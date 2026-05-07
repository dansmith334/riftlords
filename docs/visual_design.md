# Visual Design Notes (Prototype)

## Dark-fantasy arcade overhaul (2026-05-07)
- Unit rendering moved to a reusable `UnitSprite` visual system with role-specific layers (body, shield, weapon, sigil, wheels, ram head).
- Battlefield art pass deepened lane mood with atmospheric overlays, lane marks, stronger base silhouettes, and heavier impact effects.
- Commander chips now read as elite cards with stronger trim/portrait treatment by faction.

## Acceptance checklist
- [x] Each unit is recognizable at a glance.
- [x] Knight clearly looks armored.
- [x] Archer clearly has bow/projectile.
- [x] Spearman clearly has spear.
- [x] Siege ram clearly looks like siege engine.
- [x] Attacks are visibly animated.
- [x] Visual style is darker and less cartoonish.

## Unit silhouettes
- **Militia**: poor infantry silhouette (simple tunic, small weapon, basic shield).
- **Spearman**: long forward pike with visible spear tip and braced stance.
- **Archer**: curved bow silhouette with visible fired projectile.
- **Knight**: larger armored body, helm plate, shield, and elite mass.
- **Priest**: robe profile, staff, and holy glow/sigil aura.
- **Siege Ram**: wheeled wooden siege frame with ram head.

## Combat animation pass
- Melee strike and ram slam lunges now show stronger motion and transient weapon arcs.
- Priests emit a brighter cast pulse.
- Hit flashes, impact bursts, and short death fade states improve readability.

## Performance guardrails
- Effects use short-lived lightweight DOM elements.
- No external assets or paid art packs required.
- Animations are CSS keyframes with minimal layout cost.
