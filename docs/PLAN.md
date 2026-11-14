# PLAN — ORBI

Living plan to execute the remaining work in parallel with several agents.
Current state and blockers are in `HANDOFF.md`; assignment and onboarding, in `docs/TEAM.md`;
the product, in `docs/BRIEF.md` and `docs/CONCEPT.md`.

**Date:** 2026-11-14
**Base:** `development`
**Status:** engine, data, coach, Home, EVA, console, pitch, deploy, documentation and F0 (light/dark
theme, tokens, primitives, nav and store) are ready. The code still uses a 14-day baseline,
3 correlations and 4 scenarios; the documented target is a 90-day ground-training baseline, 4 correlations
and 5 scenarios (closed by P3 if it lands). Still missing: Body/Level 0, Mission Control, visual
polish, final submission and P3 (stretch). Trends is implemented in PR #71 and held by the Level 0 gate.

---

## 1. How to use this document

1. Read `AGENTS.md`, `HANDOFF.md`, `docs/TEAM.md` and your lane section.
2. **Issues are already created** (see `docs/TEAM.md` §2); all are assigned except #53. Comment the
   branch, worktree and port when starting; do not reassign someone else's issue.
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
- F0 design foundation: light/dark theme, tokens, UI primitives, motion, nav shell, store and
  route placeholders for the interactive screens.
- CI, Docker, nginx, Dokploy, Cloudflare and auto-deploy.
- **56/56 tests**, `npm run check` and `npm run build` green; `npm run gen` reproducible.
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
- Details in `docs/CONCEPT.md` §8. **Not applied to the code until P3 is merged.**

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
| 0 | **P0 · Pitch light + motion** | #8 | `pitch/light-motion` | Theme toggle, light tokens and deck animations | — | closed; deck follow-ups in #33/#48 |
| 0 | **P1 · Threshold audit** | #9 | `engine/threshold-audit` | Threshold review, boundary tests, 600 mSv with source and `verified` warning | — | done (#62) |
| 0 | **P2 · Submission groundwork** | #10 | `docs/submission` | `docs/DEMO.md`, storyboard, final README and form | — | closed; script/video follow-ups in #48/#49 |
| 0 | **P2.1 · Public repo and submission access** | #39 | `docs/submission-access` | Public visibility, license, credits and jury access | P2 | partial; visibility decision pending |
| 1 | **F0 · Foundation** | #11 | `design/theme-foundation` | Dark/light theme, switch, tokens, typography, UI primitives, motion, nav/routes and store skeleton | — | done (#36) |
| 1 | **F0.1 · Deployed version footer** | #31 | `design/version-footer` | Shared footer with `package.json` version and optional commit SHA | F0 (done) | ready; `@amilege` + `@elenaalmansacampos` |
| 1 | **P3 · Engine: ground baseline + cycle** | #12 | `engine/cycle-baseline` | Contract, 90-day and phase-aware baseline, `cycle-aware`, `luteal-phase`, radiation from P1 and tests | P1 (done) | ready; stretch, does not gate A/B/C |
| 2 | **A · Today** | #13 | `today/checkin` | 7-field check-in + opt-in cycle, DemoBar, streak and Confirm | F0 (done) | done (#58) |
| 2 | **A.1 · Profile and consent** | #40 | `today/profile-consent` | Crew profile, reproductive-data consent and packet privacy | P3 + A (done) | blocked by #12 for `CrewProfile` |
| 2 | **B · Body** | #14 | `body/map` | SVG 6 systems + halo, detail panel, 30-day sparkline and ground baseline band | F0 (done) | ready; P3 is stretch and does not gate it |
| 2 | **C · Decision** | #15 | `decision/triage` | Level, “Because…”, action card, escalation, coach and private packet | F0 (done) | done (#64) |
| 2 | **E · Visual polish** | #16 | `design/motion-polish` | Redesign of Home/EVA/Console, less density and animations | F0 (done) | ready |
| 3 | **D · Trends** | #18 | `trends/charts` | 30 days, system selector, “Your ground baseline” band and cycle | B + Level 0 gate (#32) | PR #71 green; held by the gate |
| 3 | **F · Mission Control** | #19 | `mission-control/window` | `?view=ground`, BroadcastChannel, countdown and private packet | C (done) + Level 0 gate (#32) | blocked by #32 |
| 3 | **G · Level 2** | #20 | `level2/extras` | Amsler, procedures, cycle notices and offline PWA | A/B/C + Level 0 gate (#32) | blocked; stretch |
| 3 | **H0 · Level 0 checkpoint** | #32 | `integration/level0` | Integrate A/B/C, Playwright, deploy Level 0 and unblock D/F/G | A/B/C | blocked by B only |
| 4 | **H1 · Final integration/QA** | #17 | `integration/level0` | Final routes, D/F/G, privacy, QA and release | H0 + D/F/G | blocked by #32 + D/F/G |
| 4 | **P4 · Post-P3 docs sync** | #33 | `docs/post-p3-sync` | Refresh counts, deck and docs after P3 | P3 if it lands | P0/P2 done; sync current counts |
| 4 | **I · Final submission** | #21 | `docs/submission` | Video, README, form and rehearsal | H1 | blocked by #17 |

