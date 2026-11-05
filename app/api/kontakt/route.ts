import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { firma, nameVorname, adresse, plzOrt, email, telefon, bemerkungen } = data;

    if (!nameVorname || !email) {
      return NextResponse.json({ error: "Name und E-Mail sind Pflichtfelder." }, { status: 400 });
    }

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.warn("[kontakt] BREVO_API_KEY fehlt");
      return NextResponse.json({ error: "E-Mail-Versand nicht konfiguriert." }, { status: 500 });
    }

    const rows = [
      firma ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Firma</td><td style="padding:4px 0;font-weight:600">${esc(firma)}</td></tr>` : "",
      `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Name</td><td style="padding:4px 0;font-weight:600">${esc(nameVorname)}</td></tr>`,
      `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Adresse</td><td style="padding:4px 0;font-weight:600">${esc(adresse)}</td></tr>`,
      `<tr><td style="padding:4px 12px 4px 0;color:#64748b">PLZ / Ort</td><td style="padding:4px 0;font-weight:600">${esc(plzOrt)}</td></tr>`,
      `<tr><td style="padding:4px 12px 4px 0;color:#64748b">E-Mail</td><td style="padding:4px 0;font-weight:600">${esc(email)}</td></tr>`,
      telefon ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Telefon</td><td style="padding:4px 0;font-weight:600">${esc(telefon)}</td></tr>` : "",
      bemerkungen ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Bemerkungen</td><td style="padding:4px 0;font-weight:600">${esc(bemerkungen)}</td></tr>` : "",
    ].filter(Boolean).join("");

    const html = `
      <h2 style="font-family:sans-serif">Kontaktanfrage Wiehnachtsmärt</h2>
      <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">${rows}</table>
      <p style="font-family:sans-serif;color:#94a3b8;font-size:12px">Gesendet von weihnachtsmarkt-luzern.com</p>`;

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: "Wiehnachtsmärt Kontakt", email: process.env.BREVO_SENDER ?? "sekretariat@weihnachtsmarktluzern.com" },
        to: [{ email: "sekretariat@weihnachtsmarktluzern.com" }],
        replyTo: { email },
        subject: `Kontaktanfrage: ${nameVorname}`,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[kontakt] Brevo Fehler", res.status, body);
      return NextResponse.json({ error: "E-Mail konnte nicht gesendet werden." }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server-Fehler" }, { status: 500 });
  }
}

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
