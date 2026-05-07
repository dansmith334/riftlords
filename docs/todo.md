# TODO

## Immediate priorities
- [x] Add balance evaluation harness (`npm run eval:balance`) for autoplay simulations and target checks.
- [ ] Split `src/App.jsx` into modules (`campaign`, `battle`, `ui`) while preserving behavior.
- [ ] Apply territory modifiers as real gameplay effects.
- [ ] Wire upgrade rewards to visible strategic progression.
- [x] Fix base-stop + sustained base attacking behavior for both sides.
- [x] Add first-pass hero system (3 classes, cooldown abilities, UI panel, auto enemy hero).
- [ ] Add lightweight automated tests for battle step logic.
- [x] Add player-hero Forward/Hold/Retreat command controls with persistent state and active-button highlighting.

## Balance and polish
- [x] Validate balance targets with eval harness after each tuning pass (current snapshot: first 85%, normal 53%).
- [ ] Tune unit stats/cost curves for mid/late difficulty.
- [ ] Improve enemy spawn logic (weighted by commander traits and situation).
- [x] Improve battle readability (targeting clarity, lane depth, better unit silhouettes).
- [x] Refine battlefield visual style toward dark-fantasy polish (unit materials, hit feedback, moodier UI pass) without changing combat systems.
- [x] Perform major in-battle visual overhaul (distinct unit sprite system, stronger commander treatment, visible attack/death effects).

## Nemesis depth
- [ ] Expand commander trait system (more strengths/weaknesses with mechanical impact).
- [ ] Add richer taunt generation from memory events.
- [ ] Add explicit defeated/survived commander states in UI.

## Quality
- [ ] Add save versioning/migration for localStorage schema updates.
- [ ] Add reset/save-management controls in UI.
