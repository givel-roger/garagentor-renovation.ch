import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body;

  if (verifyToken(password)) {
    return NextResponse.json({ token: password });
  }

  return NextResponse.json({ error: "Falsches Passwort" }, { status: 401 });
}
