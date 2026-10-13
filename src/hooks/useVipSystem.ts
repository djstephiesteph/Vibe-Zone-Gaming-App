import { useEffect, useRef, useState } from "react";
import { VIPS } from "../data/vips";
import { isVipEligible, computeVipPayout } from "../game/vipPayout";
import type { VipVisit } from "../types";

const SPAWN_CHECK_MS = 15_000;
const SPAWN_CHANCE = 0.35;
const VISIT_MIN_MS = 20_000;
const VISIT_MAX_MS = 35_000;

// Owns the VIP spawn timer and current visit state. Not persisted across
// reloads for v1 — a visit in progress is simply lost on refresh. Fine to
// revisit later if it turns out to matter.
export function useVipSystem(
  clearedZoneSet: Set<string>,
  isOpen: boolean,
  hasRoom: boolean,
  onCollect: (coins: number, tips: number) => void,
) {
  const [visit, setVisit] = useState<VipVisit | null>(null);
  const clearedZonesRef = useRef(clearedZoneSet);
  clearedZonesRef.current = clearedZoneSet;
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;
  const hasRoomRef = useRef(hasRoom);
  hasRoomRef.current = hasRoom;

  // Spawn check loop — only while the club is open AND there's actual
  // room (occupancy hasn't hit capacity). A visit already in progress is
  // allowed to finish out even if the club fills up or closes mid-visit.
  useEffect(() => {
    const interval = setInterval(() => {
      setVisit((current) => {
        if (current || !isOpenRef.current || !hasRoomRef.current) return current;
        const eligible = VIPS.filter((v) => isVipEligible(v, clearedZonesRef.current));
        if (eligible.length === 0) return current;
        if (Math.random() > SPAWN_CHANCE) return current;
        const vip = eligible[Math.floor(Math.random() * eligible.length)];
        return { vipId: vip.id, phase: "visiting", startedAt: Date.now() };
      });
    }, SPAWN_CHECK_MS);
    return () => clearInterval(interval);
  }, []);

  // Visiting -> ready transition
  useEffect(() => {
    if (visit?.phase !== "visiting") return;
    const delay = VISIT_MIN_MS + Math.random() * (VISIT_MAX_MS - VISIT_MIN_MS);
    const timeout = setTimeout(() => {
      setVisit((v) => (v && v.phase === "visiting" ? { ...v, phase: "ready" } : v));
    }, delay);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visit?.vipId, visit?.phase]);

  const currentVip = visit ? VIPS.find((v) => v.id === visit.vipId) ?? null : null;

  function collect(clearedItemIds: Set<string>) {
    if (!visit || visit.phase !== "ready" || !currentVip) return;
    const { coins, tips } = computeVipPayout(currentVip, clearedItemIds);
    onCollect(coins, tips);
    setVisit(null);
  }

  return { visit, currentVip, collect };
}
