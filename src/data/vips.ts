import type { VipCharacter } from "../types";

// Original archetype characters — not real people — so there's no
// publicity-rights risk. Each has a distinct order source and a quirk that
// affects their tip (see computeVipPayout in src/game/vipPayout.ts).
export const VIPS: VipCharacter[] = [
  {
    id: "nova-reigns",
    name: "Nova Reigns",
    archetype: "Global pop star",
    emoji: "🎤",
    ordersFrom: "bar",
    tipMin: 150,
    tipMax: 300,
    quirk: "Always requests the DJ play her song twice.",
    requiresZones: ["VIP Lounge"],
  },
  {
    id: "lyric-bolt",
    name: "Lyric Bolt",
    archetype: "Chart-topping rapper",
    emoji: "🎧",
    ordersFrom: "kitchen",
    tipMin: 100,
    tipMax: 250,
    quirk: "Tips bigger when the dance floor is packed.",
    requiresZones: ["VIP Lounge"],
  },
  {
    id: "chaz-marbella",
    name: "Chaz Marbella",
    archetype: "Reality-TV personality",
    emoji: "📸",
    ordersFrom: "both",
    tipMin: 50,
    tipMax: 400,
    quirk: "Tips are wildly unpredictable — stingy or huge, for the drama.",
    requiresZones: ["VIP Lounge"],
  },
  {
    id: "trey-diamonte",
    name: "Trey Diamonte",
    archetype: "Pro athlete, MVP energy",
    emoji: "🏆",
    ordersFrom: "kitchen",
    tipMin: 200,
    tipMax: 350,
    quirk: "Brings an entourage — tips more the more VIP booths you've built.",
    requiresZones: ["VIP Lounge"],
  },
  {
    id: "vivienne-cartier",
    name: "Vivienne Cartier",
    archetype: "Fashion mogul",
    emoji: "👜",
    ordersFrom: "bar",
    tipMin: 250,
    tipMax: 500,
    quirk: "Judges the ambiance first — only visits once the lighting is done.",
    requiresZones: ["VIP Lounge", "Lighting"],
  },
];
