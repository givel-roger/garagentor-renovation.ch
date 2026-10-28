import { NextRequest, NextResponse } from "next/server";
import { login, verifyToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json({ error: "Username und Passwort erforderlich" }, { status: 400 });
  }

  const result = login(username, password);
  if (!result) {
    return NextResponse.json({ error: "Falsches Login" }, { status: 401 });
  }

  return NextResponse.json({ token: result.token, user: result.user });
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

  return NextResponse.json({ user });
}
