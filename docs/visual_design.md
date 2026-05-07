# Visual Design Notes (Prototype)

## Unit silhouettes
- **Militia**: cloth-toned body + short weapon for cheap footsoldier read.
- **Spearman**: extended pike with pointed spear tip.
- **Archer**: clear curved bow shape and shot trail projectile.
- **Knight**: heavier steel palette, larger torso, shield accent.
- **Priest**: pale robe palette, staff with holy orb and healing pulse.
- **Siege Ram**: non-humanoid wooden frame with wheels and front ram head.

## Commander identity pass
- Territory cards now use a small portrait medallion with faction color coding.
- Commander row is visually separated so commanders read as more important than regular territory text.

## Combat animation pass
- Added lightweight attack animations by class: strike, shoot, cast, slam.
- Added arrow projectiles for archers.
- Added impact pulses and hit flash feedback.
- Added healing pulse visual for priests.

## Performance guardrails
- Effects use short-lived lightweight DOM elements.
- No external assets or paid art packs required.
- Animations are CSS keyframes with minimal layout cost.
