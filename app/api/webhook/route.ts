import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "garagentor-3cx-2024";

export async function POST(request: NextRequest) {
  // Verify webhook secret (via query param or header)
  const secret = request.nextUrl.searchParams.get("secret") ||
    request.headers.get("X-Webhook-Secret");
  if (secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // 3CX sends various data; we extract what we can
    const phone = body.caller_number || body.phone || body.from || "";
    const name = body.caller_name || body.name || `Anruf ${phone}`;
    const recording_url = body.recording_url || body.recording || "";
    const duration = body.duration || "";

    if (!phone) {
      return NextResponse.json({ error: "Keine Telefonnummer" }, { status: 400 });
    }

    const db = getDb();
    db.prepare(`
      INSERT INTO leads (name, email, phone, plz, ort, nachricht, source, status)
      VALUES (?, '', ?, '', '', ?, 'phone', 'neu')
    `).run(
      name,
      phone,
      `Telefonanruf${duration ? ` (${duration}s)` : ""}${recording_url ? `\nAufnahme: ${recording_url}` : ""}`
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Verarbeitungsfehler" }, { status: 500 });
  }
}
