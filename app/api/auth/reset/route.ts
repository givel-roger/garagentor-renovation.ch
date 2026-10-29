import { NextRequest, NextResponse } from "next/server";
import getDb, { hashPassword } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, newPassword } = body;

  if (!username) {
    return NextResponse.json({ error: "Benutzername erforderlich" }, { status: 400 });
  }

  const db = getDb();
  const user = db.prepare(
    "SELECT id, username, display_name, email, active FROM users WHERE username = ?"
  ).get(username) as { id: number; username: string; display_name: string; email: string; active: number } | undefined;

  if (!user) {
    return NextResponse.json({ error: "Benutzer nicht gefunden" }, { status: 404 });
  }

  if (!user.active) {
    return NextResponse.json({ error: "Dieses Konto ist gesperrt" }, { status: 403 });
  }

  const passwordToSet = newPassword || process.env.ADMIN_PASSWORD || "garagentor2024";
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?")
    .run(hashPassword(passwordToSet), user.id);

  if (user.email) {
    try {
      await sendPasswordResetEmail(user.email, user.display_name, newPassword ? "dein gewähltes Passwort" : passwordToSet);
      return NextResponse.json({
        success: true,
        message: `Passwort wurde zurückgesetzt. Eine E-Mail wurde an ${user.email.replace(/(.{2})(.*)(@.*)/, "$1***$3")} gesendet.`,
      });
    } catch (err) {
      console.error("E-Mail-Versand fehlgeschlagen:", err);
      return NextResponse.json({
        success: true,
        message: "Passwort wurde zurückgesetzt, aber die E-Mail konnte nicht gesendet werden. Bitte den Administrator kontaktieren.",
      });
    }
  }

  return NextResponse.json({
    success: true,
    message: "Passwort wurde zurückgesetzt. Du kannst dich jetzt mit dem Standard-Passwort anmelden.",
  });
}
