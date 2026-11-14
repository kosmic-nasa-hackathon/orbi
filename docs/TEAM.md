# TEAM — ORBI

Live team assignment for NASA Space Apps 2026. The lanes, dependencies and acceptance criteria are
in `docs/PLAN.md`; state and blockers in `HANDOFF.md`.

**Updated:** 2026-11-14
**Integrator:** `@Agupane` · **Backup:** `@atapiamallea`
**Team:** 5 people, the current members of the ORBI org. `@nagicome03` (Nayeli) and
`@Feito-18` are in Servido/HackMeridian, not in ORBI.

---

## 1. Roster

| Person | GitHub | Role | Skills | Focus in ORBI |
|---|---|---|---|---|
| Agustín Pane | `@Agupane` | Maintainer / integrator | Architecture, Vite + React, infra, deploy, pitch | Engine (P1, P3), integration and deploy (H), reviews |
| Andrea Tapia | `@atapiamallea` | Fullstack frontend | React/TS, Tailwind, women's health research | Foundation (F0), Today (A), Decision (C); integration backup |
| Elena Almansa | `@elenaalmansacampos` | Fullstack | Java/Spring, React, JS, SQL, tests and data | Landing/deck/submission (P0, P2, E, I) |
| Yery Rodríguez | `@Yeryalex` | Frontend | JS/TS, 42 C, Odin/JS30, CSS | Body (B) and Trends (D) |
| Andrea | `@amilege` | Programming (42 C) | C foundations; at ORBI works on UI with support | Visual (E), Mission Control (F) and Level 2 (G) |

> There are two Andreas: `@atapiamallea` is Andrea Tapia; `@amilege` is Andrea. Always use the handle.

---

## 2. Assignment

| Issue | Lane | Owner | Support | Branch | Worktree | Port | Size | Starts |
|---|---|---|---|---|---|---|---|---|
| #8 | P0 · Pitch light + motion | `@elenaalmansacampos` | `@Agupane` | `pitch/light-motion` | `../orbi-pitch` | 5317 | S | Now |
| #9 | P1 · Threshold audit | `@Agupane` | `@atapiamallea` | `engine/threshold-audit` | `../orbi-thresholds` | — | M | Now |
| #10 | P2 · Submission groundwork | `@elenaalmansacampos` | `@Agupane`, `@atapiamallea` | `docs/submission` | `../orbi-submission` | — | M | Now |
| #11 | F0 · Foundation | `@atapiamallea` | `@Agupane`, `@Yeryalex` | `design/theme-foundation` | `../orbi-foundation` | 5310 | L | Now |
| #12 | P3 · Ground baseline + cycle | `@Agupane` | `@atapiamallea`, `@Yeryalex` | `engine/cycle-baseline` | `../orbi-engine-cycle` | 5309 | L | After #9 |
| #13 | A · Today | `@atapiamallea` | `@amilege`, `@Agupane` | `today/checkin` | `../orbi-today` | 5311 | M | After #11 + #12 |
| #14 | B · Body | `@Yeryalex` | `@atapiamallea`, `@Agupane` | `body/map` | `../orbi-body` | 5312 | L | After #11 + #12; SVG first |
| #15 | C · Decision | `@atapiamallea` | `@Agupane`, `@elenaalmansacampos` | `decision/triage` | `../orbi-decision` | 5313 | M | After #11 + #12 |
| #16 | E · Visual polish | `@amilege` | `@elenaalmansacampos`, `@Yeryalex` | `design/motion-polish` | `../orbi-polish` | 5315 | M | After #11 |
| #17 | H · Integration/QA | `@Agupane` | Whole team | `integration/level0` | `../orbi-integration` | 5318 | L | Checkpoint after A/B/C |
| #18 | D · Trends | `@Yeryalex` | `@Agupane`, `@atapiamallea` | `trends/charts` | `../orbi-trends` | 5314 | M | After Level 0 gate + #14 |
| #19 | F · Mission Control | `@amilege` | `@Agupane`, `@Yeryalex` | `mission-control/window` | `../orbi-mission-control` | 5316 | M | After Level 0 gate + #15 |
| #20 | G · Level 2 | `@amilege` | `@Agupane`, `@elenaalmansacampos` | `level2/extras` | `../orbi-level2` | 5319 | M | After Level 0 gate + A/B/C; stretch |
| #21 | I · Final submission | `@elenaalmansacampos` | `@Agupane`, `@Yeryalex`, `@atapiamallea` | `docs/submission` | `../orbi-submission` | — | M | After #17 |

