# HANDOFF — ORBI

**Date:** 2026-11-14
**Branch:** `development` (integration) · `main` (release)
**State:** engine, data, coach, tests, Home, EVA, console, pitch, deploy, documentation and the F0
design foundation (light/dark theme, tokens, primitives, nav and store) ready in the release preview.
The code still has a 14-day baseline, 3 correlations and 4 scenarios.
**Missing:** run the lanes in `docs/PLAN.md`: Level 0, P3 (ground baseline + cycle),
Trends/Mission Control, visual polish, extras and submission.
**Parallel execution plan:** `docs/PLAN.md`
**Assignment and onboarding:** `docs/TEAM.md`
**Integrator:** `@Agupane` (backup: `@atapiamallea`)
**Release preview:** **https://orbi.agustinpane.xyz** · Dokploy app `ORBI`
(`pnNCsfPVhaq6_lgsFDTEF`) · `appName` `app-input-open-source-panel-hqyoop`.

---

## 1. How to start

```bash
git fetch origin
git checkout development
git pull --ff-only
npm ci
npm run gen
npm run dev
```

Branch model: every PR targets `development`. The integrator opens `development` → `main` as the
release PR; merging it runs CI and the automatic deploy to the preview.

Verification:

```bash
npm run check    # typecheck + check:domain + Biome CI + tests
npm run build    # tsc --noEmit + vite build
```

Node 22 and npm 10 pinned (`.nvmrc`, `packageManager`, `engines`; `.npmrc` with `engine-strict`).
There is no backend, database or environment variables.

---

## 2. Current state (verified)

- **Current code:** deterministic engine with 6 systems + halo, 3 correlations, 14-day baseline,
  4 scenarios, bone rules and estimates; `npm run gen` reproduces the JSON without diff.
- **F0 shipped:** light/dark theme with `localStorage`, design tokens, UI primitives, motion helpers,
  nav shell and Zustand store; route placeholders for Today/Body/Decision/Trends/Mission Control.
