export const LEVEL_REPUTATION_THRESHOLDS = [0, 70, 180, 340, 560, 860, 1240, 1700];

export function getClubLevel(reputation: number): number {
  let level = 1;
  for (let i = 0; i < LEVEL_REPUTATION_THRESHOLDS.length; i += 1) {
    if (reputation >= LEVEL_REPUTATION_THRESHOLDS[i]) level = i + 1;
  }
  return level;
}

export function isThemeSwitchUnlocked(reputation: number, stars: number): boolean {
  return reputation >= 180 || stars >= 15;
}

export function clampToNonNegative(value: number): number {
  return Math.max(0, Math.round(value));
}
