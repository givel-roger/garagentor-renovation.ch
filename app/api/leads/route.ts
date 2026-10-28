import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { verifyToken } from "@/lib/auth";
import { assignLeadToPartner } from "@/lib/geo";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const plz = formData.get("plz") as string;
    const ort = formData.get("ort") as string;
    const torTyp = (formData.get("torTyp") as string) || "";
    const breite = (formData.get("breite") as string) || "";
    const hoehe = (formData.get("hoehe") as string) || "";
    const nachricht = (formData.get("nachricht") as string) || "";

    if (!name || !email || !phone || !plz || !ort) {
      return NextResponse.json(
        { error: "Pflichtfelder fehlen" },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fotoPaths: string[] = [];
    const files = formData.getAll("fotos");
    for (const file of files) {
      if (file instanceof File && file.size > 0) {
        const ext = file.name.split(".").pop() || "jpg";
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const buffer = Buffer.from(await file.arrayBuffer());
        fs.writeFileSync(path.join(uploadDir, filename), buffer);
        fotoPaths.push(`/uploads/${filename}`);
      }
    }

    const db = getDb();
    const partnerId = assignLeadToPartner(db, plz);

    const stmt = db.prepare(`
      INSERT INTO leads (name, email, phone, plz, ort, tor_typ, breite, hoehe, nachricht, fotos, source, partner_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'web', ?)
    `);
    stmt.run(name, email, phone, plz, ort, torTyp, breite, hoehe, nachricht, JSON.stringify(fotoPaths), partnerId);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lead creation error:", err);
    return NextResponse.json(
      { error: "Interner Serverfehler" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = verifyToken(token);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const status = request.nextUrl.searchParams.get("status");

  let query = "SELECT * FROM leads";
  const conditions: string[] = [];
  const params: (string | number)[] = [];

  // Partners only see their own leads
  if (user.role === "partner" && user.partnerId) {
    conditions.push("partner_id = ?");
    params.push(user.partnerId);
  }

  if (status && status !== "alle") {
    conditions.push("status = ?");
    params.push(status);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }
  query += " ORDER BY created_at DESC";

  const leads = db.prepare(query).all(...params);
  return NextResponse.json(leads);
}
