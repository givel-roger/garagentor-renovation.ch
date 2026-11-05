import Link from "next/link";

export default function DatumUndZeit() {
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
        <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-12">Datum und Zeit</h1>

        <div className="space-y-8 text-base text-foreground/60 leading-relaxed">
          <section className="bg-burgundy/8 border border-burgundy/20 rounded-xl p-6 sm:p-8">
            <p className="font-display font-bold text-2xl sm:text-3xl text-burgundy mb-6">
              3. bis 21. Dezember 2026
            </p>
            <div className="space-y-3 text-base">
              <div className="flex justify-between items-baseline">
                <span className="text-foreground/70 font-semibold">Marktstände</span>
                <span className="text-foreground/80">11.00 – 20.00 Uhr</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-foreground/70 font-semibold">Foodstände</span>
                <span className="text-foreground/80">11.00 – 21.00 Uhr</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-foreground/70 font-semibold">Schlusstag</span>
                <span className="text-foreground/80">bis 19.00 Uhr</span>
              </div>
            </div>
          </section>

          <section className="bg-foreground/[0.03] border border-foreground/10 rounded-xl p-6 sm:p-8">
            <p className="text-sm text-burgundy font-semibold mb-2">Auszeichnung</p>
            <p className="text-foreground/60">
              Wir sind erfreut, zu den <strong className="text-foreground/80">10 schönsten Weihnachtsmärkten Europas</strong> zu
              gehören. Der Markt auf dem Luzerner Franziskanerplatz wurde vom Magazin «Time Out» als einer
              der schönsten Europas ausgezeichnet – dank Stimmung, Glühwein und Handwerkskunst.
            </p>
            <p className="mt-3">
              <a href="https://www.20min.ch/story/das-sind-die-schoensten-weihnachtsmaerkte-europas-103438353" target="_blank" rel="noopener noreferrer" className="text-burgundy underline decoration-burgundy/30 hover:decoration-burgundy/60">
                Hier gelangen Sie zum Artikel
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-foreground mb-3">
              Der «Lozärner Wiehnachtsmärt» auf dem Franziskanerplatz
            </h2>
            <p>
              Im Advent verwandelt sich der Franziskanerplatz wieder in eine kleine Stadt aus bunten
              Holzhäuschen. Im Herzen der Klein-Altstadt, doch etwas abseits der hektischen und lauten
              Einkaufsmeile, verbreitet der Weihnachtsmarkt eine einmalige besinnliche Stimmung. In rund
              70 heimeligen Marktständen wartet ein vielfältiges Angebot von speziellen Geschenkartikeln
              auf die Käuferschaft.
            </p>
            <p className="mt-3">
              Das Reisemagazin Time Out zählt ihn zu den zehn schönsten Weihnachtsmärkten Europas –
              gewürdigt für seine stimmungsvolle Atmosphäre, die liebevolle Handwerkskunst und den
              typischen Luzerner Glühwein, der in der beliebten Sammeltasse ausgeschenkt wird.
            </p>
            <p className="mt-3">
              Im Zentrum des Weihnachtsmarktes, sozusagen als sein Markenzeichen, leuchtet auf dem
              Franziskanerbrunnen mit mehr als drei Metern Durchmesser der grösste Adventskranz der
              Zentralschweiz, geschmückt mit Hunderten von Lichtern und Kugeln sowie vier meterhohen Kerzen.
            </p>
            <p className="mt-3">
              Rundherum duftet es würzig nach Punsch und Glühwein. Die Ambiance lädt zum Verweilen und
              Geniessen ein. Die traditionelle Glühweintasse dürfte auch dieses Jahr wieder zum begehrten
              Sammelobjekt werden.
            </p>
            <p className="mt-3">
              Während die Erwachsenen das breite kulinarische Angebot geniessen, können die Kleinen ein
              paar Runden auf dem Weihnachtskarussell drehen.
            </p>
            <p className="mt-3">
              Die Pfarrei St. Maria zu Franziskanern wartet in der historischen Franziskanerkirche mit
              einer ganzen Palette von Anlässen zum Advent auf, von der Eucharistiefeier über
              Adventskonzerte bis zum byzantinischen Gottesdienst am 4. Adventssonntag. Neu finden auch
              jeweils am Samstag und Sonntag um 13.15 bis 13.45 Orgelkonzerte in der Kirche statt.
            </p>
            <p className="mt-3">
              Der «Lozärner Wiehnachtsmärt» auf dem Franziskanerplatz bietet Gross und Klein ein
              unvergessliches vorweihnächtliches Erlebnis, das sich niemand entgehen lassen sollte.
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