**Golden rule:** D and F are not merged until Today + Body + Decision are on the deployed URL.
G is stretch: if Level 0 slips, it is cut first.

---

## 3. Sequence per person

| Person | Sequence |
|---|---|
| `@Agupane` | #9 → #12 → reviews/merges → #17 → #21 support |
| `@atapiamallea` | #11 → #13/#15 → integration backup and reviews |
| `@elenaalmansacampos` | #8 → #10 → #21; supports #16 and #15 |
| `@Yeryalex` | #14 (SVG pre-work) → #16 support → #18; supports #19 |
| `@amilege` | #16 → #19 → #20; supports #13 |

Critical path: `#9 → #12 → #13/#14/#15 → gate #17 → #18/#19/#20 → close #17 → #21`.

---

## 4. Working rules

- **The assignee is the lock.** Issues are already assigned; do not reassign without talking to the owner
  and the integrator. When starting, comment branch, worktree and port in the issue.
- **Branches:** create every branch from `development` and open every PR against `development`.
  `main` is release-only: the integrator opens the `development` → `main` release PR, and that merge
  triggers the automatic deploy to the preview.
- **One PR per issue**, title `[lane-id] …` and `Closes #<n>` in the body.
- **Before the PR:** `npm run check` and `npm run build`. If you touched data, `npm run gen` without diff.
- **Allowed files:** those in the issue and `docs/PLAN.md` §5. The shared ones in §3 are touched only by
  F0 (`#11`) and the integrator. If you need one, ask for it; do not edit it.
- **Contracts:** do not change `src/domain/types.ts`, `src/ai/types.ts`, `src/content/systems.ts` or the
  JSON shape without announcing it. P3 (`#12`) has the contract notice in its issue.
- **Blockers:** if you are stuck for more than 30 min, comment the blocker and the next action in the issue.
- **UI in English**, all project docs are in English. Colour + icon + text; never colour alone.
- **No secrets** in the repo, logs, screenshots or docs.

---

## 5. Worktrees and ports

```bash
git fetch origin
git switch development

git worktree add ../orbi-pitch          pitch/light-motion
git worktree add ../orbi-thresholds     engine/threshold-audit
git worktree add ../orbi-submission     docs/submission
git worktree add ../orbi-foundation     design/theme-foundation
git worktree add ../orbi-engine-cycle   engine/cycle-baseline
git worktree add ../orbi-today          today/checkin
git worktree add ../orbi-body           body/map
git worktree add ../orbi-decision       decision/triage
git worktree add ../orbi-polish         design/motion-polish
git worktree add ../orbi-trends         trends/charts
git worktree add ../orbi-mission-control mission-control/window
git worktree add ../orbi-level2         level2/extras
git worktree add ../orbi-integration    integration/level0

# In each worktree
npm ci
npm run dev -- --port 53xx
```

| Port | Lane |
|---|---|
| 5309 | P3 · engine/cycle-baseline |
| 5310 | F0 · foundation |
| 5311 | A · today |
| 5312 | B · body |
| 5313 | C · decision |
| 5314 | D · trends |
| 5315 | E · polish |
| 5316 | F · mission-control |
| 5317 | P0 · pitch |
| 5318 | H · integration |
| 5319 | G · level2 |

Do not share `node_modules` between worktrees. Rebase frequently on `development`.

---

## 6. Onboarding (first day)

1. `nvm use && npm ci && npm run gen && npm run dev`
2. Read `AGENTS.md`, `docs/PLAN.md`, `HANDOFF.md` and this document.
3. `gh auth status` and `gh issue list --state open`: verify that your issue is assigned to you.
4. On `development`: `npm run check` and `npm run build` before creating the branch.
5. Create branch/worktree, comment in the issue and open a small PR.
6. If it is your first PR, ask `@Agupane` or `@atapiamallea` for pairing.

---

## 7. State

The status table and PRs are maintained in `docs/PLAN.md` §10 and `HANDOFF.md` §9. Only the
integrator updates them when merging.
