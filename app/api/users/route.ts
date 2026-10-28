import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import getDb, { hashPassword } from "@/lib/db";

function requireAdmin(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const user = verifyToken(token);
  if (!user || user.role !== "admin") return null;
  return user;
}

export async function GET(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const users = db.prepare(
    "SELECT id, username, display_name, role, partner_id, active, created_at FROM users ORDER BY id"
  ).all();

  return NextResponse.json(users);
}

export async function PATCH(request: NextRequest) {
  if (!requireAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { userId, newPassword, active } = body;

  if (!userId) {
    return NextResponse.json({ error: "userId erforderlich" }, { status: 400 });
  }

  const db = getDb();

  if (newPassword) {
    if (newPassword.length < 4) {
      return NextResponse.json({ error: "Passwort muss mindestens 4 Zeichen haben" }, { status: 400 });
    }
    db.prepare("UPDATE users SET password_hash = ? WHERE id = ?")
      .run(hashPassword(newPassword), userId);
    return NextResponse.json({ success: true, message: "Passwort zurückgesetzt" });
  }

  if (typeof active === "number") {
    db.prepare("UPDATE users SET active = ? WHERE id = ?").run(active, userId);
    return NextResponse.json({ success: true, message: active ? "User aktiviert" : "User deaktiviert" });
  }

  return NextResponse.json({ error: "Keine Aktion angegeben" }, { status: 400 });
}
