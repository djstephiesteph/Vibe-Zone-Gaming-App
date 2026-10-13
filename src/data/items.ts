import type { ClubItem } from "../types";
import { CLUB_ITEMS } from "./clubItems";
import { FLOOR_ROW_ITEMS } from "./floorGrid";
import { ZONES } from "./zones";

export const ALL_ITEMS: ClubItem[] = [...CLUB_ITEMS, ...FLOOR_ROW_ITEMS];

export function itemsForZone(zoneName: string): ClubItem[] {
  return ALL_ITEMS.filter((i) => i.zone === zoneName);
}

// The active zone is the first zone (in ZONES order) with an uncleared
// item. Everything in it is buyable in any order; everything after stays
// locked/cluttered.
export function getActiveZone(clearedItemIds: Set<string>): string | null {
  for (const zone of ZONES) {
    if (itemsForZone(zone.name).some((i) => !clearedItemIds.has(i.id))) return zone.name;
  }
  return null;
}

export function isZoneCleared(zoneName: string, clearedItemIds: Set<string>): boolean {
  return itemsForZone(zoneName).every((i) => clearedItemIds.has(i.id));
}
