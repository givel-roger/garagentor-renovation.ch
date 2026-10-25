import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { status } = body;

  const validStatuses = ["neu", "kontaktiert", "offerte", "abgeschlossen", "abgelehnt"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Ungültiger Status" }, { status: 400 });
  }

  const db = getDb();
  db.prepare(
    "UPDATE leads SET status = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(status, id);

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token || !verifyToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const db = getDb();
  db.prepare("DELETE FROM leads WHERE id = ?").run(id);

  return NextResponse.json({ success: true });
}
