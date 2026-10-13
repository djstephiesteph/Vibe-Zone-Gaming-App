// Core domain types for Vibe Zone.

export interface LevelConfig {
  gridSize: number;
  noteKinds: number;
  targetScore: number;
  moveLimit: number;
}

// Club items are bought with Coins, not tied to a specific match-3 level —
// Coins come from an open-ended, replayable level track (src/data/levels.ts).
export interface ClubItem {
  id: string;
  zone: string;              // must match a Zone.name
  price: number;              // coin cost to clear
  emoji: string;               // the restored piece, shown once cleared
  clutterEmoji: string;        // the junk shown in its place before clearing
  x: number;                   // percent position in the room scene
  y: number;
  size: number;
  label: string;
  kind: "furniture" | "staff" | "floorRow";
  floorRow?: number;           // only set when kind === "floorRow"
  isStall?: boolean;            // a bathroom stall — has live clean/dirty state once bought
  stallGender?: "women" | "men";
  isTable?: boolean;             // a seating table — a valid food-delivery target
}

export interface RestroomStallState {
  id: string;
  gender: "women" | "men";
  clean: boolean;
}

export interface KitchenOrder {
  tableId: string;
  createdAt: number;
  ready: boolean;
}

export interface Zone {
  name: string;
  order: number;
}

export type ThemeAvailability = "playable" | "coming_soon";
export type MusicMood = "steady" | "hype" | "chill";

export type GuestState =
  | "ARRIVING"
  | "QUEUED"
  | "ENTERING"
  | "DANCING"
  | "ORDERING"
  | "SERVED"
  | "LEAVING";

export interface ClubGuest {
  id: string;
  look: string;
  state: GuestState;
  mood: "happy" | "neutral" | "impatient";
  progress: number;
  rewardGranted: boolean;
}

export interface ClubEvent {
  id: string;
  type: "vip-rush" | "birthday-crew" | "service-glitch";
  title: string;
  detail: string;
  startedAt: number;
  durationMs: number;
}

// --- VIPs ---
export type OrderSource = "bar" | "kitchen" | "both";

export interface VipCharacter {
  id: string;
  name: string;
  archetype: string;
  emoji: string;
  ordersFrom: OrderSource;
  tipMin: number;
  tipMax: number;
  quirk: string;
  requiresZones: string[]; // every one of these zones must be fully cleared before this VIP can spawn
}

export interface VipVisit {
  vipId: string;
  phase: "visiting" | "ready";
  startedAt: number;
}

export interface GameProgress {
  clubName: string;
  isOpen: boolean;          // patrons/VIPs/orders only happen while open
  selectedThemeId: string | null;
  unlockedThemeIds: string[];
  themeSwitchUnlocked: boolean;
  coins: number;
  tips: number;
  reputation: number;
  totalCoinsEarned: number;
  totalGuestsServed: number;
  totalUpgradesBought: number;
  totalEventsHandled: number;
  clearedItemIds: string[];
  nextLevelIndex: number;  // which level of the open-ended track plays next
  totalStars: number;
  bestVibeStreak: number;
  vipsCollected: number;
  miniGameLevels: Partial<Record<MiniGameId, number>>; // next unlocked level per mini-game
}

export type MiniGameId = "beat" | "mixer" | "lights";
