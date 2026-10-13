# Vibe Zone

A music-matching puzzle game. Play an open-ended track of match-3 sets to
earn Coins, then spend Coins tapping whatever piece of junk you want to
clear next — My Perfect Hotel's build-at-your-own-pace model, with a
Homescapes-style match-3 underneath it.

## Rooms (2.5D look)

Each zone is its own **room** (`src/components/RoomStage.tsx`) with its own
wall colors/mood (`theme` in `src/data/zones.ts`) and a perspective floor
(trapezoid, narrow at the back wall). Items shrink slightly the further
back they sit (`depthScale`), which gives real depth without true 3D
transforms — robust in iOS/Android WebViews, and every CSS animation keeps
working. A room switcher (`RoomSwitcher.tsx`) lets you walk into any zone
you've reached; the view auto-walks into the next room when one finishes.
Cross-room alerts (dirty stalls, ready food, a waiting VIP) appear as chips
that jump you to the right room. Food has to be carried from the Kitchen
room to a highlighted table in the Seating room. Item x/y are now local to
each room (0-100). True 3D (Three.js/WebGL + models) would be a separate,
much larger art/asset effort.

## Capacity & occupancy

The club can only hold as many guests as it's actually built out to fit —
**capacity** (`src/game/capacity.ts`) is computed from what's been bought,
not stored: each dance-floor row, table, chair, bar stool, and VIP booth
adds its own amount (floor rows contribute the most per section, VIP
booths the most per seat). **Occupancy** (`src/hooks/useOccupancy.ts`)
simulates how full the club actually is right now, 0 up to capacity —
rising while open and room remains, slowly turning over as guests leave,
emptying out the moment the club closes.

Occupancy then drives the systems already built, so a fuller club
visibly does more business:
- **VIPs** only spawn if there's room (`hasRoom` in `useVipSystem`) — no
  VIP walks into a packed house.
- **Restroom and kitchen demand scale with occupancy** — an empty club
  generates zero bathroom needs or food orders no matter how long it's
  been open; a packed one generates noticeably more, and kitchen orders
  fire a bit faster the fuller it gets.

## Core loop

- **Coins** come from playing match-3 sets (`src/data/levels.ts`,
  `getLevelConfig`/`coinsForStars`). The track is open-ended — difficulty
  climbs then plateaus, so it's endlessly replayable for more coins. Not
  tied to any specific club item.
- The club has **66 items** across **10 zones**: Entrance → Dance Floor →
  Seating → Bathrooms → Bar → Kitchen → DJ Booth → Lighting → VIP Lounge →
  Grand Reopening. Only the **current zone** is buyable; within it, every
  item can be bought in any order. Afford it, tap it, it clears instantly
  — no mini-game required per item. Finishing a zone unlocks the next.
- Staff hires (`kind: "staff"`) — door host, **security guard**,
  bathroom attendant, bartender, **waiter**, chef, DJ, VIP host — are
  each zone's priciest, capstone purchase. Staff render with a gold glow
  instead of furniture's magenta glow, so uniformed crew reads as
  visually distinct even with emoji rather than custom sprite art (swap
  the emoji per role in `clubItems.ts` for real costume art later — the
  gold-glow styling already does the "this is staff" signaling
  independent of whichever icon is there).
- A **cleaner wanders the room** ambiently once anything's been cleared;
  once the **waiter** is hired, a second ambient figure joins (cosmetic
  only, no gameplay effect).
- **Players name their own club** (tap the pencil next to the name) and
  **open/close it** (toggle button). Patrons, VIPs, and kitchen orders
  only happen while **open** — closed just pauses all three service
  loops; building/buying is unaffected either way.
- **Bathrooms are live once built**: 3 women's + 3 men's stalls
  (`src/hooks/useRestroomSystem.ts`). Patrons need a stall periodically;
  if one's clean, max tip (100) instantly. If not, they wait — tap a
  dirty stall to clean it (that's the player's job), or hire the
  attendant to have stalls auto-clean on a timer too. Longer wait = lower
  tip (see `tipForWait` in `src/game/service.ts`).
- **Kitchen orders work the same way**, once the Kitchen zone and a
  Seating table both exist (`src/hooks/useKitchenSystem.ts`). An order
  fires a timer immediately; once it's done cooking, tap the ready food,
  then tap its assigned table (highlighted in gold) to deliver — total
  elapsed time (order → delivered) sets the tip, same tiering as the
  restroom. **Hire the waiter** (Seating zone capstone) and delivery
  happens automatically a few seconds after the food's ready, no tap
  needed — same tip math, just hands-off. **v1 runs one order at a
  time**, not every table ordering at once — see "Known v1
  simplifications" below.
