"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

/* ── Adventskalender-Daten ── */
const ADVENT: Record<number, { t: string; d: string }> = {
  1: { t: "Willkommen!", d: "Der Lozärner Wiehnachtsmärt öffnet seine Türen. 70 Stände erwarten dich." },
  2: { t: "Glühwein", d: "Nach Rezept zubereitet – mit Gewürztraminer und Zimt." },
  3: { t: "Adventskranz", d: "Über drei Meter gross. Auf dem Franziskanerbrunnen." },
  4: { t: "Eröffnung", d: "In der Franziskanerkirche – stimmungsvoller Auftakt." },
  5: { t: "Handwerkskunst", d: "Holzschnitzereien, Keramik, Unikate." },
  6: { t: "Samichlaus!", d: "Besuch in der Franziskanerkirche." },
  7: { t: "Nidlezältli", d: "Gehören zum Märt wie der Schnee zum Winter." },
  8: { t: "Lichterglanz", d: "Hunderte Lichter verwandeln den Platz." },
  9: { t: "Musik", d: "Chöre und Bläser aus der Region." },
  10: { t: "Sammeltasse", d: "Jedes Jahr ein neues Design." },
  11: { t: "Holzofenbrot", d: "Der Duft allein ist ein Erlebnis." },
  12: { t: "Punsch & Kakao", d: "Wärmendes für Gross und Klein." },
  13: { t: "Tubas de Noël", d: "Tuba, Euphonium, Sousaphon." },
  14: { t: "Franziskanerkirche", d: "Seit 1270. Andachten und Konzerte." },
  15: { t: "Kerzenziehen", d: "Besonders beliebt bei Familien." },
  16: { t: "Geschenkideen", d: "Handgemachte Unikate." },
  17: { t: "Sternennacht", d: "Der Blick von der Kapellbrücke." },
  18: { t: "Fondue & Raclette", d: "Mit Blick auf den Platz." },
  19: { t: "Adventsandacht", d: "Ruhe in der Franziskanerkirche." },
  20: { t: "Kinderkarussell", d: "Auf dem Franziskanergärtli." },
  21: { t: "Letzter Tag", d: "Nochmals geniessen – bis 19 Uhr." },
  22: { t: "Rückblick", d: "Danke an alle!" },
  23: { t: "Vorfreude", d: "Mir gsehnd üs 2027!" },
  24: { t: "Frohe Weihnachten!", d: "Schöni Festtäg und es guets Nöis!" },
};

/* ── Künstlerbilder ── */
const KUENSTLER_BILDER: Record<string, string> = {
  "Duo PanTastico": "/images/kuenstler-pantastico.jpg",
  "Original Lozärner Schäller & Trychler": "/images/kuenstler-schaeller.jpg",
  "Lozärner Samichlausgesellschaft": "/images/kuenstler-samichlaus.jpg",
  "Männerchor Quartett-Vereinigung Luzern": "/images/kuenstler-quartett.png",
  "Lara Zoe": "/images/kuenstler-lara-zoe.png",
  "Serenade Avenue (Harfe)": "/images/kuenstler-serenade.jpg",
  "Gunvor": "/images/kuenstler-gunvor.jpg",
  "Posaunenensemble Musikschule Luzern": "/images/kuenstler-posaunen.jpg",
  "Spättacolo — Erwachsenen-Bläserensemble der Musikschule Luzern": "/images/kuenstler-spaettacolo.png",
  "Montags-Jodel-Gruppe von Silvia Rymann": "/images/kuenstler-jodelgruppe.jpg",
  "NoHeadBand": "/images/kuenstler-nohead.jpg",
  "Santa's Swingin' Six": "/images/kuenstler-santas.jpg",
  "Sixtett Vivace": "/images/kuenstler-sixtett.jpg",
  "Marc Rudin — TouchSoulMusic": "/images/kuenstler-marc-rudin.jpg",
  "Jugendblasorchester Kriens": "/images/kuenstler-jbo-kriens.png",
  "MG Aesch-Mosen": "/images/kuenstler-mg-aesch.jpg",
  "Fantasie-Chörli Luzern": "/images/kuenstler-fantasie-choerli.jpg",
  "Tubas de Noël": "/images/kuenstler-tubas.jpg",
  "Chörli": "/images/kuenstler-choerli.jpg",
  "Gingerbreads Christmas Brassband": "/images/kuenstler-gingerbreads.png",
  "Brass and Pipes": "/images/kuenstler-brass-pipes.jpg",
  "Line Dance": "/images/kuenstler-line-dance.jpg",
  "Marc Pircher": "/images/kuenstler-marc-pircher.jpg",
  "Hornschüler": "/images/kuenstler-hornschueler.jpg",
  "Jodlerfründe Ruopige": "/images/kuenstler-jodlerfruende.jpg",
  "Kinder-/Jugendchor Anton-Michael": "/images/kuenstler-jugendchor-anton.jpg",
  "Kinderchor Mailino": "/images/kuenstler-mailino.jpg",
  "Musikverein Rotkreuz": "/images/kuenstler-mg-rotkreuz.jpg",
  "Musikschule Bigband Luzern": "/images/kuenstler-bigband.jpg",
  "christmasBand Schwyz": "/images/kuenstler-christmasband.jpg",
  "Luca Di Felice": "/images/kuenstler-luca-di-felice.jpg",
};

