import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const DB_PATH = path.join(process.cwd(), "data", "leads.db");

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function getDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      plz TEXT NOT NULL,
      ort TEXT NOT NULL,
      tor_typ TEXT DEFAULT '',
      breite TEXT DEFAULT '',
      hoehe TEXT DEFAULT '',
      nachricht TEXT DEFAULT '',
      fotos TEXT DEFAULT '[]',
      source TEXT DEFAULT 'web',
      partner_id INTEGER,
      status TEXT DEFAULT 'neu',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (partner_id) REFERENCES partners(id)
    )
  `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'partner',
      partner_id INTEGER,
      email TEXT DEFAULT '',
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (partner_id) REFERENCES partners(id)
    )
  `);

  try { db.exec("ALTER TABLE users ADD COLUMN email TEXT DEFAULT ''"); } catch {}

  db.exec(`
    CREATE TABLE IF NOT EXISTS partners (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firma TEXT NOT NULL,
      kontakt_name TEXT NOT NULL,
      email TEXT DEFAULT '',
      phone TEXT DEFAULT '',
      plz TEXT NOT NULL,
      ort TEXT NOT NULL,
      radius_km INTEGER NOT NULL DEFAULT 15,
      lat REAL,
      lng REAL,
      active INTEGER DEFAULT 1,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Add source and partner_id columns if they don't exist (migration)
  try { db.exec("ALTER TABLE leads ADD COLUMN source TEXT DEFAULT 'web'"); } catch {}
  try { db.exec("ALTER TABLE leads ADD COLUMN partner_id INTEGER"); } catch {}
  try { db.exec("ALTER TABLE leads ADD COLUMN transkription TEXT DEFAULT ''"); } catch {}
  try { db.exec("ALTER TABLE leads ADD COLUMN recording_url TEXT DEFAULT ''"); } catch {}

  // Seed admin users if none exist
  const userCount = db.prepare("SELECT COUNT(*) as cnt FROM users").get() as { cnt: number };
  if (userCount.cnt === 0) {
    const adminPw = process.env.ADMIN_PASSWORD || "garagentor2024";
    db.prepare("INSERT INTO users (username, password_hash, display_name, role, email) VALUES (?, ?, ?, ?, ?)")
      .run("roger", hashPassword(adminPw), "Roger Givel", "admin", "givel@marktindex.ch");
    db.prepare("INSERT INTO users (username, password_hash, display_name, role, email) VALUES (?, ?, ?, ?, ?)")
      .run("irma", hashPassword(adminPw), "Irma", "admin", "");
  }

  return db;
}

export { hashPassword };
export default getDb;
