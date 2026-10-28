import type Database from "better-sqlite3";

// Haversine distance in km between two lat/lng points
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Swiss PLZ → approximate coordinates (central Switzerland focus)
// This is a simplified lookup; for production, a full PLZ database would be better
const PLZ_COORDS: Record<string, [number, number]> = {
  // Luzern region
  "6000": [47.0502, 8.3093], "6003": [47.0502, 8.3093], "6004": [47.0502, 8.3093],
  "6005": [47.0502, 8.3093], "6006": [47.0502, 8.3093], "6010": [47.0293, 8.2930],
  "6012": [47.0183, 8.3285], "6014": [47.0561, 8.3350], "6015": [47.0478, 8.3543],
  "6020": [47.0714, 8.3466], "6023": [47.0863, 8.3638], "6030": [47.0767, 8.3060],
  "6032": [47.0855, 8.2851], "6033": [47.0952, 8.2663], "6034": [47.0938, 8.2386],
  "6035": [47.0888, 8.2197], "6036": [47.0762, 8.2076],
  // Horw
  "6048": [47.0175, 8.3075],
  // Meggen
  "6045": [47.0456, 8.3767],
  // Stans / Nidwalden
  "6370": [46.9572, 8.3660], "6371": [46.9572, 8.3660],
  // Alpnach
  "6055": [46.9414, 8.2714],
  // Sarnen
  "6060": [46.8962, 8.2456],
  // Stansstad
  "6362": [46.9768, 8.3403],
  // Hergiswil
  "6052": [46.9875, 8.3100],
  // Dagmarsellen
  "6252": [47.2153, 7.9863],
  // Sursee
  "6210": [47.1711, 8.1089],
  // Emmenbrücke
  "6021": [47.0800, 8.3050],
  // Buochs
  "6374": [46.9700, 8.4200],
  // Ennetbürgen
  "6376": [46.9878, 8.4100],
  // Beckenried
  "6375": [46.9600, 8.4600],
  // Sempach
  "6204": [47.1333, 8.1897],
  // Willisau
  "6130": [47.1217, 7.9917],
  // Zug
  "6300": [47.1724, 8.5169], "6301": [47.1724, 8.5169],
  // Cham
  "6330": [47.1811, 8.4633],
  // Baar
  "6340": [47.1933, 8.5278],
  // Rotkreuz
  "6343": [47.1422, 8.4336],
  // Küssnacht
  "6403": [47.0856, 8.4386],
  // Schwyz
  "6430": [47.0208, 8.6533],
  // Zürich
  "8000": [47.3769, 8.5417], "8001": [47.3703, 8.5391], "8002": [47.3636, 8.5325],
  "8003": [47.3714, 8.5214], "8004": [47.3775, 8.5267], "8005": [47.3867, 8.5247],
  "8006": [47.3814, 8.5447], "8008": [47.3547, 8.5472], "8032": [47.3700, 8.5600],
  "8037": [47.3900, 8.5350], "8038": [47.3464, 8.5289], "8041": [47.3436, 8.5186],
  "8044": [47.3858, 8.5625], "8045": [47.3408, 8.5394], "8046": [47.4042, 8.5339],
  "8047": [47.3967, 8.4981], "8048": [47.3903, 8.4836], "8049": [47.4100, 8.4964],
  "8050": [47.4097, 8.5503], "8051": [47.3997, 8.5572], "8052": [47.4125, 8.5400],
  "8053": [47.3578, 8.5542], "8055": [47.3689, 8.5047], "8057": [47.3978, 8.5414],
  // Bern
  "3000": [46.9480, 7.4474], "3001": [46.9480, 7.4474],
  // Basel
  "4000": [47.5596, 7.5886], "4001": [47.5596, 7.5886],
  // Oberwil-Lieli
  "8966": [47.3600, 8.3800],
};

export function getPlzCoords(plz: string): [number, number] | null {
  return PLZ_COORDS[plz] || null;
}

export function assignLeadToPartner(db: Database.Database, leadPlz: string): number | null {
  const leadCoords = getPlzCoords(leadPlz);
  if (!leadCoords) return null;

  const partners = db.prepare(
    "SELECT id, lat, lng, radius_km FROM partners WHERE active = 1 AND lat IS NOT NULL AND lng IS NOT NULL"
  ).all() as { id: number; lat: number; lng: number; radius_km: number }[];

  let bestPartner: number | null = null;
  let bestDistance = Infinity;

  for (const p of partners) {
    const dist = haversineKm(leadCoords[0], leadCoords[1], p.lat, p.lng);
    if (dist <= p.radius_km && dist < bestDistance) {
      bestDistance = dist;
      bestPartner = p.id;
    }
  }

  return bestPartner;
}
