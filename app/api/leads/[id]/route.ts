import { NextRequest, NextResponse } from "next/server";
import getDb from "@/lib/db";
import { verifyToken } from "@/lib/auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = verifyToken(token);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();

  const db = getDb();

  // Partners can only update their own leads
  if (user.role === "partner" && user.partnerId) {
    const lead = db.prepare("SELECT partner_id FROM leads WHERE id = ?").get(id) as { partner_id: number | null } | undefined;
    if (!lead || lead.partner_id !== user.partnerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  if (body.status) {
    const validStatuses = ["neu", "kontaktiert", "offerte", "abgeschlossen", "abgelehnt"];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Ungültiger Status" }, { status: 400 });
    }
    db.prepare("UPDATE leads SET status = ?, updated_at = datetime('now') WHERE id = ?").run(body.status, id);
  }

  if (body.partner_id !== undefined && user.role === "admin") {
    db.prepare("UPDATE leads SET partner_id = ?, updated_at = datetime('now') WHERE id = ?").run(body.partner_id, id);
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = verifyToken(token);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Nur Admins können Leads löschen" }, { status: 403 });
  }

  const { id } = await params;
  const db = getDb();
  db.prepare("DELETE FROM leads WHERE id = ?").run(id);

  return NextResponse.json({ success: true });
}
