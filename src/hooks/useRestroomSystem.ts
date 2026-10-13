import { useEffect, useMemo, useRef, useState } from "react";
import { ALL_ITEMS } from "../data/items";
import { tipForWait, coinsForTip } from "../game/service";
import type { RestroomStallState } from "../types";

const NEED_INTERVAL_MIN_MS = 14_000;
const NEED_INTERVAL_MAX_MS = 22_000;
const ATTENDANT_CLEAN_INTERVAL_MS = 12_000;

// Simulates two restroom lines (women's / men's), each with 3 stalls.
// A "need" spawns periodically; if a clean stall of that gender is free,
// it's used immediately (max tip). If not, that gender's need waits —
// simplified to ONE outstanding wait per gender at a time, not a full
// queue — until a stall of that gender is cleaned (by a tap, or
// automatically if the attendant is hired), at which point the wait
// resolves and pays out based on how long it took.
export function useRestroomSystem(
  built: boolean,
  attendantHired: boolean,
  occupancyRatio: number, // 0..1 — how full the club is right now
  onPayout: (coins: number, tips: number) => void,
) {
  const stallDefs = useMemo(() => ALL_ITEMS.filter((i) => i.isStall), []);
  const [stalls, setStalls] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(stallDefs.map((s) => [s.id, true])), // true = clean
  );
  const pendingRef = useRef<{ women: number | null; men: number | null }>({ women: null, men: null });
  const [, bump] = useState(0);
  const occupancyRef = useRef(occupancyRatio);
  occupancyRef.current = occupancyRatio;

  function setPending(gender: "women" | "men", value: number | null) {
    pendingRef.current = { ...pendingRef.current, [gender]: value };
    bump((n) => n + 1);
  }

  function cleanStall(id: string) {
    setStalls((prev) => {
      if (prev[id]) return prev; // already clean
      const def = stallDefs.find((s) => s.id === id);
      if (!def) return prev;
      const pendingSince = pendingRef.current[def.stallGender!];
      if (pendingSince) {
        const wait = Date.now() - pendingSince;
        const tip = tipForWait(wait);
        onPayout(coinsForTip(tip), tip);
        setPending(def.stallGender!, null);
        return { ...prev, [id]: false }; // the waiting patron immediately uses it
      }
      return { ...prev, [id]: true };
    });
  }

  // Patron need spawn loop — a fuller club means more bathroom demand; an
  // empty one means none at all, regardless of how long it's been open.
  useEffect(() => {
    if (!built) return;
    const interval = setInterval(
      () => {
        if (occupancyRef.current <= 0) return;
        if (Math.random() > occupancyRef.current) return; // fuller club = more likely this tick
        const gender: "women" | "men" = Math.random() < 0.5 ? "women" : "men";
        setStalls((prev) => {
          const freeId = stallDefs.find((s) => s.stallGender === gender && prev[s.id])?.id;
          if (freeId) {
            onPayout(coinsForTip(100), 100); // clean stall ready immediately — max tip
            return { ...prev, [freeId]: false };
          }
          if (pendingRef.current[gender] === null) setPending(gender, Date.now());
          return prev;
        });
      },
      NEED_INTERVAL_MIN_MS + Math.random() * (NEED_INTERVAL_MAX_MS - NEED_INTERVAL_MIN_MS),
    );
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [built]);

  // Attendant auto-clean loop
  useEffect(() => {
    if (!built || !attendantHired) return;
    const interval = setInterval(() => {
      const dirtyId = stallDefs.find((s) => !stalls[s.id])?.id;
      if (dirtyId) cleanStall(dirtyId);
    }, ATTENDANT_CLEAN_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [built, attendantHired, stalls]);

  const stallStates: RestroomStallState[] = stallDefs.map((s) => ({
    id: s.id,
    gender: s.stallGender!,
    clean: stalls[s.id],
  }));

  return {
    stallStates,
    cleanStall,
    womenWaiting: pendingRef.current.women !== null,
    menWaiting: pendingRef.current.men !== null,
  };
}
