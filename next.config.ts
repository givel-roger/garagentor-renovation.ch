import { readFileSync } from 'node:fs'
import type { NextConfig } from "next";

// Version aus package.json einsetzen statt in der Seite eintippen. Bis zum
// 04.11.2026 stand in app/page.tsx fest 'v2.14.0'; bei einem Versionssprung
// wurde diese zweite Stelle vergessen und die Fusszeile log.
const APP_VERSION = JSON.parse(readFileSync('./package.json', 'utf-8')).version

const nextConfig: NextConfig = {
  env: { APP_VERSION },

  serverExternalPackages: ["better-sqlite3"],
  output: "standalone",
};

export default nextConfig;
