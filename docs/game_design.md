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
