# Vibe Zone Gaming App

Single-building nightclub management + match-3 progression game built with React, TypeScript, Vite, and Tailwind.

## What Works Now (Vertical Slice)

- First-play starter choice with 3 functional themes:
  - Open Format
  - EDM / House
  - Latin Nights
- Theme choice affects:
  - Visual tint/accent in the active room scene
  - Guest appearance pool
  - Vibe bias and queue tolerance in simulation
- Club operation while idle:
  - Guests visibly arrive, queue, enter, dance/order, get served, and leave
  - Restroom, kitchen, VIP, and occupancy loops keep running while open
- Vibe Meter (0-100) reacts to:
  - Crowd pressure/overcrowding
  - Queue pressure and service satisfaction
  - Music mood choice (Balanced Set, Peak Hour Push, Cool Down Session)
  - Room operations and temporary surprise events
- Surprise events:
  - VIP Rush
  - Birthday Crew
  - Service Glitch
- Management progression:
  - Coins, tips, stars, reputation, level, and objective tracking
  - Upgrade purchases affect room visuals and systems
  - Theme switching unlocks at 15 stars or 180 reputation (non-destructive)
- Room progression teaser state is visible:
  - VIP section progression text is visible in-game
  - Second themed room unlock teaser appears at level 4 (full room simulation is roadmap)
- Save/load:
  - Local storage migration to v6 save format
  - Starter theme, progression counters, and unlocked systems persist across reloads

## Core Loop

1. Start with theme selection.
2. Open club and run ambient operations.
3. Play match-3 sets for coin income.
4. Buy upgrades to restore rooms and unlock systems.
5. Serve guests/VIPs and collect coins/tips.
6. Push vibe and objectives to gain reputation/levels.
7. Reload and continue from saved progress.

## Controls

- Tap upgrade clutter/items to purchase
- Toggle open/closed state from the top control
- Use mood buttons to shift music energy
- Jump between zones with room pills
- Tap dirty restroom stalls to clean
- Pick up and deliver kitchen orders (or hire waiter)
- Collect VIP payout when ready

## Tech Notes

- Engine: React + DOM scene rendering (no Unity/Three.js dependency)
- Room perspective: 2.5D style via gradients, depth scaling, and layered room stage
- Simulation strategy: bounded lightweight guest state machine, no expensive pathfinding
- Monetization scaffolding: no-op service interfaces only (no billing/ad SDK enabled)

## Running Locally

```bash
npm install
npm run dev
```

Dev server default URL:

```txt
http://localhost:5173
```

## Build Validation

```bash
npm run build
```

## Capacitor

```bash
npm run build
npm run cap:sync
npm run cap:ios
npm run cap:android
```

## Verification Status

- TypeScript/build validation: expected via local `npm run build`
- In this implementation pass: visual behavior is implemented in code, but full manual desktop/mobile gameplay verification is still required in a browser/device session.

## Known Current Limits

- No dedicated automated test runner is configured in this repository yet.
- Guest visuals are emoji-based placeholders, not final authored character sprites/models.
- Second themed room is intentionally a progression teaser in this slice, not fully simulated yet.
- Surprise events are lightweight local simulation events, not backend-driven live ops.
