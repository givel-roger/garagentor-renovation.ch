import { NextRequest, NextResponse } from "next/server";
import getDb, { hashPassword } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { token, password, passwordConfirm } = body;

  if (!token) {
    return NextResponse.json({ error: "Ungültiger Link" }, { status: 400 });
  }

  if (!password || password.length < 4) {
    return NextResponse.json({ error: "Passwort muss mindestens 4 Zeichen haben" }, { status: 400 });
  }

  if (password !== passwordConfirm) {
    return NextResponse.json({ error: "Passwörter stimmen nicht überein" }, { status: 400 });
  }

  const db = getDb();
  const resetToken = db.prepare(
    "SELECT id, user_id, expires_at, used FROM password_reset_tokens WHERE token = ?"
  ).get(token) as { id: number; user_id: number; expires_at: string; used: number } | undefined;

  if (!resetToken) {
    return NextResponse.json({ error: "Ungültiger oder abgelaufener Link" }, { status: 400 });
  }

  if (resetToken.used) {
    return NextResponse.json({ error: "Dieser Link wurde bereits verwendet" }, { status: 400 });
  }

  if (new Date(resetToken.expires_at) < new Date()) {
    return NextResponse.json({ error: "Dieser Link ist abgelaufen. Bitte fordere einen neuen an." }, { status: 400 });
  }

  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?")
    .run(hashPassword(password), resetToken.user_id);

  db.prepare("UPDATE password_reset_tokens SET used = 1 WHERE id = ?")
    .run(resetToken.id);

  return NextResponse.json({
    success: true,
    message: "Passwort wurde erfolgreich geändert. Du kannst dich jetzt anmelden.",
  });
}
