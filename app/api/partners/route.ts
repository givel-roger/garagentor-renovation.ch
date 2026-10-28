import { NextRequest, NextResponse } from "next/server";
import getDb, { hashPassword } from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { getPlzCoords } from "@/lib/geo";

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = verifyToken(token);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Nur Admins" }, { status: 403 });
  }

  const db = getDb();
  const partners = db.prepare("SELECT * FROM partners ORDER BY firma").all();
  return NextResponse.json(partners);
}

export async function POST(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = verifyToken(token);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Nur Admins" }, { status: 403 });
  }

  const body = await request.json();
  const { firma, kontakt_name, email, phone, plz, ort, radius_km, username, password } = body;

  if (!firma || !kontakt_name || !plz || !ort) {
    return NextResponse.json({ error: "Pflichtfelder fehlen" }, { status: 400 });
  }

  const coords = getPlzCoords(plz);
  const db = getDb();

  const result = db.prepare(
    "INSERT INTO partners (firma, kontakt_name, email, phone, plz, ort, radius_km, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(firma, kontakt_name, email || "", phone || "", plz, ort, radius_km || 15, coords?.[0] || null, coords?.[1] || null);

  const partnerId = result.lastInsertRowid;

  // Create login for partner if username/password provided
  if (username && password) {
    db.prepare(
      "INSERT INTO users (username, password_hash, display_name, role, partner_id) VALUES (?, ?, ?, 'partner', ?)"
    ).run(username, hashPassword(password), kontakt_name, partnerId);
  }

  return NextResponse.json({ success: true, id: partnerId });
}
