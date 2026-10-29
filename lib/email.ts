const NOTIFICATION_EMAIL = "givel@marktindex.ch";

export async function sendLeadNotification(lead: {
  name: string;
  phone?: string;
  email?: string;
  plz?: string;
  ort?: string;
  source: string;
  nachricht?: string;
  transkription?: string;
}) {
  const apiKey = process.env.BREVO_SMTP_KEY;
  if (!apiKey) return;

  const quelleLabel: Record<string, string> = {
    web: "Webformular",
    phone: "Telefonanruf",
  };
  const quelle = quelleLabel[lead.source] || lead.source;
  const zeit = new Date().toLocaleString("de-CH", { timeZone: "Europe/Zurich" });

  const details = [
    `<tr><td style="padding:4px 12px 4px 0;color:#666;">Quelle</td><td style="padding:4px 0;"><strong>${quelle}</strong></td></tr>`,
    `<tr><td style="padding:4px 12px 4px 0;color:#666;">Name</td><td style="padding:4px 0;">${lead.name}</td></tr>`,
    lead.phone ? `<tr><td style="padding:4px 12px 4px 0;color:#666;">Telefon</td><td style="padding:4px 0;"><a href="tel:${lead.phone}">${lead.phone}</a></td></tr>` : "",
    lead.email ? `<tr><td style="padding:4px 12px 4px 0;color:#666;">E-Mail</td><td style="padding:4px 0;">${lead.email}</td></tr>` : "",
    lead.plz || lead.ort ? `<tr><td style="padding:4px 12px 4px 0;color:#666;">Ort</td><td style="padding:4px 0;">${lead.plz} ${lead.ort}</td></tr>` : "",
    lead.nachricht ? `<tr><td style="padding:4px 12px 4px 0;color:#666;">Nachricht</td><td style="padding:4px 0;">${lead.nachricht}</td></tr>` : "",
    lead.transkription ? `<tr><td style="padding:4px 12px 4px 0;color:#666;">Transkription</td><td style="padding:4px 0;"><em>${lead.transkription}</em></td></tr>` : "",
    `<tr><td style="padding:4px 12px 4px 0;color:#666;">Zeit</td><td style="padding:4px 0;">${zeit}</td></tr>`,
  ].filter(Boolean).join("");

  try {
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { name: "Garagentor Renovation", email: "givel@marktindex.ch" },
        to: [{ email: NOTIFICATION_EMAIL, name: "Roger Givel" }],
        subject: `Neuer Lead: ${lead.name} (${quelle})`,
        htmlContent: `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:20px;">
            <h2 style="color:#003A7D;margin-bottom:4px;">Neuer Lead eingegangen</h2>
            <table style="border-collapse:collapse;width:100%;margin-top:12px;">${details}</table>
            <p style="margin-top:20px;">
              <a href="https://garagentor-renovation.ch/admin" style="background:#003A7D;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;">Im Admin öffnen</a>
            </p>
          </div>
        `,
      }),
    });
  } catch (err) {
    console.error("[Email] Benachrichtigung fehlgeschlagen:", err);
  }
}

export async function sendPasswordResetEmail(
  to: string,
  username: string,
  newPassword: string
) {
  const apiKey = process.env.BREVO_SMTP_KEY;
  if (!apiKey) throw new Error("BREVO_SMTP_KEY nicht konfiguriert");

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: "Marktindex", email: "givel@marktindex.ch" },
      to: [{ email: to, name: username }],
      subject: "Passwort zurückgesetzt – garagentor-renovation.ch",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #003A7D;">Passwort zurückgesetzt</h2>
          <p>Hallo <strong>${username}</strong>,</p>
          <p>Dein Passwort für das Admin-Panel von <strong>garagentor-renovation.ch</strong> wurde zurückgesetzt.</p>
          <p>Du kannst dich jetzt mit folgendem Passwort anmelden:</p>
          <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <code style="font-size: 18px; color: #003A7D;">${newPassword}</code>
          </div>
          <p>Bitte ändere dein Passwort nach dem Login.</p>
          <p style="color: #888; font-size: 12px; margin-top: 30px;">
            Diese E-Mail wurde automatisch versendet. Bitte antworte nicht darauf.
          </p>
        </div>
      `,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo API Fehler: ${res.status} ${err}`);
  }
}
