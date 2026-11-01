"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

/* ── Adventskalender-Inhalte ── */
const ADVENT_CONTENT: Record<number, { title: string; text: string }> = {
  1: { title: "Willkommen!", text: "Der Lozärner Wiehnachtsmärt öffnet seine Türen. Rund 70 Stände erwarten Sie." },
  2: { title: "Glühwein", text: "Unser Glühwein wird nach einem traditionellen Rezept zubereitet – mit feinem Gewürztraminer und Zimt." },
  3: { title: "Adventskranz", text: "Der über drei Meter grosse Adventskranz auf dem Franziskanerbrunnen ist der grösste der Zentralschweiz." },
  4: { title: "Eröffnung", text: "Die feierliche Eröffnung in der Franziskanerkirche – ein stimmungsvoller Auftakt." },
  5: { title: "Handwerkskunst", text: "Holzschnitzereien, Keramik und einzigartige Geschenke von lokalen Kunsthandwerkern." },
  6: { title: "Samichlaus!", text: "Der Samichlaus besucht die Franziskanerkirche. Leuchtende Kinderaugen garantiert." },
  7: { title: "Nidlezältli", text: "Die Luzerner Nidlezältli gehören zum Wiehnachtsmärt wie der Schnee zum Winter." },
  8: { title: "Lichterglanz", text: "Hunderte von Lichtern und Kerzen verwandeln den Platz in eine Winterwelt." },
  9: { title: "Musik", text: "Chöre und Bläsergruppen aus der Region sorgen für festliche Klänge." },
  10: { title: "Sammeltasse", text: "Jedes Jahr ein neues Design. Sammler kommen von weit her." },
  11: { title: "Holzofenbrot", text: "Frisch gebackenes Holzofenbrot – der Duft allein ist schon ein Erlebnis." },
  12: { title: "Punsch & Kakao", text: "Wärmende Getränke für Gross und Klein." },
  13: { title: "Tubas de Noël", text: "Les Tubas de Noël – ein ganz spezielles Klangerlebnis mit Tuba und Sousaphon." },
  14: { title: "Franziskanerkirche", text: "Die Kirche aus dem Jahr 1270 bietet Adventsandachten und Konzerte." },
  15: { title: "Kerzenziehen", text: "Eigene Kerzen ziehen – besonders beliebt bei Familien." },
  16: { title: "Geschenkideen", text: "Handgemachte Unikate für jeden Geschmack." },
  17: { title: "Sternennacht", text: "Der Blick von der Kapellbrücke auf den beleuchteten Wiehnachtsmärt – unvergesslich." },
  18: { title: "Fondue & Raclette", text: "Käsespezialitäten mit Blick auf den geschmückten Franziskanerplatz." },
  19: { title: "Adventsandacht", text: "Momente der Ruhe in der festlich geschmückten Franziskanerkirche." },
  20: { title: "Kinderkarussell", text: "Das nostalgische Karussell dreht sich auf dem Franziskanergärtli." },
  21: { title: "Letzter Tag", text: "Nochmals die besondere Atmosphäre geniessen – bis 19 Uhr." },
  22: { title: "Rückblick", text: "Danke an alle Besucher und Aussteller!" },
  23: { title: "Vorfreude", text: "Wir sehen uns 2027!" },
  24: { title: "Frohe Weihnachten!", text: "Schöne Festtage und es guets Nöis wünscht der Lozärner Wiehnachtsmärt!" },
};

/* ── Schneefall ── */
function Snowfall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const flakes: { x: number; y: number; r: number; speed: number; wind: number }[] = [];
    const count = Math.floor(w / 12);

    for (let i = 0; i < count; i++) {
      flakes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2.5 + 1,
        speed: Math.random() * 0.8 + 0.3,
        wind: Math.random() * 0.4 - 0.2,
      });
    }

    let raf: number;
    function draw() {
      ctx!.clearRect(0, 0, w, h);
      ctx!.fillStyle = "rgba(255,255,255,0.7)";
      for (const f of flakes) {
        ctx!.beginPath();
        ctx!.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx!.fill();
        f.y += f.speed;
        f.x += f.wind + Math.sin(f.y * 0.01) * 0.3;
        if (f.y > h) { f.y = -5; f.x = Math.random() * w; }
        if (f.x > w) f.x = 0;
        if (f.x < 0) f.x = w;
      }
      raf = requestAnimationFrame(draw);
    }
    draw();

    const onResize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-30 pointer-events-none" />;
}

