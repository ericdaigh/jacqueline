# Jacqueline

You wake dead in a generated house. Someone alive is stuck. Figure out what kind of ghost this moment needs, and be it.

A browser game. One HTML file, no build step, no server: open `index.html` or serve the folder statically.

## Layout

- `index.html` — the whole game (three.js r152 from cdnjs is the only dependency)
- `docs/design-map.html` — the design map: loop, generation stack, ghost toolkit, clue design
- `docs/build-plan.html` — phased plan, decisions, and the "our story" memory layer
- `docs/ad-nauseam.html` — the original infinite voxel terrain playable, kept as the terrain layer's reference
- `tools/` — headless test scripts (Playwright): run a seed to its ending, screenshot a scene

## Seeds

Every leap is a pure function of its seed string. The launch screen lets you type one.

## Running the tests

    npm i playwright three@0.152.2
    node tools/sim.js "hill street" nudge     # play a seed to its ending, optionally intervening
    node tools/shot.js pearl                  # screenshot a scene

Tests expect Chromium at `/opt/pw-browsers/chromium` or `npx playwright install chromium`.
