import type { MetadataRoute } from "next";

const SEITEN = [
  { pfad: "", prioritaet: 1, wechsel: "weekly" as const },
  { pfad: "/rahmenprogramm", prioritaet: 0.9, wechsel: "weekly" as const },
  { pfad: "/teilnehmer", prioritaet: 0.9, wechsel: "weekly" as const },
  { pfad: "/standplan", prioritaet: 0.8, wechsel: "monthly" as const },
  { pfad: "/datum-und-zeit", prioritaet: 0.8, wechsel: "monthly" as const },
  { pfad: "/anmeldung", prioritaet: 0.8, wechsel: "monthly" as const },
  { pfad: "/haeuschenmasse", prioritaet: 0.7, wechsel: "monthly" as const },
  { pfad: "/weihnachtstassen", prioritaet: 0.7, wechsel: "monthly" as const },
  { pfad: "/stimmungsbilder", prioritaet: 0.6, wechsel: "monthly" as const },
  { pfad: "/organisation", prioritaet: 0.6, wechsel: "yearly" as const },
  { pfad: "/kontakt", prioritaet: 0.6, wechsel: "yearly" as const },
  { pfad: "/impressum", prioritaet: 0.3, wechsel: "yearly" as const },
  { pfad: "/datenschutz", prioritaet: 0.3, wechsel: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const basis = "https://www.weihnachtsmarkt-luzern.com";
  const jetzt = new Date();
  return SEITEN.map(({ pfad, prioritaet, wechsel }) => ({
    url: `${basis}${pfad}`,
    lastModified: jetzt,
    changeFrequency: wechsel,
    priority: prioritaet,
  }));
}
