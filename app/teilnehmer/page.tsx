import Link from "next/link";

const TEILNEHMER = [
  { nr: "", name: "IG LHMM / Weihnachtskarussell", ort: "6003 Luzern", angebot: "Weihnachtskarussell" },
  { nr: "1/2", name: "Pamis – Peyman Mazloomi", ort: "4513 Langendorf", angebot: "Hüte, Hemden, Handschuhe" },
  { nr: "3/4", name: "Gewürzegge – Ives Waltzer", ort: "4147 Aesch", angebot: "Gewürze, Tee, Saucen, Zubehör", web: "www.gwürzegge.ch" },
  { nr: "5/6", name: "Confiserie Haegeli – Lukas Haegeli", ort: "6032 Emmen", angebot: "Confiserie, Weihnachtsgebäck", web: "www.haegeli.ch" },
  { nr: "7", name: "Wettengl Neuheitenvertrieb", ort: "8154 Oberglatt", angebot: "Memoryfoam Duftkopfkissen" },
  { nr: "8/9", name: "Shandan – Andrea Bachmann", ort: "6004 Luzern", angebot: "Silber- vergoldeter Schmuck, Schwemmholzengel", web: "www.shandan.ch" },
  { nr: "10", name: "Sheherazad", ort: "8047 Zürich", angebot: "Silberschmuck" },
  { nr: "12/13", name: "Dreams & Fantasy GmbH", ort: "8610 Uster", angebot: "Laternen, Holzbretter, Tassen", web: "www.dreamsandfantasy.ch" },
  { nr: "14/15", name: "Roger's Welt der Engel – Roger Dreyer", ort: "6102 Malters", angebot: "Engel aller Art", web: "www.toptime.ch" },
  { nr: "16", name: "Exclusiv Wollbetten – Manuela Bushaj", ort: "6010 Kriens", angebot: "Decken, Auflagen, Schaf- und Lammfelle, Kissen, Finken", web: "www.wollbetten.ch" },
  { nr: "17", name: "Candleclub.ch – Dominique Berweger", ort: "6005 Luzern", angebot: "Handgegossene Kerzen", web: "www.candleclub.ch" },
  { nr: "18/19", name: "Sutis GmbH – Tommy Suter", ort: "6006 Luzern", angebot: "Risotto, heisse und kalte Getränke" },
  { nr: "20", name: "Starfood AG – Sandi Zupan", ort: "6023 Rothenburg", angebot: "Crèperie, Glühwein" },
  { nr: "21", name: "Howald AG – Michèle Howald", ort: "8045 Zürich", angebot: "Grillwürste, Glühwein" },
  { nr: "22", name: "Karl Koch", ort: "6032 Emmen", angebot: "Lachs, Apfelküchli, Glühwein" },
  { nr: "23/24", name: "IG LHMM Unterstand", ort: "6003 Luzern", angebot: "Unterstand" },
  { nr: "25/26", name: "Valis Churros-Hütte – Valentin Leuthard", ort: "5608 Stetten", angebot: "Churros, heisse und kalte Getränke" },
  { nr: "27", name: "IG LHMM Unterstand", ort: "6003 Luzern", angebot: "Unterstand" },
  { nr: "28/29", name: "Marktverband Zentralschweiz", ort: "6354 Vitznau", angebot: "Raclette, Getränke" },
  { nr: "30/31", name: "Momo Design – Mounir Zeriouhi", ort: "8047 Zürich", angebot: "Karussell- und Porzellanlampen" },
  { nr: "32", name: "Silvia Stampfli", ort: "4542 Luterbach", angebot: "Glasdekoketten, Engel, Bilder, Armbänder" },
  { nr: "33/34", name: "Khaled Madi", ort: "8635 Dürnten", angebot: "Lederwaren, Gürtel, Taschen" },
  { nr: "35", name: "Perlkönig GmbH", ort: "D-55234 Erbes-Büdesheim", angebot: "Perlen, Schmuck und Zubehör" },
  { nr: "36/37", name: "Khaled Madi", ort: "8635 Dürnten", angebot: "Hüte, Winterartikel" },
  { nr: "38", name: "THECS Partner AG", ort: "9100 Herisau", angebot: "Alltags- und Reisebeutel «das Wandelwunder»" },
  { nr: "39", name: "emil-handwerk.ch", ort: "6003 Luzern", angebot: "Produkte aus Restholz", web: "www.emil-handwerk.ch" },
  { nr: "40", name: "Bali Accessoires – Daniela Möhl", ort: "8103 Unterengstringen", angebot: "Schmuck, Weihnachtsdeko" },
  { nr: "41/42", name: "Gusto Siciliano – Edoardo Lo Verde", ort: "6710 Biasca", angebot: "Sizilianische Spezialitäten" },
  { nr: "43", name: "Bite of Paradise", ort: "3380 Wangen a.A.", angebot: "Macarons, Pralinen" },
  { nr: "44", name: "Tüechli Hus", ort: "4623 Neuendorf", angebot: "Tischtücher, Servietten" },
  { nr: "45", name: "IG LHMM Unterstand", ort: "6003 Luzern", angebot: "Unterstand" },
  { nr: "46/47", name: "Duftschloss AG – P. Nüesch", ort: "9514 Wuppenau", angebot: "Düfte, Ätherische Öle", web: "www.duftschloss.ch" },
  { nr: "48/49", name: "KBJ GmbH – Andreas Krause", ort: "6018 Buttisholz", angebot: "Met-Honigweine, Fruchtweine" },
  { nr: "50", name: "Sonam Paldon", ort: "5600 Lenzburg", angebot: "Momos" },
  { nr: "51", name: "Knusperhäuschen – Tim Tiedemann", ort: "D-88410 Bad Wurzach", angebot: "Holzofenbäckerei, Schwäb. Flammkuchen" },
  { nr: "52", name: "Obwaldner Alpkäse – Erwin Spichtig", ort: "6072 Sachseln", angebot: "Alpkäse, Fondue, Eiercognac" },
  { nr: "53", name: "Etienn's Bünderspezialitäten – Etienne Dermon", ort: "7206 Igis", angebot: "Bündner Spezialitäten", web: "www.etisbuendnershop.ch" },
  { nr: "54", name: "Puralpina AG", ort: "3714 Frutigen", angebot: "Murmelisalbe, kosmetische Naturprodukte", web: "www.puralpina.ch" },
  { nr: "55", name: "Midobodoboka – Sniezana Cocchiarella", ort: "6010 Kriens", angebot: "Bast, Tischsets, Strickmode, Fotos" },
  { nr: "56/57", name: "Carlos Marron Arela", ort: "4800 Zofingen", angebot: "Piercingschmuck, Produkte aus Südamerika" },
  { nr: "58", name: "aepll consulting gmbh", ort: "5627 Besenbüren", angebot: "Krippen, Teelichter, Spiele, Besteck", web: "www.la-mia.ch" },
  { nr: "59", name: "Nahrin AG", ort: "6060 Sarnen", angebot: "Nahrin Produkte", web: "www.nahrin.ch" },
  { nr: "60/61", name: "Asi Design Ambühl & Co. – Sepp Ambühl", ort: "6206 Neuenkirch", angebot: "Silber- und vergoldeter Schmuck, Edelsteinschmuck und Wintersaccessoires", web: "www.schmuckmitstil.ch" },
  { nr: "62", name: "WoodBold", ort: "6203 Sempach Station", angebot: "Produkte aus Holz", web: "www.woodbold.ch" },
  { nr: "63", name: "Daniel Kolar", ort: "6052 Hergiswil", angebot: "Socken aller Art, Bambus-, Woll-, Knie-, Militärsocken", web: "www.kolarsocken.com" },
  { nr: "64/65", name: "Tête de Choco – Marieta Marte", ort: "2854 Bassecourt", angebot: "Schokoküsse in verschiedenen Variationen" },
];

export default function Teilnehmer() {
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
        <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-4">Teilnehmer-Liste</h1>
        <p className="text-muted text-base mb-12">Lozärner Wiehnachtsmärt 2026 — Rund 65 Marktstände</p>

        <div className="space-y-3">
          {TEILNEHMER.map((t) => (
            <div key={t.nr} className="flex items-baseline gap-4 py-3 border-b border-foreground/8">
              <span className="text-burgundy font-display font-bold text-sm w-12 shrink-0">{t.nr}</span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-foreground/80 text-sm sm:text-base">{t.name}</p>
                <p className="text-foreground/40 text-xs sm:text-sm">{t.angebot}</p>
                {t.web && (
                  <a href={`https://${t.web}`} target="_blank" rel="noopener noreferrer" className="text-burgundy text-xs underline decoration-burgundy/30 hover:decoration-burgundy/60">{t.web}</a>
                )}
              </div>
              <span className="text-foreground/30 text-xs shrink-0 hidden sm:block">{t.ort}</span>
            </div>
          ))}
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
