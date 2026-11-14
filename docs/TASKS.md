# TASKS — ORBI (historical)

This document keeps the original per-lane briefs as product context.
The live plan, branches and parallel assignment are in **[`docs/PLAN.md`](PLAN.md)**.
The roster, owner/support and onboarding are in **[`docs/TEAM.md`](TEAM.md)**.
Current state and blockers are in `HANDOFF.md`; deployment is in `docs/DEPLOYMENT.md`.

**Do not use this file to coordinate current work.** The active lanes, waves and acceptance
criteria are in `docs/PLAN.md`.

The counts in this document (14-day baseline, 3 correlations, 4 scenarios) are historical.
The current documented target is a 90-day ground-training baseline, 4 correlations,
5 scenarios and a phase-aware baseline (P3 in `docs/PLAN.md`).

## Assignment (5 people)

| Lane | Owner | Branch | First PR |
|---|---|---|---|
| A · Engine + data | _(name)_ | `engine/…` | `engine/threshold-audit` |
| B · Body + Trends | _(name)_ | `body/…` | `body/skeleton` |
| C · Today + Decision | _(name)_ | `today/…` | `today/checkin` |
| D · Coach + Mission Control | _(name)_ | `ai/…` or `mission-control/…` | `ai/coach-panel` |
| E · Design + pitch | _(name)_ | `design/…` | `design/tokens` |
| Integration + deploy | Agustín (backup: Andrea Tapia) | `development`, `main` (release), `deploy/…` | — |

Names are filled in at the first meeting. Meanwhile, each lane can move forward
against the already-frozen contracts.

## Level rule

**Level 1 is not started until Today + Body + Decision work on the deployed URL.**
The order is: level 0 → deploy → level 1 → extras.

## Lane A · Engine + data

Area: `src/domain/`, `src/data/`, `scripts/`, `src/domain/*.test.ts`.

Done: contract, baseline, simple rules, correlations, bone, estimates, escalation,
evaluation, data and tests.

First PR (`engine/threshold-audit`):

- Review every threshold in `src/domain/rules.ts` against `docs/recursos/` and mark `verified`
  only when there is a primary source. Those without one stay `false` with a `TODO verify` note.
- Add tests for the exact limits (WATCH/CONCERN/URGENT) and for the bone case with
  good adherence on a long mission.
- Verify that `evaluate()` does not depend on the UI and that `npm run gen` does not change the JSON.

Acceptance criteria:

- `npm run check` green and no changes to the generated JSON.
- Every rule has a `SourceRef`; unverified ones are visible to the UI.
- No React/DOM imports in `src/domain/`.

## Lane B · Body + Trends

Area: `src/components/body/`, `src/components/charts/`, `src/screens/Body.tsx`,
`src/screens/Trends.tsx`.

First PR (`body/skeleton`):

- `BodyMap` SVG with the 6 zones + halo, colors from `LEVEL_COLOR`/`LEVEL_BG`, icon and text
  per state (never color alone).
- System card on tap: state, `why`, source, 30-day sparkline with baseline band.
- Data from `evaluate(scenario, day, mission)`; do not recompute rules.

Criteria:

- Works at 1180 × 820 (tablet) and with keyboard/touch.
- If a system is at WATCH+ it is understood without color.
- Component tests for the card and the empty state.

## Lane C · Today + Decision

Area: `src/screens/Today.tsx`, `src/screens/Decision.tsx`, `src/components/DemoBar.tsx`,
`src/store/orbiStore.ts`.

First PR (`today/checkin`):

- 7-field check-in with "Synced from wearable" / "Manual" labels.
- Streak and overall state; `Confirm` updates the store and the day.
- DemoBar: scenario, mission ISS/Moon/Mars, "Next day ▶", Reset.
- Decision: level, "Because…", action card and escalation by latency.

Criteria:

- 90-second check-in, without typing the automatic fields.
- Changing mission changes escalation without reloading.
- The UI does not reimplement thresholds: it only displays `Assessment`.

## Lane D · Coach + Mission Control

Area: `src/ai/`, `src/screens/MissionControl.tsx`, `src/components/decision/`.

First PR (`ai/coach-panel`):

- Connect the deterministic coach to the UI ("On-device" badge, "Explain" button).
- Feature flag for the local adapter: if there is no WebGPU/model, template and a clear message.
- Do not block the UI while it "thinks".

### EVA demo (preview of lane D)

Done: `src/simulation/eva.ts`, `src/screens/Eva.tsx`, Suit/Central map, sync loss,
inertial return, audit log and demo controls. The root opens the demo; the engine console
stays at `?view=console`.

Second PR (`mission-control/window`):

- `?view=ground` window with `BroadcastChannel('orbi-comms')` and latency countdown
  accelerated in the demo (14 min).
- Surgeon's packet and reply with the same latency.

Criteria:

- 0 guardrail violations in the 4 scenarios.
- The app behaves like the template if the model fails.
- Mission Control needs no backend.

## Lane E · Design + pitch

Area: `docs/`, `public/`, project page, video and slides.

First PR (`design/tokens`):

- Visual tokens (color, typography, spacing), states and base components.
- Today/Body/Decision sketches so B and C don't invent layout.
- "Why we ask" and "Why this matters" copy in English.

Criteria:

- Accessible contrast and states; color + icon + text.
- Illustration credits (Servier CC BY 4.0) visible.
- Demo script aligned with `CONCEPTO-ORBI.md` §13.

## Integration + deploy

- CI green on every PR; work merges to `development`; `main` only receives the release PR.
- ✅ Dokploy (`ORBI`) and Cloudflare (`orbi.agustinpane.xyz`) provisioned.
- ✅ Auto-deploy active: release merge into `main` → CI → `deploy` workflow on self-hosted runner → Dokploy.
- Keep `HANDOFF.md` and `docs/DEPLOYMENT.md` up to date.

## Contracts

Do not change without notifying the team:

- `src/domain/types.ts`
- `src/ai/types.ts`
- `src/content/systems.ts`
- Shape of the scenario JSON

## Schedule

| When | What | Done when… |
|---|---|---|
| Friday | Scaffold, engine, data, CI, docs | `npm run check` green; deploy provisioned |
| Saturday morning | Onboarding, sketches, B and C in parallel | Body and Today show real engine data |
| Saturday afternoon | Decision + DemoBar + streak | Level 0 complete on the URL |
| Saturday night | Trends + Mission Control (if there are 5) | Level 1 demonstrable |
| Sunday 12:00 | Code frozen | Rehearsal and submission only |
| Sunday 14:00 | Submission | Form complete |

## Definition of done

- `npm run check` and `npm run build` pass.
- The change is visible in the UI or in the engine, not only in a test.
- Tests cover the rule/correlation/estimate or the guardrail.
- UI and docs in English.
- No secrets or generated-data drift.
- `HANDOFF.md` reflects the state and the next action.
