import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Garagentor-Renovation | Ihr Tor, wie neu",
  description:
    "Professionelle Garagentor-Renovation in der Schweiz. Günstig, schnell und sauber. Jetzt kostenlose Offerte anfordern.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
