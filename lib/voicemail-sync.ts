import getDb from "./db";
import { sendLeadNotification } from "./email";
import path from "path";
import fs from "fs";

const TCX_URL = process.env.TCX_URL || "";
const TCX_CLIENT_ID = process.env.TCX_CLIENT_ID || "";
const TCX_CLIENT_SECRET = process.env.TCX_CLIENT_SECRET || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

const VOICEMAIL_DIR = path.join(process.cwd(), "public", "uploads", "voicemails");

let syncRunning = false;

// 3CX entwertet den vorherigen Token bei neuem Abruf — Cache vermeidet das
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

// Yorokobi-Methode: ReportCallLogData statt CallHistoryView
// Dieser Endpoint funktioniert mit niedrigeren Berechtigungen
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

function istVoicemail(call: any): boolean {
  const dest = String(call.DestinationDisplayName ?? "") + " " + String(call.DestinationDn ?? "");
  return /voicemail|mailbox|combox/i.test(dest);
}

async function downloadRecording(recId: number | string): Promise<Buffer | null> {
  const token = await get3cxToken();
  const url = `${TCX_URL}/xapi/v1/Recordings/Pbx.DownloadRecording(recId=${recId})?access_token=${token}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`[VoicemailSync] Recording download ${recId} failed: ${res.status}`);
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
  } catch {
    return [];
  }
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

    const calls = await getRecentCalls(10);
    console.log(`[VoicemailSync] Found ${calls.length} calls total`);

    // Voicemail-Anrufe filtern (Yorokobi-Methode: Zielname enthält voicemail/mailbox/combox)
    const voicemailCalls = calls.filter(istVoicemail);
    console.log(`[VoicemailSync] ${voicemailCalls.length} voicemail calls`);

    if (voicemailCalls.length === 0) {
      console.log("[VoicemailSync] No voicemails found, done.");
      syncRunning = false;
      return { processed: 0, errors: [] };
    }

    if (!fs.existsSync(VOICEMAIL_DIR)) {
      fs.mkdirSync(VOICEMAIL_DIR, { recursive: true });
    }

    const recordings = await getRecentRecordings(10);
    console.log(`[VoicemailSync] ${recordings.length} recordings available`);

    const db = ensureVoicemailTable();

    // Hauptanrufe deduplizieren (3CX liefert auch Einzelabschnitte)
    const gesehen = new Set<string>();

    for (const call of voicemailCalls) {
      try {
        const mainId = String(call.MainCallHistoryId ?? call.CallHistoryId ?? "");
        if (mainId && gesehen.has(mainId)) continue;
        if (mainId) gesehen.add(mainId);

        const callId = mainId || String(call.Id ?? Date.now());
        const existing = db.prepare("SELECT id FROM voicemail_processed WHERE call_id = ?").get(callId);
        if (existing) continue;

        const callerNumber = normalizePhone(
          call.SourceCallerId || call.SourceDn || ""
        );
        if (!callerNumber) continue;

        const callerName = String(call.SourceDisplayName || "");
        console.log(`[VoicemailSync] Processing voicemail ${callId} from ${callerName || callerNumber}`);

        let audioBuffer: Buffer | null = null;
        let recordingUrl = "";
        let transcription = "";

        // Aufnahme über Telefonnummer + Zeitfenster zuordnen (Yorokobi-Methode)
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
          const filename = `vm_${callId}_${Date.now()}.wav`;
          const filepath = path.join(VOICEMAIL_DIR, filename);
          fs.writeFileSync(filepath, audioBuffer);
          recordingUrl = `/uploads/voicemails/${filename}`;
          transcription = await transcribeAudio(audioBuffer);
          if (transcription) {
            console.log(`[VoicemailSync] Transcribed: ${transcription.substring(0, 80)}...`);
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
            console.log(`[VoicemailSync] Updated lead ${recentLead.id}`);
          }
        } else {
          const callTime = call.StartTime || new Date().toISOString();
          const nachricht = transcription
            ? `Voicemail: ${transcription}`
            : `Voicemail vom ${new Date(callTime).toLocaleString("de-CH")}`;
          const leadName = callerName || `Anruf ${callerNumber}`;
          db.prepare(
            `INSERT INTO leads (name, email, phone, plz, ort, nachricht, source, status, recording_url, transkription)
             VALUES (?, '', ?, '', '', ?, 'phone', 'neu', ?, ?)`
          ).run(
            leadName,
            callerNumber,
            nachricht,
            recordingUrl,
            transcription
          );
          console.log(`[VoicemailSync] Created new lead for ${callerNumber}`);
          sendLeadNotification({ name: leadName, phone: callerNumber, source: "phone", nachricht, transkription: transcription || undefined });
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
