# Contributing to ORBI

Short guide for the team. The technical contract is in `AGENTS.md`; assignment and onboarding in
`docs/TEAM.md`; the lanes in `docs/PLAN.md`.

## Setup

```bash
nvm use            # Node 22 (.nvmrc); npm 10 pinned in package.json
npm ci
npm run gen        # deterministic synthetic data
npm run dev
```

No backend, database or environment variables needed. The stack is Vite + React 19:
do not add Next.js or SSR.

## Before you start: claim your issue

Every lane must be tied to a GitHub issue. The assignee is the lock so two
agents do not work on the same thing. Issues are already created and assigned in `docs/TEAM.md`:

1. Find your issue in `docs/TEAM.md` or with `gh issue list --assignee @me --state open`.
2. Confirm the assignee is you; if not, do not start: coordinate in the issue.
3. Comment branch, worktree and port before writing code:

   ```bash
   gh issue comment <number> --body "Starting on <branch> (worktree <path>, port <port>)."
   ```

4. In the PR, reference it with `Closes #<number>`.
5. Do not reassign someone else's issue. If you need to move it, talk to the owner and the integrator.

## Before opening a PR

```bash
npm run check      # typecheck + check:domain + Biome CI + tests
npm run build
```

If you touched `src/data/generate.ts` or the scenarios, run `npm run gen` and commit the JSON.
If you touched the UI, test it in a tablet viewport (1180 × 820) and attach a screenshot.

## Branches

One branch per lane, with prefix:

```text
engine/…          engine, rules, data, tests
body/…            BodyMap, system sheet, sparkline, Trends
today/…           check-in, streak, DemoBar
ai/…              coach, guardrails, optional local integration
mission-control/… ground window, procedures
design/…          styles, copy, pitch
deploy/…          Docker, CI, Dokploy, Cloudflare
docs/…            documentation
```

Create every branch from `development` and open the PR against `development`. `main` is
release-only: the integrator opens a `development` → `main` release PR, and that merge triggers the
automatic deploy to the preview. Do not open feature PRs against `main` or push directly to it.

Do not mix two lanes in one PR. Small PRs; the integrator (`@Agupane`, backup
`@atapiamallea`) merges into `development` every 3–4 h.

## Contracts that are not touched without notice

- `src/domain/types.ts`
- `src/ai/types.ts`
- `src/content/systems.ts`
- The shape of the scenario JSON files

If you need to change them, say so in the team channel before opening the PR and update
`docs/PLAN.md`/`HANDOFF.md` with the reason.

## Product rules

- UI in English; all project docs are in English.
- The engine does not diagnose: it prioritizes, explains and escalates.
- Every threshold has a source and a `verified` flag in `src/domain/rules.ts`. Do not invent numbers.
- Colour is never the only signal: colour + icon + text.
- No backend, database, auth, decision ML, computer vision or 3D.

## Commits

Conventional Commits:

```text
feat: add early-infection correlation to Decision
fix: only raise bone WATCH below exercise target
test: cover coach guardrails against invented numbers
docs: update handoff and deployment runbook
chore: pin Node 22
refactor: extract baseline statistics
```

## Handoff

If you end a session with work in progress, update `HANDOFF.md`: state, what's missing,
blockers and the concrete next action. Do not leave the context only in chat.

## Deploy

Release preview: `https://orbi.agustinpane.xyz` (Dokploy BCN, Cloudflare in front).
Full runbook: `docs/DEPLOYMENT.md`. There are no per-PR previews: the preview is updated by a
release merge into `main`.
