import getDb from "./db";
import { sendLeadNotification } from "./email";
import path from "path";
import fs from "fs";

const TCX_URL = process.env.TCX_URL || "";
const TCX_CLIENT_ID = process.env.TCX_CLIENT_ID || "";
const TCX_CLIENT_SECRET = process.env.TCX_CLIENT_SECRET || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

const RECORDINGS_DIR = path.join(process.cwd(), "public", "uploads", "voicemails");

let syncRunning = false;

let tokenCache: { token: string; bis: number } | null = null;
let tokenHolen: Promise<string> | null = null;

async function get3cxToken(): Promise<string> {
  if (tokenCache && tokenCache.bis > Date.now() + 30_000) return tokenCache.token;
  if (tokenHolen) return tokenHolen;
  tokenHolen = doGetToken().finally(() => { tokenHolen = null; });
  return tokenHolen;
}

async function doGetToken(): Promise<string> {
  const res = await fetch(`${TCX_URL}/connect/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: TCX_CLIENT_ID,
      client_secret: TCX_CLIENT_SECRET,
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`3CX token error ${res.status}: ${text}`);
  }
  const data = await res.json();
  if (!data.access_token) throw new Error("3CX gab keinen Token zurück");
  tokenCache = {
    token: data.access_token,
    bis: Date.now() + (Number(data.expires_in) || 3600) * 1000,
  };
  return tokenCache.token;
}

async function xapiFetch(pfad: string): Promise<any> {
  const einmal = async (t: string) => fetch(`${TCX_URL}${pfad}`, {
    headers: { authorization: `Bearer ${t}`, accept: "application/json" },
    cache: "no-store",
  });
  let r = await einmal(await get3cxToken());
  if (r.status === 401) {
    tokenCache = null;
    tokenHolen = null;
    r = await einmal(await get3cxToken());
  }
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`XAPI ${pfad.substring(0, 60)} → ${r.status}: ${text.substring(0, 200)}`);
  }
  return r.json();
}

async function getRecentCalls(sinceMinutes: number): Promise<any[]> {
  const von = new Date(Date.now() - sinceMinutes * 60000).toISOString();
  const bis = new Date().toISOString();
  const pfad = "/xapi/v1/ReportCallLogData/Pbx.GetCallLogData"
    + `(periodFrom=${encodeURIComponent(von)}`
    + `,periodTo=${encodeURIComponent(bis)}`
    + ",sourceType=0,sourceFilter='',destinationType=0,destinationFilter=''"
    + ",callsType=0,callTimeFilterType=0,callTimeFilterFrom='0:00:0'"
    + `,callTimeFilterTo='0:00:0',hidePcalls=true)?$top=100&$skip=0`;
  const data = await xapiFetch(pfad);
  return data.value || [];
}

function istEingehend(call: any): boolean {
  const typ = String(call.CallType ?? "").toLowerCase();
  return typ.includes("inbound") || typ.includes("eingehend") || typ === "1" || typ === "";
}

function istVoicemail(call: any): boolean {
  const dest = String(call.DestinationDisplayName ?? "") + " " + String(call.DestinationDn ?? "");
  return /voicemail|mailbox|combox/i.test(dest);
}

async function downloadRecording(recId: number | string): Promise<Buffer | null> {
  const token = await get3cxToken();
  const url = `${TCX_URL}/xapi/v1/Recordings/Pbx.DownloadRecording(recId=${recId})?access_token=${token}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 403) {
      console.log(`[CallSync] Recording ${recId}: 403 (Call Control API nicht aktiviert)`);
    } else {
      console.error(`[CallSync] Recording download ${recId} failed: ${res.status}`);
    }
    return null;
  }
  return Buffer.from(await res.arrayBuffer());
}

async function getRecentRecordings(sinceMinutes: number): Promise<any[]> {
  try {
    const since = new Date(Date.now() - sinceMinutes * 60000).toISOString();
    const data = await xapiFetch(
      `/xapi/v1/Recordings?$filter=StartTime ge '${since}'&$orderby=StartTime desc&$top=50`
    );
    return data.value || [];
  } catch (err: any) {
    if (err.message?.includes("403")) {
      console.log("[CallSync] Recordings API: 403 (Call Control API nicht aktiviert)");
    }
    return [];
  }
}

async function transcribeAudio(audioBuffer: Buffer): Promise<string> {
  if (!OPENAI_API_KEY || audioBuffer.length < 1000) return "";
  try {
    const formData = new FormData();
    formData.append("file", new Blob([new Uint8Array(audioBuffer)], { type: "audio/wav" }), "recording.wav");
    formData.append("model", "whisper-1");
    formData.append("language", "de");
    formData.append("response_format", "text");
    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: formData,
    });
    if (!res.ok) {
      console.error("[CallSync] Whisper error:", res.status, await res.text());
      return "";
    }
    return (await res.text()).trim();
  } catch (err) {
    console.error("[CallSync] Transcription error:", err);
    return "";
  }
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9+]/g, "").replace(/^00/, "+");
}

function phoneLastDigits(phone: string): string {
  return normalizePhone(phone).replace(/\D/g, "").slice(-9);
}