/* ── Programmdaten ── */
const PROGRAMM: { datum: number; tag: string; events: { z: string; w: string; o?: string }[] }[] = [
  { datum: 3, tag: "Donnerstag, 3. Dezember", events: [
    { z: "10:30", w: "Feierliche Eröffnung Wiehnachtsmärt", o: "Kirche" },
    { z: "10:30", w: "Duo PanTastico", o: "Kirche" },
    { z: "16:30", w: "Rosenkranzgebet", o: "Kirche" },
    { z: "18:30", w: "Original Lozärner Schäller & Trychler" },
  ]},
  { datum: 4, tag: "Freitag, 4. Dezember", events: [
    { z: "17:15", w: "Adventliche Andacht «Feier-Abend» — Stille, Musik und Texte", o: "Kirche" },
    { z: "18:00", w: "Lozärner Samichlausgesellschaft" },
  ]},
  { datum: 5, tag: "Samstag, 5. Dezember", events: [
    { z: "11:00", w: "Männerchor Quartett-Vereinigung Luzern" },
    { z: "12:30", w: "Musikalische Meditation — Valentin Lupp (Trompete), Daniel Baker (Orgel)", o: "Kirche" },
    { z: "13:30", w: "Lara Zoe" },
    { z: "13:30", w: "Serenade Avenue (Harfe)" },
    { z: "14:30", w: "Lara Zoe" },
    { z: "15:00", w: "Gunvor" },
    { z: "16:00", w: "Gottesdienst", o: "Kirche" },
    { z: "17:15", w: "Samichlaus zu Besuch in der Franziskanerkirche", o: "Kirche" },
    { z: "18:30", w: "Posaunenensemble Musikschule Luzern" },
    { z: "19:15", w: "Posaunenensemble Musikschule Luzern" },
  ]},
  { datum: 6, tag: "Sonntag, 6. Dezember", events: [
    { z: "09:00", w: "Gottesdienst", o: "Kirche" },
    { z: "11:00", w: "Gottesdienst", o: "Kirche" },
    { z: "12:30", w: "Musikalische Meditation — Thomas Triesschijn (Blockflöte), Freddie James (Cembalo/Orgel)", o: "Kirche" },
    { z: "13:30", w: "Gunvor" },
    { z: "17:00", w: "Advents- und Weihnachtslieder mit der Gemeinde — Franziskanerchor, Daniel Baker und Freddie James (Orgel), Ulrike Grosch (Leitung)", o: "Kirche" },
  ]},
  { datum: 7, tag: "Montag, 7. Dezember", events: [
    { z: "15:00", w: "Serenade Avenue (Harfe)" },
    { z: "18:30", w: "Montags-Jodel-Gruppe von Silvia Rymann" },
  ]},
  { datum: 8, tag: "Dienstag, 8. Dezember — Maria Empfängnis", events: [
    { z: "12:30", w: "Duo PanTastico" },
    { z: "13:40", w: "Trychlergruppe Perlen" },
    { z: "14:00", w: "Hornschüler" },
    { z: "17:00", w: "Serenade Avenue (Harfe)" },
    { z: "19:00", w: "Luca Di Felice" },
  ]},
  { datum: 9, tag: "Mittwoch, 9. Dezember", events: [
    { z: "15:00", w: "Duo PanTastico", o: "Kirche" },
    { z: "16:00", w: "Adventsgeschichte für Klein und Gross", o: "Antoniuskapelle" },
    { z: "18:00", w: "Spättacolo — Erwachsenen-Bläserensemble der Musikschule Luzern" },
    { z: "19:00", w: "Brass and Pipes" },
    { z: "20:00", w: "Jugendblasorchester Kriens" },
  ]},
  { datum: 10, tag: "Donnerstag, 10. Dezember", events: [
    { z: "16:30", w: "Rosenkranzgebet", o: "Kirche" },
    { z: "18:00", w: "Marc Rudin — TouchSoulMusic" },
    { z: "19:00", w: "Chörli" },
  ]},
  { datum: 11, tag: "Freitag, 11. Dezember", events: [
    { z: "19:00", w: "Fantasie-Chörli Luzern" },
  ]},
  { datum: 12, tag: "Samstag, 12. Dezember", events: [
    { z: "11:00", w: "Tubas de Noël" },
    { z: "12:30", w: "Musikalische Meditation — Laurie Krier (Blockflöte), Melina Wegner (Cello), Julien Brügger (Orgel)", o: "Kirche" },
    { z: "15:00", w: "Gunvor" },
    { z: "16:00", w: "Gottesdienst", o: "Kirche" },
    { z: "17:30", w: "MG Aesch-Mosen" },
    { z: "19:15", w: "Marc Rudin — TouchSoulMusic" },
  ]},
  { datum: 13, tag: "Sonntag, 13. Dezember", events: [
    { z: "09:00", w: "Gottesdienst", o: "Kirche" },
    { z: "11:00", w: "Gottesdienst", o: "Kirche" },
    { z: "12:30", w: "Musikalische Meditation — Alessandra Riudalbas (Blockflöte), Ivàn Garcia (Laute)", o: "Kirche" },
    { z: "14:00", w: "Gunvor" },
    { z: "15:00", w: "Gingerbreads Christmas Brassband" },
    { z: "16:00", w: "Sixtett Vivace" },
    { z: "17:00", w: "Weihnachtskonzert Männeroktett «VOCALISTI» — Harfe: Anne Neugebauer, Leitung: Norbert Carlen", o: "Kirche" },
  ]},
  { datum: 14, tag: "Montag, 14. Dezember", events: [
    { z: "15:00", w: "Serenade Avenue (Harfe)" },
    { z: "19:00", w: "NoHeadBand" },
  ]},
  { datum: 15, tag: "Dienstag, 15. Dezember", events: [
    { z: "15:00", w: "Serenade Avenue (Harfe)" },
    { z: "19:00", w: "Musikverein Rotkreuz" },
    { z: "20:15", w: "Line Dance" },
  ]},
  { datum: 16, tag: "Mittwoch, 16. Dezember", events: [
    { z: "16:00", w: "Kinderchor Mailino" },
    { z: "18:00", w: "Marc Pircher", o: "Bühne" },
  ]},
  { datum: 17, tag: "Donnerstag, 17. Dezember", events: [
    { z: "16:30", w: "Rosenkranzgebet", o: "Kirche" },
    { z: "18:00", w: "Santa's Swingin' Six" },
    { z: "19:30", w: "Nacht der Kirchen", o: "Kirche" },
  ]},
  { datum: 18, tag: "Freitag, 18. Dezember", events: [
    { z: "17:15", w: "Adventliche Andacht «Feier-Abend» — Stille, Musik und Texte", o: "Kirche" },
    { z: "18:00", w: "Kinder-/Jugendchor Anton-Michael" },
    { z: "19:15", w: "Projektchor Anton-Michael" },
  ]},
  { datum: 19, tag: "Samstag, 19. Dezember", events: [
    { z: "11:15", w: "christmasBand Schwyz" },
    { z: "12:30", w: "Musik zum Weihnachtsmarkt — Christian Barthen (Orgel)", o: "Kirche" },
    { z: "16:00", w: "Gottesdienst", o: "Kirche" },
    { z: "17:15", w: "COPOTUWA Quintett" },
    { z: "18:30", w: "Musikschule Bigband Luzern" },
    { z: "19:30", w: "Jodlerfründe Ruopige" },
  ]},
  { datum: 20, tag: "Sonntag, 20. Dezember", events: [
    { z: "09:00", w: "Gottesdienst", o: "Kirche" },
    { z: "11:00", w: "Gottesdienst", o: "Kirche" },
    { z: "12:30", w: "Musik zum Weihnachtsmarkt — Heyon Ko (Orgel)", o: "Kirche" },
    { z: "18:00", w: "Byzantinischer Gottesdienst", o: "Kirche" },
  ]},
  { datum: 21, tag: "Montag, 21. Dezember — Schlusstag", events: [
    { z: "15:00", w: "Duo PanTastico" },
    { z: "19:00", w: "Schluss der Verkaufsstände" },
  ]},
];

