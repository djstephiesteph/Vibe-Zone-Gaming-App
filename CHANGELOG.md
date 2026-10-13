# Changelog

## 1.2.0 - 2026-10-13

- Added first-play starter theme selection with 3 playable options:
  - Open Format
  - EDM / House
  - Latin Nights
- Added theme registry for future expansion with clearly labeled coming-soon themes.
- Added save migration to v6 progress format with new persistent fields:
  - selected theme
  - unlocked themes / theme-switch unlock state
  - reputation and progression counters
  - service and event tracking metrics
- Added reputation/level progression helpers and early theme-switch unlock milestone.
- Added bounded guest state-machine loop with visible states:
  - arriving, queued, entering, dancing, ordering, served, leaving
- Added Vibe Meter calculation based on occupancy, queue pressure, satisfaction, operations, mood, and live event modifiers.
- Added player music mood controls:
  - Balanced Set
  - Peak Hour Push
  - Cool Down Session
- Added lightweight surprise event loop:
  - VIP Rush
  - Birthday Crew
  - Service Glitch
- Added active objective panel with progress bars and completion state.
- Added progression teaser UI for VIP/second themed room milestones.
- Added monetization service scaffolding interfaces as no-op implementations:
  - RewardedAdService
  - PurchaseService
  - SubscriptionService
- Updated room scene visual layering with theme tint overlays and improved global background/font styling.
- Updated documentation set:
  - README
  - GAME_DESIGN
  - GAME_BALANCE
  - ROADMAP
  - ASSET_PROVENANCE
  - design reference mapping notes

## 1.1.0

- New players start with 500 coins; v4 saves migrate to the v5 save key.
- Mini-games hub: Beat Tap, Cocktail Mixer, Light Show (20 levels each, coins and stars on win).
- 3D layout preview (`mocks/3d-preview.html`, not part of the app): fresh-start rooms for all 10 zones, door with a queue outside the wall, owner character, 2-6 seat tables unlocked by level, trash/cleaning with hired help, wall art and windows in tiers.

## 1.0.0

- Match-3 coin track, 10-zone club build-out, restroom/kitchen/VIP service loops.
