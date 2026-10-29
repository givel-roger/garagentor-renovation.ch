import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

export async function sendPasswordResetEmail(
  to: string,
  username: string,
  newPassword: string
) {
  await transporter.sendMail({
    from: `"Garagentor Renovation" <${process.env.BREVO_SMTP_LOGIN}>`,
    to,
    subject: "Passwort zurückgesetzt – garagentor-renovation.ch",
    html: `
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
  });
}
