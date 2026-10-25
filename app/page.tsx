"use client";

import Image from "next/image";
import { useState, useRef } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    plz: "",
    ort: "",
    torTyp: "",
    breite: "",
    hoehe: "",
    nachricht: "",
  });
  const [fotos, setFotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const allFiles = [...fotos, ...files].slice(0, 5);
    setFotos(allFiles);
    const urls = allFiles.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
  }

  function removePhoto(index: number) {
    const newFotos = fotos.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    setFotos(newFotos);
    setPreviews(newPreviews);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setError("");

    try {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, val]) => fd.append(key, val));
      fotos.forEach((f) => fd.append("fotos", f));

      const res = await fetch("/api/leads", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Fehler beim Senden");
      setSent(true);
    } catch {
      setError("Es gab einen Fehler. Bitte versuchen Sie es erneut.");
    } finally {
      setSending(false);
    }
  }

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Image src="/logo.svg" alt="Garagentor-Renovation" width={200} height={40} priority />
          <button
            onClick={scrollToForm}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            Offerte anfordern
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-anthracite text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-orange-500 font-semibold text-sm uppercase tracking-wide mb-3">
              Professionelle Garagentor-Renovation
            </p>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-6">
              Ihr Garagentor,
              <br />
              <span className="text-orange-500">wie neu.</span>
            </h1>
            <p className="text-gray-300 text-lg sm:text-xl leading-relaxed mb-8">
              Wir renovieren Ihr bestehendes Garagentor — schnell, sauber und
              zum besten Preis in der Schweiz. Ohne Kompromisse bei der Qualität.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={scrollToForm}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-lg text-base font-semibold transition-colors"
              >
                Kostenlose Offerte anfordern
              </button>
              <a
                href="tel:+41XXXXXXXXX"
                className="border border-white/20 hover:border-white/40 text-white px-8 py-3.5 rounded-lg text-base font-semibold transition-colors text-center"
              >
                Jetzt anrufen
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Vorteile */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            Warum Garagentor-Renovation?
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "💰",
                title: "Günstigster Anbieter",
                text: "Wir bieten Ihnen den besten Preis für Ihre Garagentor-Renovation in der Schweiz.",
              },
              {
                icon: "⚡",
                title: "Schnelle Umsetzung",
                text: "In der Regel ist Ihr Tor innerhalb eines Tages fertig renoviert.",
              },
              {
                icon: "✨",
                title: "Saubere Arbeit",
                text: "Wir arbeiten präzise und hinterlassen Ihre Garage sauber und ordentlich.",
              },
              {
                icon: "🏆",
                title: "Premium-Qualität",
                text: "Hochwertige Materialien und Markentore für langlebige Ergebnisse.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* So funktioniert's */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            So einfach geht&apos;s
          </h2>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Foto hochladen",
                text: "Fotografieren Sie Ihr Garagentor mit dem Handy und laden Sie das Bild hoch.",
              },
              {
                step: "2",
                title: "Offerte erhalten",
                text: "Wir erstellen Ihnen innert 24 Stunden eine kostenlose und unverbindliche Offerte.",
              },
              {
                step: "3",
                title: "Tor renovieren",
                text: "Nach Ihrer Zusage renovieren wir Ihr Tor — schnell und zum vereinbarten Preis.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead-Formular */}
      <section ref={formRef} id="offerte" className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-3">
            Kostenlose Offerte anfordern
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-lg mx-auto">
            Füllen Sie das Formular aus und laden Sie ein Foto Ihres Garagentors
            hoch. Wir melden uns innert 24 Stunden bei Ihnen.
          </p>

          {sent ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">
                Vielen Dank!
              </h3>
              <p className="text-green-700">
                Ihre Anfrage wurde erfolgreich gesendet. Wir melden uns innert
                24 Stunden bei Ihnen.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 space-y-6"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Hans Muster"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    E-Mail *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="hans@beispiel.ch"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="079 123 45 67"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      PLZ *
                    </label>
                    <input
                      type="text"
                      name="plz"
                      required
                      value={formData.plz}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="8000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Ort *
                    </label>
                    <input
                      type="text"
                      name="ort"
                      required
                      value={formData.ort}
                      onChange={handleChange}
                      className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder="Zürich"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Tor-Typ
                </label>
                <select
                  name="torTyp"
                  value={formData.torTyp}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                >
                  <option value="">Bitte wählen (optional)</option>
                  <option value="sektionaltor">Sektionaltor</option>
                  <option value="schwingtor">Schwingtor</option>
                  <option value="rolltor">Rolltor</option>
                  <option value="fluegel">Flügeltor</option>
                  <option value="unbekannt">Weiss ich nicht</option>
                </select>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Breite (cm)
                  </label>
                  <input
                    type="text"
                    name="breite"
                    value={formData.breite}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="z.B. 250"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Höhe (cm)
                  </label>
                  <input
                    type="text"
                    name="hoehe"
                    value={formData.hoehe}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="z.B. 200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Nachricht (optional)
                </label>
                <textarea
                  name="nachricht"
                  value={formData.nachricht}
                  onChange={handleChange}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  placeholder="Zusätzliche Informationen zu Ihrem Garagentor..."
                />
              </div>

              {/* Foto-Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Fotos Ihres Garagentors (max. 5)
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center cursor-pointer hover:border-orange-400 transition-colors"
                >
                  <div className="text-3xl mb-2">📷</div>
                  <p className="text-sm text-gray-600">
                    Klicken oder Foto mit dem Handy aufnehmen
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    JPG, PNG — max. 10 MB pro Bild
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    multiple
                    onChange={handleFiles}
                    className="hidden"
                  />
                </div>
                {previews.length > 0 && (
                  <div className="flex gap-3 mt-4 flex-wrap">
                    {previews.map((src, i) => (
                      <div key={i} className="relative">
                        <img
                          src={src}
                          alt={`Foto ${i + 1}`}
                          className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {error && (
                <p className="text-red-600 text-sm">{error}</p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3.5 rounded-lg text-base font-semibold transition-colors"
              >
                {sending ? "Wird gesendet..." : "Kostenlose Offerte anfordern"}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Ihre Daten werden vertraulich behandelt und nicht an Dritte
                weitergegeben.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* Vertrauen */}
      <section className="py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-orange-500 mb-2">500+</div>
              <p className="text-gray-600">Renovierte Garagentore</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-orange-500 mb-2">24h</div>
              <p className="text-gray-600">Offerte innert einem Tag</p>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-orange-500 mb-2">100%</div>
              <p className="text-gray-600">Zufriedene Kunden</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-anthracite text-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8">
            <div>
              <Image src="/logo.svg" alt="Garagentor-Renovation" width={180} height={36} className="invert mb-4" />
              <p className="text-gray-400 text-sm">
                Professionelle Garagentor-Renovation
                <br />
                in der ganzen Schweiz.
              </p>
            </div>
            <div className="text-sm text-gray-400">
              <p className="font-semibold text-white mb-2">Kontakt</p>
              <p>info@garagentor-renovation.ch</p>
              <p>+41 XX XXX XX XX</p>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-6 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Garagentor-Renovation. Alle Rechte vorbehalten.
          </div>
        </div>
      </footer>
    </>
  );
}
