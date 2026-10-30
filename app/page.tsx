"use client";

import { useState, useRef } from "react";
import { trackEvent } from "@/lib/tracking";

function IconShield() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M12 2l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V6l7-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function IconTool() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

function IconCamera() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const allFiles = [...fotos, ...files].slice(0, 5);
    setFotos(allFiles);
    setPreviews(allFiles.map((f) => URL.createObjectURL(f)));
  }

  function removePhoto(index: number) {
    setFotos(fotos.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
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
      if (!res.ok) throw new Error("Fehler");
      setSent(true);
      trackEvent("lead_form_submit", { tor_typ: formData.torTyp || "", plz: formData.plz || "" });
    } catch {
      setError("Es gab einen Fehler. Bitte versuchen Sie es erneut.");
    } finally {
      setSending(false);
    }
  }

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const inputClass =
    "w-full border border-gray-300 rounded px-3.5 py-2.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-700/40 focus:border-blue-700 transition-shadow bg-white";

  return (
    <>
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-50 bg-[#003A7D] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[64px] flex items-center justify-between">
          <div className="flex items-center gap-0">
            <div className="flex flex-col items-start leading-none">
              <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[22px] font-black tracking-[-0.01em] text-white uppercase">Garagentor</span>
              <div className="w-full h-[2px] bg-[#F9AD09] my-[3px] rounded-full" />
              <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[11.5px] font-extrabold tracking-[0.28em] text-[#F9AD09] uppercase">Renovation</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:+41444429990" onClick={() => trackEvent("phone_click")} className="hidden sm:flex items-center gap-2 text-sm text-white/70 hover:text-white">
              <IconPhone />
              <span>044 442 99 90</span>
            </a>
            <button onClick={scrollToForm} className="bg-[#F9AD09] hover:bg-[#E89D06] text-[#003A7D] font-bold px-5 py-2.5 rounded text-sm transition-all hover:shadow-lg hover:shadow-gold-400/20">
              Offerte anfordern
            </button>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="relative min-h-[600px] sm:min-h-[700px] flex items-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img src="/images/gz-tipps.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,31,69,0.93) 0%, rgba(0,58,125,0.78) 60%, rgba(0,58,125,0.5) 100%)" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 mb-8">
              <div className="w-2 h-2 bg-green-400 rounded-full" />
              <span className="text-white/80 text-sm">Jetzt Offerte anfordern &mdash; Antwort innert 24h</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6 tracking-tight">
              Ihr Garagentor,<br />
              <span className="text-gold-400">wie neu.</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 leading-relaxed mb-10 max-w-xl">
              Renovation statt Neukauf. Wir bringen Ihr bestehendes Garagentor
              auf Vordermann &mdash; zum besten Preis in der Schweiz.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={scrollToForm} className="bg-[#F9AD09] hover:bg-[#E89D06] text-[#003A7D] font-bold px-8 py-4 rounded text-base transition-all hover:shadow-xl hover:shadow-gold-400/25 flex items-center justify-center gap-2">
                Kostenlose Offerte
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
              </button>
              <a href="tel:+41444429990" onClick={() => trackEvent("phone_click")} className="border border-white/25 hover:border-white/40 hover:bg-white/5 text-white px-8 py-4 rounded text-base font-semibold transition-all text-center flex items-center justify-center gap-2">
                <IconPhone />
                Anrufen
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <section className="bg-[#003A7D] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {[
              { value: "500+", label: "Tore renoviert" },
              { value: "24h", label: "Offerte-Garantie" },
              { value: "15+", label: "Jahre Erfahrung" },
              { value: "100%", label: "Festpreisgarantie" },
            ].map((s) => (
              <div key={s.label} className="text-center sm:text-left">
                <span className="text-2xl sm:text-3xl font-bold text-gold-400">{s.value}</span>
                <p className="text-sm text-white/50 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LEISTUNGEN ─── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-wide mb-3">Unsere Leistungen</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#003A7D] tracking-tight mb-4">
              Warum renovieren statt ersetzen?
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed">
              Ein neues Garagentor kostet schnell CHF 5&apos;000 oder mehr.
              Wir renovieren Ihr bestehendes Tor &mdash; für einen Bruchteil des Preises.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Image */}
            <div className="relative rounded-xl overflow-hidden h-[300px] sm:h-[400px] lg:h-full">
              <img src="/images/gz-renovieren.jpg" alt="Garagentor-Monteure bei der Arbeit" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-white font-semibold text-lg">Professionelle Renovation</p>
                <p className="text-white/70 text-sm mt-1">Ihr Garagentor sieht aus wie neu &mdash; ohne den Preis eines Neukaufs.</p>
              </div>
            </div>

            {/* Cards */}
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { icon: <IconShield />, highlight: "70%", sub: "günstiger", prefix: "bis zu", title: "Bester Preis", text: "Transparente Festpreise — ohne versteckte Kosten." },
                { icon: <IconClock />, highlight: "1", sub: "Tag", title: "Fertig in einem Tag", text: "Morgens kommen wir, abends ist Ihr Tor wie neu." },
                { icon: <IconTool />, highlight: "100%", sub: "sauber", title: "Saubere Arbeit", text: "Professionelle Ausführung mit hochwertigen Materialien." },
                { icon: <IconStar />, highlight: "5", sub: "Jahre", title: "Mit Garantie", text: "Schriftliche Garantie auf jede Renovation." },
              ].map((item) => (
                <div key={item.title} className="p-6 rounded-xl bg-[#003A7D] text-white hover:bg-[#002D63] transition-all group">
                  {'prefix' in item && <span className="text-[13px] font-semibold text-white/50 uppercase tracking-wider">{(item as any).prefix}</span>}
                  <div className="flex items-end gap-2 mb-4">
                    <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[42px] font-black leading-none text-[#F9AD09]">{item.highlight}</span>
                    <span className="text-[15px] font-semibold text-white/70 pb-1">{item.sub}</span>
                  </div>
                  <h3 className="font-bold text-[17px] mb-2">{item.title}</h3>
                  <p className="text-white/60 text-[14px] leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TOR-TYPEN ─── */}
      <section className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-wide mb-3">Tor-Typen</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#003A7D] tracking-tight mb-4">
              Wir renovieren alle Garagentor-Typen
            </h2>
            <p className="text-gray-500 text-lg">
              Egal ob Sektionaltor, Schwingtor oder Rolltor &mdash; wir haben die Lösung.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { img: "/images/gz-beste.jpg", title: "Sektionaltor", desc: "Das beliebteste Garagentor der Schweiz. Platzsparend und modern." },
              { img: "/images/gz-ersetzen.jpg", title: "Schwingtor", desc: "Der Klassiker. Robust und langlebig — ideal für die Renovation." },
              { img: "/images/gz-komplett.jpg", title: "Rolltor / Spezial", desc: "Auch spezielle Tor-Typen renovieren wir fachgerecht und zuverlässig." },
            ].map((tor) => (
              <div key={tor.title} className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
                <div className="h-[220px] overflow-hidden">
                  <img src={tor.img} alt={tor.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-[#003A7D] mb-1.5">{tor.title}</h3>
                  <p className="text-gray-500 text-[14px] leading-relaxed">{tor.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ABLAUF ─── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-gold-400 font-semibold text-sm uppercase tracking-wide mb-3">So funktioniert&apos;s</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#003A7D] tracking-tight mb-4">
              In drei Schritten zum neuen Tor
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Foto & Masse", text: "Fotografieren Sie Ihr Garagentor mit dem Handy und teilen Sie uns die ungefähren Masse mit." },
              { step: "02", title: "Offerte erhalten", text: "Innert 24 Stunden erhalten Sie eine kostenlose, unverbindliche Offerte mit Festpreis." },
              { step: "03", title: "Renovation", text: "Nach Ihrer Zusage renovieren wir Ihr Tor — schnell, sauber, zum vereinbarten Preis." },
            ].map((item, i) => (
              <div key={item.step} className="relative text-center">
                {i < 2 && (
                  <div className="hidden sm:block absolute top-8 left-[calc(50%+40px)] w-[calc(100%-80px)] border-t-2 border-dashed border-gray-200" />
                )}
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#003A7D] text-white text-lg font-bold mb-5">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg text-[#003A7D] mb-3">{item.title}</h3>
                <p className="text-gray-500 text-[15px] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="/images/gz-fehler.jpg" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#003A7D]/90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Bereit für ein neues Garagentor-Erlebnis?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            Starten Sie jetzt &mdash; kostenlos und unverbindlich. Wir melden uns innert 24 Stunden.
          </p>
          <button onClick={scrollToForm} className="bg-[#F9AD09] hover:bg-[#E89D06] text-[#003A7D] font-bold px-10 py-4 rounded text-base transition-all hover:shadow-xl hover:shadow-gold-400/25 inline-flex items-center gap-2">
            Jetzt Offerte anfordern
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
          </button>
        </div>
      </section>

      {/* ─── FORMULAR ─── */}
      <section ref={formRef} id="offerte" className="py-20 sm:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Info */}
            <div className="lg:col-span-2">
              <p className="text-gold-400 font-semibold text-sm uppercase tracking-wide mb-3">Kontakt</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#003A7D] tracking-tight mb-4">
                Kostenlose Offerte
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-8">
                Füllen Sie das Formular aus und laden Sie ein Foto Ihres Garagentors hoch. Wir melden uns innert 24 Stunden.
              </p>

              <div className="space-y-5">
                {[
                  { icon: <IconShield />, title: "Unverbindlich & kostenlos", text: "Keine versteckten Kosten, kein Risiko." },
                  { icon: <IconClock />, title: "Antwort innert 24h", text: "Wir sind schnell. Versprochen." },
                  { icon: <IconTool />, title: "Festpreisgarantie", text: "Der Preis in der Offerte gilt. Punkt." },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-gold-400">{item.icon}</div>
                    <div>
                      <p className="font-semibold text-[#003A7D] text-[15px]">{item.title}</p>
                      <p className="text-gray-500 text-sm">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {sent ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-10 text-center">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" className="w-7 h-7"><path d="M20 6L9 17l-5-5" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Vielen Dank!</h3>
                  <p className="text-green-700">Ihre Anfrage wurde gesendet. Wir melden uns innert 24 Stunden.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 space-y-5 shadow-sm">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Name *</label>
                      <input type="text" name="name" required value={formData.name} onChange={handleChange} className={inputClass} placeholder="Vor- und Nachname" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon *</label>
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className={inputClass} placeholder="079 123 45 67" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">E-Mail *</label>
                    <input type="email" name="email" required value={formData.email} onChange={handleChange} className={inputClass} placeholder="ihre@email.ch" />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">PLZ *</label>
                      <input type="text" name="plz" required value={formData.plz} onChange={handleChange} className={inputClass} placeholder="8000" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Ort *</label>
                      <input type="text" name="ort" required value={formData.ort} onChange={handleChange} className={inputClass} placeholder="Zürich" />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Tor-Typ</label>
                      <select name="torTyp" value={formData.torTyp} onChange={handleChange} className={inputClass}>
                        <option value="">Wählen</option>
                        <option value="sektionaltor">Sektionaltor</option>
                        <option value="schwingtor">Schwingtor</option>
                        <option value="rolltor">Rolltor</option>
                        <option value="fluegel">Flügeltor</option>
                        <option value="unbekannt">Weiss nicht</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Breite (cm)</label>
                      <input type="text" name="breite" value={formData.breite} onChange={handleChange} className={inputClass} placeholder="z.B. 250" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Höhe (cm)</label>
                      <input type="text" name="hoehe" value={formData.hoehe} onChange={handleChange} className={inputClass} placeholder="z.B. 200" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nachricht</label>
                    <textarea name="nachricht" value={formData.nachricht} onChange={handleChange} rows={3} className={inputClass + " resize-none"} placeholder="Beschreiben Sie kurz den Zustand Ihres Tors..." />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Fotos hochladen <span className="font-normal text-gray-400">(max. 5)</span></label>
                    <div onClick={() => fileRef.current?.click()} className="border border-dashed border-gray-300 rounded-lg p-5 text-center cursor-pointer hover:border-gold-400 hover:bg-gold-400/5 transition-all">
                      <div className="text-gray-400 flex justify-center mb-2"><IconCamera /></div>
                      <p className="text-sm text-gray-600">Foto aufnehmen oder Datei wählen</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG &mdash; max. 10 MB</p>
                      <input ref={fileRef} type="file" accept="image/*" capture="environment" multiple onChange={handleFiles} className="hidden" />
                    </div>
                    {previews.length > 0 && (
                      <div className="flex gap-3 mt-3 flex-wrap">
                        {previews.map((src, i) => (
                          <div key={i} className="relative">
                            <img src={src} alt={`Foto ${i + 1}`} className="w-20 h-20 object-cover rounded border border-gray-200" />
                            <button type="button" onClick={() => removePhoto(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">&times;</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {error && <p className="text-red-600 text-sm">{error}</p>}

                  <button type="submit" disabled={sending} className="w-full bg-[#003A7D] hover:bg-[#002D63] disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3.5 rounded text-[15px] font-semibold transition-all hover:shadow-lg hover:shadow-blue-700/20">
                    {sending ? "Wird gesendet..." : "Offerte anfordern — kostenlos & unverbindlich"}
                  </button>

                  <p className="text-xs text-gray-400 text-center">Ihre Daten werden vertraulich behandelt und nicht an Dritte weitergegeben.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-[#001F45] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid sm:grid-cols-3 gap-10">
            <div>
              <div className="flex items-center gap-0 mb-4">
                <div className="flex flex-col items-start leading-none">
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[18px] font-black tracking-[-0.01em] text-white uppercase">Garagentor</span>
                  <div className="w-full h-[2px] bg-[#F9AD09] my-[2.5px] rounded-full" />
                  <span style={{ fontFamily: "'Montserrat', sans-serif" }} className="text-[9.5px] font-extrabold tracking-[0.28em] text-[#F9AD09] uppercase">Renovation</span>
                </div>
              </div>
              <p className="text-white/40 text-sm leading-relaxed">
                Professionelle Garagentor-Renovation<br />in der ganzen Schweiz.
              </p>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Leadhunter GmbH</p>
              <div className="space-y-2 text-sm text-white/50">
                <p>Cheerstrasse 13b</p>
                <p>6014 Luzern</p>
                <p>044 442 99 90</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-sm mb-3">Leistungen</p>
              <div className="space-y-2 text-sm text-white/50">
                <p>Sektionaltor-Renovation</p>
                <p>Schwingtor-Renovation</p>
                <p>Rolltor-Renovation</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-white/30">
            <p>&copy; {new Date().getFullYear()} garagentor-renovation.ch</p>
            <p>v2.14.0</p>
          </div>
        </div>
      </footer>
    </>
  );
}
