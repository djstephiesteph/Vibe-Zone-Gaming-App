import { useEffect, useRef, useState } from "react";
import { tipForWait, coinsForTip } from "../game/service";
import type { KitchenOrder } from "../types";

const NEW_ORDER_MIN_MS = 10_000;
const NEW_ORDER_MAX_MS = 20_000;
const COOK_MIN_MS = 6_000;
const COOK_MAX_MS = 12_000;

// One active order at a time (v1 simplification — see README). The timer
// starts the instant the order is placed and keeps running the whole time,
// through cooking AND through however long the player takes to pick it up
// and carry it to the table — a slow player genuinely costs tip, same as
// a slow kitchen would.
export function useKitchenSystem(
  built: boolean,
  tableIds: string[],
  waiterHired: boolean,
  occupancyRatio: number, // 0..1 — an empty club never orders food
  onPayout: (coins: number, tips: number) => void,
) {
  const [order, setOrder] = useState<KitchenOrder | null>(null);
  const [carrying, setCarrying] = useState(false);
  const occupancyRef = useRef(occupancyRatio);
  occupancyRef.current = occupancyRatio;

  // Spawn a new order once the previous one is delivered — but only if
  // there's actually anyone in the club to order it. A fuller club also
  // orders a bit faster (shorter spawn delay).
  useEffect(() => {
    if (!built || order || tableIds.length === 0) return;
    let timeout: number;
    const tryScheduleOrder = () => {
      if (occupancyRef.current <= 0) {
        timeout = window.setTimeout(tryScheduleOrder, 5_000); // check again shortly
        return;
      }
      const span = NEW_ORDER_MAX_MS - NEW_ORDER_MIN_MS;
      const delay = NEW_ORDER_MIN_MS + (1 - occupancyRef.current) * span + Math.random() * span * 0.3;
      timeout = window.setTimeout(() => {
        const tableId = tableIds[Math.floor(Math.random() * tableIds.length)];
        setOrder({ tableId, createdAt: Date.now(), ready: false });
      }, delay);
    };
    tryScheduleOrder();
    return () => window.clearTimeout(timeout);
  }, [built, order, tableIds]);

  // Cooking delay, then the dish is ready to carry
  useEffect(() => {
    if (!order || order.ready) return;
    const timeout = setTimeout(
      () => setOrder((o) => (o ? { ...o, ready: true } : o)),
      COOK_MIN_MS + Math.random() * (COOK_MAX_MS - COOK_MIN_MS),
    );
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.createdAt]);

  // With a waiter hired, a ready order delivers itself a few seconds after
  // it's ready — the player never has to tap it. Total elapsed time still
  // sets the tip, same as a manual delivery.
  useEffect(() => {
    if (!order?.ready || carrying || !waiterHired) return;
    const timeout = setTimeout(
      () => {
        setOrder((o) => {
          if (!o) return o;
          const wait = Date.now() - o.createdAt;
          const tip = tipForWait(wait);
          onPayout(coinsForTip(tip), tip);
          return null;
        });
      },
      2000 + Math.random() * 3000,
    );
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.ready, order?.createdAt, carrying, waiterHired]);

  function pickUp() {
    if (order?.ready && !carrying) setCarrying(true);
  }

  function deliverTo(tableId: string) {
    if (!order || !carrying || tableId !== order.tableId) return;
    const wait = Date.now() - order.createdAt;
    const tip = tipForWait(wait);
    onPayout(coinsForTip(tip), tip);
    setOrder(null);
    setCarrying(false);
  }

  return { order, carrying, pickUp, deliverTo };
}
