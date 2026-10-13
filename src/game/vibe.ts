import type { MusicMood } from "../types";

export interface VibeFactors {
  occupancyRatio: number;
  queuePressure: number;
  serviceSatisfaction: number;
  musicMood: MusicMood;
  themeBias: number;
  eventModifier: number;
  operationsBonus: number;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

export function computeVibeScore(factors: VibeFactors): number {
  const occupancy = clamp01(factors.occupancyRatio);
  const queue = clamp01(factors.queuePressure);
  const satisfaction = clamp01(factors.serviceSatisfaction);

  const moodModifier = factors.musicMood === "hype" ? 7 : factors.musicMood === "chill" ? 4 : 5;
  const overcrowdingPenalty = occupancy > 0.92 ? (occupancy - 0.92) * 140 : 0;

  const raw =
    44 +
    factors.themeBias +
    moodModifier +
    factors.operationsBonus +
    factors.eventModifier +
    satisfaction * 24 +
    occupancy * 10 -
    queue * 20 -
    overcrowdingPenalty;

  return Math.max(0, Math.min(100, Math.round(raw)));
}
