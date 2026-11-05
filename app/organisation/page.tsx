import Link from "next/link";

export default function Organisation() {
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
        <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-12">Organisation</h1>

        <div className="space-y-8 text-base text-foreground/60 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Interessengemeinschaft Luzerner Herbstmesse und Märkte (IG LHMM)
            </h2>
            <p>
              Der Lozärner Wiehnachtsmärt wird von der Interessengemeinschaft Luzerner
              Herbstmesse und Märkte (IG LHMM) organisiert.
            </p>
            <p className="mt-3 font-semibold text-foreground/80">
              Ausblick: Der Lozärner Wiehnachtsmärt 2026 dauert vom 3. – 21. Dezember 2026
              und ist täglich von 11 Uhr bis 20 Uhr (Verpflegungsstände bis 21 Uhr) geöffnet.
            </p>
            <p className="mt-3">
              Gemäss den Vereinsstatuten bezweckt die IG LHMM seit 1972 die Förderung des
              Marktwesens in der Stadt Luzern sowie die effiziente Zusammenarbeit zwischen
              der organisierenden Behörde und der Teilnehmerschaft sowie ihren Interessenverbänden.
            </p>
            <p className="mt-3">
              Sie setzt sich insbesondere für die Erhaltung der zentralen Standorte und von
              attraktiven Veranstaltungskonzepten der Marktveranstaltungen ein. In dieser Funktion
              organisiert die IG LHMM seit Jahrzehnten die gesamte PR für die Herbstmesse auf dem
              Inseli und für den Monats-Warenmarkt.
            </p>
            <p className="mt-3">
              Seit 2006 obliegt ihr auch die gesamte Organisation und Durchführung des
              Luzerner Weihnachtsmarktes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">OK Wiehnachtsmärt</h2>
            <ul className="space-y-2">
              <li><strong className="text-foreground/80">Präsident:</strong> Pius Suter</li>
              <li><strong className="text-foreground/80">Finanzen:</strong> Andreas Krause</li>
              <li><strong className="text-foreground/80">Werbung &amp; Kommunikation:</strong> Roger Givel</li>
              <li><strong className="text-foreground/80">Kulturprogramm:</strong> Rico De Bona</li>
              <li><strong className="text-foreground/80">Sekretariat:</strong> Alexi Dubach</li>
              <li><strong className="text-foreground/80">Platzmeister / Infrastruktur / Auf- &amp; Abbau:</strong> Roger Dreyer</li>
              <li><strong className="text-foreground/80">Platzmeister Stv:</strong> Tommy Suter</li>
              <li><strong className="text-foreground/80">Platzgestaltung:</strong> Helmuth Ackermann</li>
              <li><strong className="text-foreground/80">Strom / Wasser:</strong> Herbert Schwarz</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Kontakt</h2>
            <p>
              IG Luzerner Herbstmesse und Märkte (IG LHMM)<br />
              Schachenstrasse 10<br />
              6020 Emmenbrücke
            </p>
            <p className="mt-3">
              E-Mail:{" "}
              <a href="mailto:sekretariat@weihnachtsmarktluzern.com" className="text-burgundy underline decoration-burgundy/30 hover:decoration-burgundy/60">
                sekretariat@weihnachtsmarktluzern.com
              </a>
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
