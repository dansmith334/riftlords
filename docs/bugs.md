# Known Bugs / Issues

## Open
1. **Upgrade stats are partially unused**
   - `unitHpMult` / `unitDmgMult` are tracked but not consistently applied to spawned unit combat stats.
   - Impact: reward progression feels weaker than expected.

2. **Enemy AI is simplistic**
   - Enemy spawns are random by difficulty slice and do not fully reflect commander strengths/weaknesses.
   - Impact: nemesis flavor is stronger in text than mechanics.

3. **Territory modifiers mostly cosmetic**
   - Modifier strings display on map but are not systematically translated into runtime battle effects.
   - Impact: campaign choices feel less distinct.


## Resolved
1. **Units rendered as generic blocks with weak readability**
   - Replaced block-only bodies with class-specific silhouettes and commander portrait chips.
   - Added attack/heal/hit visuals so combat intent is readable at a glance.


2. **Units could pass through enemy base instead of sieging**
   - Units now stop at base assault distance and continue attacking until blocked, dead, or base destruction.

