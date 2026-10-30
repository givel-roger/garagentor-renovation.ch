import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { sendLeadNotification } from "@/lib/email";
import { findRecentLeadByPhone, isOwnNumber } from "@/lib/leads";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "garagentor-3cx-2024";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

async function transcribeAudio(audioUrl: string): Promise<string> {
  if (!OPENAI_API_KEY || !audioUrl) return "";

  try {
    const audioRes = await fetch(audioUrl);
    if (!audioRes.ok) return "";
    const audioBuffer = await audioRes.arrayBuffer();

    const formData = new FormData();
    formData.append("file", new Blob([audioBuffer], { type: "audio/wav" }), "recording.wav");
    formData.append("model", "whisper-1");
    formData.append("language", "de");
    formData.append("response_format", "text");

    const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
      body: formData,
    });

    if (!res.ok) {
      console.error("Whisper API error:", res.status, await res.text());
      return "";
    }

    return (await res.text()).trim();
  } catch (err) {
    console.error("Transcription error:", err);
    return "";
  }
}

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret") ||
    request.headers.get("X-Webhook-Secret");
  if (secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("[Webhook] Received payload:", JSON.stringify(body));

    const phone = body.caller_number || body.phone || body.from || "";
    const name = body.caller_name || body.name || `Anruf ${phone}`;
    const recording_url = body.recording_url || body.recording || "";
    const duration = body.duration || "";
    const callType = body.call_type || "";
    const agent = body.agent || "";
    const notes = body.notes || "";

    if (!phone) {
      return NextResponse.json({ error: "Keine Telefonnummer" }, { status: 400 });
    }

    if (isOwnNumber(phone)) {
      console.log(`[Webhook] Eigene Nummer ${phone} ignoriert (${callType})`);
      return NextResponse.json({ success: true, ignored: true });
    }

    const db = getDb();

    const messageParts = [];
    if (callType === "Missed") messageParts.push("Verpasster Anruf");
    else messageParts.push("Telefonanruf");
    if (duration) messageParts.push(`(${duration})`);
    if (agent) messageParts.push(`Agent: ${agent}`);
    if (notes) messageParts.push(notes);
    const nachricht = messageParts.join(" – ") || "Telefonanruf";

    const recentLead = findRecentLeadByPhone<{ id: number; nachricht: string }>(db, phone, "id, nachricht");
    if (recentLead) {
      const merged = recentLead.nachricht?.includes(nachricht)
        ? recentLead.nachricht
        : [recentLead.nachricht, nachricht].filter(Boolean).join(" | ");
      db.prepare("UPDATE leads SET nachricht = ?, updated_at = datetime('now') WHERE id = ?")
        .run(merged, recentLead.id);
      console.log(`[Webhook] Lead ${recentLead.id} existiert bereits für ${phone}, zusammengeführt`);
      return NextResponse.json({ success: true, id: recentLead.id, merged: true });
    }

    const result = db.prepare(`
      INSERT INTO leads (name, email, phone, plz, ort, nachricht, source, status, recording_url)
      VALUES (?, '', ?, '', '', ?, 'phone', 'neu', ?)
    `).run(
      name,
      phone,
      nachricht,
      recording_url
    );

    const leadId = result.lastInsertRowid;

    sendLeadNotification({ name, phone, source: "phone", nachricht });

    if (recording_url) {
      transcribeAudio(recording_url).then((text) => {
        if (text) {
          try {
            const db2 = getDb();
            db2.prepare("UPDATE leads SET transkription = ? WHERE id = ?").run(text, leadId);
          } catch (err) {
            console.error("Failed to save transcription:", err);
          }
        }
      });
    }

    return NextResponse.json({ success: true, id: leadId });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Verarbeitungsfehler" }, { status: 500 });
  }
}
