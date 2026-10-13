# VibeZone Club — Codex / VS Code Master Build Prompt (2026-10-13)

You are working in the open VibeZone Club game repository. Implement a focused, playable redesign based on the provided product specification and local visual references, using minimal Codex usage. This is an implementation task, not an audit-only task.

## FIRST: Verify & preserve
1. Confirm the repository identity from its existing README/package manifest and git remote. If it is not clearly the VibeZone Gaming App, STOP without editing. Never work in the VibeQue DJ-request app or Soulware app by mistake.
2. Read AGENTS.md (if present), package manifest, relevant game routes, scene, state/persistence, assets, and existing docs using targeted searches. Respect existing uncommitted changes. Do not overwrite working functionality.
3. Find reference PNGs in `docs/design-references/vibezone/`, especially `01_full_concept_board.png`; these are ORIGINAL CONCEPT/STYLE REFERENCES, NOT ready-to-run 3D models or animations. Reproduce their design direction in the game's actual engine as feasible; do NOT just display the reference image as a fake playable scene. Do not assert a visual match unless verified.

## LOCKED DESIGN DECISIONS
- ONE expandable flagship VibeZone Club venue, with rooms and floors unlocked over time. Do not turn this into independent clubs requiring restart.
- Players choose a starter THEME / MUSIC-CROWD PROFILE on first play; this changes the music-mood categories, outfits, décor palette, guest preferences, and opening objectives; the starting upgrade economy and fairness should stay balanced across selections.
- Initial selection should use as many themes as can be delivered properly from data-driven definitions; prioritize Open Format, EDM/Techno/House, Rock/Alternative, Country/Line Dance, Latin Dance, Hip-Hop/R&B, Retro, and Lounge/Jazz. If full implementations are too large, show additional future themes as clearly locked/coming later, not functional buttons.
- Theme selection is reversible after reaching a defined early milestone, without restarting, forfeiting progress, or requiring purchases; document the threshold. Additional room themes unlock through gameplay. Any room can eventually be assigned an unlocked compatible theme.
- Each club has a visually varied inclusive guest population. No racial admissions/exclusions or race-determined spending behavior. Culture, fashion, dance, age presentation, hairstyles, skin tones, body types, personalities, and individual music preferences create variety. A theme does not determine a guest's race. No racial stereotyping.
- Character style: polished, stylish, expressive, semi-stylized 3D-like game characters with readable eyes, brows, mouths, diverse hair and outfits, and distinct staff/guest/VIP silhouettes. Avoid faceless mannequin/zombie NPCs. On small screens, use readable emotes/animations to reinforce expressions.
- Preserve satisfying BUILD → UPGRADE → EXPAND: improvements physically change appearance and capabilities, not only numeric menu values.
- Balance three living-club mechanisms: (1) Vibe Meter/music choices, (2) guests/regulars/VIP preferences and occasional surprises, (3) optional short dance/rhythm challenges. These augment, not replace, building/operations.
- No forced 24-hour lockouts. Short timers may pace objectives, but always leave meaningful play available. Multiple sessions per day.
- Mobile-first responsiveness, performant character crowds, sound on/off, clear readable HUD, and distinct room ambience. Use existing engine/rendering and assets where feasible; do not force new 3D technology into a 2D project.
- Potential monetization: future optional rewarded ads, optional cosmetic coin packs and VIP subscription, minimal configurable interstitials at most. No ad spam, no real ads or payments, no credentials or live SDK integration during this pass; abstraction/docs only. Free play must remain enjoyable.

## REQUIRED FIRST PLAYABLE VERTICAL SLICE
1. Start screen / starter theme selection with at least THREE fully working contrasting themes, if existing architecture permits. Persist selection. If broader themes can be supported safely through config, enable them too.
2. One lively main-floor club scene with recognizable entrance, DJ booth, dance floor and basic service station; guests have simple visible movement/reactions, and at least one VIP/regular variant.
3. Guests arrive → consume service/entertainment → club earns money → player buys an upgrade → scene AND gameplay reflect upgrade → progress unlocks next objective. Vibe Meter rises/falls based on simple choices.
4. Implement one accessible music-choice decision and one lightweight club surprise. A small optional dance challenge only if affordable after core loop is stable.
5. Show room/floor selector with Main Floor open and proposed VIP Lounge + second themed room locked with clear unlock requirements. Architect for eventual rooftop, Live Music, Techno, Latin, Country, Arcade, Private Events without implementing a whole multi-floor simulation now.
6. Store game progress with versioned existing persistence, safe migration/default handling, no loss of valid previous saves. Use deterministic configuration for balancing and theme profiles; no real copyrighted commercial songs.
7. Provide a functioning local preview through the project's documented dev command. Test desktop and narrow mobile layout. If browser preview cannot be inspected, say so explicitly, do not claim visual verification.

## LOW-USAGE WORKFLOW
- One targeted architecture scan; avoid repo-wide dumps; ignore node_modules, dist, build, caches, archives, and generated assets.
- Reuse current components, stores, libraries, assets, and styling. Avoid new dependencies, API services, unnecessary abstractions and broad rewrites.
- Plan internally then implement in cohesive file batches; prioritize functional game loop and visual scene. No repeated approval questions for small decisions. Do not fabricate files/features/tests.
- Run focused typecheck/tests/build once per meaningful implementation batch, fix introduced errors. Skip expensive unrelated suites unless necessary.
- If task is too big for one pass, ship the deepest complete playable vertical slice and precisely list deferred features. Do not leave half-wired UI pretending to function.

## FILES & DOCUMENTATION
Update applicable existing docs instead of duplicating:
- README.md: setup, preview command, implemented playable features, limitations.
- GAME_DESIGN.md: single building multi-floor design, starter themes, inclusive crowd design, Vibe Meter, guests/regulars/VIPs, surprises, rhythm challenges, progression, monetization principles.
- ROADMAP.md: implemented NOW, highest priority NEXT (max 5), LATER features.
- CHANGELOG.md: date 2026-10-13, factual changes only.
- GAME_BALANCE.md: starting economy, upgrade cost scaling, theme unlock milestone, time limits, reward tuning.
- docs/design-references/vibezone/README.md: map images to screens and clarify concept-art-only status, original production asset requirements and third-party licensing review.

## SAFETY & DELIVERY
No auto-commit, push, merge, deploy, live payment/ad activation, or external expenses. Do not touch unrelated repositories or production data. No secrets. Treat image reference board as stylistic direction, not exact game code. Prefer original assets you create in repo or assets appropriately licensed for commercial distribution; inventory provenance/attribution requirements and flag unresolved asset rights. AI concept images may need original hand-built game-ready models/sprites; do not claim they are unique copyrighted assets or legally risk-free.

Final response: report repo + branch, what was preserved, implemented gameplay and visuals, exact preview command/URL if known from local dev server, changed files, validation PASS/FAIL/NOT RUN, persistence behavior, deferred capabilities, and next five priorities. No vague 'everything complete' claims.
