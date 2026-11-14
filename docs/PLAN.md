# PLAN — ORBI

Living plan to execute the remaining work in parallel with several agents.
Current state and blockers are in `HANDOFF.md`; assignment and onboarding, in `docs/TEAM.md`;
the product, in `docs/BRIEF.md` and `docs/CONCEPTO-ORBI.md`.

**Date:** 2026-11-14
**Base:** `development`
**Status:** engine, data, coach, Home, EVA, console, pitch, deploy and documentation for the product
pivot (women's health + ground training) are ready. The code still uses a 14-day baseline,
3 correlations and 4 scenarios; the documented target is a 90-day baseline, 4 correlations
and 5 scenarios (closed by P3). Still missing: the interactive product (Level 0), Trends/Mission Control,
light theme, redesign and submission.

---

## 1. How to use this document

1. Read `AGENTS.md`, `HANDOFF.md`, `docs/TEAM.md` and your lane section.
2. **Issues are already created and assigned** (see `docs/TEAM.md` §2). Comment the branch, worktree and
   port when starting; do not reassign someone else's issue.
3. Work **one lane per branch and, if possible, per worktree**.
4. Touch only the lane's allowed files. If you need a shared file, ask the
   integrator; do not edit it yourself.
5. Before opening the PR: `npm run check` and `npm run build`.
6. PR titled `[lane-id] short description`, `Closes #<n>`, dark/light screenshots and tablet
   viewport.
7. Do not change contracts, generated data, secrets or deploy configuration.
8. Only the integrator updates the status table in §4 and merges to `development`; releases go
   `development` → `main`.

### Branch and release model

- `development` is the default branch and the integration target for every PR.
- `main` is release-only. The integrator opens `development` → `main`; merging it runs CI and the
  automatic deploy to the preview.
- Do not open feature PRs against `main` or push directly to it.

### Golden rule

**Trends and Mission Control do not start until Today + Body + Decision are on the deployed
URL.** Level 0 first; Level 1 after.

---

## 2. Current state

- **Current code:** deterministic engine with 6 systems + halo, 3 correlations, 14-day baseline,
  4 scenarios, template coach + optional local adapter + guardrails.
- **Documented target:** 90-day ground-training baseline, phase-aware cycle baseline
  (opt-in and private), 4 correlations and 5 scenarios. P3 closes this gap.
- Home `/`, EVA demo `?view=eva`, console `?view=console` and pitch `/pitch/`.
- Sticky, responsive nav with icons and query-based routes.
- CI, Docker, nginx, Dokploy, Cloudflare and auto-deploy.
- **36/36 tests**, `npm run check` and `npm run build` green; `npm run gen` reproducible.
- Release preview: `/`, `?view=eva`, `?view=console` and `/pitch/` return `200`.

What is missing is in the lanes in §4.

---

## 3. Contracts and shared files

### Frozen contracts

Do not change without announcing it to the whole team:

- `src/domain/types.ts`
- `src/ai/types.ts`
- `src/content/systems.ts`
- The JSON shape of `src/data/scenarios/*.json`

### Proposed contract extension (P3)

Pending announcement to the whole team before touching `src/domain/types.ts`:

- `Phase`: `TRAINING | TRANSIT | SURFACE | RETURN`.
- `CrewProfile` with `sex`, `cycle`, `contraception` and `shareReproductiveWithGround`.
- `DailyReading.phase/menses/cycleDay`, `Scenario.crew/trainingDays` and
  `evaluate(..., { cycleAware })`.
- Details in `docs/CONCEPTO-ORBI.md` §8. **Not applied to the code until P3 is merged.**

**P3 files:** `src/domain/baseline.ts`, `src/domain/evaluate.ts`, `src/domain/rules.ts`,
domain tests, `scripts/generate-mission.ts` and `src/data/scenarios/*.json`.

### Foundation/Integration files

Only F0 and the integrator touch these files. Other lanes must request changes:

- `src/App.tsx`
- `src/navigation.ts`
- `src/components/SiteNav.tsx`
- `src/index.css`
- `src/main.tsx`
- `index.html`
- `package.json` / `package-lock.json`
- `vite.config.ts`
- `nginx.conf`
- `.github/*`
- `docs/PLAN.md` (status table)

### UI rules

- Consume `evaluate()` and `askCoach()`; never reimplement clinical rules.
- Use semantic tokens (`surface`, `ink`, `muted`, `line`, `accent`, `nominal`, etc.).
- Do not hardcode `#05070d`, `text-white/40` or level colours in new screens.
- Every state uses colour + icon + text.
- Light theme is a first-class citizen: every screen is verified in dark and light.

---

## 4. Lanes

Only the integrator updates the **Status** column.

| Wave | Lane | Issue | Branch | Scope | Depends on | Status |
|---|---|---|---|---|---|---|
| 0 | **P0 · Pitch light + motion** | #8 | `pitch/light-motion` | Theme toggle, light tokens and deck animations | — | assigned |
| 0 | **P1 · Threshold audit** | #9 | `engine/threshold-audit` | Threshold review, boundary tests, 600 mSv with source and `verified` warning | — | assigned |
| 0 | **P2 · Submission groundwork** | #10 | `docs/submission` | `docs/DEMO.md`, storyboard, final README and form | — | assigned |
| 1 | **F0 · Foundation** | #11 | `design/theme-foundation` | Dark/light theme, switch, tokens, typography, UI primitives, motion, nav/routes and store skeleton | — | assigned |
| 1 | **P3 · Engine: ground baseline + cycle** | #12 | `engine/cycle-baseline` | Contract, 90-day and phase-aware baseline, `cycle-aware`, `luteal-phase`, 600 mSv and tests | P1 | assigned |
| 2 | **A · Today** | #13 | `today/checkin` | 7-field check-in + opt-in cycle, DemoBar, streak and Confirm | F0 + P3 | assigned |
| 2 | **B · Body** | #14 | `body/map` | SVG 6 systems + halo, detail panel, 30-day sparkline and ground baseline band | F0 + P3 | assigned |
| 2 | **C · Decision** | #15 | `decision/triage` | Level, “Because…”, action card, escalation, coach and private packet | F0 + P3 | assigned |
| 2 | **E · Visual polish** | #16 | `design/motion-polish` | Redesign of Home/EVA/Console, less density and animations | F0 | assigned |
| 3 | **D · Trends** | #18 | `trends/charts` | 30 days, system selector, “Your ground baseline” band and cycle | F0 + P3 + Level 0 gate | assigned |
| 3 | **F · Mission Control** | #19 | `mission-control/window` | `?view=ground`, BroadcastChannel, countdown and private packet | F0 + C + P3 + Level 0 gate | assigned |
| 3 | **G · Level 2** | #20 | `level2/extras` | Amsler, procedures, cycle notices and offline PWA | F0 + A/B/C + P3 + Level 0 gate | assigned |
| 3 | **H · Integration/QA** | #17 | `integration/level0` | Routes/nav, conflicts, tests, screenshots, privacy and deploy | A–G | assigned |
| 4 | **I · Final submission** | #21 | `docs/submission` | Video, README, form and rehearsal | H | assigned |

### Assignment and startup

Issues already assigned. Onboarding details, worktrees and rules are in `docs/TEAM.md`.

| Issue | Lane | Owner | Support | Size | Starts |
|---|---|---|---|---|---|
| #8 | P0 · Pitch light + motion | `@elenaalmansacampos` | `@Agupane` | S | Now |
| #9 | P1 · Threshold audit | `@Agupane` | `@atapiamallea` | M | Now |
| #10 | P2 · Submission groundwork | `@elenaalmansacampos` | `@Agupane`, `@atapiamallea` | M | Now |
| #11 | F0 · Foundation | `@atapiamallea` | `@Agupane`, `@Yeryalex` | L | Now |
| #12 | P3 · Ground baseline + cycle | `@Agupane` | `@atapiamallea`, `@Yeryalex` | L | After #9 |
| #13 | A · Today | `@atapiamallea` | `@amilege`, `@Agupane` | M | After #11 + #12 |
| #14 | B · Body | `@Yeryalex` | `@atapiamallea`, `@Agupane` | L | After #11 + #12; SVG first |
| #15 | C · Decision | `@atapiamallea` | `@Agupane`, `@elenaalmansacampos` | M | After #11 + #12 |
| #16 | E · Visual polish | `@amilege` | `@elenaalmansacampos`, `@Yeryalex` | M | After #11 |
| #18 | D · Trends | `@Yeryalex` | `@Agupane`, `@atapiamallea` | M | Level 0 gate + #14 |
| #19 | F · Mission Control | `@amilege` | `@Agupane`, `@Yeryalex` | M | Level 0 gate + #15 |
| #20 | G · Level 2 | `@amilege` | `@Agupane`, `@elenaalmansacampos` | M | Level 0 gate + A/B/C; stretch |
| #17 | H · Integration/QA | `@Agupane` | Whole team | L | Checkpoint after A/B/C |
| #21 | I · Final submission | `@elenaalmansacampos` | `@Agupane`, `@Yeryalex`, `@atapiamallea` | M | After #17 |

**Ready to start:** #8, #9, #10 and #11. **Blocked:** #12–#21 until their
dependencies are met. Agustín remains integrator and sole merge to `development`; he also opens
the `development` → `main` release. Andrea Tapia is backup.

### Merge order

1. P0, P1 and P2 can run in parallel from now on.
2. F0 and P3 (P3 waits for P1 because of `rules.ts`; announce the contract before starting).
3. A, B, C and E in parallel against F0 + P3.
4. Level 0 checkpoint in H: integrate A/B/C and deploy; that unblocks D, F and G.
5. F and G; then close H with the final integration.
6. I (submission).
7. Release: the integrator opens `development` → `main`; merging it runs CI and the automatic
   deploy to the preview.

---

## 5. Lane details

### P0 · Pitch light + motion

**Goal:** make `/pitch/` have a light/dark theme and feel more alive.

**Allowed files:** `public/pitch/*`.

**Deliverables:**

- Sun/Moon toggle in the deck topbar.
- `public/pitch/theme-init.js` to avoid flash; same `orbi-theme` key as the app.
- Light/dark tokens in `public/pitch/theme.css`.
- Per-slide entrance animation, progress and smooth transitions.
- Verify that it respects the CSP (`script-src 'self'`) and works in `?view=scroll` and print.

**Acceptance criteria:**

- Theme persists on reload and follows the system if there is no preference.
- 15 slides, notes (`S`), overview (`G`) and print still work.
- No console errors in the release preview (except the Cloudflare script, which is external).

### P1 · Threshold audit

**Goal:** close the threshold debt without inventing numbers.

**Allowed files:** `src/domain/rules.ts`, `src/domain/*.test.ts`, `docs/recursos/*` (read-only).

**Deliverables:**

- Review every `verified: false` against `docs/recursos/`.
- Mark `verified: true` only with a primary source.
- Incorporate `docs/recursos/08`: the 600 mSv career limit is a single limit for all sexes and
  ages since 2022; update the radiation source and remove the `TODO verify`.
- Reconcile `docs/recursos/06` with that source.
- Leave `TODO verify` where evidence is still missing.
- Boundary tests for exact WATCH/CONCERN/URGENT thresholds and for the bone case with good adherence.
- Visible notice of pending thresholds in the UI (coordinate with E).

**Acceptance criteria:**

- `npm run check` green and `npm run gen` with no diff.
- Every rule keeps a `SourceRef`.
- No new number without a source.
- The count of pending sources is documented (currently 6; after verifying radiation, 5).

### P2 · Submission groundwork

**Goal:** prepare the submission while the product is being built.

**Allowed files:** `docs/DEMO.md`, `docs/PITCH.md`, `README.md`, `docs/submission/*`.

**Deliverables:**

- 3-minute demo script aligned with `CONCEPTO-ORBI.md` §13, with the `luteal-phase` beat and
  “Train like you fly”.
- Video storyboard and shot list.
- Final README (completed at the end); all project docs and UI in English.
- Draft form answers and mapping to the jury.
- Rehearsal checklist and plan B if the URL fails.
- Check that `docs/PITCH.md` and the deck reflect the pivot without promising as live what is not yet
  on the deployed preview.

**Acceptance criteria:**

- The script uses the real app and does not promise screens that do not exist.
- All links and commands are verifiable.
- Live counts (scenarios/correlations) are accurate until P3 is deployed.

### F0 · Foundation

**Goal:** a visual and navigation foundation so the rest can work in parallel.

**Allowed files:** the shared files from §3, plus `src/theme/*`, `src/components/ui/*`,
`src/components/motion/*`, `src/store/orbiStore.ts`.

**Deliverables:**

- `ThemeProvider` + `useTheme` + `ThemeToggle` (system + `localStorage`, dark fallback).
- `public/theme-init.js` and dynamic `meta theme-color`.
- Dark/light tokens: `canvas`, `surface`, `surface-strong`, `ink`, `muted`, `faint`, `line`,
  `accent`, `accent-soft`, `nominal/watch/concern/urgent` with accessible variants.
- Type scale: labels ≥ 11px, body 15–16px, headings with large jumps.
- UI primitives: `Panel`, `Card`, `Badge`, `Button`, `Tabs`, `Metric`, `Reveal`.
- Motion primitives with `motion/react` and `useReducedMotion`.
- Extended `View` and mission subnav: Today, Body, Decision, Trends, Mission Control.
- `orbiStore` skeleton with scenario/day/mission/streak selectors and a `cycleAware` flag.
- `App.tsx` with routing shell and placeholders for the new screens.

**Acceptance criteria:**

- Toggle visible, accessible, persists and does not flash.
- Dark and light with AA contrast in text and states.
- `prefers-reduced-motion` respected.
- No existing route is broken.

### P3 · Engine: ground baseline + cycle

**Goal:** implement in the pure domain the 90-day baseline, the phase-aware cycle baseline
(opt-in and private), the `cycle-aware` correlation and the `luteal-phase` scenario.

**Allowed files:** `src/domain/types.ts` (contract; announce beforehand), `src/domain/baseline.ts`,
`src/domain/evaluate.ts`, `src/domain/rules.ts`, `src/domain/*.test.ts`,
`scripts/generate-mission.ts` and `src/data/scenarios/*.json`.

**Deliverables:**

- Announce the contract extension from §3 before touching `types.ts`.
- `Phase`, `CrewProfile` and the cycle fields in `DailyReading`, `Scenario` and `evaluate()`.
- 90-day ground-training baseline (days −90 to −1) and, if `cycle === "tracked"`, follicular/luteal
  phase-aware baseline; fallback to 14 readings for legacy scenarios.
- Generator: 90 training days + 30 mission days, cycle 28 ± 2, rule days 1–5, luteal phase
  +0.4 °C ± 0.1 and +4 bpm ± 1.
- Deterministic `luteal-phase` scenario (5 scenarios in total).
- `cycle-aware` correlation → NOMINAL with the explanation “Expected cycle variation, not infection”
  when the rise stays within the phase, sleep is normal and an absolute threshold is not exceeded.
- Safety rule: the adjustment only affects relative rules; absolute thresholds are never
  relaxed.
- Private packet: no `menses`/`cycleDay` unless `shareReproductiveWithGround`.
- `rules.ts`: radiation to `docs/recursos/08` (single 600 mSv since 2022) and `verified: true`.
- Tests for phase-aware baseline, toggle on/off, real fever in the luteal phase, privacy and determinism.
- `npm run gen` and commit the JSON.

**Acceptance criteria:**

- `npm run check` and `npm run build` green; `npm run gen` with no diff.
- 5 scenarios and 4 correlations available from the engine.
- The UI does not reimplement clinical rules.
- Day 148 fixed; no randomness at runtime.

### A · Today

**Goal:** the 90-second check-in.

**Allowed files:** `src/screens/Today.tsx`, `src/components/DemoBar.tsx`,
`src/store/orbiStore.ts` (check-in actions only), `src/screens/Today.test.tsx`.

**Deliverables:**

- 4 pre-filled fields “Synced from wearable”: sleep, HR, temperature, SpO₂.
- 3 manual fields: mood, fatigue, glucose.
- Opt-in field “period today? yes/no” only if `cycle === "tracked"`; it does not count as one of the 7.
- Confirm updates the store, the streak and the day's state.
- DemoBar: scenario, mission, Next day, Reset and “Cycle-aware baseline” toggle.
- The toggle writes `cycleAware` to the store and reaches `evaluate()`.
- Empty, confirmed and error states.

**Acceptance criteria:**

- The automatic fields cannot be typed into.
- Changing scenario/day updates the data.
- Tests for prefill, manual editing, Confirm, Next day and cycle toggle.
- The cycle field is hidden if `cycle` is `suppressed` or `n/a`.
- Dark/light and tablet 1180×820.

### B · Body

**Goal:** the interactive body map.

**Allowed files:** `src/screens/Body.tsx`, `src/components/body/*`,
`src/components/charts/Sparkline.tsx`, `src/screens/Body.test.tsx`.

**Deliverables:**

- SVG with 6 systems + halo, colour + icon + text.
- Detail panel on tap: state, `why`, source and 30-day sparkline with the “Your ground baseline” band.
- Bone: estimate and exercise adherence.
- Halo: dose vs budget.
- If the cycle is active, mark the phase without exposing reproductive data outside the tablet.
- Keyboard and touch navigation.

**Acceptance criteria:**

- Understandable without colour.
- Tests for click/keyboard, nominal state and WATCH+.
- The baseline band uses the P3 baseline, not a hardcoded mean.
- Dark/light and tablet.

### C · Decision

**Goal:** the explained decision screen.

**Allowed files:** `src/screens/Decision.tsx`, `src/components/decision/*`,
`src/screens/Decision.test.tsx`, packet actions in `src/store/orbiStore.ts`.

**Deliverables:**

- Level, “Because…”, action card and latency-based escalation.
- Mission change without reloading.
- “Explain” with `askCoach()` and template fallback.
- “Send to flight surgeon” marks the packet for Mission Control.
- `cycle-aware` case: “Expected cycle variation, not infection” with the “Because…” when applicable.
- Private packet: no cycle day or period days if `shareReproductiveWithGround === false`.

**Acceptance criteria:**

- The UI only shows `Assessment`; it does not recalculate thresholds.
- Changing ISS/Moon/Mars changes the escalation.
- Test for coach fallback and packet privacy.
- Dark/light.

### D · Trends

**Goal:** dynamic charts with a baseline band.

**Allowed files:** `src/screens/Trends.tsx`, `src/components/charts/*`,
`src/domain/series.ts` (pure helper), tests.

**Deliverables:**

- System selector.
- 30 days of readings with baseline line and ±σ band of “Your ground baseline”.
- Cycle overlaid if `cycle === "tracked"` and the toggle is active; private by default.
- Thresholds and current level.
- Chart draw animation.

**Acceptance criteria:**

- Uses `computeBaseline()` and `evaluate()`; does not duplicate rules.
- Test for the series helper.
- Training and mission are visually distinguished.
- Dark/light and responsive.
- **Gate:** not merged before H's deployed Level 0 checkpoint.

### E · Visual polish

**Goal:** make the app look bigger, more modern and less cluttered.

**Allowed files:** `src/screens/Home.tsx`, `src/screens/Eva.tsx`,
`src/screens/Console.tsx`, `src/components/eva/*`, `src/components/ui/*` (consumption).

**Deliverables:**

- Remove 8–10px text; minimum 11–12px in labels.
- Less visible density:
  - Home: fewer simultaneous metrics and a main CTA to Today.
  - Console: tabs Overview / Assessments / Facts.
  - EVA: collapsible telemetry and audit log, or in tabs.
- Animations: staggered entrance, hover lift and transition between views.
- Review hierarchy, spacing and contrast in dark/light.

**Acceptance criteria:**

- No horizontal overflow at 390px.
- `prefers-reduced-motion` works.
- Before/after screenshots at 1440×900 and 1180×820.

### F · Mission Control

**Goal:** make latency tangible.

**Allowed files:** `src/screens/MissionControl.tsx`,
`src/components/mission-control/*`, `src/lib/comms.ts`, tests.

**Deliverables:**

- `?view=ground`.
- Ship/ground split.
- `BroadcastChannel('orbi-comms')`.
- Accelerated 14-min countdown.
- Flight surgeon packet and reply with the same latency.
- Privacy: no cycle day or period days if `shareReproductiveWithGround === false`.

**Acceptance criteria:**

- Works with two windows and no backend.
- Test for countdown, messages and packet privacy.
- Dark/light.
- **Gate:** not merged before H's deployed Level 0 checkpoint.

### G · Level 2

**Goal:** extras if Level 0 and 1 are on the URL.

**Allowed files:** `src/screens/Amsler.tsx`, `src/screens/Procedures.tsx`,
`public/manifest.webmanifest`, `public/sw.js`, tests.

**Deliverables:**

- Amsler grid (`?view=amsler`) with instructions and disclaimer.
- Guided procedures: BP in microgravity and orthostatic test.
- Guided jugular ultrasound (2019 thrombosis case).
- Contraceptive reserve notice if `cycle === "suppressed"`; bone density note if `dmpa`.
- Offline PWA feature-flagged: manifest, service worker and offline-mode notice.

**Acceptance criteria:**

- Amsler and procedures do not diagnose.
- The service worker does not break the deploy or asset cache.
- Cycle notices are informative and do not expose reproductive data.
- New routes are integrated by H.
- **Gate:** not merged before H's deployed Level 0 checkpoint.

### H · Integration/QA

**Goal:** bring everything together and keep it stable in the release preview.

**Allowed files:** all shared files from §3.

**Deliverables:**

- Final routes and subnav.
- Conflict resolution between lanes.
- **Level 0 checkpoint:** integrate A/B/C and deploy; unblocks D/F/G.
- Smoke tests for all routes.
- Playwright: dark/light, 1440/1180/390, no overflow.
- Verify 5 scenarios, 4 correlations and cycle privacy.
- `npm run check`, `npm run build`, `npm run gen` with no diff, nginx + CSP and deploy.
- Update the status tables in §4 and §10, and `HANDOFF.md`.

**Acceptance criteria:**

- CI green and release preview `200` on all routes.
- No console errors of our own.
- Final dark/light screenshots.
- The Mission Control packet does not leak reproductive data without consent.
- No docs/code drift remains in scenarios/correlations.

### I · Final submission

**Goal:** close the submission.

**Allowed files:** `README.md`, `docs/DEMO.md`, `docs/submission/*`.

**Deliverables:**

- Demo video (script + auto-recording with Playwright or manual recording).
- Final README in English with dark/light screenshots, architecture, sources and commands
  (all project docs and UI in English).
- Complete form and mapping to the jury.
- Timed rehearsal and plan B.
- The video shows the `luteal-phase` beat, “Train like you fly” and cycle privacy.

**Acceptance criteria:**

- All links work.
- The video shows the real app.
- Nothing is promised that is not on the URL.
- Live counts match the deployed code.

---

## 6. Parallel work with worktrees

Startup example (full list in `docs/TEAM.md` §5):

```bash
git fetch origin
git switch development

git worktree add ../orbi-foundation design/theme-foundation
git worktree add ../orbi-today today/checkin
git worktree add ../orbi-body body/map
git worktree add ../orbi-decision decision/triage
git worktree add ../orbi-trends trends/charts
git worktree add ../orbi-polish design/motion-polish

# In each worktree:
npm ci
npm run dev -- --port 53xx
```

Suggested ports: 5310 foundation, 5311 today, 5312 body, 5313 decision, 5314 trends, 5315
polish, 5316 mission-control, 5317 pitch.

Rules:

- One agent per worktree.
- Do not share `node_modules` between worktrees unless agreed.
- Frequent rebase onto `development`.
- If two lanes need the same component, the integrator moves it to `src/components/ui/`.

---

## 7. Global verification

```bash
npm run check
npm run build
```

Minimum matrix:

| What | How |
|---|---|
| Themes | Dark and light on all routes |
| Viewports | 1440×900, 1180×820, 390×844 |
| Overflow | `scrollWidth === innerWidth` |
| Accessibility | Visible focus, keyboard, AA contrast |
| Motion | `prefers-reduced-motion` |
| Routes | `/`, `?view=today`, `?view=body`, `?view=decision`, `?view=trends`, `?view=eva`, `?view=console`, `?view=ground`, `?view=amsler`, `/pitch/` |
| Deploy | nginx + real CSP and the release preview |

---

## 8. Risks

- **The theme touches every screen.** Mitigation: tokens and dark/light screenshots.
- **Level colours in light.** Use accessible variants, not the current neons.
- **Conflicts between lanes.** Mitigation: contracts from §3 and one integrator.
- **Contract extension (P3).** Touches `types.ts`, generated JSON and tests; announce beforehand and do not
  start until P1 is closed to avoid conflicts in `rules.ts`.
- **Docs/code drift.** The documentation already describes 90 days, 4 correlations and 5 scenarios, but
  the code remains at 14/3/4 until P3. `HANDOFF.md` must keep that distinction visible.
- **Cycle privacy.** Reproductive data is opt-in; neither the packet nor Mission Control
  exposes it without `shareReproductiveWithGround`.
- **PWA/service worker** can break the cache. It goes last and feature-flagged.
- **Heavy video.** Do not commit large binaries; link to it or store it outside the repo.
- **Cloudflare injects an inline script** that the CSP blocks. It is external; do not relax the CSP.

---

## 9. Decisions for this phase

- Theme: system + `localStorage`, dark fallback.
- Light theme: app and pitch deck.
- Product pivot: 90-day ground-training baseline and phase-aware cycle baseline
  (opt-in, private, without relaxing absolute thresholds); implemented in P3.
- Level 2: Amsler, procedures and cycle notices; offline PWA at the end.
- Video: script + auto-recording with Playwright, without committing the binary.
- Parallelization: worktrees + CLI agents; Foundation and integration handled by the integrator.

---

## 10. Lane status

Only the integrator updates this table.

| Lane | Issue | Owner | Branch | Status | PR |
|---|---|---|---|---|---|
| P0 · Pitch light + motion | #8 | `@elenaalmansacampos` | `pitch/light-motion` | ready | — |
| P1 · Threshold audit | #9 | `@Agupane` | `engine/threshold-audit` | ready | — |
| P2 · Submission groundwork | #10 | `@elenaalmansacampos` | `docs/submission` | ready | — |
| F0 · Foundation | #11 | `@atapiamallea` | `design/theme-foundation` | ready | — |
| P3 · Engine: baseline + cycle | #12 | `@Agupane` | `engine/cycle-baseline` | blocked by #9 | — |
| A · Today | #13 | `@atapiamallea` | `today/checkin` | blocked by #11 + #12 | — |
| B · Body | #14 | `@Yeryalex` | `body/map` | blocked by #11 + #12 | — |
| C · Decision | #15 | `@atapiamallea` | `decision/triage` | blocked by #11 + #12 | — |
| E · Visual polish | #16 | `@amilege` | `design/motion-polish` | blocked by #11 | — |
| D · Trends | #18 | `@Yeryalex` | `trends/charts` | blocked by Level 0 gate | — |
| F · Mission Control | #19 | `@amilege` | `mission-control/window` | blocked by Level 0 gate | — |
| G · Level 2 | #20 | `@amilege` | `level2/extras` | blocked; stretch | — |
| H · Integration/QA | #17 | `@Agupane` | `integration/level0` | checkpoint pending | — |
| I · Final submission | #21 | `@elenaalmansacampos` | `docs/submission` | blocked by #17 | — |
