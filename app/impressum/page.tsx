import Link from "next/link";

export default function Impressum() {
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
        <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-12">Impressum</h1>

        <div className="space-y-8 text-base text-foreground/60 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Veranstalter</h2>
            <p>
              IG Luzerner Herbstmesse und Märkte (IG LHMM)<br />
              Franziskanerplatz<br />
              6003 Luzern
            </p>
            <p className="mt-3">
              E-Mail:{" "}
              <a href="mailto:sekretariat@weihnachtsmarktluzern.com" className="text-burgundy underline decoration-burgundy/30 hover:decoration-burgundy/60">
                sekretariat@weihnachtsmarktluzern.com
              </a>
              <br />
              Web:{" "}
              <a href="https://www.weihnachtsmarkt-luzern.com" className="text-burgundy underline decoration-burgundy/30 hover:decoration-burgundy/60">
                www.weihnachtsmarkt-luzern.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Organisationskomitee</h2>
            <ul className="space-y-1">
              <li><strong className="text-foreground/80">Präsident:</strong> Pius Suter</li>
              <li><strong className="text-foreground/80">Finanzen:</strong> Andreas Krause</li>
              <li><strong className="text-foreground/80">Werbung &amp; Kommunikation:</strong> Roger Givel</li>
              <li><strong className="text-foreground/80">Kulturprogramm:</strong> Rico De Bona</li>
              <li><strong className="text-foreground/80">Sekretariat:</strong> Alexi Dubach</li>
              <li><strong className="text-foreground/80">Platzmeister / Infrastruktur:</strong> Roger Dreyer</li>
              <li><strong className="text-foreground/80">Platzmeister Stv:</strong> Tommy Suter</li>
              <li><strong className="text-foreground/80">Platzgestaltung:</strong> Helmuth Ackermann</li>
              <li><strong className="text-foreground/80">Strom / Wasser:</strong> Herbert Schwarz</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Haftungsausschluss</h2>
            <p>
              Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit,
              Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen.
            </p>
            <p className="mt-3">
              Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art,
              welche aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten
              Informationen, durch Missbrauch der Verbindung oder durch technische Störungen
              entstanden sind, werden ausgeschlossen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Urheberrechte</h2>
            <p>
              Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen
              Dateien auf dieser Website gehören ausschliesslich der IG Luzerner Herbstmesse
              und Märkte oder den speziell genannten Rechteinhabern. Für die Reproduktion
              jeglicher Elemente ist die schriftliche Zustimmung der Urheberrechtsträger
              im Voraus einzuholen.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-foreground/10 py-10">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-foreground/20">
          <p>&copy; {new Date().getFullYear()} IG Luzerner Herbstmesse und Märkte</p>
          <div className="flex gap-6">
            <Link href="/impressum" className="text-foreground/50">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-foreground/50 transition-colors">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
