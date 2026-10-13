import { useEffect, useMemo, useState } from "react";
import { getLevelConfig } from "./data/levels";
import { getThemeById } from "./data/themes";
import { ZONES } from "./data/zones";
import { isZoneCleared, ALL_ITEMS } from "./data/items";
import { computeCapacity } from "./game/capacity";
import { getActiveObjectives } from "./game/objectives";
import { getClubLevel } from "./game/progression";
import { computeVibeScore } from "./game/vibe";
import { useProgress } from "./hooks/useProgress";
import { useGuestFlow } from "./hooks/useGuestFlow";
import { useVipSystem } from "./hooks/useVipSystem";
import { useRestroomSystem } from "./hooks/useRestroomSystem";
import { useKitchenSystem } from "./hooks/useKitchenSystem";
import { useOccupancy } from "./hooks/useOccupancy";
import NightclubView from "./components/NightclubView";
import GameBoard from "./components/GameBoard";
import MiniGames from "./components/MiniGames";
import ThemePicker from "./components/ThemePicker";
import type { ClubEvent, MusicMood } from "./types";

type Screen = "club" | "playing" | "minigames";

export default function App() {
  const {
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
  } = useProgress();
  const [screen, setScreen] = useState<Screen>("club");
  const [musicMood, setMusicMood] = useState<MusicMood>("steady");
  const [activeEvent, setActiveEvent] = useState<ClubEvent | null>(null);
  const [vibeStreak, setVibeStreak] = useState(0);

  const selectedTheme = useMemo(() => getThemeById(progress.selectedThemeId), [progress.selectedThemeId]);

  const clearedItemSet = useMemo(() => new Set(progress.clearedItemIds), [progress.clearedItemIds]);
  const clearedZoneSet = useMemo(
    () => new Set(ZONES.filter((z) => isZoneCleared(z.name, clearedItemSet)).map((z) => z.name)),
    [clearedItemSet],
  );

  const capacity = useMemo(() => computeCapacity(clearedItemSet), [clearedItemSet]);
  const occupancy = useOccupancy(capacity, progress.isOpen);
  const occupancyRatio = capacity > 0 ? occupancy / capacity : 0;
  const hasRoom = capacity > 0 && occupancy < capacity;

  const { visit, currentVip, collect } = useVipSystem(clearedZoneSet, progress.isOpen, hasRoom, (coins, tips) =>
    addServiceTip(coins, tips, true),
  );

  const bathroomsBuilt = clearedZoneSet.has("Bathrooms");
  const bathAttendantHired = clearedItemSet.has("bath-attendant");
  const restroom = useRestroomSystem(
    bathroomsBuilt && progress.isOpen,
    bathAttendantHired,
    occupancyRatio,
    (coins, tips) => addServiceTip(coins, tips),
  );

  const kitchenBuilt = clearedZoneSet.has("Kitchen");
  const waiterHired = clearedItemSet.has("seat-waiter");
  const tableIds = useMemo(
    () => ALL_ITEMS.filter((i) => i.isTable && clearedItemSet.has(i.id)).map((i) => i.id),
    [clearedItemSet],
  );
  const kitchen = useKitchenSystem(
    kitchenBuilt && progress.isOpen,
    tableIds,
    waiterHired,
    occupancyRatio,
    (coins, tips) => addServiceTip(coins, tips),
  );

  const guestFlow = useGuestFlow({
    isOpen: progress.isOpen,
    capacity,
    occupancy,
    theme: selectedTheme ?? getThemeById("open-format")!,
    musicMood,
    activeEvent,
    onGuestServed: (coins, tips, reputation) => addGuestPayout(coins, tips, reputation),
  });

  const queuePressure = capacity > 0 ? guestFlow.queueCount / Math.max(2, Math.round(capacity * 0.24)) : 0;

  const operationsBonus =
    (kitchenBuilt ? 3 : 0) +
    (bathroomsBuilt ? 2 : 0) +
    (clearedZoneSet.has("Bar") ? 2 : 0) +
    (clearedZoneSet.has("DJ Booth") ? 4 : 0) +
    (waiterHired ? 2 : 0) +
    (bathAttendantHired ? 1 : 0);

  const eventModifier = activeEvent?.type === "vip-rush"
    ? 5
    : activeEvent?.type === "birthday-crew"
      ? 3
      : activeEvent?.type === "service-glitch"
        ? -7
        : 0;

  const vibeScore = selectedTheme
    ? computeVibeScore({
      occupancyRatio,
      queuePressure,
      serviceSatisfaction: guestFlow.serviceSatisfaction,
      musicMood,
      themeBias: selectedTheme.vibeBias,
      eventModifier,
      operationsBonus,
    })
    : 50;

  const clubLevel = getClubLevel(progress.reputation);

  const objectives = getActiveObjectives({
    totalUpgradesBought: progress.totalUpgradesBought,
    totalGuestsServed: progress.totalGuestsServed,
    totalEventsHandled: progress.totalEventsHandled,
    reputation: progress.reputation,
    vibeScore,
    clearedZones: clearedZoneSet,
  });

  useEffect(() => {
    if (!progress.isOpen) {
      setActiveEvent(null);
      return;
    }

    const interval = window.setInterval(() => {
      setActiveEvent((current) => {
        if (current) {
          const elapsed = Date.now() - current.startedAt;
          if (elapsed < current.durationMs) return current;
          recordEventHandled();
          return null;
        }
        if (Math.random() > 0.32) return null;
        const now = Date.now();
        const pool: ClubEvent[] = [
          {
            id: `event-rush-${now}`,
            type: "vip-rush",
            title: "VIP Rush",
            detail: "A promoter sent a last-minute celebrity table request.",
            startedAt: now,
            durationMs: 30_000,
          },
          {
            id: `event-bday-${now}`,
            type: "birthday-crew",
            title: "Birthday Crew",
            detail: "A large birthday party enters and boosts dance-floor energy.",
            startedAt: now,
            durationMs: 28_000,
          },
          {
            id: `event-glitch-${now}`,
            type: "service-glitch",
            title: "Service Glitch",
            detail: "A temporary service slowdown increases queue pressure.",
            startedAt: now,
            durationMs: 22_000,
          },
        ];
        return pool[Math.floor(Math.random() * pool.length)];
      });
    }, 14_000);

    return () => window.clearInterval(interval);
  }, [progress.isOpen, recordEventHandled]);

  useEffect(() => {
    setVibeStreak((current) => {
      if (!progress.isOpen) return 0;
      if (vibeScore >= 70) return current + 1;
      return Math.max(0, current - 1);
    });
  }, [progress.isOpen, vibeScore]);

  return (
    <div className="min-h-screen bg-ink text-bulb font-body">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-6">
        <header className="mb-5 flex items-center justify-between">
          <span className="font-display text-magenta tracking-wide">VIBE ZONE</span>
          <span className="text-xs text-haze font-body">★ {progress.totalStars} · Lv {clubLevel}</span>
        </header>

        <main className="flex-1">
          {!selectedTheme && (
            <ThemePicker
              onChoose={(themeId) => {
                chooseStarterTheme(themeId);
                setMusicMood("steady");
              }}
            />
          )}

          {screen === "club" && (
            <NightclubView
              selectedTheme={selectedTheme}
              progress={progress}
              onPurchase={purchaseItem}
              onPlay={() => setScreen("playing")}
              onMiniGames={() => setScreen("minigames")}
              onRenameClub={renameClub}
              onToggleOpen={() => setOpen(!progress.isOpen)}
              onSwitchTheme={switchTheme}
              onChangeMood={setMusicMood}
              musicMood={musicMood}
              vibeScore={vibeScore}
              vibeStreak={vibeStreak}
              objectives={objectives}
              queueCount={guestFlow.queueCount}
              guests={guestFlow.guests}
              activeEvent={activeEvent}
              vipVisit={visit}
              currentVip={currentVip}
              onCollectVip={() => collect(clearedItemSet)}
              restroom={restroom}
              kitchen={kitchen}
              capacity={capacity}
              occupancy={occupancy}
              level={clubLevel}
            />
          )}

          {screen === "playing" && (
            <GameBoard
              levelIndex={progress.nextLevelIndex}
              config={getLevelConfig(progress.nextLevelIndex)}
              onExit={() => setScreen("club")}
              onComplete={(stars) => recordLevelWin(stars)}
            />
          )}
          {screen === "minigames" && (
            <MiniGames levels={progress.miniGameLevels} onWin={recordMiniGameWin} onExit={() => setScreen("club")} />
          )}
        </main>

        {screen === "club" && (
          <footer className="mt-6 text-center">
            <button onClick={resetProgress} className="text-[11px] text-haze/50 font-body underline">
              Reset progress
            </button>
          </footer>
        )}
      </div>
    </div>
  );
}
