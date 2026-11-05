import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { firmenname, name, vorname, strasse, postfach, plzOrt, telefon, mobile, email, webseite, sortiment, angebot, bemerkungen } = data;

    if (!firmenname || !name || !vorname || !email) {
      return NextResponse.json({ error: "Pflichtfelder fehlen." }, { status: 400 });
    }

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.warn("[anmeldung] BREVO_API_KEY fehlt");
      return NextResponse.json({ error: "E-Mail-Versand nicht konfiguriert." }, { status: 500 });
    }

    const rows = [
      `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Firmenname</td><td style="padding:4px 0;font-weight:600">${esc(firmenname)}</td></tr>`,
      `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Name</td><td style="padding:4px 0;font-weight:600">${esc(name)}</td></tr>`,
      `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Vorname</td><td style="padding:4px 0;font-weight:600">${esc(vorname)}</td></tr>`,
      `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Strasse</td><td style="padding:4px 0;font-weight:600">${esc(strasse)}</td></tr>`,
      postfach ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Postfach</td><td style="padding:4px 0;font-weight:600">${esc(postfach)}</td></tr>` : "",
      `<tr><td style="padding:4px 12px 4px 0;color:#64748b">PLZ/Ort</td><td style="padding:4px 0;font-weight:600">${esc(plzOrt)}</td></tr>`,
      telefon ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Telefon</td><td style="padding:4px 0;font-weight:600">${esc(telefon)}</td></tr>` : "",
      `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Mobile</td><td style="padding:4px 0;font-weight:600">${esc(mobile)}</td></tr>`,
      `<tr><td style="padding:4px 12px 4px 0;color:#64748b">E-Mail</td><td style="padding:4px 0;font-weight:600">${esc(email)}</td></tr>`,
      webseite ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Webseite</td><td style="padding:4px 0;font-weight:600">${esc(webseite)}</td></tr>` : "",
      `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Sortiment</td><td style="padding:4px 0;font-weight:600">${esc(sortiment)}</td></tr>`,
      `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Angebot</td><td style="padding:4px 0;font-weight:600">${esc(angebot)}</td></tr>`,
      bemerkungen ? `<tr><td style="padding:4px 12px 4px 0;color:#64748b">Bemerkungen</td><td style="padding:4px 0;font-weight:600">${esc(bemerkungen)}</td></tr>` : "",
    ].filter(Boolean).join("");

    const html = `
      <h2 style="font-family:sans-serif">Anmeldung Wiehnachtsmärt 2026</h2>
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
        sender: { name: "Wiehnachtsmärt Anmeldung", email: process.env.BREVO_SENDER ?? "sekretariat@weihnachtsmarktluzern.com" },
        to: [{ email: "sekretariat@weihnachtsmarktluzern.com" }],
        replyTo: { email },
        subject: `Anmeldung Wiehnachtsmärt: ${firmenname} – ${vorname} ${name}`,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[anmeldung] Brevo Fehler", res.status, body);
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
