import Link from "next/link";

const KUENSTLER_BILDER: Record<string, string> = {
  "Duo PanTastico": "/images/kuenstler-pantastico.jpg",
  "Original Lozärner Schäller & Trychler": "/images/kuenstler-schaeller.jpg",
  "Lozärner Samichlausgesellschaft": "/images/kuenstler-samichlaus.jpg",
  "Samichlaus zu Besuch in der Franziskanerkirche": "/images/kuenstler-samichlaus.jpg",
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
  "Hornschüler": "/images/kuenstler-hornschueler.jpg",
  "Jodlerfründe Ruopige": "/images/kuenstler-jodlerfruende.jpg",
  "Kinder-/Jugendchor Anton-Michael": "/images/kuenstler-jugendchor-anton.jpg",
  "Kinderchor Mailino": "/images/kuenstler-mailino.jpg",
  "Musikverein Rotkreuz": "/images/kuenstler-mg-rotkreuz.jpg",
  "Musikschule Bigband Luzern": "/images/kuenstler-bigband.jpg",
  "christmasBand Schwyz": "/images/kuenstler-christmasband.jpg",
  "Luca Di Felice": "/images/kuenstler-luca-di-felice.jpg",
};

const PROGRAMM = [
  { tag: "Donnerstag, 3. Dezember", events: [
    { z: "10:30", w: "Feierliche Eröffnung Wiehnachtsmärt", o: "Kirche" },
    { z: "10:30", w: "Duo PanTastico", o: "Kirche" },
    { z: "16:30", w: "Rosenkranzgebet", o: "Kirche" },
    { z: "18:30", w: "Original Lozärner Schäller & Trychler" },
  ]},
  { tag: "Freitag, 4. Dezember", events: [
    { z: "17:15", w: "Adventliche Andacht «Feier-Abend» — Stille, Musik und Texte", o: "Kirche" },
    { z: "18:00", w: "Lozärner Samichlausgesellschaft" },
  ]},
  { tag: "Samstag, 5. Dezember", events: [
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
  { tag: "Sonntag, 6. Dezember", events: [
    { z: "09:00", w: "Gottesdienst", o: "Kirche" },
    { z: "11:00", w: "Gottesdienst", o: "Kirche" },
    { z: "12:30", w: "Musikalische Meditation — Thomas Triesschijn (Blockflöte), Freddie James (Cembalo/Orgel)", o: "Kirche" },
    { z: "13:30", w: "Gunvor" },
    { z: "17:00", w: "Advents- und Weihnachtslieder mit der Gemeinde — Franziskanerchor, Daniel Baker und Freddie James (Orgel), Ulrike Grosch (Leitung)", o: "Kirche" },
  ]},
  { tag: "Montag, 7. Dezember", events: [
    { z: "15:00", w: "Serenade Avenue (Harfe)" },
    { z: "18:30", w: "Montags-Jodel-Gruppe von Silvia Rymann" },
  ]},
  { tag: "Dienstag, 8. Dezember — Maria Empfängnis", events: [
    { z: "12:30", w: "Duo PanTastico" },
    { z: "13:40", w: "Trychlergruppe Perlen" },
    { z: "14:00", w: "Hornschüler" },
    { z: "17:00", w: "Serenade Avenue (Harfe)" },
    { z: "19:00", w: "Luca Di Felice" },
  ]},
  { tag: "Mittwoch, 9. Dezember", events: [
    { z: "15:00", w: "Duo PanTastico", o: "Kirche" },
    { z: "16:00", w: "Adventsgeschichte für Klein und Gross", o: "Antoniuskapelle" },
    { z: "18:00", w: "Spättacolo — Erwachsenen-Bläserensemble der Musikschule Luzern" },
    { z: "19:00", w: "Brass and Pipes" },
    { z: "20:00", w: "Jugendblasorchester Kriens" },
  ]},
  { tag: "Donnerstag, 10. Dezember", events: [
    { z: "16:30", w: "Rosenkranzgebet", o: "Kirche" },
    { z: "18:00", w: "Marc Rudin — TouchSoulMusic" },
    { z: "19:00", w: "Chörli" },
  ]},
  { tag: "Freitag, 11. Dezember", events: [
    { z: "19:00", w: "Fantasie-Chörli Luzern" },
  ]},
  { tag: "Samstag, 12. Dezember", events: [
    { z: "11:00", w: "Tubas de Noël" },
    { z: "12:30", w: "Musikalische Meditation — Laurie Krier (Blockflöte), Melina Wegner (Cello), Julien Brügger (Orgel)", o: "Kirche" },
    { z: "15:00", w: "Gunvor" },
    { z: "16:00", w: "Gottesdienst", o: "Kirche" },
    { z: "17:30", w: "MG Aesch-Mosen" },
    { z: "19:15", w: "Marc Rudin — TouchSoulMusic" },
  ]},
  { tag: "Sonntag, 13. Dezember", events: [
    { z: "09:00", w: "Gottesdienst", o: "Kirche" },
    { z: "11:00", w: "Gottesdienst", o: "Kirche" },
    { z: "12:30", w: "Musikalische Meditation — Alessandra Riudalbas (Blockflöte), Ivàn Garcia (Laute)", o: "Kirche" },
    { z: "14:00", w: "Gunvor" },
    { z: "15:00", w: "Gingerbreads Christmas Brassband" },
    { z: "16:00", w: "Sixtett Vivace" },
    { z: "17:00", w: "Weihnachtskonzert Männeroktett «VOCALISTI» — Harfe: Anne Neugebauer, Leitung: Norbert Carlen", o: "Kirche" },
  ]},
  { tag: "Montag, 14. Dezember", events: [
    { z: "15:00", w: "Serenade Avenue (Harfe)" },
    { z: "19:00", w: "NoHeadBand" },
  ]},
  { tag: "Dienstag, 15. Dezember", events: [
    { z: "15:00", w: "Serenade Avenue (Harfe)" },
    { z: "19:00", w: "Musikverein Rotkreuz" },
    { z: "20:15", w: "Line Dance" },
  ]},
  { tag: "Mittwoch, 16. Dezember", events: [
    { z: "16:00", w: "Kinderchor Mailino" },
    { z: "18:00", w: "Marc Pircher" },
  ]},
  { tag: "Donnerstag, 17. Dezember", events: [
    { z: "16:30", w: "Rosenkranzgebet", o: "Kirche" },
    { z: "18:00", w: "Santa's Swingin' Six" },
    { z: "19:30", w: "Nacht der Kirchen", o: "Kirche" },
  ]},
  { tag: "Freitag, 18. Dezember", events: [
    { z: "17:15", w: "Adventliche Andacht «Feier-Abend» — Stille, Musik und Texte", o: "Kirche" },
    { z: "18:00", w: "Kinder-/Jugendchor Anton-Michael" },
    { z: "19:15", w: "Projektchor Anton-Michael" },
  ]},
  { tag: "Samstag, 19. Dezember", events: [
    { z: "11:15", w: "christmasBand Schwyz" },
    { z: "12:30", w: "Musik zum Weihnachtsmarkt — Christian Barthen (Orgel)", o: "Kirche" },
    { z: "16:00", w: "Gottesdienst", o: "Kirche" },
    { z: "17:15", w: "COPOTUWA Quintett" },
    { z: "18:30", w: "Musikschule Bigband Luzern" },
    { z: "19:30", w: "Jodlerfründe Ruopige" },
  ]},
  { tag: "Sonntag, 20. Dezember", events: [
    { z: "09:00", w: "Gottesdienst", o: "Kirche" },
    { z: "11:00", w: "Gottesdienst", o: "Kirche" },
    { z: "12:30", w: "Musik zum Weihnachtsmarkt — Heyon Ko (Orgel)", o: "Kirche" },
    { z: "18:00", w: "Byzantinischer Gottesdienst", o: "Kirche" },
  ]},
  { tag: "Montag, 21. Dezember — Schlusstag", events: [
    { z: "15:00", w: "Duo PanTastico" },
    { z: "19:00", w: "Schluss der Verkaufsstände" },
  ]},
];

export default function Rahmenprogramm() {
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

      <main className="max-w-[900px] mx-auto px-5 sm:px-10 py-20">
        <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-4">Rahmenprogramm</h1>
        <p className="text-muted text-base mb-4">Wiehnachtsmärt 2026: Kulturprogramm</p>
        <p className="text-foreground/40 text-sm mb-12">
          Alle Auftritte auf dem Franziskanerplatz, sofern nicht anders angegeben. Programmänderungen vorbehalten.
        </p>

        <div className="space-y-12">
          {PROGRAMM.map((day) => (
            <section key={day.tag}>
              <h2 className="font-display font-bold text-lg sm:text-xl text-burgundy mb-4 pb-2 border-b border-burgundy/20">
                {day.tag}
              </h2>
              <div className="space-y-3">
                {day.events.map((ev, i) => {
                  const img = KUENSTLER_BILDER[ev.w];
                  return (
                    <div key={i}>
                      <div className="flex items-baseline gap-4 py-2">
                        <span className="text-burgundy font-display font-bold text-sm w-14 shrink-0 tabular-nums">
                          {ev.z}
                        </span>
                        <div className="flex-1">
                          <p className="text-foreground/80 text-sm sm:text-base">{ev.w}</p>
                          {ev.o && (
                            <p className="text-foreground/30 text-xs mt-0.5">{ev.o}</p>
                          )}
                        </div>
                      </div>
                      {img && (
                        <div className="ml-[4.5rem] mt-2 mb-4">
                          <img src={img} alt={ev.w} className="max-w-[400px] w-full h-auto rounded-lg" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-foreground/10">
          <p className="text-foreground/40 text-sm">
            Öffnungszeiten: Täglich 11.00 – 20.00 Uhr, Verpflegungsstände bis 21.00 Uhr
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
