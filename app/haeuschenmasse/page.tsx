import Link from "next/link";

export default function Haeuschenmasse() {
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
        <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-4">Häuschenmasse</h1>
        <p className="text-muted text-base mb-12">
          Masse und Ansicht der Markthäuschen
        </p>

        <div className="space-y-10">
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Standmasse</h2>
            <img src="/images/standmasse.jpg" alt="Standmasse – technische Zeichnung" className="w-full h-auto rounded-lg" />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Einfaches Häuschen</h2>
            <img src="/images/einfaches-haus.jpg" alt="Einfaches Häuschen – technische Zeichnung" className="w-full h-auto rounded-lg" />
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">Doppelhäuschen</h2>
            <img src="/images/doppelhaus.jpg" alt="Doppelhäuschen – technische Zeichnung" className="w-full h-auto rounded-lg" />
          </section>

          <section className="pt-4 border-t border-foreground/10">
            <p className="text-foreground/40 text-sm">
              Für Fragen zu den Häuschenmassen oder zur Infrastruktur kontaktieren Sie bitte unser{" "}
              <Link href="/kontakt" className="text-burgundy underline decoration-burgundy/30 hover:decoration-burgundy/60">
                Sekretariat
              </Link>
              .
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