/* ── Heute-Komponente ── */
function TodayProgram() {
  const now = new Date();
  const month = now.getMonth();
  const day = now.getDate();
  const today = month === 11 ? PROGRAMM.find((d) => d.datum === day) : null;
  const nextDay = !today && month === 11 && day < 21
    ? PROGRAMM.find((d) => d.datum > day)
    : month === 10 ? PROGRAMM[0] : null;
  const show = today || nextDay;
  if (!show) return null;
  const isToday = !!today;
  const upcoming = show.events.slice(0, 3);

  return (
    <section className="bg-wine py-8 sm:py-10 border-b border-foreground/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-burgundy/8 border border-burgundy/15 rounded-xl p-5 sm:p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-burgundy text-lg">♪</span>
            <h3 className="font-display font-bold text-lg sm:text-xl text-foreground">
              {isToday ? "Heute auf dem Märt" : `Nächste Veranstaltungen — ${show.tag}`}
            </h3>
          </div>
          <div className="space-y-2">
            {upcoming.map((ev, i) => (
              <div key={i} className="flex items-baseline gap-3 sm:gap-4">
                <span className="text-burgundy font-display font-bold text-sm w-14 shrink-0 tabular-nums">{ev.z}</span>
                <span className="text-foreground/80 text-sm sm:text-base flex-1">{ev.w}</span>
                {ev.o && <span className="hidden sm:block text-foreground/30 text-xs shrink-0">{ev.o}</span>}
              </div>
            ))}
          </div>
          {show.events.length > 3 && (
            <a href="#programm" className="inline-block mt-4 text-burgundy text-sm font-medium hover:text-ruby transition-colors">
              + {show.events.length - 3} weitere →
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

/* ── Hooks ── */
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function R({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useReveal();
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

/* ── Schnee (Canvas) ── */
function Snow() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let w = (c.width = window.innerWidth);
    let h = (c.height = window.innerHeight);
    const nSnow = Math.min(Math.floor(w / 25), 40);
    const fl = Array.from({ length: nSnow }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      r: Math.random() * 16 + 6,
      s: Math.random() * 0.5 + 0.1,
      d: Math.random() * 0.2 - 0.1,
      o: Math.random() * 0.4 + 0.15,
      rot: Math.random() * Math.PI * 2,
      rotS: (Math.random() - 0.5) * 0.005,
    }));
    const drawFlake = (x: number, y: number, r: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      for (let i = 0; i < 6; i++) {
        ctx.rotate(Math.PI / 3);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -r);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.45);
        ctx.lineTo(r * 0.2, -r * 0.65);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -r * 0.45);
        ctx.lineTo(-r * 0.2, -r * 0.65);
        ctx.stroke();
      }
      ctx.restore();
    };
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "round";
      for (const f of fl) {
        ctx.strokeStyle = `rgba(255,255,255,${f.o})`;
        ctx.lineWidth = Math.max(1, f.r * 0.12);
        drawFlake(f.x, f.y, f.r, f.rot);
        f.y += f.s;
        f.x += f.d + Math.sin(f.y * 0.004) * 0.15;
        f.rot += f.rotS;
        if (f.y > h + f.r) { f.y = -f.r * 2; f.x = Math.random() * w; }
        if (f.x > w + f.r) f.x = -f.r;
        if (f.x < -f.r) f.x = w + f.r;
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => {
      w = c.width = window.innerWidth;
      h = c.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={ref} className="fixed inset-0 z-30 pointer-events-none" style={{ height: "100vh" }} />;
}

/* ── Hero Slider ── */
function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const images = [
    { src: "/images/galerie-7.jpg", alt: "Weihnachtsschmuck und Rentier-Dekoration" },
    { src: "/images/galerie-3.jpg", alt: "Geschenke und Dekoration am Märt" },
    { src: "/images/galerie-12.jpg", alt: "Lozärner Wiehnachtsmärt auf dem Franziskanerplatz" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % images.length), 6000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <>
      {images.map((img, i) => (
        <div
          key={img.src}
          className="absolute inset-0 transition-opacity duration-[2000ms] slider-img"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image src={img.src} alt={img.alt} fill className="object-cover" priority={i === 0} />
        </div>
      ))}
    </>
  );
}

/* ── Bilder-Slider (Mittelteil) ── */
function ImageSlider() {
  const [current, setCurrent] = useState(0);
  const images = [
    { src: "/images/galerie-1.jpg", alt: "Engel-Dekoration am Wiehnachtsmärt" },
    { src: "/images/galerie-8.jpg", alt: "Franziskanerplatz mit beleuchtetem Brunnen" },
    { src: "/images/galerie-4.jpg", alt: "Engel-Statue am Märt" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % images.length), 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative aspect-[3/2] sm:aspect-[2/1] overflow-hidden rounded-xl ring-1 ring-foreground/10">
      {images.map((img, i) => (
        <div
          key={img.src}
          className="absolute inset-0 transition-opacity duration-1000 slider-img"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image src={img.src} alt={img.alt} fill className={`object-cover${img.src.includes("galerie-1") ? " object-top" : ""}`} />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
              i === current ? "bg-burgundy w-6" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Adventskalender ── */
function AdventCalendar() {
  const [open, setOpen] = useState<number | null>(null);
  const now = new Date();
  const day = now.getMonth() === 11 ? now.getDate() : 0;
  const order = [18, 3, 21, 7, 14, 1, 24, 10, 5, 16, 11, 22, 8, 2, 19, 13, 6, 23, 9, 17, 4, 15, 20, 12];

  return (
    <>
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-3">
        {order.map((d) => {
          const ok = d <= day;
          const today = d === day;
          return (
            <button
              key={d}
              onClick={() => (ok ? setOpen(open === d ? null : d) : undefined)}
              className={`advent-btn aspect-square rounded-lg flex items-center justify-center text-xl sm:text-2xl font-display font-bold cursor-pointer select-none border ${
                today
                  ? "bg-burgundy text-white border-burgundy shadow-lg shadow-burgundy/20"
                  : ok
                  ? "bg-burgundy/10 text-burgundy border-burgundy/20 hover:border-burgundy/40 hover:bg-burgundy/15"
                  : "bg-foreground/5 text-foreground/20 border-foreground/10"
              }`}
            >
              {d}
            </button>
          );
        })}
      </div>
      {open && ADVENT[open] && (
        <div
          className="mt-6 bg-burgundy/10 border border-burgundy/20 rounded-xl p-6 max-w-md shadow-lg"
          style={{ animation: "fadeIn 0.3s ease" }}
        >
          <p className="text-burgundy font-display font-bold text-sm mb-1">{open}. Dezember</p>
          <h3 className="font-display font-bold text-xl text-foreground mb-2">{ADVENT[open].t}</h3>
          <p className="text-foreground/60 text-sm leading-relaxed">{ADVENT[open].d}</p>
          <button
            onClick={() => setOpen(null)}
            className="mt-4 text-xs text-foreground/40 hover:text-burgundy cursor-pointer transition-colors"
          >
            Schliessen
          </button>
        </div>
      )}
    </>
  );
}

/* ── Hauptseite ── */
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const NAV = [
    ["Über uns", "ueber"],
    ["Programm", "programm"],
    ["Galerie", "galerie"],
    ["Kalender", "kalender"],
    ["Anreise", "anreise"],
  ];

  const PAGES = [
    ["Datum und Zeit", "/datum-und-zeit"],
    ["Teilnehmer", "/teilnehmer"],
    ["Stand-Plan", "/standplan"],
    ["Rahmenprogramm", "/rahmenprogramm"],
    ["Stimmungsbilder", "/stimmungsbilder"],
    ["Weihnachtstassen", "/weihnachtstassen"],
    ["Anmeldung", "/anmeldung"],
    ["Organisation", "/organisation"],
    ["Häuschenmasse", "/haeuschenmasse"],
    ["Kontakt", "/kontakt"],
  ];

  return (
    <div className="min-h-screen">
      <Snow />

      {/* ── Nav ── */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 nav-blur ${
          scrolled ? "bg-burgundy/95 backdrop-blur-md shadow-lg" : "bg-burgundy/70 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2">
            <img src="/images/logo-weihnachtsmaert.png" alt="Lozärner Wiehnachtsmärt" className="h-10 sm:h-12 w-auto" />
          </a>
          <div className="hidden md:flex gap-6 text-sm font-medium text-white/80 items-center">
            {NAV.map(([l, id]) => (
              <a key={id} href={`#${id}`} className="hover:text-gold-bright transition-colors drop-shadow-sm">
                {l}
              </a>
            ))}
            <span className="text-white/30">|</span>
            {PAGES.slice(0, 4).map(([l, href]) => (
              <Link key={href} href={href} className="hover:text-gold-bright transition-colors drop-shadow-sm">
                {l}
              </Link>
            ))}
            <div className="relative group">
              <button className="hover:text-gold-bright transition-colors drop-shadow-sm cursor-pointer flex items-center gap-1">
                Mehr
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 1l4 4 4-4"/></svg>
              </button>
              <div className="absolute right-0 top-full pt-2 hidden group-hover:block">
                <div className="bg-burgundy/95 backdrop-blur-md rounded-lg shadow-xl py-2 min-w-[200px] border border-white/10">
                  {PAGES.slice(4).map(([l, href]) => (
                    <Link key={href} href={href} className="block px-4 py-2 text-white/70 hover:text-gold-bright hover:bg-white/5 transition-colors">
                      {l}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden cursor-pointer text-white/80"
            aria-label="Menü"
          >
            <svg width="24" height="16" viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="0" y1="2" x2="24" y2="2" />
              <line x1="0" y1="8" x2="24" y2="8" />
              <line x1="0" y1="14" x2="24" y2="14" />
            </svg>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-burgundy flex flex-col items-center overflow-y-auto py-20 gap-6">
          <button
            onClick={() => setMenuOpen(false)}
            className="fixed top-5 right-5 z-50 text-3xl text-white/60 cursor-pointer"
          >
            &times;
          </button>
          {NAV.map(([l, id]) => (
            <a
              key={id}
              href={`#${id}`}
              onClick={() => setMenuOpen(false)}
              className="font-display font-bold text-2xl text-white hover:text-gold-bright transition-colors"
            >
              {l}
            </a>
          ))}
          <div className="w-16 h-px bg-white/20" />
          {PAGES.map(([l, href]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="font-display font-semibold text-lg text-white/70 hover:text-gold-bright transition-colors"
            >
              {l}
            </Link>
          ))}
        </div>
      )}

      {/* ── Hero mit Slider ── */}
      <section className="relative h-[100svh] min-h-[600px] overflow-hidden">
        <HeroSlider />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

        <div className="relative h-full flex flex-col justify-end px-4 sm:px-8 pb-12 sm:pb-20 max-w-6xl mx-auto">
          <div style={{ animation: "fadeIn 0.8s ease 0.2s both" }}>
            <p className="font-script italic text-gold-bright text-2xl sm:text-4xl md:text-5xl mb-2 drop-shadow-lg">
              Willkommen am
            </p>
          </div>
          <div style={{ animation: "fadeIn 0.8s ease 0.4s both" }}>
            <h1 className="font-display font-black text-white text-[2.4rem] sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] uppercase tracking-wide mb-4 drop-shadow-lg">
              Lozärner
              <br />
              Wiehnachts&shy;märt
            </h1>
          </div>
          <div style={{ animation: "fadeIn 0.8s ease 0.7s both" }}>
            <p className="text-white/60 text-sm sm:text-base mt-2 drop-shadow-md">
              Franziskanerplatz, Luzern &middot; 3.–21. Dezember 2026
            </p>
          </div>
        </div>

        <a
          href="#info"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40 hover:text-white/70 transition-colors"
          style={{ animation: "fadeIn 0.8s ease 1s both" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </a>
      </section>

      {/* ── Datum-Leiste ── */}
      <section id="info" className="bg-burgundy text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="text-center">
              <p className="font-display font-black text-3xl sm:text-4xl">3.–21.</p>
              <p className="text-white/50 text-xs uppercase tracking-widest">Dezember 2026</p>
            </div>
            <div className="w-px h-12 bg-white/20 hidden sm:block" />
            <div className="text-center sm:text-left">
              <p className="font-display font-bold text-lg sm:text-xl">Franziskanerplatz</p>
              <p className="text-white/50 text-sm">Luzern</p>
            </div>
          </div>
          <p className="text-white/50 text-sm">
            Rund 70 Marktstände &middot; Täglich ab 11 Uhr
          </p>
        </div>
      </section>

      <TodayProgram />

      {/* ── Video ── */}
      <section className="bg-wine-dark py-0">
        <div className="max-w-6xl mx-auto">
          <div className="relative aspect-video overflow-hidden shadow-2xl">
            <video
              className="w-full h-full object-cover"
              controls
              autoPlay
              muted
              loop
              playsInline
              poster="/images/hero-markt.jpg"
              preload="auto"
            >
              <source src="/images/weihnachtsmarkt-samschtigjass.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="text-center py-4 bg-wine-dark">
            <p className="text-white/40 text-sm">
              Der Lozärner Wiehnachtsmärt im SRF Samschtigjass
            </p>
          </div>
        </div>
      </section>

      {/* ── Über den Markt ── */}
      <section id="ueber" className="py-20 sm:py-28 bg-wine text-foreground">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <R>
            <p className="text-center text-burgundy/30 text-sm tracking-[0.4em] mb-16">✦&ensp;&ensp;✦&ensp;&ensp;✦</p>
          </R>
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <R>
              <div>
                <p className="font-script italic text-burgundy text-xl sm:text-2xl mb-2">Seit 2009</p>
                <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl leading-tight mb-6">
                  Einer der schönsten
                  Adventsmärkte
                  Europas
                </h2>
                <p className="text-foreground/60 text-base sm:text-lg leading-relaxed mb-4">
                  Bereits zum achtzehnten Mal organisiert die IG Luzerner Herbstmesse und Märkte
                  den &bdquo;Lozärner Wiehnachtsmärt&ldquo; auf dem Franziskanerplatz. Im Herzen
                  der historischen Klein-Altstadt, rund um die Franziskanerkirche, entsteht auch
                  dieses Jahr eine ganz besondere Atmosphäre.
                </p>
                <p className="text-foreground/60 text-base sm:text-lg leading-relaxed mb-4">
                  Rund 70 liebevoll geschmückte Marktstände bieten ausgewählte Geschenkideen,
                  Handwerkskunst und kulinarische Spezialitäten an. Der Duft von Glühwein, Punsch,
                  Nidlezältli, frischem Holzofenbrot und anderen Köstlichkeiten erfüllt den Platz.
                </p>
                <p className="text-foreground/60 text-base sm:text-lg leading-relaxed">
                  Das Reisemagazin{" "}
                  <a
                    href="https://www.20min.ch/story/das-sind-die-schoensten-weihnachtsmaerkte-europas-103438353"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-burgundy underline decoration-burgundy/30 hover:decoration-burgundy/60 transition-colors"
                  >
                    Time Out zählt ihn zu den zehn schönsten Weihnachtsmärkten Europas
                  </a>{" "}
                  — gewürdigt für seine stimmungsvolle Atmosphäre und den typischen Luzerner Glühwein
                  in der beliebten Sammeltasse.
                </p>
              </div>
            </R>
            <R>
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden ring-1 ring-foreground/10">
                <Image
                  src="/images/galerie-8.jpg"
                  alt="Franziskanerplatz am Wiehnachtsmärt"
                  fill
                  className="object-cover"
                />
              </div>
            </R>
          </div>
        </div>
      </section>

      {/* ── Adventskranz-Highlight ── */}
      <section className="py-16 sm:py-20 bg-burgundy text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <R>
              <div className="relative aspect-square rounded-xl overflow-hidden ring-1 ring-white/10">
                <Image
                  src="/images/galerie-3.jpg"
                  alt="Adventskranz auf dem Franziskanerbrunnen"
                  fill
                  className="object-cover"
                />
              </div>
            </R>
            <R>
              <div>
                <p className="font-script italic text-gold-bright text-lg mb-2">Highlight</p>
                <h2 className="font-display font-bold text-2xl sm:text-3xl leading-tight mb-4">
                  Der grösste Adventskranz der Zentralschweiz
                </h2>
                <p className="text-white/70 text-base leading-relaxed">
                  Über drei Meter Durchmesser, geschmückt mit Hunderten von Lichtern,
                  Kugeln und vier meterhohen Kerzen — auf dem Franziskanerbrunnen.
                  Das leuchtende Herzstück des Marktes.
                </p>
              </div>
            </R>
          </div>
        </div>
      </section>

      {/* ── Glühwein & Genuss ── */}
      <section className="py-20 sm:py-28 bg-wine text-foreground">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <R>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden md:order-1 ring-1 ring-foreground/10">
                <Image
                  src="/images/galerie-10.jpg"
                  alt="Marktbesucher am Wiehnachtsmärt"
                  fill
                  className="object-cover"
                />
              </div>
            </R>
            <R>
              <div className="md:order-0">
                <h2 className="font-display font-bold text-3xl sm:text-4xl leading-tight mb-6">
                  Glühwein, Raclette
                  <br />
                  und Nidlezältli
                </h2>
                <p className="text-foreground/60 text-base sm:text-lg leading-relaxed mb-4">
                  Die Sammeltasse — jedes Jahr ein neues Design — gehört zum Märt
                  wie der Schnee zum Winter. Dazu Raclette mit Blick auf den Platz,
                  Holzofenbrot frisch aus dem Ofen und natürlich: Nidlezältli.
                </p>
                <p className="text-muted text-sm">
                  Foodstände bis 21 Uhr
                </p>
              </div>
            </R>
          </div>
        </div>
      </section>

      {/* ── Bilder-Slider ── */}
      <section className="py-16 sm:py-24 bg-burgundy text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <R>
            <h2 className="font-display font-bold text-2xl sm:text-3xl md:text-4xl mb-8 text-center">
              Stimmung wie nirgendwo sonst
            </h2>
          </R>
          <R>
            <ImageSlider />
          </R>
        </div>
      </section>

      {/* ── Musik & Kultur ── */}
      <section className="py-20 sm:py-28 bg-wine text-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <R>
              <div>
                <h2 className="font-display font-bold text-3xl sm:text-4xl leading-tight mb-6">
                  Musik und Kultur
                </h2>
                <p className="text-foreground/60 text-base sm:text-lg leading-relaxed mb-4">
                  Fast täglich sorgen Chöre, Bläsergruppen und Musikensembles aus der Region
                  auf der Bühne vor dem Franziskanerbrunnen für festliche Stimmung.
                  Unterschiedliche Stilrichtungen — von traditionellen Klängen bis zu
                  modernen Interpretationen — verleihen dem Markt seine besondere musikalische Vielfalt.
                </p>
                <p className="text-foreground/60 text-base sm:text-lg leading-relaxed">
                  Auch in der Franziskanerkirche laden zahlreiche Adventsandachten,
                  musikalische Meditationen und Konzerte zu ruhigen Momenten der Besinnung ein.
                </p>
              </div>
            </R>
            <R>
              <div className="relative aspect-[4/5] rounded-xl overflow-hidden ring-1 ring-foreground/10">
                <Image
                  src="/images/galerie-12.jpg"
                  alt="Musikbühne am Wiehnachtsmärt"
                  fill
                  className="object-cover"
                />
              </div>
            </R>
          </div>
        </div>
      </section>

      {/* ── Franziskanerkirche ── */}
      <section className="py-16 sm:py-20 bg-wine-light text-foreground">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <R>
            <p className="font-script italic text-burgundy text-lg mb-2">Mittelalterliche Kirche</p>
            <h3 className="font-display font-bold text-2xl sm:text-3xl mb-4">Die Franziskanerkirche</h3>
            <p className="text-foreground/60 text-base leading-relaxed max-w-2xl mx-auto">
              Die Franziskanerkirche wurde 1270 als Klosterkirche des Franziskanerordens
              im gotischen Stil erbaut. Im 17. und 18. Jahrhundert bekam sie ihre heutige
              barocke Ausstattung und eine Erweiterung mit zwei Kapellen. Seit 1895 ist sie Pfarrkirche.
            </p>
          </R>
        </div>
      </section>

      {/* ── Programm ── */}
      <section id="programm" className="py-20 sm:py-28 bg-wine text-foreground">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <R>
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-3">Kulturprogramm 2026</h2>
            <p className="text-muted text-base mb-12">Musik, Andachten und Kultur vom 3. bis 21. Dezember</p>
          </R>

          {PROGRAMM.map((day) => (
            <R key={day.tag}>
              <div className="mb-8">
                <h3 className="font-display font-bold text-lg text-burgundy border-b border-burgundy/20 pb-2 mb-3">
                  {day.tag}
                </h3>
                <div className="space-y-0">
                  {day.events.map((ev, i) => {
                    const img = KUENSTLER_BILDER[ev.w];
                    return (
                      <div key={`${day.tag}-${i}`}>
                        <div className="flex items-baseline gap-3 sm:gap-5 py-2">
                          <span className="text-muted text-sm w-14 shrink-0 tabular-nums">{ev.z}</span>
                          <span className="text-foreground/80 text-sm sm:text-base flex-1">{ev.w}</span>
                          {ev.o && <span className="hidden sm:block text-foreground/25 text-xs shrink-0">{ev.o}</span>}
                        </div>
                        {img && (
                          <div className="ml-[4.5rem] mt-1 mb-4">
                            <img src={img} alt={ev.w} className="max-w-[360px] w-full h-auto rounded-lg" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </R>
          ))}

          <R>
            <p className="mt-4 text-muted/60 text-xs">
              Programmänderungen vorbehalten. Alle Auftritte auf dem Franziskanerplatz, sofern nicht anders angegeben.
            </p>
          </R>
        </div>
      </section>

      {/* ── Öffnungszeiten ── */}
      <section className="bg-burgundy text-white py-14 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-center mb-10">
            Öffnungszeiten
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              ["Ab 11 Uhr", "Öffnung"],
              ["Bis 20 Uhr", "Warenstände"],
              ["Bis 21 Uhr", "Foodstände"],
              ["Bis 19 Uhr", "Schlusstag"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="font-display font-black text-3xl sm:text-4xl text-white mb-1">{v}</p>
                <p className="text-white/50 text-sm">{l}</p>
              </div>
            ))}
          </div>
          <R>
            <div className="text-center mt-10 pt-6 border-t border-white/10">
              <p className="text-white/50 text-sm font-display font-bold mb-1">Folgetermine</p>
              <p className="text-white/40 text-sm">
                2.–21. Dezember 2027 &middot; 1.–21. Dezember 2028
              </p>
            </div>
          </R>
        </div>
      </section>

      {/* ── Grosses Foto ── */}
      <section className="relative w-full overflow-hidden">
        <div className="relative w-full" style={{ paddingBottom: "45%" }}>
          <Image
            src="/images/galerie-4.jpg"
            alt="Engel am Wiehnachtsmärt"
            fill
            className="object-cover object-top"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-burgundy/40 to-transparent" />
      </section>

      {/* ── Galerie ── */}
      <section id="galerie" className="py-20 sm:py-28 bg-wine text-foreground">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <R>
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-3">Impressionen</h2>
            <p className="text-muted text-base mb-10">Bilder vom Lozärner Wiehnachtsmärt</p>
          </R>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {[
              { src: "/images/galerie-4.jpg", alt: "Marktstände bei Nacht" },
              { src: "/images/galerie-7.jpg", alt: "Weihnachtsschmuck" },
              { src: "/images/galerie-11.jpg", alt: "Stimmungsvoller Abend" },
              { src: "/images/galerie-5.jpg", alt: "Marktstände von oben" },
              { src: "/images/galerie-10.jpg", alt: "Dekorationen" },
              { src: "/images/galerie-9.jpg", alt: "Besucherinnen und Besucher" },
              { src: "/images/galerie-3.jpg", alt: "Adventskranz" },
              { src: "/images/galerie-12.jpg", alt: "Winterliche Stimmung" },
              { src: "/images/galerie-8.jpg", alt: "Franziskanerplatz" },
              { src: "/images/galerie-1.jpg", alt: "Engel-Dekoration" },
              { src: "/images/galerie-2.jpg", alt: "Auf dem Märt" },
              { src: "/images/galerie-6.jpg", alt: "Wiehnachtsmärt bei Nacht" },
            ].map((img) => (
              <R key={img.src}>
                <div className="gallery-item relative aspect-[4/3] rounded-lg overflow-hidden ring-1 ring-foreground/8">
                  <Image src={img.src} alt={img.alt} fill className={`object-cover${img.src.includes("galerie-1") ? " object-top" : ""}`} sizes="(max-width: 768px) 50vw, 33vw" />
                </div>
              </R>
            ))}
          </div>
        </div>
      </section>

      {/* ── Kapellbrücke Foto ── */}
      <section className="relative w-full overflow-hidden">
        <div className="relative w-full" style={{ paddingBottom: "40%" }}>
          <Image
            src="/images/galerie-6.jpg"
            alt="Wiehnachtsmärt bei Nacht"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/30 to-transparent" />
      </section>

      {/* ── Adventskalender ── */}
      <section id="kalender" className="py-20 sm:py-28 bg-wine text-foreground">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <R>
            <div className="text-center mb-10">
              <p className="text-burgundy/30 text-xs tracking-[0.5em] mb-6">✦&ensp;✦&ensp;✦</p>
              <h2 className="font-display font-bold text-3xl sm:text-4xl mb-2">
                Adventskalender
              </h2>
              <p className="text-muted">24 Türchen — jeden Tag eins öffnen</p>
            </div>
          </R>
          <AdventCalendar />
        </div>
      </section>

      {/* ── Anreise ── */}
      <section id="anreise" className="py-20 sm:py-28 bg-wine text-foreground border-t border-foreground/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <R>
            <h2 className="font-display font-bold text-3xl sm:text-4xl mb-3">Anreise</h2>
            <p className="text-muted text-base mb-10">Franziskanerplatz, 6003 Luzern</p>
          </R>

          <div className="space-y-8 mb-14">
            <R>
              <div>
                <h3 className="font-display font-bold text-lg text-burgundy mb-2">Mit dem Zug</h3>
                <p className="text-foreground/55 text-base leading-relaxed">
                  Ab Bahnhof Luzern Richtung Kapellbrücke, linkes Reussufer entlang.
                  Bahnhofstrasse weitergehen, nach dem Stadttheater entlang der Jesuitenkirche,
                  nach 200 Metern links abbiegen — schon bist du da.
                </p>
              </div>
            </R>

            <R>
              <div>
                <h3 className="font-display font-bold text-lg text-burgundy mb-2">Mit dem Auto</h3>
                <p className="text-foreground/55 text-base leading-relaxed">
                  A2, Ausfahrt Luzern Zentrum. In der Nähe befinden sich mehrere Parkhäuser:
                  Altstadt (456 Plätze), Kesselturm (350), Bahnhofparking P1/P2 (515),
                  P3 (500) und Kantonalbankparking (254 Plätze).
                </p>
              </div>
            </R>

            <R>
              <div>
                <h3 className="font-display font-bold text-lg text-burgundy mb-2">Mit dem Bus</h3>
                <p className="text-foreground/55 text-base leading-relaxed">
                  Haltestelle Pilatusplatz — von dort sind es rund 100 Meter Richtung Hirschengraben.
                </p>
              </div>
            </R>

            <R>
              <div>
                <h3 className="font-display font-bold text-lg text-burgundy mb-2">Mit Velo oder Mofa</h3>
                <p className="text-foreground/55 text-base leading-relaxed">
                  Velo- und Mofaparkplätze stehen an der Bahnhofstrasse zur Verfügung.
                </p>
              </div>
            </R>
          </div>

          <R>
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden border border-foreground/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1356.5!2d8.3065!3d47.0502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478ffba0b6574d0d%3A0x0!2sFranziskanerplatz%2C+Luzern!5e0!3m2!1sde!2sch!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Franziskanerplatz Luzern"
                className="absolute inset-0"
              />
            </div>
          </R>
        </div>
      </section>

      {/* ── Partner ── */}
      <section className="bg-wine-light py-14 border-t border-foreground/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display font-bold text-xl sm:text-2xl mb-10 text-foreground/40">
            Unsere Partner
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-10 sm:gap-14">
            <a href="https://www.ewl-luzern.ch/privatkunden/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
              <img src="/images/partner-ewl-new.svg" alt="ewl energie wasser luzern" className="h-10 sm:h-12 w-auto" />
            </a>
            <a href="https://www.stadtluzern.ch/" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
              <img src="/images/partner-stadt-luzern-new.svg" alt="Stadt Luzern" className="h-10 sm:h-12 w-auto" />
            </a>
            <a href="https://www.lu.ch/verwaltung/finanzdepartement/dienststelle_lawi/swisslos_sportfonds/swisslos_kultur" target="_blank" rel="noopener noreferrer" className="opacity-70 hover:opacity-100 transition-opacity">
              <img src="/images/partner-kulturfoerderung-new.jpg" alt="Kanton Luzern Kulturförderung" className="h-10 sm:h-12 w-auto" />
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-wine-dark text-white/80 border-t border-burgundy/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14">
          <div className="text-center mb-8">
            <p className="text-burgundy text-xs tracking-[0.5em] mb-4">★</p>
            <p className="font-script italic text-gold-bright text-2xl mb-1">
              Lozärner Wiehnachtsmärt
            </p>
            <p className="font-display font-bold text-lg text-white mb-1">
              Franziskanerplatz
            </p>
            <p className="text-white/60 text-sm">
              6003 Luzern
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 text-white/50 text-xs text-center mb-6">
            <span>IG Luzerner Herbstmesse und Märkte</span>
            <span className="hidden sm:inline">&middot;</span>
            <span>ewl &middot; Stadt Luzern &middot; Kulturförderung</span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-white/50 text-xs mb-6">
            {PAGES.map(([l, href]) => (
              <Link key={href} href={href} className="hover:text-white transition-colors">
                {l}
              </Link>
            ))}
          </div>

          <div className="flex justify-center gap-6 text-white/60 text-sm">
            <Link href="/impressum" className="hover:text-white transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-white transition-colors">
              Datenschutz
            </Link>
          </div>

          <p className="text-center text-white/25 text-[10px] mt-8">v2.3.1</p>
        </div>
      </footer>
    </div>
  );
}
