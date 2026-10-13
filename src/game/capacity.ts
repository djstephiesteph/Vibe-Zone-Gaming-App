import { ALL_ITEMS } from "../data/items";

// How much headroom each kind of built item adds. Tuned so the dance floor
// (the biggest, cheapest-per-slot space) dominates capacity early, and VIP
// booths (expensive, exclusive) matter a lot per-seat but only show up
// late. Pure numbers — change these to retune the whole curve in one spot.
export const CAPACITY_PER_FLOOR_ROW = 10;
export const CAPACITY_PER_TABLE = 4;
export const CAPACITY_PER_CHAIR = 2;
export const CAPACITY_PER_BAR_STOOL = 3;
export const CAPACITY_PER_VIP_BOOTH = 6;

const FLOOR_ROW_IDS = Array.from({ length: 8 }, (_, r) => `floor-row-${r}`);
const CHAIR_IDS = ["seat-2", "seat-3", "seat-6", "seat-7"];
const BAR_STOOL_IDS = ["bar-stool1", "bar-stool2"];
const VIP_BOOTH_IDS = ["vip-booth-l", "vip-booth-r"];

function countBuilt(ids: string[], clearedItemIds: Set<string>): number {
  return ids.filter((id) => clearedItemIds.has(id)).length;
}

// Max simultaneous guests the club can hold, purely a function of what's
// been built — floor sections, dining tables, loose chairs, bar stools,
// VIP booths. No "capacity" field is ever stored; it's recomputed from
// clearedItemIds whenever it's needed.
export function computeCapacity(clearedItemIds: Set<string>): number {
  const tables = ALL_ITEMS.filter((i) => i.isTable && clearedItemIds.has(i.id)).length;
  return (
    countBuilt(FLOOR_ROW_IDS, clearedItemIds) * CAPACITY_PER_FLOOR_ROW +
    tables * CAPACITY_PER_TABLE +
    countBuilt(CHAIR_IDS, clearedItemIds) * CAPACITY_PER_CHAIR +
    countBuilt(BAR_STOOL_IDS, clearedItemIds) * CAPACITY_PER_BAR_STOOL +
    countBuilt(VIP_BOOTH_IDS, clearedItemIds) * CAPACITY_PER_VIP_BOOTH
  );
}
