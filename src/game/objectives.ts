import { ZONES } from "../data/zones";

export interface ObjectiveSnapshot {
  id: string;
  label: string;
  progress: number;
  target: number;
  complete: boolean;
}

interface ObjectiveInput {
  totalUpgradesBought: number;
  totalGuestsServed: number;
  reputation: number;
  totalEventsHandled: number;
  vibeScore: number;
  clearedZones: Set<string>;
}

export function getActiveObjectives(input: ObjectiveInput): ObjectiveSnapshot[] {
  const vipUnlocked = input.clearedZones.has("VIP Lounge");
  const nextZone = ZONES.find((zone) => !input.clearedZones.has(zone.name));

  return [
    {
      id: "upgrade-push",
      label: `Buy 12 upgrades${nextZone ? ` (next: ${nextZone.name})` : ""}`,
      progress: input.totalUpgradesBought,
      target: 12,
      complete: input.totalUpgradesBought >= 12,
    },
    {
      id: "guest-service",
      label: "Serve 35 guests",
      progress: input.totalGuestsServed,
      target: 35,
      complete: input.totalGuestsServed >= 35,
    },
    {
      id: "vibe-or-vip",
      label: vipUnlocked ? "Resolve 4 surprise nights" : "Reach 220 reputation",
      progress: vipUnlocked ? input.totalEventsHandled : input.reputation,
      target: vipUnlocked ? 4 : 220,
      complete: vipUnlocked ? input.totalEventsHandled >= 4 : input.reputation >= 220,
    },
    {
      id: "crowd-energy",
      label: "Hold Vibe Meter at 70+",
      progress: Math.max(0, input.vibeScore - 69),
      target: 31,
      complete: input.vibeScore >= 70,
    },
  ].slice(0, 3);
}
