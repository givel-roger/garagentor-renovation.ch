import crypto from "crypto";
import getDb, { hashPassword } from "./db";

export interface UserSession {
  userId: number;
  username: string;
  displayName: string;
  role: "admin" | "partner";
  partnerId: number | null;
}

const LEGACY_PASSWORD = process.env.ADMIN_PASSWORD || "garagentor2024";

function generateToken(userId: number): string {
  const payload = `${userId}:${Date.now()}:${crypto.randomBytes(16).toString("hex")}`;
  const hmac = crypto.createHmac("sha256", LEGACY_PASSWORD).update(payload).digest("hex");
  return Buffer.from(`${payload}:${hmac}`).toString("base64");
}

function parseToken(token: string): number | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length < 4) return null;
    const hmac = parts.pop()!;
    const payload = parts.join(":");
    const expected = crypto.createHmac("sha256", LEGACY_PASSWORD).update(payload).digest("hex");
    if (hmac !== expected) return null;
    return parseInt(parts[0], 10);
  } catch {
    return null;
  }
}

export function login(identifier: string, password: string): { token: string; user: UserSession } | null {
  const db = getDb();
  const hash = hashPassword(password);
  const row = db.prepare(
    "SELECT id, username, display_name, role, partner_id FROM users WHERE (username = ? OR email = ?) AND password_hash = ? AND active = 1"
  ).get(identifier, identifier, hash) as { id: number; username: string; display_name: string; role: string; partner_id: number | null } | undefined;

  if (!row) return null;

  const token = generateToken(row.id);
  return {
    token,
    user: {
      userId: row.id,
      username: row.username,
      displayName: row.display_name,
      role: row.role as "admin" | "partner",
      partnerId: row.partner_id,
    },
  };
}

export function verifyToken(token: string): UserSession | null {
  // Legacy support: plain password token from old sessions
  if (token === LEGACY_PASSWORD) {
    const db = getDb();
    const admin = db.prepare("SELECT id, username, display_name, role, partner_id FROM users WHERE role = 'admin' LIMIT 1")
      .get() as { id: number; username: string; display_name: string; role: string; partner_id: number | null } | undefined;
    if (admin) {
      return {
        userId: admin.id,
        username: admin.username,
        displayName: admin.display_name,
        role: "admin",
        partnerId: null,
      };
    }
    return null;
  }

  const userId = parseToken(token);
  if (!userId) return null;

  const db = getDb();
  const row = db.prepare(
    "SELECT id, username, display_name, role, partner_id FROM users WHERE id = ? AND active = 1"
  ).get(userId) as { id: number; username: string; display_name: string; role: string; partner_id: number | null } | undefined;

  if (!row) return null;

  return {
    userId: row.id,
    username: row.username,
    displayName: row.display_name,
    role: row.role as "admin" | "partner",
    partnerId: row.partner_id,
  };
}