### Assignment and startup

Issues are already created; all are assigned except #53 (unassigned stretch). Onboarding details,
worktrees and rules are in `docs/TEAM.md`.

| Issue | Lane | Owner | Support | Size | Starts |
|---|---|---|---|---|---|
| #8 | P0 · Pitch light + motion | `@elenaalmansacampos` | `@Agupane` | S | Closed; follow-ups #33/#48 |
| #9 | P1 · Threshold audit | `@Agupane` | `@atapiamallea` | M | Done (#62) |
| #10 | P2 · Submission groundwork | `@elenaalmansacampos` | `@Agupane`, `@atapiamallea` | M | Closed; follow-ups #48/#49 |
| #39 | P2.1 · Public repo and submission access | `@Agupane` | `@elenaalmansacampos` | S | Now; visibility decision pending |
| #11 | F0 · Foundation | `@atapiamallea` | `@Agupane`, `@Yeryalex` | L | Done (#36) |
| #31 | F0.1 · Deployed version footer | `@amilege` | `@elenaalmansacampos` | S | Now |
| #12 | P3 · Ground baseline + cycle | `@Agupane` | `@atapiamallea`, `@Yeryalex` | L | Now; stretch, does not gate A/B/C |
| #13 | A · Today | `@atapiamallea` | `@amilege`, `@Agupane` | M | Done (#58) |
| #40 | A.1 · Profile and reproductive-data consent | `@atapiamallea` | `@Yeryalex` | S | After #12; A done |
| #14 | B · Body | `@atapiamallea` | `@Yeryalex`, `@Agupane` | L | Now; P3 optional |
| #15 | C · Decision | `@atapiamallea` | `@Agupane`, `@elenaalmansacampos` | M | Done (#64) |
| #16 | E · Visual polish | `@amilege` | `@elenaalmansacampos`, `@Yeryalex` | M | Now |
| #18 | D · Trends | `@atapiamallea` | `@Agupane`, `@Yeryalex` | M | PR #71 green; held by #32 |
| #19 | F · Mission Control | `@amilege` | `@Agupane`, `@Yeryalex` | M | After #32; C done |
| #20 | G · Level 2 | `@amilege` | `@Agupane`, `@elenaalmansacampos` | M | After #32; stretch |
| #32 | H0 · Level 0 checkpoint | `@Agupane` | Whole team | M | After B #14 |
| #17 | H1 · Final integration/QA | `@Agupane` | Whole team | L | After #32 + D/F/G |
| #33 | P4 · Post-P3 docs sync | `@elenaalmansacampos` | `@Agupane` | S | Now; re-run after P3 if it lands |
| #21 | I · Final submission | `@elenaalmansacampos` | `@Agupane`, `@Yeryalex`, `@atapiamallea` | M | After #17 |

**Ready to start:** #12 (stretch), #14, #16, #31, #33, #39, #48, #49 and #51. **Held:** #18 /
PR #71 until the Level 0 gate (#32). **Blocked:** #17, #19, #20 and #21; #40 waits for #12. #53 is the
only unassigned stretch issue. Agustín remains integrator and sole merge to `development`; he also opens the
`development` → `main` release. Andrea Tapia is backup.

### Merge order

