// Handyfotos sind oft 3–8 MB. Der Webserver nimmt pro Anfrage max. 1 MB an,
// deshalb werden die Fotos im Browser verkleinert, bis alle zusammen darunter liegen.
export const UPLOAD_LIMIT_BYTES = 900_000;

const STUFEN = [
  { kante: 1600, qualitaet: 0.8 },
  { kante: 1280, qualitaet: 0.72 },
  { kante: 1024, qualitaet: 0.65 },
  { kante: 800, qualitaet: 0.6 },
  { kante: 640, qualitaet: 0.55 },
];

async function verkleinern(file: File, kante: number, qualitaet: number): Promise<File | null> {
  try {
    const bild = await createImageBitmap(file);
    const faktor = Math.min(1, kante / Math.max(bild.width, bild.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bild.width * faktor);
    canvas.height = Math.round(bild.height * faktor);
    canvas.getContext("2d")?.drawImage(bild, 0, 0, canvas.width, canvas.height);
    bild.close();
    const blob = await new Promise<Blob | null>((ok) => canvas.toBlob(ok, "image/jpeg", qualitaet));
    if (!blob) return null;
    const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return new File([blob], name, { type: "image/jpeg" });
  } catch {
    return null; // Format kann der Browser nicht lesen (z.B. HEIC in Chrome)
  }
}

export async function fotosFuerUpload(fotos: File[]): Promise<File[]> {
  if (fotos.length === 0) return [];
  let ergebnis = fotos;
  for (const { kante, qualitaet } of STUFEN) {
    ergebnis = await Promise.all(fotos.map(async (f) => (await verkleinern(f, kante, qualitaet)) ?? f));
    if (ergebnis.reduce((summe, f) => summe + f.size, 0) <= UPLOAD_LIMIT_BYTES) break;
  }
  return ergebnis;
}
