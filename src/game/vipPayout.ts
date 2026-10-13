import type { VipCharacter } from "../types";
import { FLOOR_ROWS } from "../data/floorGrid";

function randBetween(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

export function isVipEligible(vip: VipCharacter, clearedZoneSet: Set<string>): boolean {
  return vip.requiresZones.every((z) => clearedZoneSet.has(z));
}

// Tip payout, with each VIP's quirk from the roster implemented:
// - Lyric Bolt tips from the upper half of her range once the whole dance
//   floor is built, lower half otherwise.
// - Trey Diamonte gets +75 tip per VIP booth that's been built.
// - Chaz Marbella and everyone else just uses their full (wide, for Chaz)
//   tip range as-is.
export function computeVipPayout(vip: VipCharacter, clearedItemIds: Set<string>) {
  let tip: number;

  if (vip.id === "lyric-bolt") {
    const floorDone = Array.from({ length: FLOOR_ROWS }, (_, r) => `floor-row-${r}`).every((id) =>
      clearedItemIds.has(id),
    );
    const mid = Math.round((vip.tipMin + vip.tipMax) / 2);
    tip = floorDone ? randBetween(mid, vip.tipMax) : randBetween(vip.tipMin, mid);
  } else {
    tip = randBetween(vip.tipMin, vip.tipMax);
  }

  if (vip.id === "trey-diamonte") {
    const boothsCleared = ["vip-booth-l", "vip-booth-r"].filter((id) => clearedItemIds.has(id)).length;
    tip += boothsCleared * 75;
  }

  const coins = Math.round(tip * 0.6);
  return { coins, tips: tip };
}
