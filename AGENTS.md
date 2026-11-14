# AGENTS.md — ORBI

Health autonomy console for astronauts on long-duration missions.
NASA Space Apps Challenge 2026 · team Kosmic.

**Read this first, then the source docs:**

- `docs/BRIEF.md` — product in 2 minutes, scope levels, work lanes.
- `docs/CONCEPT.md` — full concept, rules, scenarios, demo script.
- `docs/STACK.md` — stack, setup, folder structure, CI and risks.
- **`docs/PLAN.md` — live parallel plan: lanes, branches, file ownership and acceptance criteria.**
- `docs/TEAM.md` — live roster, owners, worktrees, ports and onboarding.
- `docs/TASKS.md` — historical lane briefs (product context).
- `HANDOFF.md` — live state, blockers and next actions.
- `docs/DEPLOYMENT.md` — Dokploy/Cloudflare runbook.

## Product in one paragraph

ORBI is a tablet app for astronauts. Wearables pre-fill sleep, heart rate, SpO₂ and temperature;
in a 90-second daily check-in the astronaut confirms them and adds mood, fatigue and glucose.
A deterministic rules engine compares each reading with the astronaut's personal baseline, learned
during 90 days of ground training and, when the crew member opts in, by menstrual-cycle phase, and
returns six body systems plus a radiation halo, an explained triage decision, an action card and an
escalation path that adapts to communication latency. ORBI does not diagnose: it prioritizes,
explains and escalates.

The 90-day/cycle-aware baseline, the `cycle-aware` correlation and the `luteal-phase` scenario are
the documented target (see `docs/PLAN.md` P3). Until P3 lands, the code still uses a 14-day
pre-flight baseline, 3 correlations and 4 scenarios; keep that distinction visible in docs.

## Non-negotiable rules

1. `src/domain/` is pure TypeScript. **No React, DOM, browser APIs or UI imports** in that folder.
2. `src/domain/types.ts` is the contract between the engine, UI and coach. Do not change it
   without announcing it to the whole team. The same applies to `src/ai/types.ts`,
   `src/content/systems.ts` and the scenario JSON shape. The cycle/ground-baseline extension
   (`Phase`, `CrewProfile`, cycle fields) is **proposed in `docs/CONCEPT.md` §8 but not
   applied**; announce it before the `engine/cycle-baseline` PR.
3. The UI consumes `evaluate()` and `askCoach()`. **Never reimplement clinical rules in components.**
4. Every threshold lives in `src/domain/rules.ts` with a `SourceRef` and a `verified` flag.
   Do not invent a number. If a value still needs a primary source, keep `verified: false` and
   mark it as pending in the UI/pitch. The 600 mSv career limit has a primary source since 2022
   (`docs/resources/08`, single limit for all sexes and ages); keep `radiation` pending in code
   until P1/P3 updates `rules.ts`.
5. UI copy, the final README, the submission and all project docs are **in English**.
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

Node 22 and npm 10 are pinned in `.nvmrc`, `packageManager` and `engines`; `.npmrc` enforces them.

```bash
nvm use                 # or: nvm install 22
npm ci
npm run dev             # Vite dev server
npm run gen             # regenerate src/data/scenarios/*.json
npm run test            # Vitest
npm run typecheck       # tsc --noEmit (full app)
npm run check:domain    # tsc over pure layers with no DOM lib
npm run lint            # Biome (local check mode)
npm run lint:ci         # Biome CI mode (same gate as GitHub Actions)
npm run check           # typecheck + check:domain + lint:ci + tests (run before every PR)
npm run build           # production build in dist/
npm run preview         # serve the production build locally
```

## Toolchain and type/structure rules

The stack is **Vite 8 + React 19.3**. Do not add Next.js, SSR or a backend; this is a static SPA.
Pinned versions: Node 22, npm 10, TypeScript 5.9, Biome 2.6 and Vitest 5.

Enforced locally and in CI:

