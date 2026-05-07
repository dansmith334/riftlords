# Nemesis System (Current Prototype)

## Purpose
Add persistent rivalry and personality to campaign enemies, inspired by Shadow of Mordor-style emergent memory.

## Commander model (implemented)
Each territory has a commander with:
- Name
- Title
- Faction
- Personality
- Strength
- Weakness
- Level
- Alive flag
- Memory log

## Persistence
- Commanders persist via campaign save in localStorage (`riftlords_campaign`).
- Commander changes survive page refresh/restart.

## Battle outcome effects
### If player loses
- Commander level increases.
- Commander may gain/roll new strength emphasis.
- New memory entry records their victory context.

### If player wins
- Territory marked conquered.
- Commander marked defeated unless survival roll succeeds.
- 25% survival chance: commander returns with scarred title evolution.
- New memory entry records the defeat and/or survival vow.

## Taunts
- Short taunt line is generated from memory context.
- Current logic is simple and can be expanded into templated/event-driven lines.

## Expansion directions
- Make strengths/weaknesses mechanically modify AI composition and stats.
- Introduce scars as gameplay modifiers (not just title text).
- Track specific kill events (e.g., "Rams broke your gate") to drive future taunts.
- Add hierarchy/promotion behavior among commanders.
