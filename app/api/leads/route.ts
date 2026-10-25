import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { verifyToken } from "@/lib/auth";
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
    const stmt = db.prepare(`
      INSERT INTO leads (name, email, phone, plz, ort, tor_typ, breite, hoehe, nachricht, fotos)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      name,
      email,
      phone,
      plz,
      ort,
      torTyp,
      breite,
      hoehe,
      nachricht,
      JSON.stringify(fotoPaths)
    );

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
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  const status = request.nextUrl.searchParams.get("status");

  let leads;
  if (status && status !== "alle") {
    leads = db
      .prepare("SELECT * FROM leads WHERE status = ? ORDER BY created_at DESC")
      .all(status);
  } else {
    leads = db.prepare("SELECT * FROM leads ORDER BY created_at DESC").all();
  }

  return NextResponse.json(leads);
}
