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
