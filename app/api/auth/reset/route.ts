import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { sendPasswordResetLink } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email } = body;

  if (!email || !email.trim()) {
    return NextResponse.json({ error: "E-Mail-Adresse erforderlich" }, { status: 400 });
  }

  const db = getDb();
  const user = db.prepare(
    "SELECT id, username, display_name, email, active FROM users WHERE email = ?"
  ).get(email.trim().toLowerCase()) as { id: number; username: string; display_name: string; email: string; active: number } | undefined;

  if (!user || !user.active) {
    return NextResponse.json({
      success: true,
      message: "Falls ein Konto mit dieser E-Mail existiert, wurde ein Link zum Zurücksetzen gesendet.",
    });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

  db.prepare("INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)")
    .run(user.id, token, expiresAt);

  try {
    await sendPasswordResetLink(user.email, user.display_name, token);
  } catch (err) {
    console.error("[Reset] E-Mail-Versand fehlgeschlagen:", err);
    return NextResponse.json({ error: "E-Mail konnte nicht gesendet werden" }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: "Falls ein Konto mit dieser E-Mail existiert, wurde ein Link zum Zurücksetzen gesendet.",
  });
}
