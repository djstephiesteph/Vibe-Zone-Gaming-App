import type { LevelConfig } from "../types";

// Open-ended, replayable match-3 track — this is the only way the player
// earns Coins. Not tied to any specific club item. Difficulty climbs
// through index 50 and then plateaus at the hardest band (grid/kinds stay
// capped so the board never gets unreasonably large), while the score
// target keeps rising gently so later replays still take real skill to
// 3-star.
function bandFor(index: number) {
  const capped = Math.min(index, 50);
  if (capped <= 10) return { grid: 6, kinds: 3 };
  if (capped <= 20) return { grid: 6, kinds: 4 };
  if (capped <= 30) return { grid: 7, kinds: 4 };
  if (capped <= 40) return { grid: 7, kinds: 5 };
  return { grid: 8, kinds: 5 };
}

export function getLevelConfig(index: number): LevelConfig {
  const { grid, kinds } = bandFor(index);
  const targetScore = 400 + index * 45 + Math.floor(index / 5) * 60;
  const moveLimit = Math.max(14, 26 - Math.floor(Math.min(index, 60) / 6));
  return { gridSize: grid, noteKinds: kinds, targetScore, moveLimit };
}

// Flat coin reward by stars earned — simple and predictable, matches the
// payout table already agreed on.
export function coinsForStars(stars: 1 | 2 | 3): number {
  if (stars === 3) return 150;
  if (stars === 2) return 100;
  return 50;
}
