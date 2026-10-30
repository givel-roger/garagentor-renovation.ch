import type Database from "better-sqlite3";

// Ein Anruf erzeugt bis zu drei Ereignisse (3CX-Webhook, Anruf-Poller, Voicemail-Mail),
// teils Minuten auseinander. Gleiche Nummer innerhalb dieses Fensters = derselbe Lead.
export const LEAD_MERGE_MINUTES = 120;

export function normalizePhone(phone: string): string {
  return phone.replace(/[^0-9+]/g, "").replace(/^00/, "+");
}

export function phoneLastDigits(phone: string): string {
  return normalizePhone(phone).replace(/\D/g, "").slice(-9);
}

export function findRecentLeadByPhone<T = { id: number }>(
  db: Database.Database,
  phone: string,
  columns = "id",
  minutes = LEAD_MERGE_MINUTES,
): T | undefined {
  const digits = phoneLastDigits(phone);
  if (digits.length < 5) return undefined;
  return db
    .prepare(
      `SELECT ${columns} FROM leads
       WHERE phone LIKE ? AND created_at >= datetime('now', ?)
       ORDER BY created_at DESC LIMIT 1`,
    )
    .get(`%${digits}%`, `-${minutes} minutes`) as T | undefined;
}
