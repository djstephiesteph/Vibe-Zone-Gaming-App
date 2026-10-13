import { useCallback, useEffect, useState } from "react";
import type { GameProgress, MiniGameId } from "../types";
import { coinsForStars } from "../data/levels";
import { STARTER_THEME_IDS } from "../data/themes";
import { clampToNonNegative, isThemeSwitchUnlocked } from "../game/progression";

// v4: added clubName + isOpen. Still not worth migrating from v3 — the
// shape only grew by two fields, but bumping the key keeps a v3 save (which
// has no clubName/isOpen) from loading with those fields silently
// `undefined`.
// v5: added miniGameLevels and 500 starting coins; v4 saves are migrated.
// v6: adds theme identity, reputation/level support fields, and mission counters.
const STORAGE_KEY = "vibe-zone-progress-v6";
const LEGACY_KEYS = ["vibe-zone-progress-v5", "vibe-zone-progress-v4"];
export const START_COINS = 500;

function freshProgress(): GameProgress {
  return {
    clubName: "Vibe Zone",
    isOpen: false,
    selectedThemeId: null,
    unlockedThemeIds: [],
    themeSwitchUnlocked: false,
    coins: START_COINS,
    tips: 0,
    reputation: 0,
    totalCoinsEarned: START_COINS,
    totalGuestsServed: 0,
    totalUpgradesBought: 0,
    totalEventsHandled: 0,
    clearedItemIds: [],
    nextLevelIndex: 1,
    totalStars: 0,
    bestVibeStreak: 0,
    vipsCollected: 0,
    miniGameLevels: {},
  };
}

function mergeAndNormalize(raw: Partial<GameProgress>): GameProgress {
  const merged = { ...freshProgress(), ...raw } as GameProgress;
  const starterSet = new Set(STARTER_THEME_IDS);

  const selectedThemeId = merged.selectedThemeId && starterSet.has(merged.selectedThemeId)
    ? merged.selectedThemeId
    : null;

  const unlockedThemeIds = Array.from(
    new Set(
      (merged.unlockedThemeIds ?? [])
        .filter((themeId) => starterSet.has(themeId))
        .concat(selectedThemeId ? [selectedThemeId] : []),
    ),
  );

  return {
    ...merged,
    selectedThemeId,
    unlockedThemeIds,
    coins: clampToNonNegative(merged.coins),
    tips: clampToNonNegative(merged.tips),
    totalCoinsEarned: clampToNonNegative(merged.totalCoinsEarned),
    totalGuestsServed: clampToNonNegative(merged.totalGuestsServed),
    totalUpgradesBought: clampToNonNegative(merged.totalUpgradesBought),
    totalEventsHandled: clampToNonNegative(merged.totalEventsHandled),
    reputation: clampToNonNegative(merged.reputation),
    themeSwitchUnlocked:
      merged.themeSwitchUnlocked || isThemeSwitchUnlocked(merged.reputation, merged.totalStars),
  };
}

function applyProgression(progress: GameProgress): GameProgress {
  if (!isThemeSwitchUnlocked(progress.reputation, progress.totalStars)) return progress;
  if (progress.themeSwitchUnlocked && progress.unlockedThemeIds.length >= STARTER_THEME_IDS.length) return progress;
  return {
    ...progress,
    themeSwitchUnlocked: true,
    unlockedThemeIds: Array.from(new Set([...progress.unlockedThemeIds, ...STARTER_THEME_IDS])),
  };
}

function loadProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return applyProgression(mergeAndNormalize(JSON.parse(raw)));
    for (const key of LEGACY_KEYS) {
      const legacy = localStorage.getItem(key);
      if (legacy) return applyProgression(mergeAndNormalize(JSON.parse(legacy)));
    }
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
    setProgress((prev) => {
      const earnedCoins = coinsForStars(stars);
      return applyProgression({
        ...prev,
        coins: prev.coins + earnedCoins,
        totalCoinsEarned: prev.totalCoinsEarned + earnedCoins,
        totalStars: prev.totalStars + stars,
        nextLevelIndex: prev.nextLevelIndex + 1,
        reputation: prev.reputation + stars * 6,
      });
    });
  }, []);

  // Spends coins to instantly clear a club item, if affordable.
  const purchaseItem = useCallback((itemId: string, price: number) => {
    setProgress((prev) => {
      if (prev.clearedItemIds.includes(itemId) || prev.coins < price) return prev;
      return applyProgression({
        ...prev,
        coins: prev.coins - price,
        clearedItemIds: [...prev.clearedItemIds, itemId],
        totalUpgradesBought: prev.totalUpgradesBought + 1,
        reputation: prev.reputation + 5,
      });
    });
  }, []);

  // Shared payout path for VIPs, the restroom system, and the kitchen —
  // all three are "someone was served, here's a tip" economically.
  // vipsCollected only increments when the payout came from an actual VIP.
  const addServiceTip = useCallback((coins: number, tips: number, isVip = false, reputationGain = 2) => {
    setProgress((prev) =>
      applyProgression({
        ...prev,
        coins: prev.coins + coins,
        tips: prev.tips + tips,
        totalCoinsEarned: prev.totalCoinsEarned + coins,
        vipsCollected: prev.vipsCollected + (isVip ? 1 : 0),
        reputation: prev.reputation + reputationGain + Math.floor(tips / 60),
      }),
    );
  }, []);

  const addGuestPayout = useCallback((coins: number, tips: number, reputationGain = 2) => {
    setProgress((prev) =>
      applyProgression({
        ...prev,
        coins: prev.coins + coins,
        tips: prev.tips + tips,
        totalCoinsEarned: prev.totalCoinsEarned + coins,
        totalGuestsServed: prev.totalGuestsServed + 1,
        reputation: prev.reputation + reputationGain,
      }),
    );
  }, []);

  const recordEventHandled = useCallback(() => {
    setProgress((prev) =>
      applyProgression({
        ...prev,
        totalEventsHandled: prev.totalEventsHandled + 1,
        reputation: prev.reputation + 8,
      }),
    );
  }, []);

  const renameClub = useCallback((name: string) => {
    const trimmed = name.trim().slice(0, 24);
    if (!trimmed) return;
    setProgress((prev) => ({ ...prev, clubName: trimmed }));
  }, []);

  const setOpen = useCallback((open: boolean) => {
    setProgress((prev) => ({ ...prev, isOpen: open }));
  }, []);

  const chooseStarterTheme = useCallback((themeId: string) => {
    setProgress((prev) => {
      if (prev.selectedThemeId) return prev;
      return {
        ...prev,
        selectedThemeId: themeId,
        unlockedThemeIds: Array.from(new Set([...prev.unlockedThemeIds, themeId])),
      };
    });
  }, []);

  const switchTheme = useCallback((themeId: string) => {
    setProgress((prev) => {
      if (!prev.themeSwitchUnlocked) return prev;
      if (!prev.unlockedThemeIds.includes(themeId)) return prev;
      if (prev.selectedThemeId === themeId) return prev;
      return { ...prev, selectedThemeId: themeId };
    });
  }, []);

  const recordMiniGameWin = useCallback((gameId: MiniGameId, level: number, stars: 1 | 2 | 3) => {
    setProgress((prev) => {
      const best = prev.miniGameLevels[gameId] ?? 1;
      const earnedCoins = coinsForStars(stars);
      return applyProgression({
        ...prev,
        coins: prev.coins + earnedCoins,
        totalCoinsEarned: prev.totalCoinsEarned + earnedCoins,
        totalStars: prev.totalStars + stars,
        reputation: prev.reputation + stars * 4,
        miniGameLevels: { ...prev.miniGameLevels, [gameId]: Math.max(best, level + 1) },
      });
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(freshProgress());
  }, []);

  return {
    progress,
    recordLevelWin,
    recordMiniGameWin,
    purchaseItem,
    addServiceTip,
    addGuestPayout,
    recordEventHandled,
    renameClub,
    setOpen,
    chooseStarterTheme,
    switchTheme,
    resetProgress,
  };
}
