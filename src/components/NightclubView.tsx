import { useEffect, useMemo, useState } from "react";
import { ALL_ITEMS, getActiveZone, isZoneCleared, itemsForZone } from "../data/items";
import { FLOOR_TILE_LAYOUT, FLOOR_ROWS, FLOOR_ROW_ITEMS } from "../data/floorGrid";
import { ZONES } from "../data/zones";
import type { GameProgress, VipCharacter, VipVisit } from "../types";
import type { useRestroomSystem } from "../hooks/useRestroomSystem";
import type { useKitchenSystem } from "../hooks/useKitchenSystem";
import RoomStage, { depthScale } from "./RoomStage";
import RoomSwitcher from "./RoomSwitcher";

interface NightclubViewProps {
  progress: GameProgress;
  onPurchase: (itemId: string, price: number) => void;
  onPlay: () => void;
  onMiniGames: () => void;
  onRenameClub: (name: string) => void;
  onToggleOpen: () => void;
  vipVisit: VipVisit | null;
  currentVip: VipCharacter | null;
  onCollectVip: () => void;
  restroom: ReturnType<typeof useRestroomSystem>;
  kitchen: ReturnType<typeof useKitchenSystem>;
  capacity: number;
  occupancy: number;
}

const TOTAL_ITEMS = ALL_ITEMS.length;