function ensureProcessedTable() {
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
    console.log("[CallSync] Starting sync...");

    const calls = await getRecentCalls(10);
    console.log(`[CallSync] Found ${calls.length} calls total`);

    // Alle eingehenden Anrufe verarbeiten (nicht nur Voicemails)
    const eingehend = calls.filter((c) => {
      const callerNumber = normalizePhone(c.SourceCallerId || c.SourceDn || "");
      return callerNumber.length >= 5;
    });
    console.log(`[CallSync] ${eingehend.length} incoming calls with caller number`);

    if (eingehend.length === 0) {
      console.log("[CallSync] No calls to process, done.");
      syncRunning = false;
      return { processed: 0, errors: [] };
    }

    if (!fs.existsSync(RECORDINGS_DIR)) {
      fs.mkdirSync(RECORDINGS_DIR, { recursive: true });
    }

    const recordings = await getRecentRecordings(10);
    console.log(`[CallSync] ${recordings.length} recordings available`);

    const db = ensureProcessedTable();
    const gesehen = new Set<string>();

    for (const call of eingehend) {
      try {
        const mainId = String(call.MainCallHistoryId ?? call.CallHistoryId ?? "");
        if (mainId && gesehen.has(mainId)) continue;
        if (mainId) gesehen.add(mainId);

        const callId = mainId || String(call.Id ?? Date.now());
        const existing = db.prepare("SELECT id FROM voicemail_processed WHERE call_id = ?").get(callId);
        if (existing) continue;

        const callerNumber = normalizePhone(call.SourceCallerId || call.SourceDn || "");
        if (!callerNumber) continue;

        const callerName = String(call.SourceDisplayName || "");
        const isVoicemail = istVoicemail(call);
        const callLabel = isVoicemail ? "Voicemail" : "Anruf";
        console.log(`[CallSync] Processing ${callLabel} ${callId} from ${callerName || callerNumber}`);

        let audioBuffer: Buffer | null = null;
        let recordingUrl = "";
        let transcription = "";

        // Aufnahme über Telefonnummer + Zeitfenster zuordnen
        if (recordings.length > 0) {
          const callTime = Date.parse(call.StartTime || "");
          const matched = recordings.find((r: any) => {
            const recCaller = normalizePhone(r.CallerNumber || r.Participants || "");
            if (phoneLastDigits(recCaller) !== phoneLastDigits(callerNumber)) return false;
            if (callTime) {
              const recTime = Date.parse(r.StartTime || "");
              if (recTime && Math.abs(recTime - callTime) > 10 * 60000) return false;
            }
            return true;
          });
          if (matched) {
            const recId = matched.Id || matched.RecId;
            if (recId) audioBuffer = await downloadRecording(recId);
          }
        }

        if (audioBuffer && audioBuffer.length > 0) {
          const prefix = isVoicemail ? "vm" : "call";
          const filename = `${prefix}_${callId}_${Date.now()}.wav`;
          const filepath = path.join(RECORDINGS_DIR, filename);
          fs.writeFileSync(filepath, audioBuffer);
          recordingUrl = `/uploads/voicemails/${filename}`;
          transcription = await transcribeAudio(audioBuffer);
          if (transcription) {
            console.log(`[CallSync] Transcribed: ${transcription.substring(0, 80)}...`);
          }
        }

        // Lead zuordnen oder erstellen
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
            console.log(`[CallSync] Updated lead ${recentLead.id} with recording/transcription`);
          }
        } else {
          const callTime = call.StartTime || new Date().toISOString();
          const duration = call.TalkingDuration || call.Duration || "";
          let nachricht: string;
          if (transcription) {
            nachricht = transcription;
          } else if (isVoicemail) {
            nachricht = `Voicemail vom ${new Date(callTime).toLocaleString("de-CH")}`;
          } else {
            const parts = ["Telefonanruf"];
            if (duration) parts.push(`(${duration})`);
            const agent = call.DestinationDisplayName || call.DestinationDn || "";
            if (agent) parts.push(`Agent: ${agent}`);
            nachricht = parts.join(" – ");
          }
          const leadName = callerName || `Anruf ${callerNumber}`;
          db.prepare(
            `INSERT INTO leads (name, email, phone, plz, ort, nachricht, source, status, recording_url, transkription)
             VALUES (?, '', ?, '', '', ?, 'phone', 'neu', ?, ?)`
          ).run(leadName, callerNumber, nachricht, recordingUrl, transcription);
          console.log(`[CallSync] Created new lead for ${callerNumber}`);
          sendLeadNotification({ name: leadName, phone: callerNumber, source: "phone", nachricht, transkription: transcription || undefined });
        }

        db.prepare("INSERT OR IGNORE INTO voicemail_processed (call_id) VALUES (?)").run(callId);
        processed++;
      } catch (callErr: any) {
        console.error(`[CallSync] Error processing call:`, callErr.message);
        errors.push(callErr.message);
      }
    }

    console.log(`[CallSync] Done. Processed: ${processed}`);
  } catch (err: any) {
    console.error("[CallSync] Error:", err.message);
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
    console.log("[CallSync] 3CX not configured, poller not started");
    return;
  }

  console.log(`[CallSync] Poller started (every ${intervalMs / 1000}s)`);
  setTimeout(() => syncVoicemails(), 30_000);
  intervalId = setInterval(() => syncVoicemails(), intervalMs);
}

export function stopVoicemailPoller() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    console.log("[CallSync] Poller stopped");
  }
}
