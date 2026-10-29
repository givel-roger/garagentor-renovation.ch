import getDb from "./db";
import path from "path";
import fs from "fs";

const TCX_URL = process.env.TCX_URL || "";
const TCX_CLIENT_ID = process.env.TCX_CLIENT_ID || "";
const TCX_CLIENT_SECRET = process.env.TCX_CLIENT_SECRET || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

const VOICEMAIL_DIR = path.join(process.cwd(), "public", "uploads", "voicemails");

let syncRunning = false;

async function get3cxToken(): Promise<string> {
  const res = await fetch(`${TCX_URL}/connect/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: TCX_CLIENT_ID,
      client_secret: TCX_CLIENT_SECRET,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`3CX token error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function getRecentVoicemailCalls(token: string, sinceMinutes: number): Promise<any[]> {
  const since = new Date(Date.now() - sinceMinutes * 60000).toISOString();
  const filter = `DstDnType eq 5 and SegmentStartTime ge '${since}'`;
  const url = `${TCX_URL}/xapi/v1/CallHistoryView?$filter=${encodeURIComponent(filter)}&$orderby=SegmentStartTime desc&$top=50`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`CallHistory error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data.value || [];
}

async function getRecentRecordings(token: string, sinceMinutes: number): Promise<any[]> {
  const since = new Date(Date.now() - sinceMinutes * 60000).toISOString();
  const url = `${TCX_URL}/xapi/v1/Recordings?$filter=StartTime ge '${since}'&$orderby=StartTime desc&$top=50`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    console.log(`[VoicemailSync] Recordings endpoint: ${res.status}`);
    return [];
  }
  const data = await res.json();
  return data.value || [];
}

async function downloadRecording(token: string, recId: number | string): Promise<Buffer | null> {
  const url = `${TCX_URL}/xapi/v1/Recordings/Pbx.DownloadRecording(recId=${recId})?access_token=${token}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`[VoicemailSync] Recording download ${recId} failed: ${res.status}`);
    return null;
  }
  return Buffer.from(await res.arrayBuffer());
}

async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  if (!OPENAI_API_KEY || audioBuffer.length < 1000) return "";
  try {
    const formData = new FormData();
    formData.append("file", new Blob([new Uint8Array(audioBuffer)], { type: "audio/wav" }), "voicemail.wav");
    formData.append("model", "whisper-1");
    formData.append("language", "de");
    formData.append("response_format", "text");
    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: formData,
    });
    if (!res.ok) {
      console.error("[VoicemailSync] Whisper error:", res.status, await res.text());
      return "";
    }
    return (await res.text()).trim();
  } catch (err) {
    console.error("[VoicemailSync] Transcription error:", err);
    return "";
  }
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9+]/g, "").replace(/^00/, "+");
}

function phoneLastDigits(phone: string): string {
  return normalizePhone(phone).replace(/\D/g, "").slice(-9);
}

function ensureVoicemailTable() {
  const db = getDb();
  db.exec(`
    CREATE TABLE IF NOT EXISTS voicemail_processed (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      call_id TEXT UNIQUE NOT NULL,
      processed_at TEXT DEFAULT (datetime('now'))
    )
  `);
  return db;
}

