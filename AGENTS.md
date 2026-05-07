# AGENTS.md — Riftlords: Nemesis Siege

Scope: entire repository.

## Project intent
This repository contains a **first playable prototype** of a browser game called **Riftlords: Nemesis Siege** (React + Vite). Keep momentum high by making **small, focused, reviewable changes** instead of large rewrites.

## Rules for future agents
1. **Do not rewrite the whole game.** Build incrementally on current systems.
2. Keep PRs/task changes scoped to one primary goal (bugfix, balancing pass, UI polish, or one feature slice).
3. Preserve local save compatibility when possible (`localStorage` key: `riftlords_campaign`).
4. Maintain clear separation between:
   - campaign/meta logic
   - battle simulation logic
   - rendering/UI
5. If adding complexity, prefer extracting modules instead of enlarging a single file.
6. Add/adjust comments where future extension points are introduced.
7. Keep the game playable after each change.

## Required workflow
- Read before editing:
  - `docs/architecture.md`
  - `docs/game_design.md`
  - `docs/nemesis_system.md`
  - `docs/todo.md`
  - `docs/bugs.md`
  - `docs/dev_log.md`
- After meaningful changes, update docs:
  - append a dated note in `docs/dev_log.md`
  - update `docs/todo.md` status
  - update `docs/bugs.md` when fixing/adding known issues
  - update design/architecture docs if behavior changed

## Validation expectations
When environment allows:
- Run install/build/dev checks:
  - `npm install`
  - `npm run build`
  - `npm run dev` (smoke test start)
- If commands cannot run (network/dependency/environment constraints), clearly report limitations.

## Coding guidance
- Prefer predictable, data-driven structures for units, territories, commanders, and modifiers.
- Keep deterministic logic isolated so it can be unit tested later.
- Avoid introducing external assets unless required; prototype style currently uses simple shapes/colors.
- Preserve readability over micro-optimizations.
