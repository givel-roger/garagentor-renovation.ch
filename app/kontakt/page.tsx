"use client";

import { useState } from "react";
import Link from "next/link";

export default function Kontakt() {
  const [form, setForm] = useState({
    firma: "",
    nameVorname: "",
    adresse: "",
    plzOrt: "",
    email: "",
    telefon: "",
    bemerkungen: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Fehler beim Senden");
      }

      setStatus("success");
      setForm({ firma: "", nameVorname: "", adresse: "", plzOrt: "", email: "", telefon: "", bemerkungen: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unbekannter Fehler");
    }
  };

  const inputClass = "w-full bg-white border border-foreground/20 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-foreground/40 focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/30 transition-colors";
  const labelClass = "block text-sm font-medium text-foreground/60 mb-1.5";

  return (
    <div className="min-h-screen bg-wine text-foreground">
      <nav className="bg-burgundy">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/logo-weihnachtsmaert.png" alt="Lozärner Wiehnachtsmärt" className="h-10 w-auto" />
          </Link>
          <Link href="/" className="text-sm text-white/70 hover:text-white transition-colors">
            Zurück zur Startseite
          </Link>
        </div>
      </nav>

      <main className="max-w-[700px] mx-auto px-5 sm:px-10 py-20">
        <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-12">Kontakt</h1>

        <div className="space-y-8 text-base text-foreground/60 leading-relaxed">
          <section>
            <p>
              Allgemeine Anfragen oder Anliegen können Sie uns gerne mit diesem Formular oder direkt per Mail an{" "}
              <a href="mailto:sekretariat@weihnachtsmarktluzern.com" className="text-burgundy underline decoration-burgundy/30 hover:decoration-burgundy/60">
                sekretariat@weihnachtsmarktluzern.com
              </a>{" "}
              mitteilen. Wir freuen uns auf Ihre Nachricht.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-6">Kontaktformular</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={labelClass}>Firma</label>
                <input type="text" value={form.firma} onChange={set("firma")} placeholder="Firma" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Name und Vorname <span className="text-burgundy">*</span></label>
                <input type="text" required value={form.nameVorname} onChange={set("nameVorname")} placeholder="Name und Vorname" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Adresse <span className="text-burgundy">*</span></label>
                <input type="text" required value={form.adresse} onChange={set("adresse")} placeholder="Adresse" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>PLZ / Ort <span className="text-burgundy">*</span></label>
                <input type="text" required value={form.plzOrt} onChange={set("plzOrt")} placeholder="PLZ / Ort" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Ihre E-Mail <span className="text-burgundy">*</span></label>
                <input type="email" required value={form.email} onChange={set("email")} placeholder="Ihre E-Mail" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Ihre Telefonnummer <span className="text-burgundy">*</span></label>
                <input type="tel" required value={form.telefon} onChange={set("telefon")} placeholder="Ihre Telefonnummer" className={inputClass} />
              </div>

              <div>
                <label className={labelClass}>Bemerkungen / Wünsche</label>
                <textarea
                  value={form.bemerkungen}
                  onChange={set("bemerkungen")}
                  placeholder="Bemerkungen / Wünsche"
                  rows={4}
                  className={inputClass}
                />
              </div>

              {status === "success" && (
                <div className="bg-green-50 border border-green-600/30 rounded-lg p-4 text-green-800 text-sm">
                  Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.
                </div>
              )}

              {status === "error" && (
                <div className="bg-red-50 border border-red-600/30 rounded-lg p-4 text-red-800 text-sm">
                  {errorMsg || "Fehler beim Senden. Bitte versuchen Sie es erneut."}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="bg-burgundy text-white px-8 py-3 rounded-lg font-medium text-sm hover:bg-ruby transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === "sending" ? "Wird gesendet..." : "Nachricht senden"}
              </button>
            </form>
          </section>

          <section className="pt-4 border-t border-foreground/10">
            <h2 className="text-lg font-semibold text-foreground mb-3">Sekretariat</h2>
            <p>
              IG Luzerner Herbstmesse und Märkte (IG LHMM)<br />
              Schachenstrasse 10<br />
              6020 Emmenbrücke
            </p>
            <p className="mt-4">
              E-Mail:{" "}
              <a href="mailto:sekretariat@weihnachtsmarktluzern.com" className="text-burgundy underline decoration-burgundy/30 hover:decoration-burgundy/60">
                sekretariat@weihnachtsmarktluzern.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Werbung &amp; Kommunikation</h2>
            <p>
              Roger Givel
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Anmeldung / Standvergabe</h2>
            <p>
              Interessierte Marktfahrer können sich über unser{" "}
              <Link href="/anmeldung" className="text-burgundy underline decoration-burgundy/30 hover:decoration-burgundy/60">
                Anmeldeformular
              </Link>{" "}
              bewerben. Bitte beachten Sie, dass die Standplätze limitiert sind und eine frühzeitige
              Anmeldung empfohlen wird.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Standort</h2>
            <p>
              Der Lozärner Wiehnachtsmärt findet auf dem <strong className="text-foreground/80">Franziskanerplatz</strong> in
              der Altstadt von Luzern statt. Der Platz ist vom Bahnhof Luzern in wenigen Gehminuten erreichbar.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-foreground/10 py-10">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-foreground/40">
          <p>&copy; {new Date().getFullYear()} IG Luzerner Herbstmesse und Märkte</p>
          <div className="flex gap-6">
            <Link href="/impressum" className="hover:text-foreground/60 transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-foreground/60 transition-colors">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