1. P0, P1 and P2 are closed. P2.1 (#39), E (#16) and F0.1 (#31) can run in parallel.
2. F0.1 (#31) is owned by `@amilege` with `@elenaalmansacampos`; merge it before E (#16) because
   both touch Home, EVA and Console.
3. B (#14) is the only remaining Level 0 screen: start it now. P3 is stretch and does not gate it.
   A (#13) and C (#15) are done; A.1 (#40) still waits for P3's `CrewProfile`.
4. Level 0 checkpoint in H0 (#32): integrate B and deploy; that unblocks D, F and G.
5. D #18 / PR #71 is green but held until H0; then F and G, and close H1 (#17).
6. #48/#49 cover deck, script and backup video; P4 (#33) syncs counts now and re-runs after P3 if it
   lands. I (#21) after H1.
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

**Allowed files:** `src/domain/rules.ts`, `src/domain/*.test.ts`, `docs/resources/*` (read-only).

**Deliverables:**

- Review every `verified: false` against `docs/resources/`.
- Mark `verified: true` only with a primary source.
- Incorporate `docs/resources/08`: the 600 mSv career limit is a single limit for all sexes and
  ages since 2022; update `SOURCES.radiation` and remove the `TODO verify`.
- `docs/resources/06` is already reconciled with that source; no doc edit is needed.
- Leave `TODO verify` where evidence is still missing.
- Boundary tests for exact WATCH/CONCERN/URGENT thresholds and for the bone case with good adherence.
- Provide the final pending count and copy to E (#16), which implements the visible UI notice.

**Acceptance criteria:**

- `npm run check` green and `npm run gen` with no diff.
- Every rule keeps a `SourceRef`.
- No new number without a source.
- The count of pending sources is documented (currently 6; after verifying radiation, 5).

### P2 · Submission groundwork

**Goal:** prepare the submission while the product is being built.

**Allowed files:** `docs/DEMO.md`, `docs/PITCH.md`, `README.md`, `docs/submission/*`.

**Deliverables:**

- 3-minute demo script aligned with `CONCEPT.md` §13, with the `luteal-phase` beat and
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

### P2.1 · Public repo and submission access

**Goal:** make the code and submission package reachable for the jury, with a license and credits.

**Allowed files:** `LICENSE`, `README.md`, `docs/submission/*` and repository settings through a
GitHub admin.

**Deliverables:**

- Decide the access model: public repo, judge access or downloadable archive.
- Add a license and visible Servier/NASA/CSA credits.
- Verify the chosen URL or archive without an org account.
- Confirm the history and the build contain no secrets.

**Acceptance criteria:**

- A judge can open the code with no org membership.
- `LICENSE` and credits are visible.
- No token, deploy key or `.env` is exposed.

### F0 · Foundation

**Goal:** a visual and navigation foundation so the rest can work in parallel.

**Status:** shipped in PR #36 and deployed via release PR #37.

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

### F0.1 · Deployed version footer

**Goal:** show the deployed version in the global footer on every ORBI view.

**Allowed files:** `package.json`, `vite.config.ts`, `src/App.tsx`, `src/components/SiteFooter.tsx`,
`src/screens/Home.tsx`, `src/screens/Console.tsx`, `src/screens/Eva.tsx` only if the shared footer
requires it, tests, and `Dockerfile`/`docs/DEPLOYMENT.md` only if build args are needed.

**Deliverables:**

- Use `package.json` `version` as the single source of truth and expose it at build time.
- Shared footer with `ORBI v0.1.0` plus an optional short commit SHA linked to GitHub.
- Graceful fallback in local dev and Docker builds without `.git`.
- Reuse the footer on `/`, `?view=eva` and `?view=console`.
- Document the release/version bump rule.

**Acceptance criteria:**

- The version appears on `/`, `?view=eva` and `?view=console`.
- `npm run dev` and `npm run build` show the correct version.
- The deployed build works without `.git` in the Docker context.
- No secrets, tokens or environment values are rendered.
- Dark/light, tablet 1180×820 and 390px remain usable.
- `npm run check` and `npm run build` are green.
- A test covers the version formatter/fallback.

**Gate:** unblocked by F0 (#11, PR #36). Owned by `@amilege` with `@elenaalmansacampos`; merge it
before E (#16) because both touch Home, EVA and Console.

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
- `rules.ts`: keep #9's radiation source (`docs/resources/08`, single 600 mSv since 2022) and
  `verified: true`; do not re-edit or duplicate that change.
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

### A.1 · Profile and reproductive-data consent

**Goal:** make `shareReproductiveWithGround` a real astronaut choice instead of a scenario constant.

**Allowed files:** `src/components/profile/*`, the profile entry point in `src/screens/Today.tsx`,
`src/screens/Decision.tsx` only if the consent action belongs there, profile actions in
`src/store/orbiStore.ts` and tests.

**Deliverables:**

- Show `cycle`, optional `contraception` and the sharing state.
- Let the astronaut turn sharing on/off; default is off.
- Explain that only the conclusion travels, never cycle or period data.
- Connect the choice to C (#15) and F (#19) packet construction.
- Tests for default privacy, toggle, packet contents and no leak when off.

**Acceptance criteria:**

- Default is private.
- The next packet reflects the choice without a reload.
- No reproductive detail travels without consent.
- No backend, network call or analytics for this data.

### B · Body

**Goal:** the interactive body map.

**Status:** ready. P3 (#12) is stretch and does not gate this lane; use the current engine baseline and
swap in the 90-day/phase-aware baseline if P3 lands.

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
- The band uses `computeBaseline()`; if P3 lands, it uses its 90-day/phase-aware baseline, never a
  hardcoded mean.
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
- **Gate:** not merged before H0's deployed Level 0 checkpoint (#32).

### E · Visual polish

**Goal:** make the app look bigger, more modern and less cluttered.

**Status:** ready; unblocked by F0 (#11, PR #36). Start on `design/motion-polish`.

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
- **Gate:** not merged before H0's deployed Level 0 checkpoint (#32).

### G · Level 2

**Goal:** extras if Level 0 and 1 are on the URL. The CMO view with 3 crew members is out of
scope and stays as future work in `docs/CONCEPT.md` §12.

**Allowed files:** `src/screens/Amsler.tsx`, `src/screens/Procedures.tsx`,
`src/components/level2/*`, `public/manifest.webmanifest`, `public/sw.js`, tests.

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
- New routes are integrated by H1 (#17).
- **Gate:** not merged before H0's deployed Level 0 checkpoint (#32).

### H0 · Level 0 checkpoint

**Goal:** integrate Today, Body and Decision, verify Level 0 on the deployed URL and unblock
Trends, Mission Control and Level 2.

**Allowed files:** all shared files from §3, `package.json`/`package-lock.json` for Playwright,
`playwright.config.ts`, `e2e/*`, the status tables in §4/§10 and `HANDOFF.md`.

**Deliverables:**

- Integrate A (#13), B (#14) and C (#15) behind F0; P3 is optional and does not gate the checkpoint.
- Keep `/`, `?view=eva`, `?view=console` and `/pitch/` working.
- Add `@playwright/test`, `playwright.config.ts` and `npm run test:e2e`.
- Smoke suite: routes, dark/light, 1440/1180/390 and no horizontal overflow.
- `npm run check`, `npm run build` and `npm run gen` with no diff.
- Release `development` → `main`, wait for CI/deploy and verify production `200` on the three
  Level 0 routes.
- Update the status tables and `HANDOFF.md`; mark D/F/G unblocked.

**Acceptance criteria:**

- The deployed URL shows Today, Body and Decision with real engine data.
- CI green and production `200` on `/`, `?view=today`, `?view=body`, `?view=decision`,
  `?view=eva`, `?view=console` and `/pitch/`.
- No console errors of our own.
- Dark/light screenshots at tablet size.
- No cycle data leaks without `shareReproductiveWithGround`.

### H1 · Final integration/QA

**Goal:** close the final integration after Level 0, keeping Level 1 and Level 2 stable in the
release preview.

**Allowed files:** all shared files from §3, the status tables in §4/§10 and `HANDOFF.md`.

**Deliverables:**

- Final routes and subnav.
- Conflict resolution between lanes.
- Smoke tests for all routes.
- Playwright: dark/light, 1440/1180/390, no overflow.
- Verify 5 scenarios, 4 correlations and cycle privacy.
- `npm run check`, `npm run build`, `npm run gen` with no diff, nginx + CSP and deploy.
- Update the status tables in §4 and §10, and `HANDOFF.md`.
- Verify the version footer (#31) in production.
- Confirm there is no docs/code drift; P4 (#33) owns the post-P3 count sync.

**Acceptance criteria:**

- CI green and release preview `200` on all routes.
- No console errors of our own.
- Final dark/light screenshots.
- The Mission Control packet does not leak reproductive data without consent.
- No docs/code drift remains in scenarios/correlations.

### P4 · Post-P3 docs sync

**Goal:** remove docs/code drift in baselines, correlations, scenarios, test counts and the deck.
Sync the current code now and re-run after P3 if it lands.

**Allowed files:** `README.md`, `docs/PITCH.md`, `docs/STACK.md`, `AGENTS.md`, `docs/PLAN.md` §2,
`HANDOFF.md` and `public/pitch/deck.json`.

**Deliverables:**

- If P3 landed, replace the 14-day baseline with the 90-day ground-training baseline, 3 correlations
  with 4 and 4 scenarios with 5; otherwise keep the current numbers and mark P3 as stretch.
- Update the test count and equivalents to the real current number.
- Update the deck slides and the `docs/PITCH.md` checklist that state counts.
- Keep `docs/TASKS.md` marked as historical.

**Acceptance criteria:**

- Grep for `14-day`, `3 correlations`, `4 scenarios` and `56 tests` returns only historical or
  roadmap contexts.
- No doc promises 5 scenarios / 4 correlations before the deploy.
- `npm run check` and `npm run build` green.

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
- Level 2: Amsler, procedures and cycle notices; offline PWA at the end. The CMO view is
  descoped and documented as future work.
- Integration is two checkpoints: H0 (#32) deploys Level 0 and unblocks D/F/G; H1 (#17) closes
  the final integration.
- Video: script + auto-recording with Playwright, without committing the binary.
- Parallelization: worktrees + CLI agents; Foundation and integration handled by the integrator.

---

## 10. Lane status

Only the integrator updates this table.

| Lane | Issue | Owner | Branch | Status | PR |
|---|---|---|---|---|---|
| P0 · Pitch light + motion | #8 | `@elenaalmansacampos` | `pitch/light-motion` | closed; follow-ups #33/#48 | — |
| P1 · Threshold audit | #9 | `@Agupane` | `engine/threshold-audit` | done | #62 |
| P2 · Submission groundwork | #10 | `@elenaalmansacampos` | `docs/submission` | closed; follow-ups #48/#49 | — |
| P2.1 · Public repo and submission access | #39 | `@Agupane` | `docs/submission-access` | partial; visibility pending | #63 |
| F0 · Foundation | #11 | `@atapiamallea` | `design/theme-foundation` | done | #36 |
| F0.1 · Deployed version footer | #31 | `@amilege` + `@elenaalmansacampos` | `design/version-footer` | ready | — |
| P3 · Engine: baseline + cycle | #12 | `@Agupane` | `engine/cycle-baseline` | ready; stretch, no A/B/C gate | — |
| A · Today | #13 | `@atapiamallea` | `today/checkin` | done | #58 |
| A.1 · Profile and consent | #40 | `@atapiamallea` | `today/profile-consent` | ready after A; P3 optional | — |
| B · Body | #14 | `@atapiamallea` | `body/map` | ready; P3 optional | — |
| C · Decision | #15 | `@atapiamallea` | `decision/triage` | done | #64 |
| E · Visual polish | #16 | `@amilege` | `design/motion-polish` | ready | — |
| D · Trends | #18 | `@atapiamallea` | `trends/charts` | PR #71 green; held by #32 | #71 |
| F · Mission Control | #19 | `@amilege` | `mission-control/window` | blocked by #32 | — |
| G · Level 2 | #20 | `@amilege` | `level2/extras` | blocked; stretch | — |
| H0 · Level 0 checkpoint | #32 | `@Agupane` | `integration/level0` | blocked by B only | — |
| H1 · Final integration/QA | #17 | `@Agupane` | `integration/level0` | blocked by #32 + D/F/G | — |
| P4 · Post-P3 docs sync | #33 | `@elenaalmansacampos` | `docs/post-p3-sync` | ready; re-run after P3 if it lands | — |
| I · Final submission | #21 | `@elenaalmansacampos` | `docs/submission` | blocked by #17 | — |
