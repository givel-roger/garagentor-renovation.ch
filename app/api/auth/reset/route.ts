import { NextRequest, NextResponse } from "next/server";
import getDb, { hashPassword } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username } = body;

  if (!username) {
    return NextResponse.json({ error: "Benutzername erforderlich" }, { status: 400 });
  }

  const db = getDb();
  const user = db.prepare(
    "SELECT id, username, active FROM users WHERE username = ?"
  ).get(username) as { id: number; username: string; active: number } | undefined;

  if (!user) {
    return NextResponse.json({ error: "Benutzer nicht gefunden" }, { status: 404 });
  }

  if (!user.active) {
    return NextResponse.json({ error: "Dieses Konto ist gesperrt" }, { status: 403 });
  }

  const defaultPassword = process.env.ADMIN_PASSWORD || "garagentor2024";
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?")
    .run(hashPassword(defaultPassword), user.id);

  return NextResponse.json({
    success: true,
    message: "Passwort wurde zurückgesetzt. Du kannst dich jetzt mit dem Standard-Passwort anmelden.",
  });
}