- `tsconfig.json`: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`,
  `noUncheckedSideEffectImports`, `allowUnreachableCode: false`, `allowUnusedLabels: false` and
  `verbatimModuleSyntax`. Use `import type` for type-only imports.
- `tsconfig.domain.json`: checks `src/domain`, `src/data`, `src/content` and `src/simulation`
  **without the DOM lib**, so `window`, `document` and browser APIs fail at compile time.
- `biome.json`: recommended preset, `noExplicitAny` as an error, `useImportType` and `useConst`
  enabled, and imports organized on check. Do not use `any`; use `unknown` and narrow it.
- Pure layers (`domain`, `data`, `content`, `simulation`) cannot import React, the DOM, Zustand,
  Motion, `@/components/*`, `@/screens/*`, `@/store/*` or `@/ai/*`. Biome's `noRestrictedImports`
  and `noRestrictedGlobals` enforce the boundary.
- `.editorconfig` is the editor baseline; Biome is the formatter and linter of record.

Run `npm run check` before every PR. Do not bypass it with `--no-verify` or by weakening the flags;
if a new rule is too noisy, discuss it and change the config in a dedicated PR.

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

- **Claim the GitHub issue for your lane before writing code** (see next section).
- One branch per lane:
  `engine/…`, `body/…`, `today/…`, `ai/…`, `mission-control/…`, `design/…`, `deploy/…`.
- Cut branches from `development` and open PRs against `development`.
- Small PRs to `development`, CI green, one integrator merges (`@Agupane`; backup
  `@atapiamallea`; see `docs/TEAM.md`).
- `main` is release-only: the integrator opens the `development` → `main` release PR, and that
  merge triggers the automatic deploy to the preview.
- Commit messages use Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
- Before changing a contract file, announce it. After data changes, run `npm run gen` and commit the JSON.
- Update `HANDOFF.md` whenever the state, a blocker or the next action changes.
- Do not start Level 1 (Trends/Mission Control) until Level 0 (Today + Body + Decision) works on the
  deployed URL.

## Issue ownership (agents)

Every task must be tied to a GitHub issue. The assignee is the lock: **if an issue is assigned to
someone else, do not start it.**

1. Find your issue in `docs/TEAM.md` or with `gh issue list --assignee @me --state open`. If `gh`
   is not authenticated, run `gh auth status` first.
2. If the issue does not exist, create it with the lane name, scope, allowed files and acceptance
   criteria (`gh issue create`). Use the lane labels from `docs/PLAN.md`.
3. If it exists but is unassigned, claim it **before writing code**:

   ```bash
   gh issue edit <number> --add-assignee @me
   ```

4. If it is assigned to someone else, stop and coordinate in the issue. Never reassign another
   person's issue yourself.
5. Once it is yours, comment the branch, worktree and port before writing code:

   ```bash
   gh issue comment <number> --body "Starting on <branch> (worktree <path>, port <port>)."
   ```

6. Reference it in the PR body with `Closes #<number>`.
7. On completion, update the issue and close it. If you stop blocked, leave it assigned and comment
   the blocker and the next action.

## Testing

- Rules, correlations, estimates and escalation need Vitest coverage in `src/domain/*.test.ts`.
- Coach guardrails need adversarial tests (diagnosis, medication, invented number, untriggered action).
- Component tests use Vitest + Testing Library (`jsdom` is configured; `src/test/setup.ts` loads jest-dom).
- Minimum gate: `npm run check` and `npm run build` pass locally and in CI.

## Deployment

- Release preview: **Dokploy BCN**, domain `https://orbi.agustinpane.xyz` (see `docs/DEPLOYMENT.md`).
- Build: root `Dockerfile` (Node 22 build → `nginx:alpine` serving `dist/`).
- CI: `.github/workflows/ci.yml` runs on PRs and pushes to `main` and `development`.
- Auto-deploy: release merge into `main` → CI → `.github/workflows/deploy.yml` on the self-hosted
  runner (label `orbi`) → Dokploy token webhook. A Dokploy GitHub App is an alternative, not
  required.
- The Dokploy source is Git over SSH with the `orbi-deploy` deploy key; do not replace it with a PAT.
- Do not enable Let's Encrypt in Dokploy: Cloudflare terminates TLS.
- Do not put secrets in the repo; tokens live in Dokploy/Cloudflare/Vaultwarden.
  `DOKPLOY_TOKEN` is a GitHub repository secret, not a file.

## Definition of done

- `npm run check` and `npm run build` pass.
- The change is reachable from the UI or the engine, not only in a test.
- Tests cover the new rule/correlation/estimate or the guardrail case.
- UI copy and project docs are in English.
- No contract, secret or generated-data drift is left unexplained.
- The issue is claimed, referenced with `Closes #<number>` and closed; if blocked, it stays
  assigned with a comment explaining the blocker and next action.
- `HANDOFF.md` reflects the new state and the next action.
