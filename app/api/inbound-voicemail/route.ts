import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import getDb from "@/lib/db";
import { sendLeadNotification } from "@/lib/email";

const VOICEMAIL_DIR = path.join(process.cwd(), "public", "uploads", "voicemails");
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const TON = /\.(wav|mp3|m4a|mp4|ogg|oga|webm|flac|aac|amr)$/i;

function istTonaufnahme(name: string, mime?: string | null): boolean {
  if (mime && /^audio\//i.test(mime)) return true;
  return TON.test(name || "");
}

async function transcribeAudio(buf: Buffer, dateiName: string): Promise<string> {
  if (!OPENAI_API_KEY || buf.length < 1000) return "";
  try {
    const form = new FormData();
    form.append("file", new Blob([new Uint8Array(buf)]), path.basename(dateiName));
    form.append("model", "whisper-1");
    form.append("language", "de");
    form.append("response_format", "text");
    form.append("prompt",
      "Anruf bei Garagentor Renovation. "
      + "Mögliche Wörter: Garagentor, Sektionaltor, Schwingtor, Renovation, Offerte, "
      + "Reparatur, Montage, Antrieb, Fernbedienung, Tor, Garage.");
    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { authorization: `Bearer ${OPENAI_API_KEY}` },
      body: form,
      signal: AbortSignal.timeout(120_000),
    });
    if (!res.ok) return "";
    return (await res.text()).trim() || "";
  } catch {
    return "";
  }
}

function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9+]/g, "").replace(/^00/, "+");
}

function phoneLastDigits(phone: string): string {
  return normalizePhone(phone).replace(/\D/g, "").slice(-9);
}

function extractCallerNumber(subject: string, body: string): string | null {
  const combined = `${subject}\n${body}`;
  const m = /(?:von|from)\s+\+?(\d[\d\s]{5,})/i.exec(combined)
    ?? /\b(\+?\d{9,15})\b/.exec(subject)
    ?? /(\+?\d[\d\s]{8,})/.exec(combined);
  return m ? m[1].replace(/\s/g, "") : null;
}

export async function POST(request: NextRequest) {
  const secret = process.env.INBOUND_SECRET;
  if (!secret || request.nextUrl.searchParams.get("secret") !== secret) {
    return new Response("Kein Zugriff", { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return new Response("Kein JSON", { status: 400 });
  }

  const items = Array.isArray((payload as any).items)
    ? (payload as any).items
    : [payload];

  let created = 0;

  for (const item of items) {
    try {
      const von = (item.From?.Address ?? item.from ?? "").toString();
      const betreff = String(item.Subject ?? item.subject ?? "");
      const bodyText = String(item.RawTextBody ?? item.TextBody ?? item.text ?? item.body ?? "");

      const isVoicemail = /3cx|voicemail|sprachnachricht|mailbox|combox/i.test(`${von} ${betreff}`);
      if (!isVoicemail) {
        console.log(`[Inbound] Ignoriert (kein Voicemail): ${betreff.slice(0, 80)}`);
        continue;
      }

      console.log(`[Inbound] Voicemail empfangen: ${betreff.slice(0, 100)}`);

      const callerNumber = extractCallerNumber(betreff, bodyText);
      if (!callerNumber) {
        console.log(`[Inbound] Keine Rufnummer gefunden in: ${betreff}`);
        continue;
      }

      const atts = (item.Attachments ?? item.attachments) as
        | { Name?: string; ContentType?: string; Content?: string; content?: string; DownloadToken?: string }[]
        | undefined;

      let audioBuffer: Buffer | null = null;
      let origName = "voicemail.wav";

      for (const att of (atts ?? [])) {
        if (!istTonaufnahme(att.Name ?? "", att.ContentType)) continue;
        origName = att.Name ?? origName;
        const b64 = att.Content ?? att.content;
        if (b64) {
          audioBuffer = Buffer.from(b64, "base64");
        } else if (att.DownloadToken && process.env.BREVO_API_KEY) {
          try {
            const res = await fetch(
              `https://api.brevo.com/v3/inbound/attachments/${encodeURIComponent(att.DownloadToken)}`,
              { headers: { "api-key": process.env.BREVO_API_KEY } },
            );
            if (res.ok) audioBuffer = Buffer.from(await res.arrayBuffer());
          } catch {}
        }
        if (audioBuffer) break;
      }

      let recordingUrl = "";
      let transcription = "";

      if (audioBuffer && audioBuffer.length > 0) {
        await mkdir(VOICEMAIL_DIR, { recursive: true });
        const filename = `vm_${Date.now()}_${randomBytes(4).toString("hex")}.wav`;
        await writeFile(path.join(VOICEMAIL_DIR, filename), audioBuffer);
        recordingUrl = `/uploads/voicemails/${filename}`;
        transcription = await transcribeAudio(audioBuffer, origName);
        if (transcription) {
          console.log(`[Inbound] Transkription: ${transcription.slice(0, 80)}...`);
        }
      }

      const db = getDb();
      const digits = phoneLastDigits(callerNumber);
      const recentLead = db
        .prepare(
          `SELECT id FROM leads WHERE phone LIKE ? AND created_at >= datetime('now', '-30 minutes') ORDER BY created_at DESC LIMIT 1`
        )
        .get(`%${digits}%`) as any;

      if (recentLead) {
        db.prepare(
          `UPDATE leads SET
            recording_url = CASE WHEN ? != '' THEN ? ELSE recording_url END,
            transkription = CASE WHEN ? != '' THEN ? ELSE transkription END,
            updated_at = datetime('now')
          WHERE id = ?`
        ).run(recordingUrl, recordingUrl, transcription, transcription, recentLead.id);
        console.log(`[Inbound] Lead ${recentLead.id} aktualisiert mit Voicemail`);
      } else {
        const nachricht = transcription || `Sprachnachricht von ${callerNumber}`;
        const leadName = `Anruf ${callerNumber}`;
        db.prepare(
          `INSERT INTO leads (name, email, phone, plz, ort, nachricht, source, status, recording_url, transkription)
           VALUES (?, '', ?, '', '', ?, 'phone', 'neu', ?, ?)`
        ).run(leadName, callerNumber, nachricht, recordingUrl, transcription);
        console.log(`[Inbound] Neuer Lead für ${callerNumber}`);
        sendLeadNotification({
          name: leadName,
          phone: callerNumber,
          source: "phone",
          nachricht,
          transkription: transcription || undefined,
        });
      }

      created++;
    } catch (err: any) {
      console.error("[Inbound] Fehler:", err.message);
    }
  }

  return NextResponse.json({ ok: true, created });
}
