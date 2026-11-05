import Link from "next/link";
import Image from "next/image";

const BILDER = [
  { src: "/images/galerie-1.jpg", alt: "Engel-Dekoration am Wiehnachtsmärt" },
  { src: "/images/galerie-3.jpg", alt: "Geschenke und Dekoration am Märt" },
  { src: "/images/galerie-4.jpg", alt: "Engel-Statue am Märt" },
  { src: "/images/galerie-7.jpg", alt: "Rentier und Schlitten Dekoration" },
  { src: "/images/galerie-8.jpg", alt: "Franziskanerplatz mit beleuchtetem Brunnen" },
  { src: "/images/galerie-12.jpg", alt: "Markt-Panorama mit Banner" },
  { src: "/images/galerie-2.jpg", alt: "Aufbau am Märt" },
  { src: "/images/galerie-5.jpg", alt: "Abendstimmung am Märt" },
  { src: "/images/galerie-6.jpg", alt: "Engel über dem Märt bei Nacht" },
  { src: "/images/galerie-9.jpg", alt: "Besucher am Märt bei Nacht" },
  { src: "/images/galerie-10.jpg", alt: "Glühwein und Stimmung" },
  { src: "/images/galerie-11.jpg", alt: "Marktstände bei Nacht" },
];

export default function Stimmungsbilder() {
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

      <main className="max-w-[1200px] mx-auto px-5 sm:px-10 py-20">
        <h1 className="font-display text-4xl sm:text-5xl text-foreground mb-4">Stimmungsbilder</h1>
        <p className="text-muted text-base mb-12">Eindrücke vom Lozärner Wiehnachtsmärt</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {BILDER.map((bild) => (
            <div key={bild.src} className="gallery-item relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src={bild.src}
                alt={bild.alt}
                fill
                className="object-cover"
              />
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
