import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Next.js standalone liefert nur Dateien aus, die beim Build in public/ lagen.
// Zur Laufzeit gespeicherte Fotos und Voicemails muessen deshalb hier ausgeliefert werden.
const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");

const MIME: Record<string, string> = {
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".ogg": "audio/ogg",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".heic": "image/heic",
  ".pdf": "application/pdf",
};

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;
  const filePath = path.resolve(UPLOAD_ROOT, ...segments);
  if (!filePath.startsWith(UPLOAD_ROOT + path.sep)) {
    return new NextResponse("Not found", { status: 404 });
  }

  let stat: fs.Stats;
  try {
    stat = fs.statSync(filePath);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
  if (!stat.isFile()) return new NextResponse("Not found", { status: 404 });

  const ext = path.extname(filePath).toLowerCase();
  const body = fs.readFileSync(filePath);
  return new NextResponse(body, {
    headers: {
      "content-type": MIME[ext] ?? "application/octet-stream",
      "content-length": String(stat.size),
      "cache-control": "private, max-age=3600",
    },
  });
}
