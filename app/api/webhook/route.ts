import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "garagentor-3cx-2024";

// 3CX meldet hier alle Anrufe der geteilten Anlage, aber nicht die gewählte Nummer.
// Leads entstehen deshalb nur im Anruf-Poller, der die Portal-Nummer prüfen kann.
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret") ||
    request.headers.get("X-Webhook-Secret");
  if (secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("[Webhook] Received payload:", JSON.stringify(body));
    return NextResponse.json({ success: true, deferred: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Verarbeitungsfehler" }, { status: 500 });
  }
}