- **Target documentation (post #5):** 90-day ground-training baseline, phase-aware cycle baseline
  (opt-in and private), 4 correlations and 5 scenarios. P3 implements it.
- Template coach (default and fallback) + optional local adapter + guardrails.
- Home `/`, EVA demo `?view=eva`, console `?view=console` and pitch `/pitch/`.
- Sticky nav with icons, query routes and back/forward.
- CI, Docker, nginx, Dokploy, Cloudflare and auto-deploy working.
- Unified quality: strict TypeScript 5.9, `tsconfig.domain.json` without the DOM lib, Biome 2.6 with
  pure-layer overrides and `biome ci` inside `npm run check`.
- GitHub issues as lock: the assignee is claimed with `gh issue edit <n> --add-assignee @me`
  before writing code.
- All project docs are in English; source summaries live in `docs/resources/`.
- **56/56 tests**; `npm run check` and `npm run build` green.
- The release preview responds `200` at `/`, `?view=eva`, `?view=console` and `/pitch/`; F0 is
  deployed (`theme-init.js` and the new theme assets are present).

**Known caveat:** Cloudflare injects an inline challenge script that the CSP blocks. It is
external to the app; do not relax `script-src 'self'`.

---

## 3. What is missing

The details, allowed files and acceptance criteria are in `docs/PLAN.md`.

| Wave | Lane | Owner | Status |
|---|---|---|---|
| 0 | P0 · Pitch light + motion | `@elenaalmansacampos` | ready |
| 0 | P1 · Threshold audit | `@Agupane` | ready |
| 0 | P2 · Submission groundwork | `@elenaalmansacampos` | ready |
| 0 | P2.1 · Public repo and submission access | `@Agupane` | ready |
| 1 | F0 · Foundation (light theme, switch, tokens, UI, motion, nav, store) | `@atapiamallea` | done (#36, deployed) |
| 1 | F0.1 · Deployed version footer | `@Yeryalex` | ready |
| 1 | P3 · Engine: ground baseline + cycle | `@Agupane` | blocked by #9 |
| 2 | A · Today | `@atapiamallea` | blocked by #12 |
| 2 | A.1 · Profile and consent | `@atapiamallea` | blocked by #12 + #13 |
| 2 | B · Body | `@atapiamallea` | blocked by #12 |
| 2 | C · Decision | `@atapiamallea` | blocked by #12 |
| 2 | E · Visual polish (less density, more animations) | `@amilege` | ready |
| 3 | D · Trends | `@Yeryalex` | Level 0 gate (#32) |
| 3 | F · Mission Control | `@amilege` | Level 0 gate (#32) |
| 3 | G · Level 2 (Amsler, procedures, PWA) | `@amilege` | Level 0 gate (#32); stretch |
| 3 | H0 · Level 0 checkpoint | `@Agupane` | blocked by #12 + A/B/C |
| 4 | H1 · Final integration/QA | `@Agupane` | blocked by #32 + D/F/G |
| 4 | P4 · Post-P3 docs sync | `@elenaalmansacampos` | blocked by #8/#10/#12 |
| 4 | I · Final submission | `@elenaalmansacampos` | blocked by #17 |

**Dependencies:** F0 is done; A/B/C depend on P3 (#12); A.1 (#40) follows A; E and F0.1 are ready;
F0.1 must merge before E because both touch Home/EVA/Console; P3 waits for P1; D/F/G depend on the
deployed Level 0 checkpoint from H0 (#32); H1 (#17) closes after D/F/G.

**Rule:** Trends and Mission Control do not start until Today + Body + Decision are on the deployed
URL.

---

## 4. Blockers and risks

There are no infrastructure blockers: the repo has write access (restored for Elena, Yery and
amilege), the release deploy is live and auto-deploy works. P2 still needs its local commit
`9caa82a` re-pushed now that write access exists.

Known risks:

- **Unverified thresholds:** 6 sources remain `verified: false` (clinical, sleep, behavioral,
  co2, radiation and immune). P1 will verify radiation with `resources/08` and 5 will remain. Do not
  invent numbers.
- **Contract extension (P3):** touches `types.ts`, generated JSON and tests; announce it beforehand
  and do not start until P1 is closed to avoid conflicts in `rules.ts`.
- **Docs/code drift:** the documentation already describes 90 days, 4 correlations and 5 scenarios;
  the code stays at 14/3/4 until P3.
- **Cycle privacy:** reproductive data is opt-in; neither the packet nor Mission Control exposes it
  without `shareReproductiveWithGround`.
- **Visual polish:** E (#16) now works on the F0 foundation; use tokens and dark/light screenshots.
- **Parallel conflicts:** shared files are touched only by F0/Integration.
- **PWA/service worker:** can break the cache; goes last and feature-flagged.
- **Cloudflare + CSP:** the inline challenge script is blocked; it does not affect the app.

Infrastructure:

- The org has deploy keys enabled (`deploy_keys_enabled_for_repositories=true`).
- The Dokploy source is Git SSH (`git@github.com:kosmic-nasa-hackathon/orbi.git`) with the `orbi-deploy`
  deploy key; it does not use the GitHub App.
- The Dokploy webhook token is behind Cloudflare Access, which is why the deploy runs from the
  self-hosted LAN runner and not from a GitHub-hosted runner.
- Rotate the deploy key or `DOKPLOY_TOKEN` if they are shared outside the infrastructure.

---

## 5. Contracts and shared files

**Frozen contracts** (do not change without notice):

- `src/domain/types.ts`
- `src/ai/types.ts`
- `src/content/systems.ts`
- The shape of the scenario JSON files

**Proposed contract extension (P3, not yet applied):** `Phase`, `CrewProfile`,
`DailyReading.phase/menses/cycleDay`, `Scenario.crew/trainingDays` and `evaluate(..., { cycleAware })`.
Details in `docs/CONCEPT.md` §8. Announce it before the `engine/…` PR.

**F0/Integration only:**

- `src/App.tsx`, `src/navigation.ts`, `src/components/SiteNav.tsx`, `src/index.css`,
  `src/main.tsx`, `index.html`, `package.json`, `package-lock.json`, `vite.config.ts`,
  `nginx.conf`, `.github/*` and the status table in `docs/PLAN.md`.

**UI rule:** consume `evaluate()` and `askCoach()`; never reimplement clinical rules.
Every state uses colour + icon + text.

---

## 6. Decisions of this phase

- **Local coach:** optional explanation layer, never decision. Deterministic template by
  default and fallback.
- **Bone:** CONCERN requires low adherence **and** mission > 6 months.
- **Sources:** only `bone` and `ada` verified; 6 remain `false` with `TODO verify`. P1 will verify
  radiation with `resources/08` (600 mSv single limit since 2022) and 5 will remain.
- **Demo data:** radiation budget of 400 mSv so the halo is legible; 600 mSv remains
  the reference for the career limit.
- **Product shift (docs):** astronaut women's health + ground-training phase.
  Evidence in `docs/resources/08` and `09`. 90-day baseline, phase-aware baseline (opt-in, private,
  without relaxing absolute thresholds), `cycle-aware` correlation and `luteal-phase` scenario. **Not
  yet in the code**: it requires announcing the contract extension before the `engine/…` PR. The
  600 mSv limit already has a source (single for all sexes and ages since 2022).
- **Theme:** system + `localStorage` (key `orbi-theme`), dark fallback. Light in app and pitch.
- **Design system (F0 #11, shipped):** direction **"Body in orbit"** approved by the team, documented in
  `docs/DESIGN.md`. Cyan/near-black and teal/ice palettes with a 28 px grid, verified AA; Sora + IBM
  Plex Mono (Inter and IBM Plex Sans removed); no shadcn. Primitives in `src/components/ui` and
  `src/components/motion`, store in `src/store/orbiStore.ts` (`useScenario`, `useEvaluation`,
  `cycleAware`). Routes `?view=today|body|decision|trends|ground` with placeholders in `src/screens/*`:
  each lane replaces its file without touching `App.tsx`. Home/EVA/Console stay dark until E (#16).
- **Body #14:** reassigned to `@atapiamallea` at her request; Yery keeps F0.1 (#31) and Trends (#18).
  The tables and issue assignments are synchronized.
- **Integration:** two checkpoints. H0 (#32) deploys Level 0 and unblocks D/F/G; H1 (#17) closes
  the final integration.
- **CMO view:** descoped from Level 2 and documented as future work in `docs/CONCEPT.md` §12.
- **Parallelization:** worktrees + CLI agents; Foundation and integration handled by the integrator.
- **Video:** script + auto-recording with Playwright, without committing the binary.

---

## 7. Next action

1. Start now: P0 #8 and P2 #10 (Elena), P1 #9 and P2.1 #39 (Agustín), E #16 (amilege) and F0.1 #31
   (Yery).
2. F0.1 #31 is unblocked and assigned to `@Yeryalex`; merge it before E (#16).
3. When #9 merges, Agustín opens P3 #12; announce the contract in the issue before touching
   `types.ts`.
4. With P3 on `development`, open A #13 and C #15 and B #14 (Andrea Tapia), A.1 #40 after A, and
   E #16 is already ready.
5. Level 0 checkpoint at H0 #32: integrate A/B/C and deploy. That unblocks D #18 (Yery), F #19 and
   G #20 (amilege).
6. Close H1 #17, update the tables and open I #21 (Elena) with support from Agustín, Yery and Andrea Tapia.
7. P4 #33 (Elena) syncs counts and the deck after P3; it can run in parallel and does not block H1.
8. P2.1 #39 (Agustín) decides public/judge access, adds the license and credits, and verifies the
   URL without org access.

---

## 8. Parallel assignment

| Lane | Owner | Support | Branch | Main zone |
|---|---|---|---|---|
| P0 · Pitch light + motion | `@elenaalmansacampos` | `@Agupane` | `pitch/light-motion` | `public/pitch/*` |
| P1 · Threshold audit | `@Agupane` | `@atapiamallea` | `engine/threshold-audit` | `src/domain/rules.ts`, tests |
| P2 · Submission groundwork | `@elenaalmansacampos` | `@Agupane`, `@atapiamallea` | `docs/submission` | `docs/DEMO.md`, README, form |
| P2.1 · Public repo and submission access | `@Agupane` | `@elenaalmansacampos` | `docs/submission-access` | license, credits, jury access |
| F0 · Foundation | `@atapiamallea` | `@Agupane`, `@Yeryalex` | `design/theme-foundation` | theme, tokens, UI, nav, store |
| F0.1 · Deployed version footer | `@Yeryalex` | `@atapiamallea` | `design/version-footer` | shared footer and build metadata |
| P3 · Engine: baseline + cycle | `@Agupane` | `@atapiamallea`, `@Yeryalex` | `engine/cycle-baseline` | `src/domain/`, generator and scenarios |
| A · Today | `@atapiamallea` | `@amilege`, `@Agupane` | `today/checkin` | `src/screens/Today.tsx`, DemoBar, store |
| A.1 · Profile and consent | `@atapiamallea` | `@Yeryalex` | `today/profile-consent` | profile and `shareReproductiveWithGround` |
| B · Body | `@atapiamallea` | `@Yeryalex`, `@Agupane` | `body/map` | `src/screens/Body.tsx`, `components/body/` |
| C · Decision | `@atapiamallea` | `@Agupane`, `@elenaalmansacampos` | `decision/triage` | `src/screens/Decision.tsx`, `components/decision/` |
| E · Visual polish | `@amilege` | `@elenaalmansacampos`, `@Yeryalex` | `design/motion-polish` | Home, EVA, Console |
| D · Trends | `@Yeryalex` | `@Agupane`, `@atapiamallea` | `trends/charts` | `src/screens/Trends.tsx`, `components/charts/` |
| F · Mission Control | `@amilege` | `@Agupane`, `@Yeryalex` | `mission-control/window` | `src/screens/MissionControl.tsx` |
| G · Level 2 | `@amilege` | `@Agupane`, `@elenaalmansacampos` | `level2/extras` | Amsler, procedures, PWA |
| H0 · Level 0 checkpoint | `@Agupane` | Whole team | `integration/level0` | routes, Playwright, deploy |
| H1 · Final integration/QA | `@Agupane` | Whole team | `integration/level0` | routes, tests, deploy |
| P4 · Post-P3 docs sync | `@elenaalmansacampos` | `@Agupane` | `docs/post-p3-sync` | counts, deck and docs |
| I · Final submission | `@elenaalmansacampos` | `@Agupane`, `@Yeryalex`, `@atapiamallea` | `docs/submission` | video, README, form |

Lane issues: P0 #8 · P1 #9 · P2 #10 · P2.1 #39 · F0 #11 · F0.1 #31 · P3 #12 · A #13 · A.1 #40 ·
B #14 · C #15 · E #16 · H0 #32 · H1 #17 · D #18 · F #19 · G #20 · P4 #33 · I #21.

---

## 9. PRs and branches

Everything integrated is on `development`; `main` holds the latest release.

- #1 Scaffold, engine, coach and deployment baseline.
- #2 ci: add gated Dokploy auto-deploy fallback.
- #3 feat: add navigable pitch deck at `/pitch/`.
- #4 feat: add product home with icon navigation and landing.
- #5 docs: add women's health and ground-training research.
- #6 docs: add parallel execution plan and refresh handoff.
- #7 docs: correct pending threshold source count.
- #22 chore: unify lint, typing and issue-ownership rules.
- #23 docs: sync plan and handoff with cycle-aware direction.
- #24 docs: record PR #23 in handoff.
- #25 docs: add team roster and assignment status.
- #26 docs: finish team roster references.
- #27 docs: adopt the development release flow and English core docs.
- #28 docs: translate resources and normalize English doc paths.
- #29 docs: record PR #28 in handoff.
- #30 release: English docs and development integration flow.
- #34 docs: split H checkpoint and sync ticket plan.
- #35 release: docs plan sync.
- #36 feat: add the F0 design system foundation.
- #37 release: F0 design foundation.
- #38 docs: sync plan and handoff after F0.
- #42 release: F0 docs sync.
- #43 docs: sync ticket ownership and submission gaps.
- #44 docs: record A.1 and release PRs in handoff.
- #45 release: ticket ownership and submission gaps.
- #54 fix: correct early-infection data and explanations.
- #55 fix: cache hashed assets and revalidate HTML/pitch.
- #56 fix: rank correlations above single signals.

Repository: https://github.com/kosmic-nasa-hackathon/orbi
