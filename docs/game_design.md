# Game Design Summary (Current Prototype)

## High concept
**Riftlords: Nemesis Siege** is a 2D side-view base battle game inspired by Age of War, with a lightweight campaign and nemesis layer.

## Core loop (implemented)
1. Choose a territory from the campaign map.
2. Enter a lane battle against that territory's commander.
3. Earn gold over time.
4. Spawn units to push toward enemy base while defending your own.
5. Win by destroying enemy base; lose if your base falls.
6. Return to campaign map with commander progression outcomes.

## Unit roster (implemented)
- **Militia**: cheap melee baseline.
- **Spearman**: medium melee, bonus vs knight/cavalry.
- **Archer**: ranged unit.
- **Knight**: fast expensive melee.
- **Priest**: support healer for nearby allies.
- **Siege Ram**: slow bruiser with bonus base damage.

## Campaign structure (implemented)
- 8 territories.
- Each territory has: name, difficulty, modifier text, reward text, commander, conquered state.
- Clicking any territory starts a battle.

## Feel/style (implemented)
- Dark fantasy + arcade UI.
- Minimalist visuals via CSS shapes/colors.
- Includes HUD, cards, battlefield, health bars, floating numbers, and end-of-battle screen.

## Current gaps
- Territory modifiers are mostly descriptive; only difficulty currently impacts simulation meaningfully.
- Economy and upgrade hooks exist but are light.
- No audio or sprite animation assets yet.


## Hero system (new)
- Each battle now spawns one **player hero** and one **enemy hero** automatically.
- Current launch classes: **Warrior**, **Ranger**, **Paladin**.
- Heroes have higher HP, distinct visuals, and class abilities on cooldown.
- Player selects active hero class on the campaign map before entering battle.
- Enemy commander fields a matching-or-random hero, tuned with delayed first cast to keep early battles fair.

## Base assault behavior (new)
- Units now stop at enemy base assault range and repeatedly attack it instead of passing through.
- Base assault is interrupted by nearby enemy blockers, so lane fights can peel attackers off the gate.
- Siege Ram remains the strongest base breaker through its base-damage multiplier.

## Campaign expansion pass (2026-05-07)
- Territory count increased to 18 with typed regions and unlock-gated progression to create route planning.
- Campaign now grants war supplies currency rewards after victories.
- First base-defense mechanics integrated: tower auto-fire, spikes near base, and wall reinforcement HP scaling hooks.
