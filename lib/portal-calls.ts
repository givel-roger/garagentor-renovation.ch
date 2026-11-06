// 3CX ist eine geteilte Anlage: Nur Anrufe auf die Portal-Nummer (044 442 99 90)
// laufen über die Gruppe 810. Andere Nummern (z.B. Stellenportale, Gruppe 811)
// und ausgehende Anrufe dürfen keine Garagentor-Leads werden.
export const PORTAL_DN = process.env.PORTAL_DN || "810";

export interface PortalCall {
  id: string;
  legs: any[];
}

export function findPortalCalls(calls: any[], portalDn: string = PORTAL_DN): PortalCall[] {
  const gruppen = new Map<string, any[]>();
  for (const call of calls) {
    const id = String(call.MainCallHistoryId ?? call.CallHistoryId ?? call.Id ?? "");
    if (!id) continue;
    gruppen.set(id, [...(gruppen.get(id) ?? []), call]);
  }
  return [...gruppen]
    .filter(([, legs]) => legs.some((leg) => String(leg.DestinationDn ?? "") === portalDn))
    .map(([id, legs]) => ({ id, legs }));
}
