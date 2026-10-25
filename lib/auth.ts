const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "garagentor2024";

export function verifyToken(token: string): boolean {
  return token === ADMIN_PASSWORD;
}

export function getToken(): string {
  return ADMIN_PASSWORD;
}
