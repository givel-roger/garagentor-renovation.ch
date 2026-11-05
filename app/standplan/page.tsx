import Link from "next/link";
import Image from "next/image";

export default function Standplan() {
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
        <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-4">Stand-Plan</h1>
        <p className="text-muted text-base mb-12">
          Übersicht der Standplätze auf dem Franziskanerplatz — Lozärner Wiehnachtsmärt
        </p>

        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-foreground/[0.03] border border-foreground/10 mb-12">
          <Image
            src="/images/anfahrt-plan.jpg"
            alt="Stand-Plan Franziskanerplatz"
            fill
            className="object-contain"
          />
        </div>

        <div className="space-y-6 text-base text-foreground/60 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Standorte</h2>
            <p>
              Der Wiehnachtsmärt erstreckt sich über den gesamten Franziskanerplatz in der
              Luzerner Altstadt. Die rund 65 Marktstände sind um den historischen Brunnen
              herum angeordnet.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Anfahrt</h2>
            <p>
              Der Franziskanerplatz liegt im Herzen der Luzerner Altstadt und ist vom
              Bahnhof Luzern in ca. 5 Gehminuten erreichbar. Wir empfehlen die Anreise
              mit dem öffentlichen Verkehr.
            </p>
            <ul className="mt-3 space-y-1 list-disc list-inside text-foreground/50">
              <li>Ab Bahnhof Luzern: ca. 5 Min. zu Fuss via Kapellbrücke</li>
              <li>Parkhaus Altstadt / Parkhaus Kesselturm in der Nähe</li>
              <li>Schiffstation Luzern-Bahnhofquai</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Für Marktfahrer</h2>
            <p>
              Detaillierte Informationen zu den Häuschenmassen und zur Anmeldung finden Sie unter:{" "}
            </p>
            <div className="mt-3 flex gap-4 flex-wrap">
              <Link href="/haeuschenmasse" className="text-burgundy underline decoration-burgundy/30 hover:decoration-burgundy/60">
                Häuschenmasse
              </Link>
              <Link href="/anmeldung" className="text-burgundy underline decoration-burgundy/30 hover:decoration-burgundy/60">
                Anmeldung
              </Link>
              <Link href="/teilnehmer" className="text-burgundy underline decoration-burgundy/30 hover:decoration-burgundy/60">
                Teilnehmer-Liste
              </Link>
            </div>
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
