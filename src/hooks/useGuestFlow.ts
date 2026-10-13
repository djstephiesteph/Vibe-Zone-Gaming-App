import { useEffect, useMemo, useState } from "react";
import type { ClubGuest, ClubEvent, MusicMood } from "../types";
import type { ThemeProfile } from "../data/themes";

interface UseGuestFlowInput {
  isOpen: boolean;
  capacity: number;
  occupancy: number;
  theme: ThemeProfile;
  musicMood: MusicMood;
  activeEvent: ClubEvent | null;
  onGuestServed: (coins: number, tips: number, reputation: number) => void;
}

const STEP_MS = 1200;
const MAX_GUESTS_VISIBLE = 18;

function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function spawnGuest(theme: ThemeProfile): ClubGuest {
  const id = `g-${Date.now()}-${Math.floor(Math.random() * 10_000)}`;
  return {
    id,
    look: randomFrom(theme.guestLooks),
    state: "ARRIVING",
    mood: "neutral",
    progress: 0,
    rewardGranted: false,
  };
}

function moodFromState(guest: ClubGuest): ClubGuest["mood"] {
  if (guest.state === "QUEUED" && guest.progress > 3) return "impatient";
  if (guest.state === "SERVED" || guest.state === "DANCING") return "happy";
  return "neutral";
}

export function useGuestFlow({ isOpen, capacity, occupancy, theme, musicMood, activeEvent, onGuestServed }: UseGuestFlowInput) {
  const [guests, setGuests] = useState<ClubGuest[]>([]);

  useEffect(() => {
    if (!isOpen) {
      setGuests([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || capacity <= 0) return;
    const interval = window.setInterval(() => {
      setGuests((current) => {
        let next = [...current];
        const queueCount = current.filter((guest) => guest.state === "QUEUED").length;

        const crowdPressure = capacity > 0 ? occupancy / capacity : 0;
        const spawnChance =
          0.22 +
          (musicMood === "hype" ? 0.14 : musicMood === "chill" ? 0.06 : 0.1) +
          (activeEvent?.type === "vip-rush" ? 0.18 : 0) -
          crowdPressure * 0.08;

        if (next.length < MAX_GUESTS_VISIBLE && Math.random() < spawnChance) {
          next.push(spawnGuest(theme));
        }

        next = next
          .map((guest) => {
            const progress = guest.progress + 1;

            if (guest.state === "ARRIVING" && progress >= 1) {
              return { ...guest, state: "QUEUED" as const, progress: 0, mood: "neutral" as const };
            }

            if (guest.state === "QUEUED") {
              const queueThreshold = Math.max(1, Math.round(capacity * theme.queueTolerance * 0.08));
              if (queueCount <= queueThreshold || progress >= 2) {
                return { ...guest, state: "ENTERING" as const, progress: 0, mood: "neutral" as const };
              }
              return { ...guest, progress, mood: moodFromState({ ...guest, progress }) };
            }

            if (guest.state === "ENTERING" && progress >= 1) {
              return { ...guest, state: "DANCING" as const, progress: 0, mood: "happy" as const };
            }

            if (guest.state === "DANCING" && progress >= (musicMood === "hype" ? 2 : 3)) {
              const nextState: "ORDERING" | "SERVED" = Math.random() < 0.46 ? "ORDERING" : "SERVED";
              return {
                ...guest,
                state: nextState,
                progress: 0,
                mood: "happy" as const,
              };
            }

            if (guest.state === "ORDERING" && progress >= (activeEvent?.type === "service-glitch" ? 3 : 2)) {
              return { ...guest, state: "SERVED" as const, progress: 0, mood: "happy" as const };
            }

            if (guest.state === "SERVED") {
              if (!guest.rewardGranted) {
                const baseCoins = 5 + (musicMood === "hype" ? 1 : 0) + (activeEvent?.type === "birthday-crew" ? 2 : 0);
                const tips = guest.mood === "impatient" ? 1 : 3;
                onGuestServed(baseCoins, tips, 2);
              }
              if (progress >= 1) {
                return { ...guest, state: "LEAVING" as const, progress: 0, rewardGranted: true, mood: "happy" as const };
              }
            }

            return { ...guest, progress, mood: moodFromState({ ...guest, progress }) };
          })
          .filter((guest) => !(guest.state === "LEAVING" && guest.progress > 1));

        return next;
      });
    }, STEP_MS);

    return () => window.clearInterval(interval);
  }, [activeEvent?.type, capacity, isOpen, musicMood, occupancy, onGuestServed, theme]);

  const queueCount = useMemo(() => guests.filter((guest) => guest.state === "QUEUED").length, [guests]);
  const servedCount = useMemo(() => guests.filter((guest) => guest.state === "SERVED").length, [guests]);
  const unhappyCount = useMemo(() => guests.filter((guest) => guest.mood === "impatient").length, [guests]);

  const serviceSatisfaction = useMemo(() => {
    if (guests.length === 0) return 0.78;
    return Math.max(0.2, Math.min(1, 1 - unhappyCount / guests.length + servedCount / Math.max(1, guests.length) * 0.15));
  }, [guests.length, servedCount, unhappyCount]);

  return {
    guests,
    queueCount,
    serviceSatisfaction,
  };
}