/* ── Bilder-Slider ── */
const GALLERY_IMAGES = [
  { src: "/images/galerie-1.jpg", alt: "Besucher am Markt" },
  { src: "/images/galerie-3.jpg", alt: "Lichterglanz" },
  { src: "/images/galerie-4.jpg", alt: "Engelfigur" },
  { src: "/images/galerie-7.jpg", alt: "Marktstände" },
  { src: "/images/galerie-8.jpg", alt: "Abendstimmung" },
  { src: "/images/galerie-9.jpg", alt: "Winterabend" },
  { src: "/images/galerie-10.jpg", alt: "Weihnachtsstimmung" },
  { src: "/images/galerie-11.jpg", alt: "Stände bei Nacht" },
  { src: "/images/galerie-12.jpg", alt: "Marktszene" },
];

function ImageSlider() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const total = GALLERY_IMAGES.length;

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % total), 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, total]);

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  }, []);

  return (
    <div className="relative overflow-hidden bg-holz">
      <div className="relative h-[60vh] sm:h-[75vh]">
        {GALLERY_IMAGES.map((img, i) => (
          <div key={img.src} className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === current ? 1 : 0 }}>
            <Image src={img.src} alt={img.alt} fill className="object-cover" priority={i === 0} />
          </div>
        ))}
      </div>

      {/* Pfeile */}
      <button onClick={() => goTo((current - 1 + total) % total)}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center text-2xl cursor-pointer backdrop-blur-sm"
        aria-label="Vorheriges Bild">&lsaquo;</button>
      <button onClick={() => goTo((current + 1) % total)}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/30 hover:bg-black/50 text-white rounded-full flex items-center justify-center text-2xl cursor-pointer backdrop-blur-sm"
        aria-label="Nächstes Bild">&rsaquo;</button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {GALLERY_IMAGES.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`w-2 h-2 rounded-full cursor-pointer transition-all ${i === current ? "bg-white w-6" : "bg-white/40"}`}
            aria-label={`Bild ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}

/* ── Adventskalender ── */
function AdventCalendar() {
  const [openDoor, setOpenDoor] = useState<number | null>(null);
  const today = new Date();
  const currentDay = today.getMonth() === 11 ? today.getDate() : 0;
  const shuffled = [18,3,21,7,14,1,24,10,5,16,11,22,8,2,19,13,6,23,9,17,4,15,20,12];

  return (
    <div>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 sm:gap-4 max-w-xl">
        {shuffled.map((day) => {
          const isOpen = day <= currentDay;
          const isToday = day === currentDay;
          return (
            <button key={day}
              onClick={() => isOpen ? setOpenDoor(openDoor === day ? null : day) : undefined}
              className={`aspect-square rounded-sm flex items-center justify-center text-2xl sm:text-3xl font-display cursor-pointer select-none transition-all duration-300 hover:scale-105 ${
                isToday ? "bg-gold text-holz shadow-lg scale-105"
                : isOpen ? "bg-cream-dark text-foreground border border-border hover:bg-cream hover:shadow"
                : "bg-wine/90 text-white/60 hover:bg-wine"
              }`}>
              {day}
            </button>
          );
        })}
      </div>
      {openDoor && ADVENT_CONTENT[openDoor] && (
        <div className="mt-6 bg-cream-dark p-6 border-l-4 border-gold max-w-xl animate-[fadeIn_0.3s_ease]">
          <span className="text-gold text-sm">{openDoor}. Dezember</span>
          <h3 className="font-display text-2xl text-foreground mt-1">{ADVENT_CONTENT[openDoor].title}</h3>
          <p className="text-muted mt-3 leading-relaxed">{ADVENT_CONTENT[openDoor].text}</p>
          <button onClick={() => setOpenDoor(null)} className="text-muted text-sm mt-4 hover:text-foreground cursor-pointer">Schliessen</button>
        </div>
      )}
    </div>
  );
}

/* ── Scroll-Animation ── */
function FadeIn({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
}

/* ── Hauptseite ── */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-cream text-foreground">
      <Snowfall />

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-cream/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-5 h-12 flex items-center justify-between text-sm">
          <a href="#" className="text-foreground font-medium">Wiehnachtsmärt Luzern</a>
          <div className="hidden md:flex gap-6 text-muted">
            <a href="#programm" className="hover:text-foreground transition-colors">Programm</a>
            <a href="#kalender" className="hover:text-foreground transition-colors">Adventskalender</a>
            <a href="#galerie" className="hover:text-foreground transition-colors">Bilder</a>
            <a href="#anreise" className="hover:text-foreground transition-colors">Anreise</a>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden cursor-pointer" aria-label="Menü">
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="0" y1="1" x2="20" y2="1" />
              <line x1="0" y1="7" x2="20" y2="7" />
              <line x1="0" y1="13" x2="20" y2="13" />
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-cream pt-14 px-6 flex flex-col gap-6 md:hidden">
          {[["Programm","programm"],["Adventskalender","kalender"],["Bilder","galerie"],["Anreise","anreise"]].map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}
              className="text-2xl font-display text-foreground">{label}</a>
          ))}
        </div>
      )}

      {/* Hero */}
      <section className="relative h-screen flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/galerie-6.jpg" alt="Wiehnachtsmärt bei Nacht" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        </div>
        <div className="relative w-full max-w-6xl mx-auto px-5 pb-12 sm:pb-20">
          <h1 className="font-display text-4xl sm:text-7xl md:text-8xl lg:text-9xl text-white leading-[0.95] tracking-tight">
            Lozärner Wiehnachtsmärt
          </h1>
          <p className="text-white/50 text-lg sm:text-xl mt-6 max-w-md">
            3.–21. Dezember 2026<br/>Franziskanerplatz, Luzern
          </p>
        </div>
      </section>

      {/* Band */}
      <div className="bg-wine text-white py-4 text-center text-sm tracking-wide">
        Täglich ab 11 Uhr&ensp;·&ensp;Warenstände bis 20 Uhr&ensp;·&ensp;Foodstände bis 21 Uhr
      </div>

      {/* Intro */}
      <section className="max-w-3xl mx-auto px-5 py-20 sm:py-32">
        <FadeIn>
          <h2 className="font-display text-4xl sm:text-6xl text-foreground leading-tight mb-10">
            Seit 2009 auf dem Franziskanerplatz
          </h2>
        </FadeIn>
        <FadeIn>
          <div className="text-muted text-lg sm:text-xl leading-relaxed space-y-6">
            <p>
              70 Marktstände rund um die Franziskanerkirche.
              Glühwein, Nidlezältli, Holzofenbrot und Handwerkskunst
              aus der Region. Jeden Advent, mitten in der Luzerner Altstadt.
            </p>
            <p>
              <em>Time Out</em> zählt den Wiehnachtsmärt zu den
              zehn schönsten Weihnachtsmärkten Europas.
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Grosses Bild */}
      <div className="relative h-[50vh] sm:h-[60vh]">
        <Image src="/images/galerie-5.jpg" alt="Besucher am Wiehnachtsmärt" fill className="object-cover" />
      </div>

      {/* Adventskranz Statement */}
      <section className="max-w-3xl mx-auto px-5 py-20 sm:py-28">
        <FadeIn>
          <p className="font-display text-3xl sm:text-5xl text-foreground leading-snug">
            Der Adventskranz auf dem Franziskanerbrunnen
            ist über drei Meter gross und der grösste
            der Zentralschweiz.
          </p>
        </FadeIn>
      </section>

      {/* Bild */}
      <div className="relative h-[40vh] sm:h-[50vh]">
        <Image src="/images/hero-markt.jpg" alt="Samichlaus und Stände" fill className="object-cover" />
      </div>

      {/* Programm */}
      <section id="programm" className="max-w-3xl mx-auto px-5 py-20 sm:py-28">
        <FadeIn>
          <h2 className="font-display text-4xl sm:text-6xl text-foreground mb-12">Programm 2026</h2>
        </FadeIn>
        <div className="space-y-8">
          {[
            { date: "Donnerstag, 3. Dezember", text: "Feierliche Eröffnung in der Franziskanerkirche, 10.30 Uhr" },
            { date: "Samstag, 5. Dezember", text: "Der Samichlaus besucht die Franziskanerkirche, 16 Uhr" },
            { date: "Samstag, 12. Dezember", text: "Les Tubas de Noël – Tuba, Euphonium, Sousaphon, ab 11 Uhr" },
            { date: "Täglich", text: "Chöre und Bläsergruppen aus der Region" },
            { date: "Regelmässig", text: "Musikalische Adventsandachten in der Franziskanerkirche" },
          ].map((ev, i) => (
            <FadeIn key={ev.date}>
              <div>
                <p className="text-wine font-display text-xl">{ev.date}</p>
                <p className="text-foreground text-lg mt-1">{ev.text}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn>
          <p className="text-muted mt-12 text-lg">
            Schlusstag: Sonntag, 21. Dezember – geöffnet bis 19 Uhr
          </p>
        </FadeIn>
      </section>

      {/* Öffnungszeiten */}
      <section className="bg-tannen text-white py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="font-display text-4xl sm:text-5xl mb-10">Öffnungszeiten</h2>
          <div className="space-y-4 text-xl sm:text-2xl">
            <p>Täglich ab <strong>11 Uhr</strong></p>
            <p>Warenstände bis <strong>20 Uhr</strong></p>
            <p>Foodstände bis <strong>21 Uhr</strong></p>
            <p className="text-white/50">Letzter Tag: bis 19 Uhr</p>
          </div>
        </div>
      </section>

      {/* Adventskalender */}
      <section id="kalender" className="max-w-3xl mx-auto px-5 py-20 sm:py-28">
        <FadeIn>
          <h2 className="font-display text-4xl sm:text-6xl text-foreground mb-4">Adventskalender</h2>
          <p className="text-muted text-lg mb-10">
            Im Dezember öffnet sich jeden Tag ein Türchen.
          </p>
        </FadeIn>
        <AdventCalendar />
      </section>

      {/* Galerie – Slider */}
      <section id="galerie">
        <div className="max-w-3xl mx-auto px-5 pb-6">
          <FadeIn>
            <h2 className="font-display text-4xl sm:text-6xl text-foreground mb-2">Stimmungsbilder</h2>
          </FadeIn>
        </div>
        <ImageSlider />
      </section>

      {/* Anreise */}
      <section id="anreise" className="bg-cream-dark">
        <div className="max-w-3xl mx-auto px-5 py-20 sm:py-28">
          <FadeIn>
            <h2 className="font-display text-4xl sm:text-6xl text-foreground mb-10">Anreise</h2>
          </FadeIn>
          <div className="space-y-8 text-lg text-muted leading-relaxed">
            <FadeIn>
              <div>
                <p className="text-foreground font-display text-xl mb-2">Mit dem Zug</p>
                <p>Ab Bahnhof Richtung Kapellbrücke, linkes Reussufer,
                Bahnhofstrasse entlang, nach 200 Metern links.</p>
              </div>
            </FadeIn>
            <FadeIn>
              <div>
                <p className="text-foreground font-display text-xl mb-2">Mit dem Auto</p>
                <p>Autobahnausfahrt A2 Luzern Zentrum. Parkhaus Altstadt
                (456 Plätze), Parkhaus Kesselturm, Bahnhofparking.</p>
              </div>
            </FadeIn>
            <FadeIn>
              <div>
                <p className="text-foreground font-display text-xl mb-2">Mit dem Bus</p>
                <p>Haltestelle Pilatusplatz, 100 Meter Richtung Hirschengraben.</p>
              </div>
            </FadeIn>
          </div>

          <div className="mt-12 relative aspect-video rounded overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1356.5!2d8.3065!3d47.0502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478ffba0b6574d0d%3A0x0!2sFranziskanerplatz%2C+Luzern!5e0!3m2!1sde!2sch!4v1"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" title="Franziskanerplatz Luzern"
              className="absolute inset-0"
            />
          </div>
        </div>
      </section>

      {/* Nächste Durchführungen */}
      <div className="max-w-3xl mx-auto px-5 py-16 text-center">
        <p className="text-muted text-sm mb-2">Nächste Durchführungen</p>
        <p className="font-display text-2xl text-foreground">
          2027 &ensp;·&ensp; 2028
        </p>
      </div>

      {/* Footer */}
      <footer className="bg-holz text-white/60 py-12">
        <div className="max-w-3xl mx-auto px-5">
          <p className="font-display text-2xl text-white/90 mb-1">Lozärner Wiehnachtsmärt</p>
          <p className="mb-8">Franziskanerplatz · Luzern</p>
          <div className="flex flex-col sm:flex-row justify-between gap-4 text-sm">
            <div>
              <p>IG Luzerner Herbstmesse und Märkte</p>
              <p>Partner: ewl · Stadt Luzern · IGS</p>
            </div>
            <div className="sm:text-right">
              <p><a href="https://www.weihnachtsmarkt-luzern.com" className="hover:text-white">weihnachtsmarkt-luzern.com</a></p>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-4 flex flex-col sm:flex-row justify-between text-xs text-white/30">
            <p>&copy; {new Date().getFullYear()} Lozärner Wiehnachtsmärt · v2.0.0</p>
            <div className="flex gap-4">
              <Link href="/impressum" className="hover:text-white/50">Impressum</Link>
              <Link href="/datenschutz" className="hover:text-white/50">Datenschutz</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
