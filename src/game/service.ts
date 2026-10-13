// Shared timing/tip rules for the restroom and kitchen service loops.
//
// "5 minutes" is treated as IN-GAME time, not 5 real minutes — nobody
// should sit on a phone screen for 5 real minutes waiting on a payout.
// GAME_MINUTE_MS is the one knob that controls the whole pace: at 6000ms
// per in-game minute, the "under 5 minutes" jackpot threshold is ~30
// real seconds. Tune this single constant to speed up or slow down both
// the restroom queue and kitchen delivery pacing together.
export const GAME_MINUTE_MS = 6000;

// Under 5 (in-game) minutes: guaranteed jackpot tip. Past that, tip steps
// down the longer the wait — smaller amounts for a worse wait, as asked.
export function tipForWait(waitMs: number): number {
  const minutes = waitMs / GAME_MINUTE_MS;
  if (minutes <= 5) return 100;
  if (minutes <= 10) return 20;
  if (minutes <= 15) return 15;
  if (minutes <= 20) return 10;
  return 5;
}

export function coinsForTip(tip: number): number {
  return Math.round(tip * 0.6);
}
