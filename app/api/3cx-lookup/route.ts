import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_SECRET = "garagentor-3cx-2024";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (secret !== WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const number = request.nextUrl.searchParams.get("number") || "";

  return NextResponse.json([
    {
      id: "1",
      fname: "Anrufer",
      lname: number,
      email: "",
      worktel: number,
      mobtel: "",
      hometel: "",
    },
  ]);
}
