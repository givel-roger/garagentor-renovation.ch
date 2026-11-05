"use client";

import { useState } from "react";
import Link from "next/link";

export default function Anmeldung() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firmenname: "",
    name: "",
    vorname: "",
    strasse: "",
    postfach: "",
    plzOrt: "",
    telefon: "",
    mobile: "",
    email: "",
    webseite: "",
    sortiment: "",
    angebot: "",
    bemerkungen: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/anmeldung", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Fehler beim Senden");
      }

      setStatus("success");
      setStep(1);
      setForm({ firmenname: "", name: "", vorname: "", strasse: "", postfach: "", plzOrt: "", telefon: "", mobile: "", email: "", webseite: "", sortiment: "", angebot: "", bemerkungen: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Unbekannter Fehler");
    }
  };

  const inputClass = "w-full bg-white/5 border border-foreground/15 rounded-lg px-4 py-3 text-foreground/80 text-sm placeholder:text-foreground/25 focus:outline-none focus:border-burgundy/50 focus:ring-1 focus:ring-burgundy/30 transition-colors";
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
        <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-4">Anmeldung</h1>
        <p className="text-muted text-base mb-4">
          Anmeldung für die Teilnahme am Wiehnachtsmärt
        </p>
        <p className="text-foreground/40 text-sm mb-10">
          Vom 3. Dezember 2026 bis 21. Dezember 2026
        </p>

        <div className="bg-burgundy/8 border border-burgundy/20 rounded-xl p-6 mb-10">
          <p className="text-burgundy font-semibold text-base mb-2">Hinweis</p>
          <p className="text-foreground/60 text-sm">
            Das Kontingent für <strong className="text-foreground/80">Food/Getränke-Stände</strong> ist bereits
            ausgeschöpft und wir können keine weiteren Anmeldungen annehmen.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <p className="text-foreground/40 text-xs mb-2">Schritt {step} von 2</p>
          <div className="w-full bg-foreground/10 rounded-full h-2">
            <div
              className="bg-burgundy h-2 rounded-full transition-all duration-300"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Firmenname <span className="text-burgundy">*</span></label>
                <input type="text" required value={form.firmenname} onChange={set("firmenname")} placeholder="Firmenname" className={inputClass} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Name <span className="text-burgundy">*</span></label>
                  <input type="text" required value={form.name} onChange={set("name")} placeholder="Name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Vorname <span className="text-burgundy">*</span></label>
                  <input type="text" required value={form.vorname} onChange={set("vorname")} placeholder="Vorname" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Strasse <span className="text-burgundy">*</span></label>
                  <input type="text" required value={form.strasse} onChange={set("strasse")} placeholder="Strasse" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Postfach</label>
                  <input type="text" value={form.postfach} onChange={set("postfach")} placeholder="Postfach" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>PLZ und Ort <span className="text-burgundy">*</span></label>
                  <input type="text" required value={form.plzOrt} onChange={set("plzOrt")} placeholder="PLZ/Ort" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Telefon</label>
                  <input type="tel" value={form.telefon} onChange={set("telefon")} placeholder="Telefon" className={inputClass} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Mobile <span className="text-burgundy">*</span></label>
                  <input type="tel" required value={form.mobile} onChange={set("mobile")} placeholder="Mobile" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>E-Mail <span className="text-burgundy">*</span></label>
                  <input type="email" required value={form.email} onChange={set("email")} placeholder="E-Mail" className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>Webseite</label>
                <input type="url" value={form.webseite} onChange={set("webseite")} placeholder="Webseite" className={inputClass} />
              </div>

              <button
                type="button"
                onClick={() => {
                  if (form.firmenname && form.name && form.vorname && form.strasse && form.plzOrt && form.mobile && form.email) {
                    setStep(2);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="bg-burgundy text-white px-8 py-3 rounded-lg font-medium text-sm hover:bg-ruby transition-colors"
              >
                Weiter
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Sortiment / Kategorie <span className="text-burgundy">*</span></label>
                <select required value={form.sortiment} onChange={set("sortiment")} className={inputClass}>
                  <option value="">Bitte wählen...</option>
                  <option value="Kunsthandwerk">Kunsthandwerk</option>
                  <option value="Geschenkartikel">Geschenkartikel</option>
                  <option value="Weihnachtsdekoration">Weihnachtsdekoration</option>
                  <option value="Schmuck / Accessoires">Schmuck / Accessoires</option>
                  <option value="Textilien / Mode">Textilien / Mode</option>
                  <option value="Spielzeug">Spielzeug</option>
                  <option value="Kerzen / Seifen">Kerzen / Seifen</option>
                  <option value="Anderes">Anderes</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Beschreibung Ihres Angebots <span className="text-burgundy">*</span></label>
                <textarea
                  required
                  value={form.angebot}
                  onChange={set("angebot")}
                  placeholder="Bitte beschreiben Sie Ihr Angebot..."
                  rows={4}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Bemerkungen</label>
                <textarea
                  value={form.bemerkungen}
                  onChange={set("bemerkungen")}
                  placeholder="Weitere Bemerkungen..."
                  rows={3}
                  className={inputClass}
                />
              </div>

              {status === "success" && (
                <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4 text-green-300 text-sm">
                  Vielen Dank! Ihre Anmeldung wurde erfolgreich gesendet. Wir melden uns bei Ihnen.
                </div>
              )}

              {status === "error" && (
                <div className="bg-red-900/30 border border-red-500/30 rounded-lg p-4 text-red-300 text-sm">
                  {errorMsg || "Fehler beim Senden. Bitte versuchen Sie es erneut."}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="border border-foreground/20 text-foreground/60 px-6 py-3 rounded-lg font-medium text-sm hover:border-foreground/40 transition-colors"
                >
                  Zurück
                </button>
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="bg-burgundy text-white px-8 py-3 rounded-lg font-medium text-sm hover:bg-ruby transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? "Wird gesendet..." : "Anmeldung absenden"}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="mt-16 pt-8 border-t border-foreground/10 space-y-6 text-sm text-foreground/40">
          <p>
            Bei Fragen zur Anmeldung wenden Sie sich bitte an:{" "}
            <a href="mailto:sekretariat@weihnachtsmarktluzern.com" className="text-burgundy underline decoration-burgundy/30 hover:decoration-burgundy/60">
              sekretariat@weihnachtsmarktluzern.com
            </a>
          </p>
          <p>
            Weitere Informationen:{" "}
            <Link href="/haeuschenmasse" className="text-burgundy underline decoration-burgundy/30 hover:decoration-burgundy/60">Häuschenmasse</Link>
            {" · "}
            <Link href="/standplan" className="text-burgundy underline decoration-burgundy/30 hover:decoration-burgundy/60">Stand-Plan</Link>
            {" · "}
            <Link href="/teilnehmer" className="text-burgundy underline decoration-burgundy/30 hover:decoration-burgundy/60">Teilnehmer-Liste</Link>
          </p>
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
