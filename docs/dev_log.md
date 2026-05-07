# Dev Log

## 2026-05-07
- Added repository coordination docs and root `AGENTS.md` to support consistent iterative development.
- Documented current design, architecture, nemesis behavior, known issues, and prioritized TODO roadmap.
- Added `scripts/eval-balance.mjs` autoplay simulation harness with aggregate balance metrics and target checks.
- Added npm command `npm run eval:balance` and documented balance before/after protocol in `AGENTS.md`.
- Updated TODOs to include harness completion and focus next work on applying insights from eval data.
- Ran `npm run eval:balance` baseline (50 runs/scenario): first battle win rate 0%, normal win rate 0%, avg battle length ~28s, first enemy spawn ~0.28s (enemy overwhelming early).
- Reworked early/mid enemy pacing in game + harness: added enemy gold economy, tech-gated unit pools by battle time, spawn cooldown scheduling, and lighter early aggression.
- Added a learning-battle profile for Ashen Ford (territory id 0) with tuned enemy pacing/base values to keep it beginner-friendly without trivializing it.
- Re-ran `npm run eval:balance` (100 runs/scenario): first battle win rate 85%, normal win rate 53%, avg battle length 4.82-4.88 min, first enemy spawn 2.4s/2.8s, crashes 0.

- Added unit silhouette pass so Militia, Spearman, Archer, Knight, Priest, and Siege Ram now read as their names/classes using lightweight CSS-built shapes.
- Added commander portrait chips on campaign cards with faction-based color coding to improve commander uniqueness at map glance.
- Added combat feel pass: melee strike/lunge, archer shoot animation + projectile, priest cast/heal pulse, ram slam, plus impact flashes and hit feedback.
- Added `docs/visual_design.md` to document the visual language and performance guardrails for future iterations.
- Ran a dark-fantasy UI polish pass focused on style (not balance): adjusted battlefield/HUD/card lighting, deeper palette, higher-contrast materials, and grittier commander portrait chips while preserving readability at small sprite size.
- Refined unit proportions and silhouettes with subtle armor/material shading and clearer role accents so classes remain identifiable but less toy-like.
- Tightened attack animation timing curves and motion offsets to improve impact weight without exaggerated/cartoon movement.
- Improved combat feedback readability by upgrading hit flash treatment, impact burst gradients, and projectile treatment for punchier but restrained feel.

- Shipped a major visual overhaul focused on battlefield readability and style while preserving gameplay values: introduced reusable `UnitSprite` layering and class-distinct silhouettes for militia, spearman, archer, knight, priest, and siege ram.
- Upgraded commander chips to feel elite/named with heavier faction trim treatment and less placeholder portrait styling.
- Strengthened combat FX with visible weapon arcs, clearer arrows, brighter priest cast pulses, stronger impacts, hit recoil flashes, and short death fade states for defeated units.
- Reworked lane/background/base presentation into a darker fantasy arcade look with clearer ground separation and more legible base health bars.

- Implemented base assault fix: units now stop at enemy base edge and repeatedly attack instead of sliding through structures; assaults are interrupted by nearby enemy blockers.
- Added first-pass hero system with 3 classes (Warrior/Ranger/Paladin), per-battle hero spawn for both sides, cooldown abilities, hero selection on map, and in-battle hero status panel.
- Updated balance harness to model base-stop siege behavior and hero presence in simulations.
