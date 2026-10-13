import { useMemo, useState } from "react";
import { getLevelConfig } from "./data/levels";
import { ZONES } from "./data/zones";
import { isZoneCleared, ALL_ITEMS } from "./data/items";
import { computeCapacity } from "./game/capacity";
import { useProgress } from "./hooks/useProgress";
import { useVipSystem } from "./hooks/useVipSystem";
import { useRestroomSystem } from "./hooks/useRestroomSystem";
import { useKitchenSystem } from "./hooks/useKitchenSystem";
import { useOccupancy } from "./hooks/useOccupancy";
import NightclubView from "./components/NightclubView";
import GameBoard from "./components/GameBoard";
import MiniGames from "./components/MiniGames";

type Screen = "club" | "playing" | "minigames";

export default function App() {
  const { progress, recordLevelWin, recordMiniGameWin, purchaseItem, addServiceTip, renameClub, setOpen, resetProgress } =
    useProgress();
  const [screen, setScreen] = useState<Screen>("club");

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

  return (
    <div className="min-h-screen bg-ink text-bulb font-body">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-5 py-6">
        <header className="mb-5 flex items-center justify-between">
          <span className="font-display text-magenta tracking-wide">VIBE ZONE</span>
          <span className="text-xs text-haze font-body">★ {progress.totalStars}</span>
        </header>

        <main className="flex-1">
          {screen === "club" && (
            <NightclubView
              progress={progress}
              onPurchase={purchaseItem}
              onPlay={() => setScreen("playing")}
              onMiniGames={() => setScreen("minigames")}
              onRenameClub={renameClub}
              onToggleOpen={() => setOpen(!progress.isOpen)}
              vipVisit={visit}
              currentVip={currentVip}
              onCollectVip={() => collect(clearedItemSet)}
              restroom={restroom}
              kitchen={kitchen}
              capacity={capacity}
              occupancy={occupancy}
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
