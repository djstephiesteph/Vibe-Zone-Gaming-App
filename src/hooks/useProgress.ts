import { useCallback, useEffect, useState } from "react";
import type { GameProgress, MiniGameId } from "../types";
import { coinsForStars } from "../data/levels";

// v4: added clubName + isOpen. Still not worth migrating from v3 — the
// shape only grew by two fields, but bumping the key keeps a v3 save (which
// has no clubName/isOpen) from loading with those fields silently
// `undefined`.
// v5: added miniGameLevels and 500 starting coins; v4 saves are migrated.
const STORAGE_KEY = "vibe-zone-progress-v5";
const LEGACY_KEY = "vibe-zone-progress-v4";
export const START_COINS = 500;

function freshProgress(): GameProgress {
  return {
    clubName: "Vibe Zone",
    isOpen: false,
    coins: START_COINS,
    tips: 0,
    clearedItemIds: [],
    nextLevelIndex: 1,
    totalStars: 0,
    vipsCollected: 0,
    miniGameLevels: {},
  };
}

function loadProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...freshProgress(), ...JSON.parse(raw) } as GameProgress;
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) return { ...freshProgress(), ...JSON.parse(legacy) } as GameProgress;
  } catch {
    // ignore corrupt storage, fall through to fresh state
  }
  return freshProgress();
}

export function useProgress() {
  const [progress, setProgress] = useState<GameProgress>(loadProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Called when a match-3 set is won — pays coins by stars and advances
  // the level track.
  const recordLevelWin = useCallback((stars: 1 | 2 | 3) => {
    setProgress((prev) => ({
      ...prev,
      coins: prev.coins + coinsForStars(stars),
      totalStars: prev.totalStars + stars,
      nextLevelIndex: prev.nextLevelIndex + 1,
    }));
  }, []);

  // Spends coins to instantly clear a club item, if affordable.
  const purchaseItem = useCallback((itemId: string, price: number) => {
    setProgress((prev) => {
      if (prev.clearedItemIds.includes(itemId) || prev.coins < price) return prev;
      return { ...prev, coins: prev.coins - price, clearedItemIds: [...prev.clearedItemIds, itemId] };
    });
  }, []);

  // Shared payout path for VIPs, the restroom system, and the kitchen —
  // all three are "someone was served, here's a tip" economically.
  // vipsCollected only increments when the payout came from an actual VIP.
  const addServiceTip = useCallback((coins: number, tips: number, isVip = false) => {
    setProgress((prev) => ({
      ...prev,
      coins: prev.coins + coins,
      tips: prev.tips + tips,
      vipsCollected: prev.vipsCollected + (isVip ? 1 : 0),
    }));
  }, []);

  const renameClub = useCallback((name: string) => {
    const trimmed = name.trim().slice(0, 24);
    if (!trimmed) return;
    setProgress((prev) => ({ ...prev, clubName: trimmed }));
  }, []);

  const setOpen = useCallback((open: boolean) => {
    setProgress((prev) => ({ ...prev, isOpen: open }));
  }, []);

  const recordMiniGameWin = useCallback((gameId: MiniGameId, level: number, stars: 1 | 2 | 3) => {
    setProgress((prev) => {
      const best = prev.miniGameLevels[gameId] ?? 1;
      return {
        ...prev,
        coins: prev.coins + coinsForStars(stars),
        totalStars: prev.totalStars + stars,
        miniGameLevels: { ...prev.miniGameLevels, [gameId]: Math.max(best, level + 1) },
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(freshProgress());
  }, []);

  return {
    progress, recordLevelWin, recordMiniGameWin, purchaseItem, addServiceTip, renameClub, setOpen, resetProgress,
  };
}
