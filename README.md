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

| seed | situation | era |
|---|---|---|
| `willow` | The Letter | 1954 |
| `hill street` | The Gate | 1954 |
| `june` | The Gate | 1981 |
| `detroit` | The Bottle | 1928 |
| `pearl` | The Bottle | 1981 |
| `cherry` | The Suitcase | 1981 |
| `biscuit` | The Burner | 1928 |

## Running the tests

    npm i playwright three@0.152.2
    node tools/sim.js willow                          # play a seed to its ending
    node tools/sim.js willow 2:16:40 nudge K.hallTable 0   # intervene: day:HH:MM action prop personIndex
    node tools/sim.js cherry 2:10:03 examine S.note 0
    node tools/shot.js pearl                          # screenshot a scene

Tests expect Chromium at `/opt/pw-browsers/chromium` or `npx playwright install chromium`.
