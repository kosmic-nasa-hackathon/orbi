# AGENTS.md — ORBI

Health autonomy console for astronauts on long-duration missions.
NASA Space Apps Challenge 2026 · team Kosmic.

**Read this first, then the source docs:**

- `docs/BRIEF.md` — product in 2 minutes, scope levels, work lanes.
- `docs/CONCEPTO-ORBI.md` — full concept, rules, scenarios, demo script.
- `docs/STACK.md` — stack, setup, folder structure, CI and risks.
- **`docs/PLAN.md` — live parallel plan: lanes, branches, file ownership and acceptance criteria.**
- `docs/TASKS.md` — historical lane briefs (product context).
- `HANDOFF.md` — live state, blockers and next actions.
- `docs/DEPLOYMENT.md` — Dokploy/Cloudflare runbook.

## Product in one paragraph

ORBI is a tablet app for astronauts. Wearables pre-fill sleep, heart rate, SpO₂ and temperature;
in a 90-second daily check-in the astronaut confirms them and adds mood, fatigue and glucose.
A deterministic rules engine compares each reading with the astronaut's personal pre-flight
baseline and returns six body systems plus a radiation halo, an explained triage decision, an
action card and an escalation path that adapts to communication latency. ORBI does not diagnose:
it prioritizes, explains and escalates.

## Non-negotiable rules

1. `src/domain/` is pure TypeScript. **No React, DOM, browser APIs or UI imports** in that folder.
2. `src/domain/types.ts` is the contract between the engine, UI and coach. Do not change it
   without announcing it to the whole team. The same applies to `src/ai/types.ts`,
   `src/content/systems.ts` and the scenario JSON shape.
3. The UI consumes `evaluate()` and `askCoach()`. **Never reimplement clinical rules in components.**
4. Every threshold lives in `src/domain/rules.ts` with a `SourceRef` and a `verified` flag.
   Do not invent a number. If a value still needs a primary source, keep `verified: false` and
   mark it as pending in the UI/pitch.
5. UI copy, the final README and the submission are **in English**. Internal docs stay in Spanish.
6. No backend, database, auth, ML decision model, computer vision or 3D. The app is a static SPA.
7. Scenario data is synthetic and deterministic: `npm run gen` must reproduce the committed JSON.
   The demo always shows mission day 148. Never randomize data at runtime.
8. No secrets in the repo. No `.env`, tokens or credentials in commits, logs, screenshots or docs.
9. Colour is never the only signal: every state uses colour + icon + text.

## AI coach rules

The deterministic template coach is the default and the fallback. A local LLM may be added only as
an optional **explanation layer**:

- It receives structured facts from `evaluate()`; it never computes thresholds or levels.
- Its output is validated by `src/ai/guardrails.ts` (no diagnosis, no medication, no ungrounded
  numbers, no untriggered actions). If validation fails, fall back to the template.
- It must be feature-flagged: if WebGPU/model loading fails, the app must behave exactly like the
  template path.
- The decision always stays auditable and deterministic. Say "explains on board", never "AI decides".

## Commands

Node 22 is pinned in `.nvmrc`.

```bash
nvm use                 # or: nvm install 22
npm ci
npm run dev             # Vite dev server
npm run gen             # regenerate src/data/scenarios/*.json
npm run test            # Vitest
npm run typecheck       # tsc --noEmit
npm run lint            # Biome
npm run check           # typecheck + lint + tests (run before every PR)
npm run build           # production build in dist/
npm run preview         # serve the production build locally
```

## Architecture

```text
src/
  domain/      pure engine: types, baseline, rules, escalation, evaluate + tests
  ai/          coach provider interface, deterministic template, LLM adapter, guardrails
  data/        seeded RNG, scenario generator, generated JSON
  content/     system labels, "why this matters" copy, level colours
  simulation/  deterministic EVA demo: link loss, inertial drift, return guidance
  screens/     Home (default), Eva demo, engine console (Today/Body/Decision planned)
  App.tsx      routing shell: Home, EVA (?view=eva) and console (?view=console)
scripts/       generate-mission.ts
docs/          product/stack/tasks/deployment docs and NASA/CSA summaries
```

Planned UI structure (see `docs/STACK.md`):

```text
src/screens/       Today, Body, Decision, Trends, MissionControl
src/components/    DemoBar, LevelBadge, body/, charts/, decision/, ui/
src/store/         Zustand store (scenario, day, mission, streak)
```

## Workflow

- One branch per lane:
  `engine/…`, `body/…`, `today/…`, `ai/…`, `mission-control/…`, `design/…`, `deploy/…`.
- Small PRs to `main`, CI green, one integrator merges (Andrea unless `docs/TASKS.md` says otherwise).
- Commit messages use Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- Before changing a contract file, announce it. After data changes, run `npm run gen` and commit the JSON.
- Update `HANDOFF.md` whenever the state, a blocker or the next action changes.
- Do not start Level 1 (Trends/Mission Control) until Level 0 (Today + Body + Decision) works on the
  deployed URL.

## Testing

- Rules, correlations, estimates and escalation need Vitest coverage in `src/domain/*.test.ts`.
- Coach guardrails need adversarial tests (diagnosis, medication, invented number, untriggered action).
- Component tests use Vitest + Testing Library (`jsdom` is configured; `src/test/setup.ts` loads jest-dom).
- Minimum gate: `npm run check` and `npm run build` pass locally and in CI.

## Deployment

- Production: **Dokploy BCN**, domain `https://orbi.agustinpane.xyz` (see `docs/DEPLOYMENT.md`).
- Build: root `Dockerfile` (Node 22 build → `nginx:alpine` serving `dist/`).
- CI: `.github/workflows/ci.yml` runs on PRs and pushes to `main`.
- Auto-deploy: push to `main` → CI → `.github/workflows/deploy.yml` on the self-hosted runner
  (label `orbi`) → Dokploy token webhook. A Dokploy GitHub App is an alternative, not required.
- The Dokploy source is Git over SSH with the `orbi-deploy` deploy key; do not replace it with a PAT.
- Do not enable Let's Encrypt in Dokploy: Cloudflare terminates TLS.
- Do not put secrets in the repo; tokens live in Dokploy/Cloudflare/Vaultwarden.
  `DOKPLOY_TOKEN` is a GitHub repository secret, not a file.

## Definition of done

- `npm run check` and `npm run build` pass.
- The change is reachable from the UI or the engine, not only in a test.
- Tests cover the new rule/correlation/estimate or the guardrail case.
- UI copy is in English; internal docs are updated.
- No contract, secret or generated-data drift is left unexplained.
- `HANDOFF.md` reflects the new state and the next action.
