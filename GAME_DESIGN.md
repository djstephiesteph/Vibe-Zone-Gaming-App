# GAME DESIGN - Vibe Zone Club

## Vision

One continuously expandable VibeZone Club where players run nightly operations, shape atmosphere by music identity, manage service flow, restore facilities, and unlock larger themed spaces without restarting progression.

## Pillars

- Building and restoration: visible cleanup/upgrades that change mechanics.
- Operations and ambience: a functioning club even when player input pauses.
- Choices and challenges: Vibe Meter pressure, music mood, VIP/surprise nights.

## Current Playable Slice

- Single building with room progression across existing zones.
- First-play starter identity selection (3 fully playable themes).
- Dynamic guest flow and visible queue/service states.
- Service systems (restroom, kitchen, VIP) tied to occupancy and open/closed state.
- Vibe Meter affected by mood, operations, queue, satisfaction, and events.
- Match-3 income loop plus guest/service payouts.
- Reputation and level progression with active objectives.

## Theme and Crowd Identity

Playable launch themes:

1. Open Format
2. EDM / House
3. Latin Nights

Each includes:

- Distinct signage and scene tinting
- Different guest look pools and dance flavor messaging
- Different vibe/queue tuning bias

Upcoming identities are shown as locked/coming soon. Theme choice is not paid and no demographic restriction is used. Crowd simulation avoids any race-based gate/pricing/satisfaction logic.

## Character Representation

Current implementation uses stylized emoji placeholders for guests and staff with state icons. Final production art target remains expressive, diverse, character-driven sprites or models with readable dance/service/emote loops.

## Operations Model

- Club open/close toggles demand systems.
- Occupancy drives bathroom and kitchen demand.
- Guest finite-state simulation handles arrive/queue/serve/leave loop.
- VIP visits spawn from eligibility and available room.
- Surprise events temporarily alter crowd pressure and service pacing.

## Vibe Meter

Range: 0 to 100.

Influences:

- Positive: operations readiness, service satisfaction, selected mood, theme bias, positive event states.
- Negative: queue pressure, overcrowding, service glitches.

## Objectives and Progression

Three active objective slots surface near-term goals tied to upgrades, service volume, and reputation/event handling. Reputation maps to club level thresholds and unlocks theme switching early, without reset.

## Rooms and Expansion Plan

- Existing room progression remains active.
- VIP progression is surfaced in the current vertical slice.
- Second themed room is exposed as teaser milestone (level-based) but full independent room simulation is deferred to roadmap.

## Economy and Monetization Stance

- Primary earnable currencies: Club Cash (coins) and tips.
- Progression can be completed without purchase.
- Monetization interfaces exist only as local no-op contracts; no live SDK, no billing, and no ad network activation in this slice.
