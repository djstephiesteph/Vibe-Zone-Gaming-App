import type { ClubItem } from "../types";

// Every discrete (non-floor-grid) item in the club, with its coin price.
// Positions (x/y) are now LOCAL to that item's own zone/room (0-100, y=0
// back wall, y=100 front) — each zone renders as its own dedicated
// RoomStage now, not a shared slice of one flat scene, so there's room to
// lay items out generously instead of cramming everything in.
export const CLUB_ITEMS: ClubItem[] = [
  // --- Entrance
  { id: "ent-door", zone: "Entrance", price: 90, emoji: "🚪", clutterEmoji: "🪵", x: 50, y: 78, size: 46, label: "Front door", kind: "furniture" },
  { id: "ent-sign", zone: "Entrance", price: 130, emoji: "🔆", clutterEmoji: "⚫", x: 50, y: 22, size: 24, label: "Open sign", kind: "furniture" },
  { id: "ent-rope", zone: "Entrance", price: 110, emoji: "🔗", clutterEmoji: "🕸️", x: 28, y: 85, size: 22, label: "Entry rope", kind: "furniture" },
  { id: "ent-cashbox", zone: "Entrance", price: 80, emoji: "💵", clutterEmoji: "🫙", x: 70, y: 85, size: 18, label: "Cash box", kind: "furniture" },
  { id: "ent-host", zone: "Entrance", price: 150, emoji: "🧍", clutterEmoji: "📦", x: 24, y: 58, size: 30, label: "Hire a door host", kind: "staff" },
  { id: "ent-security", zone: "Entrance", price: 170, emoji: "👮", clutterEmoji: "🚧", x: 76, y: 58, size: 32, label: "Hire a security guard", kind: "staff" },

  // Dance Floor tasks live in floorGrid.ts (the grid itself)

  // --- Seating
  { id: "seat-1", zone: "Seating", price: 130, emoji: "🍽️", clutterEmoji: "📦", x: 25, y: 32, size: 26, label: "Table", kind: "furniture", isTable: true },
  { id: "seat-2", zone: "Seating", price: 125, emoji: "🪑", clutterEmoji: "🗑️", x: 16, y: 42, size: 20, label: "Chair", kind: "furniture" },
  { id: "seat-3", zone: "Seating", price: 140, emoji: "🪑", clutterEmoji: "🧻", x: 34, y: 42, size: 20, label: "Chair", kind: "furniture" },
  { id: "seat-4", zone: "Seating", price: 150, emoji: "🍽️", clutterEmoji: "🪵", x: 25, y: 58, size: 26, label: "Table", kind: "furniture", isTable: true },
  { id: "seat-5", zone: "Seating", price: 135, emoji: "🍽️", clutterEmoji: "📰", x: 75, y: 32, size: 26, label: "Table", kind: "furniture", isTable: true },
  { id: "seat-6", zone: "Seating", price: 145, emoji: "🪑", clutterEmoji: "🥫", x: 66, y: 42, size: 20, label: "Chair", kind: "furniture" },
  { id: "seat-7", zone: "Seating", price: 155, emoji: "🪑", clutterEmoji: "🍂", x: 84, y: 42, size: 20, label: "Chair", kind: "furniture" },
  { id: "seat-8", zone: "Seating", price: 200, emoji: "🍽️", clutterEmoji: "🪨", x: 75, y: 58, size: 26, label: "Table", kind: "furniture", isTable: true },
  { id: "seat-waiter", zone: "Seating", price: 220, emoji: "🤵", clutterEmoji: "🧻", x: 50, y: 80, size: 30, label: "Hire a waiter (auto-delivers kitchen orders)", kind: "staff" },

  // --- Bathrooms: women's stalls left column, men's right column, sink +
  // mirror along the back wall, attendant front-center
  { id: "bath-w1", zone: "Bathrooms", price: 150, emoji: "🚽", clutterEmoji: "📦", x: 20, y: 32, size: 24, label: "Women's stall 1", kind: "furniture", isStall: true, stallGender: "women" },
  { id: "bath-w2", zone: "Bathrooms", price: 160, emoji: "🚽", clutterEmoji: "🗑️", x: 20, y: 52, size: 24, label: "Women's stall 2", kind: "furniture", isStall: true, stallGender: "women" },
  { id: "bath-w3", zone: "Bathrooms", price: 170, emoji: "🚽", clutterEmoji: "🧻", x: 20, y: 72, size: 24, label: "Women's stall 3", kind: "furniture", isStall: true, stallGender: "women" },
  { id: "bath-m1", zone: "Bathrooms", price: 150, emoji: "🚽", clutterEmoji: "📰", x: 80, y: 32, size: 24, label: "Men's stall 1", kind: "furniture", isStall: true, stallGender: "men" },
  { id: "bath-m2", zone: "Bathrooms", price: 160, emoji: "🚽", clutterEmoji: "🥫", x: 80, y: 52, size: 24, label: "Men's stall 2", kind: "furniture", isStall: true, stallGender: "men" },
  { id: "bath-m3", zone: "Bathrooms", price: 170, emoji: "🚽", clutterEmoji: "🪨", x: 80, y: 72, size: 24, label: "Men's stall 3", kind: "furniture", isStall: true, stallGender: "men" },
  { id: "bath-sink", zone: "Bathrooms", price: 180, emoji: "🚰", clutterEmoji: "🪣", x: 38, y: 86, size: 22, label: "Sink", kind: "furniture" },
  { id: "bath-mirror", zone: "Bathrooms", price: 170, emoji: "🪞", clutterEmoji: "🕸️", x: 62, y: 86, size: 22, label: "Mirror", kind: "furniture" },
  { id: "bath-attendant", zone: "Bathrooms", price: 260, emoji: "🧑‍🔧", clutterEmoji: "🪠", x: 50, y: 58, size: 28, label: "Hire a bathroom attendant", kind: "staff" },

  // --- Bar: counter dominates the back wall, bartender behind it, stools
  // out front
  { id: "bar-counter", zone: "Bar", price: 300, emoji: "▭", clutterEmoji: "🧱", x: 50, y: 50, size: 70, label: "Bar counter", kind: "furniture" },
  { id: "bar-bottles", zone: "Bar", price: 220, emoji: "🍾", clutterEmoji: "🕸️", x: 28, y: 28, size: 22, label: "Bottle rack", kind: "furniture" },
  { id: "bar-glass1", zone: "Bar", price: 200, emoji: "🍸", clutterEmoji: "🥤", x: 44, y: 32, size: 20, label: "Cocktail glass", kind: "furniture" },
  { id: "bar-glass2", zone: "Bar", price: 210, emoji: "🍹", clutterEmoji: "🫙", x: 56, y: 32, size: 20, label: "Cocktail glass", kind: "furniture" },
  { id: "bar-ice", zone: "Bar", price: 240, emoji: "🧊", clutterEmoji: "🪣", x: 72, y: 28, size: 18, label: "Ice bucket", kind: "furniture" },
  { id: "bar-stool1", zone: "Bar", price: 230, emoji: "🪑", clutterEmoji: "🪨", x: 32, y: 82, size: 24, label: "Bar stool", kind: "furniture" },
  { id: "bar-stool2", zone: "Bar", price: 235, emoji: "🪑", clutterEmoji: "📦", x: 68, y: 82, size: 24, label: "Bar stool", kind: "furniture" },
  { id: "bar-tender", zone: "Bar", price: 350, emoji: "🤵", clutterEmoji: "🕸️", x: 50, y: 20, size: 30, label: "Hire a bartender", kind: "staff" },

  // --- Kitchen: back wall is cooking gear, window up front where food
  // appears, chef at the back
  { id: "kit-stove", zone: "Kitchen", price: 300, emoji: "🍳", clutterEmoji: "🧱", x: 28, y: 32, size: 28, label: "Stove", kind: "furniture" },
  { id: "kit-prep", zone: "Kitchen", price: 250, emoji: "🔪", clutterEmoji: "📦", x: 50, y: 38, size: 22, label: "Prep counter", kind: "furniture" },
  { id: "kit-pantry", zone: "Kitchen", price: 260, emoji: "🥫", clutterEmoji: "🕸️", x: 72, y: 32, size: 20, label: "Pantry", kind: "furniture" },
  { id: "kit-window", zone: "Kitchen", price: 240, emoji: "🛎️", clutterEmoji: "🪵", x: 50, y: 70, size: 22, label: "Order window", kind: "furniture" },
  { id: "kit-chef", zone: "Kitchen", price: 380, emoji: "👨‍🍳", clutterEmoji: "🧻", x: 50, y: 18, size: 30, label: "Hire a chef", kind: "staff" },

  // --- DJ Booth: table dominates the back wall like the bar, stacks flank
  // the front
  { id: "dj-table", zone: "DJ Booth", price: 380, emoji: "▬", clutterEmoji: "🧱", x: 50, y: 50, size: 66, label: "DJ table", kind: "furniture" },
  { id: "dj-mixer", zone: "DJ Booth", price: 300, emoji: "🎛️", clutterEmoji: "🕸️", x: 38, y: 32, size: 24, label: "Mixer", kind: "furniture" },
  { id: "dj-headphones", zone: "DJ Booth", price: 260, emoji: "🎧", clutterEmoji: "📦", x: 62, y: 32, size: 20, label: "Headphones", kind: "furniture" },
  { id: "dj-vinyl", zone: "DJ Booth", price: 250, emoji: "💿", clutterEmoji: "🗑️", x: 24, y: 40, size: 18, label: "Vinyl", kind: "furniture" },
  { id: "dj-eq", zone: "DJ Booth", price: 270, emoji: "🎚️", clutterEmoji: "⚡", x: 76, y: 40, size: 18, label: "EQ panel", kind: "furniture" },
  { id: "dj-speaker1", zone: "DJ Booth", price: 310, emoji: "🔊", clutterEmoji: "🪨", x: 22, y: 78, size: 28, label: "Speaker stack", kind: "furniture" },
  { id: "dj-speaker2", zone: "DJ Booth", price: 320, emoji: "🔊", clutterEmoji: "🪨", x: 78, y: 78, size: 28, label: "Speaker stack", kind: "furniture" },
  { id: "dj-booth-dj", zone: "DJ Booth", price: 400, emoji: "🧑‍🎤", clutterEmoji: "🕸️", x: 50, y: 18, size: 30, label: "Hire a DJ", kind: "staff" },

  // --- Lighting: this room is a ceiling (tiltUp), items spread across it
  { id: "light-1", zone: "Lighting", price: 160, emoji: "💡", clutterEmoji: "⚫", x: 15, y: 30, size: 20, label: "Marquee bulb", kind: "furniture" },
  { id: "light-2", zone: "Lighting", price: 165, emoji: "💡", clutterEmoji: "🕸️", x: 35, y: 16, size: 20, label: "Marquee bulb", kind: "furniture" },
  { id: "light-3", zone: "Lighting", price: 170, emoji: "💡", clutterEmoji: "⚫", x: 65, y: 16, size: 20, label: "Marquee bulb", kind: "furniture" },
  { id: "light-4", zone: "Lighting", price: 175, emoji: "💡", clutterEmoji: "🕸️", x: 85, y: 30, size: 20, label: "Marquee bulb", kind: "furniture" },
  { id: "light-5", zone: "Lighting", price: 180, emoji: "💡", clutterEmoji: "⚫", x: 50, y: 10, size: 20, label: "Marquee bulb", kind: "furniture" },
  { id: "light-spot1", zone: "Lighting", price: 250, emoji: "🔴", clutterEmoji: "🕸️", x: 30, y: 55, size: 18, label: "Spotlight", kind: "furniture" },
  { id: "light-spot2", zone: "Lighting", price: 300, emoji: "🔵", clutterEmoji: "🕸️", x: 70, y: 55, size: 18, label: "Spotlight", kind: "furniture" },

  // --- VIP Lounge: two booths flanking, host front-center
  { id: "vip-booth-l", zone: "VIP Lounge", price: 400, emoji: "🛋️", clutterEmoji: "📦", x: 20, y: 42, size: 32, label: "VIP booth", kind: "furniture" },
  { id: "vip-candle", zone: "VIP Lounge", price: 350, emoji: "🕯️", clutterEmoji: "🫙", x: 30, y: 62, size: 18, label: "Table candle", kind: "furniture" },
  { id: "vip-booth-r", zone: "VIP Lounge", price: 420, emoji: "🛋️", clutterEmoji: "📦", x: 80, y: 42, size: 32, label: "VIP booth", kind: "furniture" },
  { id: "vip-plant", zone: "VIP Lounge", price: 380, emoji: "🌿", clutterEmoji: "🥀", x: 70, y: 62, size: 22, label: "Plant", kind: "furniture" },
  { id: "vip-host", zone: "VIP Lounge", price: 600, emoji: "💁", clutterEmoji: "🚧", x: 50, y: 25, size: 28, label: "Hire a VIP host", kind: "staff" },

  // --- Grand Reopening: one big centerpiece
  { id: "final-sign", zone: "Grand Reopening", price: 800, emoji: "🌟", clutterEmoji: "🪧", x: 50, y: 40, size: 70, label: "VIBE ZONE sign, lit", kind: "furniture" },
];