export async function syncVoicemails(): Promise<{ processed: number; errors: string[] }> {
  if (syncRunning) return { processed: 0, errors: ["Sync already running"] };
  if (!TCX_URL || !TCX_CLIENT_ID || !TCX_CLIENT_SECRET) {
    return { processed: 0, errors: ["3CX API not configured"] };
  }

  syncRunning = true;
  const errors: string[] = [];
  let processed = 0;

  try {
    console.log("[VoicemailSync] Starting sync...");
    const token = await get3cxToken();
    console.log("[VoicemailSync] Token obtained");

    const calls = await getRecentVoicemailCalls(token, 10);
    console.log(`[VoicemailSync] Found ${calls.length} voicemail calls`);

    const recordings = await getRecentRecordings(token, 10);
    console.log(`[VoicemailSync] Found ${recordings.length} recordings`);

    if (!fs.existsSync(VOICEMAIL_DIR)) {
      fs.mkdirSync(VOICEMAIL_DIR, { recursive: true });
    }

    const db = ensureVoicemailTable();

    for (const call of calls) {
      try {
        const callId = String(call.Id || call.SegmentId || call.HistoryId || "");
        if (!callId) continue;

        const existing = db.prepare("SELECT id FROM voicemail_processed WHERE call_id = ?").get(callId);
        if (existing) continue;

        const callerNumber = normalizePhone(
          call.SrcDisplayNumber || call.SrcCallerNumber || call.SrcDn || ""
        );
        if (!callerNumber) continue;

        console.log(`[VoicemailSync] Processing voicemail ${callId} from ${callerNumber}`);

        let audioBuffer: Buffer | null = null;
        let recordingUrl = "";
        let transcription = "";

        const recId = call.RecordingId || call.RecId;
        if (recId) {
          audioBuffer = await downloadRecording(token, recId);
        }

        if (!audioBuffer) {
          const matchedRec = recordings.find((r: any) => {
            const recCaller = normalizePhone(r.CallerNumber || r.Participants || "");
            return phoneLastDigits(recCaller) === phoneLastDigits(callerNumber);
          });
          if (matchedRec) {
            const mRecId = matchedRec.Id || matchedRec.RecId;
            if (mRecId) audioBuffer = await downloadRecording(token, mRecId);
          }
        }

        if (audioBuffer && audioBuffer.length > 0) {
          const filename = `vm_${callId}_${Date.now()}.wav`;
          const filepath = path.join(VOICEMAIL_DIR, filename);
          fs.writeFileSync(filepath, audioBuffer);
          recordingUrl = `/uploads/voicemails/${filename}`;
          transcription = await transcribeAudio(audioBuffer);
          if (transcription) {
            console.log(`[VoicemailSync] Transcribed: ${transcription.substring(0, 80)}...`);
          }
        }

        const digits = phoneLastDigits(callerNumber);
        const recentLead = db
          .prepare(
            `SELECT id, recording_url, transkription FROM leads
             WHERE phone LIKE ? AND created_at >= datetime('now', '-15 minutes')
             ORDER BY created_at DESC LIMIT 1`
          )
          .get(`%${digits}%`) as any;

        if (recentLead) {
          if (recordingUrl || transcription) {
            db.prepare(
              `UPDATE leads SET
                recording_url = CASE WHEN ? != '' THEN ? ELSE recording_url END,
                transkription = CASE WHEN ? != '' THEN ? ELSE transkription END,
                updated_at = datetime('now')
              WHERE id = ?`
            ).run(recordingUrl, recordingUrl, transcription, transcription, recentLead.id);
            console.log(`[VoicemailSync] Updated lead ${recentLead.id}`);
          }
        } else if (recordingUrl || transcription) {
          const name = call.SrcDisplayName || `Voicemail ${callerNumber}`;
          const callTime = call.SegmentStartTime || new Date().toISOString();
          db.prepare(
            `INSERT INTO leads (name, email, phone, plz, ort, nachricht, source, status, recording_url, transkription)
             VALUES (?, '', ?, '', '', ?, 'phone', 'neu', ?, ?)`
          ).run(
            name,
            callerNumber,
            `Voicemail vom ${new Date(callTime).toLocaleString("de-CH")}`,
            recordingUrl,
            transcription
          );
          console.log(`[VoicemailSync] Created new lead for ${callerNumber}`);
        }

        db.prepare("INSERT OR IGNORE INTO voicemail_processed (call_id) VALUES (?)").run(callId);
        processed++;
      } catch (callErr: any) {
        console.error(`[VoicemailSync] Error processing call:`, callErr.message);
        errors.push(callErr.message);
      }
    }

    console.log(`[VoicemailSync] Done. Processed: ${processed}`);
  } catch (err: any) {
    console.error("[VoicemailSync] Error:", err.message);
    errors.push(err.message);
  } finally {
    syncRunning = false;
  }

  return { processed, errors };
}

let intervalId: ReturnType<typeof setInterval> | null = null;

export function startVoicemailPoller(intervalMs: number = 120_000) {
  if (intervalId) return;
  if (!TCX_URL || !TCX_CLIENT_ID) {
    console.log("[VoicemailSync] 3CX not configured, poller not started");
    return;
  }

  console.log(`[VoicemailSync] Poller started (every ${intervalMs / 1000}s)`);
  setTimeout(() => syncVoicemails(), 30_000);
  intervalId = setInterval(() => syncVoicemails(), intervalMs);
}

export function stopVoicemailPoller() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("[VoicemailSync] Poller stopped");
  }
}
