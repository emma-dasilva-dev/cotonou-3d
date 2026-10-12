# COTONOU / 3D — Life Simulator

Status: pre-production / playable prototype planning
Development branch: `feat/life-simulator`
Original exhibition: preserved on `main`

## Vision

Build an original, bilingual (French first, English second) browser-based life simulator inspired by everyday life in Cotonou, Benin. Combine a useful offline NPC-populated experience with optional real-player social interaction.

This is a stylized fictional interpretation of Cotonou, not an exact map or an adaptation of any other game's protected creative assets.

## Product principles

1. Life simulation first: meaningful player actions even with zero other players online.
2. Start with a compact fictionalized Cotonou neighborhood, not a full city.
3. Player choices should alter wallet, inventory, opportunities, and relationships.
4. Reuse the existing architectural assets where suitable; preserve exhibition mode.
5. Keep visuals intentional, performant and distinctly Beninese.
6. French-first UI; English localization throughout.
7. Desktop keyboard/mouse first, mobile touch support as a tested follow-up.
8. No public multiplayer until authoritative validation and basic safety tools exist.

## First playable vertical slice

One small neighborhood containing:
- One controllable third-person character.
- Walkable streets and reliable building/obstacle collisions.
- Third-person follow camera.
- One home and spawn/return point.
- One NPC with short branching interaction.
- One repeatable delivery job.
- Wallet in FCFA, with earnings awarded on completed tasks.
- One shop with one item to buy.
- Basic inventory and persistent local single-player save.

Example loop: spawn -> speak to NPC -> accept delivery -> complete task -> earn FCFA -> purchase item -> return home -> reload and verify persistence.

## Scope exclusions for vertical slice

No shared world, accounts, open voice chat, complex housing editor, drivable cars, advanced AI dialogue, user-generated commerce, real-money transactions, large city map, or photorealism.

## Technical starting point

Existing stack: Next.js 16, React 19, TypeScript, Three.js, React Three Fiber/Drei, GSAP, Tailwind CSS 4.

Current entry point: `src/app/page.tsx` renders `CotonouExperience`.
`CotonouScene` uses an orbital exhibition camera; `CityLife` animates pedestrians and vehicles on paths. Neither currently constitutes a playable character/NPC simulation.

Implementation direction:
- Add a separate gameplay route (proposed `/play`) and maintain the exhibition at `/`.
- Create separate modules for player input, character motion, collision, camera, interactions, economy and save data; avoid embedding all logic in a single React component.
- Evaluate `@react-three/rapier` and compatible versions before adding dependencies.
- Introduce a fixed-step movement/update policy and verify mobile performance before expanding.
- Keep authoritative money and player state on the future multiplayer server, not on the browser client.

## Milestones and acceptance

### 0. Baseline and preservation

- [x] Preserve original exhibition on `main`.
- [x] Create `feat/life-simulator` branch.
- [x] Record scope and vertical slice in this document.
- [ ] Run clean install, lint, TypeScript check and production build.
- [ ] Inspect desktop and mobile runtime and capture initial performance measurements.

### 1. Playable movement

- [ ] Add isolated `/play` prototype route.
- [ ] Add visible character with third-person follow camera.
- [ ] Add usable keyboard input and smooth motion.
- [ ] Add ground/building collisions and eliminate clipping.
- [ ] Validate pointer/touch behavior and accessible menu/pause controls.

Done when a tester can traverse one small district and cannot walk through solid buildings.

### 2. Real gameplay loop

- [ ] NPC interaction with keyboard/touch prompts.
- [ ] Delivery task with validated start/completion state.
- [ ] FCFA wallet and a purchase transaction.
- [ ] Inventory display and local save/load tests.

Done when a tester can earn, purchase, reload and retain their legitimate progress.

### 3. Living offline district

- [ ] Basic NPC daily schedules/state machine.
- [ ] Second job and relationship flags.
- [ ] Navigation and performance budgets.
- [ ] Improve character, environment, and ambience quality.

Done when the experience is engaging with no network connection.

### 4. Hybrid online prototype

- [ ] Evaluate Colyseus authoritative rooms and hosting requirements.
- [ ] Sync two players' motion with interpolation.
- [ ] Add account/session identities and server-side action validation.
- [ ] Add player blocking/reporting and chat safety before open testing.

Done when two real players join the same instanced district, can interact safely, and cannot grant themselves arbitrary game money.

### 5. Persistent shared life

- [ ] Server-owned wallet, inventory and progression.
- [ ] Persistent database and migration plan.
- [ ] Reconnect, race-condition, and duplicate-reward tests.
- [ ] Housing, career and social expansion.

### 6. Wider Cotonou

- [ ] Add further neighborhoods and transport.
- [ ] Optimize assets, instancing, memory, LOD and mobile performance.
- [ ] Conduct structured playtests and accessibility evaluation.

## Next implementation checkpoint

Validate the existing build locally; then add `/play` with a controllable third-person avatar on a small isolated test block. Do not replace `CotonouExperience` or change the entry route as part of that first implementation.

## Quality gate

A milestone is not complete because it only looks good in a screenshot. It needs actual browser verification, correct game state, responsive controls, reasonable performance, keyboard and touch consideration, and no regression to the original exhibition.