export default function NightclubView({
  progress, onPurchase, onPlay, onMiniGames, onRenameClub, onToggleOpen,
  vipVisit, currentVip, onCollectVip, restroom, kitchen, capacity, occupancy,
}: NightclubViewProps) {
  const [insufficientFor, setInsufficientFor] = useState<string | null>(null);
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(progress.clubName);

  const clearedSet = useMemo(() => new Set(progress.clearedItemIds), [progress.clearedItemIds]);
  const clearedZoneSet = useMemo(
    () => new Set(ZONES.filter((z) => isZoneCleared(z.name, clearedSet)).map((z) => z.name)),
    [clearedSet],
  );
  const clearedCount = clearedSet.size;
  const pct = Math.round((clearedCount / TOTAL_ITEMS) * 100);
  const isComplete = clearedCount >= TOTAL_ITEMS;
  const activeZone = getActiveZone(clearedSet);
  const grimeOpacity = Math.max(0, 1 - clearedCount / TOTAL_ITEMS);

  // Which room the player is looking at. Follows construction: when a zone
  // finishes, we walk into the next one automatically.
  const [viewedZone, setViewedZone] = useState<string>(activeZone ?? "Grand Reopening");
  useEffect(() => {
    if (activeZone) setViewedZone(activeZone);
  }, [activeZone]);

  const zoneDef = ZONES.find((z) => z.name === viewedZone) ?? ZONES[0];
  const roomItems = ALL_ITEMS.filter((i) => i.zone === viewedZone && i.kind !== "floorRow");
  const activeZoneItems = activeZone ? itemsForZone(activeZone).filter((i) => !clearedSet.has(i.id)) : [];

  const dirtyStalls = restroom.stallStates.filter((s) => clearedSet.has(s.id) && !s.clean).length;
  const carryingFood = kitchen.carrying && !!kitchen.order;

  function tryBuy(itemId: string, price: number) {
    if (progress.coins < price) {
      setInsufficientFor(itemId);
      window.setTimeout(() => setInsufficientFor((cur) => (cur === itemId ? null : cur)), 1500);
      return;
    }
    onPurchase(itemId, price);
  }

  const glowFor = (kind: string) =>
    kind === "staff" ? "drop-shadow(0 0 7px rgba(245,184,65,0.55))" : "drop-shadow(0 0 6px rgba(255,46,136,0.25))";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {editingName ? (
            <form
              onSubmit={(e) => { e.preventDefault(); onRenameClub(nameDraft); setEditingName(false); }}
              className="flex items-center gap-2"
            >
              <input
                autoFocus value={nameDraft} maxLength={24}
                onChange={(e) => setNameDraft(e.target.value)}
                className="min-w-0 flex-1 rounded-lg border border-magenta/40 bg-plum/70 px-2 py-1 font-display text-lg text-bulb"
              />
              <button type="submit" className="shrink-0 rounded-full bg-magenta px-3 py-1 font-body text-xs text-ink">Save</button>
            </form>
          ) : (
            <button
              onClick={() => { setNameDraft(progress.clubName); setEditingName(true); }}
              className="flex items-center gap-1.5 border-0 bg-transparent p-0 text-left"
            >
              <h2 className="truncate font-display text-2xl text-bulb">{progress.clubName}</h2>
              <span className="text-xs text-haze">✏️</span>
            </button>
          )}
          <p className="font-body text-sm text-haze">
            {isComplete ? "Grand reopening — the club is fully restored."
              : clearedCount === 0 ? "A rundown club, buried in junk. Earn coins and tap anything to start cleaning up."
              : `Restoration ${pct}% — building out ${activeZone}`}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="font-display text-sm text-gold">🪙 {progress.coins.toLocaleString()}</p>
          <p className="font-display text-xs text-cyan">💎 {progress.tips.toLocaleString()}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onToggleOpen}
          className={`flex-1 rounded-xl border px-3 py-2 font-body text-xs font-bold tracking-wide ${
            progress.isOpen ? "border-gold/60 bg-gold/10 text-gold" : "border-haze/30 bg-plum/40 text-haze"
          }`}
        >
          {progress.isOpen ? "🔓 OPEN — tap to close for the night" : "🔒 CLOSED — tap to open the doors"}
        </button>
        {capacity > 0 && (
          <div className="shrink-0 rounded-xl border border-haze/20 bg-plum/40 px-3 py-2 text-center">
            <p className="font-body text-[9px] uppercase leading-none tracking-wide text-haze">Capacity</p>
            <p className={`font-display text-sm leading-tight ${occupancy >= capacity ? "text-magenta" : "text-bulb"}`}>
              👥 {occupancy}/{capacity}
            </p>
          </div>
        )}
      </div>
      {capacity > 0 && occupancy >= capacity && progress.isOpen && (
        <p className="text-center font-body text-[10px] text-magenta">
          Club's at capacity — build more floor, seating, or VIP space to let more guests in.
        </p>
      )}

      <div className="h-2 w-full overflow-hidden rounded-full bg-velvet">
        <div className="h-full bg-gradient-to-r from-cyan to-gold transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      <RoomSwitcher viewedZone={viewedZone} activeZone={activeZone} clearedZoneSet={clearedZoneSet} onSelect={setViewedZone} />

      {/* Alerts from rooms you're not standing in */}
      <div className="flex flex-wrap gap-1.5 empty:hidden">
        {dirtyStalls > 0 && viewedZone !== "Bathrooms" && (
          <button onClick={() => setViewedZone("Bathrooms")} className="rounded-full border border-gold/50 bg-gold/10 px-2.5 py-1 font-body text-[10px] text-gold">
            🚽 {dirtyStalls} dirty — go clean
          </button>
        )}
        {kitchen.order && !carryingFood && kitchen.order.ready && viewedZone !== "Kitchen" && (
          <button onClick={() => setViewedZone("Kitchen")} className="rounded-full border border-gold/50 bg-gold/10 px-2.5 py-1 font-body text-[10px] text-gold">
            🍔 Order ready — pick it up
          </button>
        )}
        {carryingFood && viewedZone !== "Seating" && (
          <button onClick={() => setViewedZone("Seating")} className="rounded-full border border-gold/50 bg-gold/10 px-2.5 py-1 font-body text-[10px] text-gold">
            🍔 Carrying food — head to Seating
          </button>
        )}
        {currentVip && vipVisit && viewedZone !== "VIP Lounge" && (
          <button onClick={() => setViewedZone("VIP Lounge")} className="rounded-full border border-gold/50 bg-gold/10 px-2.5 py-1 font-body text-[10px] text-gold">
            {currentVip.emoji} {currentVip.name} {vipVisit.phase === "ready" ? "is ready to tip" : "is visiting"}
          </button>
        )}
      </div>

      <RoomStage
        wallGradient={zoneDef.theme.wallGradient}
        floorGradient={zoneDef.theme.floorGradient}
        tiltUp={zoneDef.theme.tiltUp}
        grimeOpacity={grimeOpacity}
      >
        {/* Dance floor grid */}
        {viewedZone === "Dance Floor" &&
          Array.from({ length: FLOOR_ROWS }, (_, row) => {
            const item = FLOOR_ROW_ITEMS[row];
            const unlocked = clearedSet.has(item.id);
            const buyable = activeZone === "Dance Floor" && !unlocked;
            return (
              <div
                key={row}
                role={buyable ? "button" : undefined}
                onClick={buyable ? () => tryBuy(item.id, item.price) : undefined}
                className="absolute inset-0"
                style={{ pointerEvents: buyable ? "auto" : "none", cursor: buyable ? "pointer" : "default" }}
              >
                {FLOOR_TILE_LAYOUT.filter((t) => t.row === row).map((t) => (
                  <div
                    key={`${t.row}-${t.col}`}
                    className={unlocked ? "absolute animate-popIn" : "absolute"}
                    style={{
                      left: `${t.x}%`, top: `${t.y}%`,
                      fontSize: 16 * depthScale(t.y),
                      transform: "translate(-50%, -50%)",
                      opacity: unlocked ? 1 : buyable ? 0.75 : 0.45,
                      filter: unlocked ? "none" : "grayscale(0.6) brightness(0.7)",
                      outline: buyable ? "1px dashed rgba(255,46,136,0.3)" : "none",
                      transition: "opacity 0.4s ease, filter 0.4s ease",
                    }}
                  >
                    {unlocked ? ((t.row + t.col) % 2 === 0 ? "◼" : "◻") : t.clutterEmoji}
                  </div>
                ))}
                {buyable && insufficientFor === item.id && (
                  <div className="absolute font-body text-[10px] text-magenta" style={{ left: "50%", top: `${item.y}%`, transform: "translate(-50%,-150%)" }}>
                    Need {item.price - progress.coins} more 🪙
                  </div>
                )}
              </div>
            );
          })}
        {viewedZone === "Dance Floor" && clearedSet.has("floor-row-7") && (
          <>
            <div className="absolute animate-popIn" style={{ left: "38%", top: "88%", fontSize: 28, transform: "translate(-50%,-50%)", filter: "drop-shadow(0 0 8px rgba(46,230,214,0.7))" }}>🕺</div>
            <div className="absolute animate-popIn" style={{ left: "62%", top: "88%", fontSize: 28, transform: "translate(-50%,-50%)", filter: "drop-shadow(0 0 8px rgba(255,46,136,0.7))" }}>💃</div>
          </>
        )}

        {/* Items in this room (stalls included — they carry live clean/dirty state) */}
        {roomItems.map((item) => {
          const unlocked = clearedSet.has(item.id);
          const buyable = item.zone === activeZone && !unlocked;
          const stallState = item.isStall ? restroom.stallStates.find((s) => s.id === item.id) : undefined;
          const isDirty = !!item.isStall && unlocked && !!stallState && !stallState.clean;
          const isCarryTarget = !!item.isTable && carryingFood && kitchen.order?.tableId === item.id;
          const onClick = buyable
            ? () => tryBuy(item.id, item.price)
            : isDirty ? () => restroom.cleanStall(item.id)
            : isCarryTarget ? () => kitchen.deliverTo(item.id)
            : undefined;
          const scale = depthScale(item.y);
          return (
            <div key={item.id} className="absolute" style={{ left: `${item.x}%`, top: `${item.y}%`, transform: "translate(-50%, -50%)" }}>
              <button
                type="button"
                aria-label={unlocked ? (isDirty ? `Clean ${item.label}` : isCarryTarget ? `Deliver food to ${item.label}` : item.label)
                  : buyable ? `Buy ${item.label} for ${item.price} coins` : `${item.label} (locked)`}
                onClick={onClick}
                disabled={!onClick}
                className={`flex items-center justify-center border-0 bg-transparent p-0 ${unlocked ? "animate-popIn" : ""}`}
                style={{
                  fontSize: (unlocked ? item.size : item.size * 0.82) * scale,
                  opacity: unlocked ? 1 : buyable ? 0.9 : 0.5,
                  filter: !unlocked
                    ? buyable ? "grayscale(0.25) brightness(0.9)" : "grayscale(0.6) brightness(0.65)"
                    : isDirty ? "sepia(0.6) saturate(3) hue-rotate(50deg) brightness(0.8)"
                    : glowFor(item.kind),
                  cursor: onClick ? "pointer" : "default",
                  outline: buyable ? "1px dashed rgba(255,46,136,0.4)"
                    : isCarryTarget ? "2px solid #F5B841"
                    : isDirty ? "1px dashed rgba(245,184,65,0.6)" : "none",
                  outlineOffset: 2,
                  boxShadow: isCarryTarget ? "0 0 10px rgba(245,184,65,0.7)" : undefined,
                  transition: "opacity 0.4s ease, filter 0.4s ease",
                }}
              >
                {unlocked ? item.emoji : item.clutterEmoji}
              </button>
              {buyable && (
                <div className="mt-0.5 whitespace-nowrap text-center font-body text-[9px] text-gold">
                  {insufficientFor === item.id ? `Need ${item.price - progress.coins} more 🪙` : `🪙 ${item.price}`}
                </div>
              )}
              {isDirty && <div className="mt-0.5 whitespace-nowrap text-center font-body text-[9px] text-gold">Tap to clean</div>}
              {isCarryTarget && <div className="mt-0.5 animate-pulseGlow whitespace-nowrap text-center font-body text-[9px] text-gold">Deliver here!</div>}
            </div>
          );
        })}

        {/* Kitchen order: cooking, then tap to pick up */}
        {viewedZone === "Kitchen" && kitchen.order && !kitchen.carrying && (
          <button
            type="button"
            onClick={kitchen.order.ready ? kitchen.pickUp : undefined}
            disabled={!kitchen.order.ready}
            className="absolute flex animate-popIn flex-col items-center border-0 bg-transparent p-0"
            style={{ left: "50%", top: "56%", transform: "translate(-50%,-50%)", cursor: kitchen.order.ready ? "pointer" : "default" }}
          >
            <span style={{ fontSize: 30 }}>{kitchen.order.ready ? "🍔" : "🍳"}</span>
            <span className="whitespace-nowrap font-body text-[9px] text-gold">{kitchen.order.ready ? "Tap to carry" : "Cooking…"}</span>
          </button>
        )}
        {restroom && viewedZone === "Bathrooms" && (restroom.womenWaiting || restroom.menWaiting) && (
          <div className="absolute font-body text-[10px] text-magenta" style={{ left: "50%", top: "42%", transform: "translate(-50%,-50%)" }}>
            ⏳ line forming
          </div>
        )}

        {/* Ambient crew, wandering in whichever room you're in */}
        {clearedCount > 0 && (
          <div className="pointer-events-none absolute animate-wander" style={{ fontSize: 20, transform: "translate(-50%, -50%)" }} aria-hidden="true">🧹</div>
        )}
        {clearedSet.has("seat-waiter") && (
          <div className="pointer-events-none absolute animate-wander" style={{ fontSize: 20, transform: "translate(-50%, -50%)", animationDelay: "-8s", animationDuration: "19s" }} aria-hidden="true">🤵</div>
        )}

        {/* VIP visit banner lives in the VIP Lounge */}
        {viewedZone === "VIP Lounge" && currentVip && vipVisit && (
          <div className="absolute inset-x-2 bottom-2 animate-popIn rounded-xl border border-gold/50 bg-ink/90 px-3 py-2 backdrop-blur">
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 22 }}>{currentVip.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-xs text-bulb">{currentVip.name}</p>
                <p className="truncate font-body text-[10px] text-haze">
                  {vipVisit.phase === "visiting"
                    ? `Ordering from the ${currentVip.ordersFrom === "both" ? "bar & kitchen" : currentVip.ordersFrom}…`
                    : "Ready to leave a tip!"}
                </p>
              </div>
              {vipVisit.phase === "ready" && (
                <button onClick={onCollectVip} className="shrink-0 rounded-full bg-gold px-3 py-1.5 font-body text-[11px] font-bold text-ink">Collect</button>
              )}
            </div>
          </div>
        )}

        {/* Room label */}
        <div className="pointer-events-none absolute left-3 top-2 font-display text-[11px] tracking-wide" style={{ color: zoneDef.theme.accent }}>
          {zoneDef.name.toUpperCase()}
        </div>
      </RoomStage>

      <button onClick={onPlay} className="rounded-full bg-gradient-to-r from-magenta to-cyan py-3 text-center font-display tracking-wide text-ink shadow-neon">
        🎵 Play a set for coins
      </button>
      <button onClick={onMiniGames} className="rounded-full border border-cyan py-3 text-center font-display tracking-wide text-cyan">
        🎮 Mini games
      </button>

      {!isComplete && activeZone && (
        <div className="flex flex-col gap-2">
          <p className="font-body text-xs uppercase tracking-wide text-haze">{activeZone} — tap to buy</p>
          <div className="flex flex-wrap gap-2">
            {activeZoneItems.map((item) => (
              <button
                key={item.id}
                onClick={() => tryBuy(item.id, item.price)}
                className="rounded-full border border-magenta/30 bg-plum/70 px-3 py-1.5 font-body text-xs text-bulb"
              >
                {item.label} · 🪙{item.price}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
