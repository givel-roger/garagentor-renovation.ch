import { NextRequest, NextResponse } from "next/server";
import { syncVoicemails } from "@/lib/voicemail-sync";

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || "garagentor-3cx-2024";

export async function GET(request: NextRequest) {
  const secret =
    request.nextUrl.searchParams.get("secret") ||
    request.headers.get("X-Webhook-Secret");
  if (secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await syncVoicemails();
  return NextResponse.json(result);
}

export async function POST(request: NextRequest) {
  return GET(request);
}
