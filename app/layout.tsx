import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lozärner Wiehnachtsmärt 2026 – Franziskanerplatz Luzern",
    template: "%s | Lozärner Wiehnachtsmärt",
  },
  description:
    "Der Lozärner Wiehnachtsmärt auf dem Franziskanerplatz – vom 3. bis 21. Dezember 2026. Rund 70 Marktstände, Glühwein, Handwerkskunst und festliche Stimmung im Herzen von Luzern.",
  keywords: [
    "weihnachtsmarkt luzern",
    "lozärner wiehnachtsmärt",
    "franziskanerplatz",
    "weihnachtsmarkt 2026",
    "adventsmarkt luzern",
    "christkindlmarkt luzern",
    "glühwein luzern",
  ],
  authors: [{ name: "IG Luzerner Herbstmesse und Märkte" }],
  metadataBase: new URL("https://www.weihnachtsmarkt-luzern.com"),
  openGraph: {
    type: "website",
    locale: "de_CH",
    url: "https://www.weihnachtsmarkt-luzern.com",
    siteName: "Lozärner Wiehnachtsmärt",
    title: "Lozärner Wiehnachtsmärt 2026 – Franziskanerplatz Luzern",
    description:
      "Vom 3. bis 21. Dezember 2026 auf dem Franziskanerplatz. 70 Marktstände, Glühwein, Handwerkskunst und festliche Stimmung.",
    images: [
      {
        url: "/images/galerie-6.jpg",
        width: 1200,
        height: 630,
        alt: "Lozärner Wiehnachtsmärt bei Nacht",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              name: "Lozärner Wiehnachtsmärt 2026",
              description:
                "Weihnachtsmarkt auf dem Franziskanerplatz in Luzern mit rund 70 Marktständen, Glühwein, Handwerkskunst und festlicher Stimmung.",
              url: "https://www.weihnachtsmarkt-luzern.com",
              startDate: "2026-12-03",
              endDate: "2026-12-21",
              eventAttendanceMode:
                "https://schema.org/OfflineEventAttendanceMode",
              eventStatus: "https://schema.org/EventScheduled",
              location: {
                "@type": "Place",
                name: "Franziskanerplatz",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "Franziskanerplatz",
                  addressLocality: "Luzern",
                  postalCode: "6003",
                  addressCountry: "CH",
                },
              },
              organizer: {
                "@type": "Organization",
                name: "IG Luzerner Herbstmesse und Märkte",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
