import Link from "next/link";

export default function Datenschutz() {
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
        <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-12">Datenschutzerklärung</h1>

        <div className="space-y-8 text-base text-foreground/60 leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Verantwortliche Stelle</h2>
            <p>
              IG Luzerner Herbstmesse und Märkte (IG LHMM)<br />
              Franziskanerplatz<br />
              6003 Luzern<br />
              E-Mail:{" "}
              <a href="mailto:sekretariat@weihnachtsmarktluzern.com" className="text-burgundy underline decoration-burgundy/30 hover:decoration-burgundy/60">
                sekretariat@weihnachtsmarktluzern.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Erhebung und Verwendung von Daten</h2>
            <p>
              Wenn Sie unser Kontaktformular nutzen, erheben wir die von Ihnen angegebenen Daten
              (Name, E-Mail-Adresse, Nachricht). Diese Daten verwenden wir ausschliesslich zur
              Bearbeitung Ihrer Anfrage.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Rechtsgrundlage</h2>
            <p>
              Die Verarbeitung Ihrer Daten erfolgt auf Grundlage Ihrer Einwilligung
              (Art. 6 Abs. 1 lit. a DSGVO) sowie zur Durchführung vorvertraglicher Massnahmen
              (Art. 6 Abs. 1 lit. b DSGVO). In der Schweiz gilt zusätzlich das
              Bundesgesetz über den Datenschutz (DSG).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Speicherdauer</h2>
            <p>
              Ihre Daten werden nur so lange gespeichert, wie es für die Bearbeitung Ihrer
              Anfrage erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Weitergabe an Dritte</h2>
            <p>
              Ihre Daten werden nicht an Dritte weitergegeben, es sei denn, dies ist zur
              Vertragserfüllung erforderlich oder Sie haben ausdrücklich eingewilligt.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Ihre Rechte</h2>
            <p>
              Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung und
              Einschränkung der Verarbeitung Ihrer personenbezogenen Daten. Kontaktieren
              Sie uns dazu unter{" "}
              <a href="mailto:sekretariat@weihnachtsmarktluzern.com" className="text-burgundy underline decoration-burgundy/30 hover:decoration-burgundy/60">
                sekretariat@weihnachtsmarktluzern.com
              </a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">Cookies</h2>
            <p>
              Diese Website verwendet keine Tracking-Cookies und keine Analyse-Tools.
              Es werden nur technisch notwendige Cookies verwendet.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">SSL-Verschlüsselung</h2>
            <p>
              Diese Website nutzt aus Sicherheitsgründen eine SSL-Verschlüsselung.
              Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile
              des Browsers von «http://» auf «https://» wechselt.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-foreground/10 py-10">
        <div className="max-w-[1400px] mx-auto px-5 sm:px-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-foreground/20">
          <p>&copy; {new Date().getFullYear()} IG Luzerner Herbstmesse und Märkte</p>
          <div className="flex gap-6">
            <Link href="/impressum" className="hover:text-foreground/50 transition-colors">Impressum</Link>
            <Link href="/datenschutz" className="text-foreground/50">Datenschutz</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
