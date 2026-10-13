# GAME BALANCE

## Purpose

This file centralizes tuning intent and current values used by the implemented vertical slice.

## Starting State

- Starting coins: 500
- Starting stars: 0
- Starting reputation: 0
- Starter themes: Open Format, EDM/House, Latin Nights

## Match-3 Earnings

Defined in level payout logic:

- 1 star: 50 coins
- 2 stars: 100 coins
- 3 stars: 150 coins

## Upgrade Progression

- Upgrade costs are data-driven per item in room/item definitions.
- Purchasing an upgrade grants:
  - +5 reputation
  - +1 total upgrade counter
- Upgrades remain permanent and persist on reload.

## Service Income

### Restroom and Kitchen

Tip tiers are time-based through shared service pacing constants:

- <= 5 in-game minutes: 100 tip
- <= 10 in-game minutes: 20 tip
- <= 15 in-game minutes: 15 tip
- <= 20 in-game minutes: 10 tip
- > 20 in-game minutes: 5 tip

Coin conversion from service tip:

- coins = round(tip * 0.6)

### Guest Flow

Guest service payout in current slice:

- Base coins per served guest: 5
- Mood/event modifiers can increase this by small fixed amounts
- Tips: low but frequent to keep loop active
- Reputation per served guest: default +2

## VIP

VIP payout remains character-based with existing quirk logic and coin conversion from tips.

## Reputation and Level

Current level thresholds by reputation:

- Lv1: 0
- Lv2: 70
- Lv3: 180
- Lv4: 340
- Lv5: 560
- Lv6: 860
- Lv7: 1240
- Lv8: 1700

Theme switch unlock:

- 15 stars OR 180 reputation

## Vibe Meter Inputs

Vibe score (0-100) currently blends:

- occupancy ratio
- queue pressure
- service satisfaction
- chosen mood
- theme bias
- event modifier
- operations bonus

Operations bonus currently includes built systems such as kitchen, bathrooms, bar, DJ booth, waiter, and attendant.

## Surprise Events

Event duration and effects are intentionally short for 5-15 minute sessions:

- VIP Rush: +crowd intensity and vibe boost
- Birthday Crew: temporary positive vibe/economic pressure
- Service Glitch: temporary queue/service penalty

## Notes

- Values are intentionally conservative and centralized in hooks/game helpers for iteration.
- This version avoids punitive multi-hour lockouts or forced return timers.
