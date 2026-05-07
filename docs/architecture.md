# Architecture (Current State)

## Tech stack
- React 18
- Vite 5
- Single-page app with CSS styling

## File layout
- `src/main.jsx`: React entrypoint.
- `src/App.jsx`: currently contains most game logic + UI rendering.
- `src/styles.css`: global and component-level styling.

## Runtime model
- Top-level app has two screens:
  - `map`
  - `battle`
- Campaign state and battle state are held in React state.
- Battle simulation advances on an interval tick (`TICK = 100ms`).

## Data domains
1. **Unit definitions**
   - Static config object with cost, HP, damage/range/speed/rate, role, and visual color.
2. **Campaign data**
   - Territories + commander records + meta upgrades.
3. **Battle state**
   - Gold, bases HP, active units, floating combat text, result flag.
4. **Nemesis memory**
   - Commander memory arrays and metadata persisted in localStorage.

## Persistence
- localStorage key: `riftlords_campaign`
- Stores territories (including commanders) and upgrade state.

## Refactor guidance
- Preferred next step: extract pure functions into modules first:
  - `battle/sim.js` (tick + combat)
  - `campaign/state.js` (build/load/update campaign)
  - `nemesis/logic.js` (memory, survival, trait evolution)
- Keep UI components thin and declarative.
