import { useEffect, useState } from "react";

const ARRIVAL_CHECK_MS = 8_000;
const DEPARTURE_CHECK_MS = 15_000;

// Simulates how full the club is right now (0..capacity) — rises while
// open and room remains, slowly turns over as guests leave. Everyone
// clears out the moment the club closes. This is deliberately a simple
// aggregate count rather than per-guest tracking (no individual "guest"
// objects with their own timers) — enough to drive the other systems'
// demand without the complexity of simulating each person.
export function useOccupancy(capacity: number, isOpen: boolean): number {
  const [occupancy, setOccupancy] = useState(0);

  useEffect(() => {
    if (!isOpen) setOccupancy(0);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || capacity <= 0) return;
    const interval = setInterval(() => {
      setOccupancy((cur) => (cur >= capacity ? cur : Math.min(capacity, cur + 1 + Math.floor(Math.random() * 3))));
    }, ARRIVAL_CHECK_MS);
    return () => clearInterval(interval);
  }, [isOpen, capacity]);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setOccupancy((cur) => Math.max(0, cur - (1 + Math.floor(Math.random() * 2))));
    }, DEPARTURE_CHECK_MS);
    return () => clearInterval(interval);
  }, [isOpen]);

  // If capacity ever shrinks (shouldn't, in practice — the club never
  // un-builds), keep occupancy from exceeding it.
  useEffect(() => {
    setOccupancy((cur) => Math.min(cur, capacity));
  }, [capacity]);

  return occupancy;
}