- **VIPs** (`src/data/vips.ts`, `src/hooks/useVipSystem.ts`) are 5
  original archetype characters (not real celebrities — avoids
  publicity-rights/App Store risk) who spawn randomly once you've built
  the VIP Lounge (Vivienne Cartier also requires Lighting finished first).
  They visit, "order" from the bar/kitchen, then leave a Coin + **Tip**
  payout — tap "Collect" once they're ready. Tips are a secondary,
  optional currency; nothing in the main build-out requires them, so
  they're a side-track for players who want more to chase after — spend
  them on cosmetic extras later (not yet built).

## What's here

- **Match-3 engine** (`src/game/match3.ts`) — no external game library.
- **Items** (`src/data/clubItems.ts`, `src/data/floorGrid.ts`,
  `src/data/items.ts`) — 52 discrete furniture/fixture/staff items plus 8
  dance-floor row items (10 tiles each) = 60 total. `getActiveZone()` in
  `items.ts` is the only thing gating progress.
- **Zones** (`src/data/zones.ts`) — the 10-zone build order.
- **Levels/coins** (`src/data/levels.ts`) — the open-ended match-3 track
  and its coin payout table.
- **VIPs** (`src/data/vips.ts`, `src/game/vipPayout.ts`,
  `src/hooks/useVipSystem.ts`) — roster, spawn gating, tip-quirk logic
  (Lyric Bolt tips more with the floor built, Trey Diamonte tips more per
  VIP booth built), and the spawn/visit timer.
- **Progress** (`src/hooks/useProgress.ts`) — coins, tips, cleared items,
  next level index, all in `localStorage`. Swap for Supabase later for
  cloud save/leaderboards.

### Known v1 simplifications (easy to revisit later)
- A VIP visit, a restroom wait, and a kitchen order all live in memory
  only — refreshing the app loses whatever's in progress (coins/tips
  already earned are safe; it's just the live state that resets).
- "5 minutes" is in-game time, not real time — `GAME_MINUTE_MS` in
  `src/game/service.ts` is the single constant controlling the pace for
  both the restroom and the kitchen; tune it to speed up/slow down both.
- Kitchen runs **one order at a time** — a new one doesn't start until
  the last is delivered. Real multi-table ordering (several dishes
  cooking/waiting at once) is a natural v2; the data model (tables
  flagged `isTable: true`) already supports it, the hook would just need
  to track an array of orders instead of one.
- The restroom "line" is simplified to one outstanding wait per gender,
  not a real multi-person queue.
- Tips have no spend target yet (no cosmetic-extras shop built).
- Staff hires other than the bathroom attendant and the waiter are
  one-time purchases only — no passive/idle income yet for bartender,
  chef, DJ, security, etc. Their auto-clean/auto-deliver loops are the
  template for adding similar passive behavior to the rest later.
- "Uniforms" are emoji choice + a gold glow, not real costume art — see
  the zones bullet above.
- Occupancy is one aggregate number, not per-guest simulation — there's
  no individual "guest" object with their own arrival/departure timer,
  just a count that rises and falls. Good enough to drive demand; a true
  per-guest model (each with their own patience, their own order) would
  be a bigger v2.

## Monetization (ads / IAP) — what's possible where

Ads and in-app purchases both require **native Capacitor plugins**
(e.g. `@capacitor-community/admob`), which only work in an exported,
Capacitor-built app on a real device/simulator — **not** in Lovable's web
preview. Build the game here, then wire in ads/IAP at the native-build
step. Both Apple and Google require disclosure (App Privacy section /
Data Safety form), and iOS requires an App Tracking Transparency prompt
for personalized ads. Rewarded video (e.g. "watch an ad for bonus coins")
tends to fit this genre best — converts better than forced interstitials.

## Adding more content later

Everything expandable is a plain data file, not game logic:
- **New item** → add one entry to `clubItems.ts` (or extend `floorGrid.ts`
  for more floor rows).
- **New zone** → add to `zones.ts` in the order you want, then give some
  items that `zone` name.
- **New VIP** → add one entry to `vips.ts` (name, archetype, tip range,
  `requiresZones`); add any tip-quirk logic as another `if (vip.id ===
  ...)` branch in `vipPayout.ts`.
- **More/harder levels** → the track in `levels.ts` is already open-ended;
  raise the plateau cap or add another difficulty band if you want it to
  keep climbing further before leveling off.

## Using this in Lovable

Standard Vite + React + TypeScript + Tailwind — Lovable's stack. Push to
a GitHub repo and connect it, or paste file contents into a fresh Lovable
project. No unusual dependencies (just `react` / `react-dom`).

## Running locally

```bash
npm install
npm run dev
```

## Building for Android and iOS (Capacitor)

```bash
npm install
npm run build          # outputs to /dist

npx cap add ios        # first time only
npx cap add android     # first time only

npm run cap:sync       # copies /dist into both native projects

npm run cap:ios        # opens Xcode
npm run cap:android    # opens Android Studio
```

`capacitor.config.ts` sets the app id (`com.wrightplace4solutions.vibezone`),
app name ("Vibe Zone"), and dark launch background color.
