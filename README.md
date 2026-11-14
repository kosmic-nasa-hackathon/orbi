# ORBI

> *From drift to decision.* Health autonomy console for astronauts on long-duration missions · NASA Space Apps Challenge 2026

**Challenge:** [Create Health Monitoring Software for Astronauts on Space Missions](https://www.spaceappschallenge.org/2026/challenges/health-monitoring-software/)
**Team:** Kosmic

ORBI is a tablet app for astronauts. The watch and the biometric shirt already carry the data, and in a 90-second daily check-in the astronaut confirms it. ORBI turns it into a body reading (6 systems + a radiation halo), an explained triage decision and an action plan, with an escalation that adapts to the communication delay with Earth.

Each astronaut's baseline is learned **during ground training** and **takes the menstrual cycle into account** (opt-in and private), so a luteal phase is not mistaken for an infection.

## Documentation

| Document | Purpose |
|---|---|
| **[docs/BRIEF.md](docs/BRIEF.md)** | **Start here.** The project in 2 minutes, scope levels and work lanes |
| [docs/CONCEPT.md](docs/CONCEPT.md) | Full concept: use on the ship, rules, scenarios, type contract, demo script |
| [docs/STACK.md](docs/STACK.md) | Technical stack, setup commands, folder structure, CI and risks |
| **[docs/PLAN.md](docs/PLAN.md)** | **Live plan:** parallel lanes, branches, allowed files and acceptance criteria |
| **[docs/TEAM.md](docs/TEAM.md)** | **Live assignment:** roster, owner/support, worktrees, ports and onboarding |
| [docs/TASKS.md](docs/TASKS.md) | Historical briefs per lane (product context) |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Dokploy + Cloudflare runbook and auto-deploy |
| [docs/PITCH.md](docs/PITCH.md) | Pitch script and navigable deck at `/pitch/` |
| [docs/resources/](docs/resources/README.md) | Summaries of the official NASA and CSA resources, plus women's health in spaceflight and ground training, and how we use them |
| **[HANDOFF.md](HANDOFF.md)** | Current state, blockers and next actions |
| [AGENTS.md](AGENTS.md) · [CLAUDE.md](CLAUDE.md) | Rules for coding agents (OpenCode, Claude Code, Codex) |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Setup, branches, PRs and commits |

## Status

- ✅ Concept, stack and resources documented
- ✅ Vite + React 19 + TS + Tailwind + Vitest scaffold
- ✅ Domain engine (`src/domain/`) and deterministic data
- ✅ Deterministic coach + optional local adapter (`src/ai/`)
- ✅ Dockerfile, nginx and CI
- ✅ Release preview at **https://orbi.agustinpane.xyz**; `main` is release-only and auto-deploys
- ✅ EVA demo: link loss, inertial navigation and return to the ship
- ✅ Navigable pitch at **`/pitch/`** (15 slides, speaker notes and reading mode with `?view=scroll`)
- ✅ Product home at `/` with icon navigation to EVA, console and pitch
- ✅ Documented product shift: ground-training baseline and opt-in menstrual cycle
  (`docs/resources/08` and `09`)
- ⏳ P3 · Engine: 90-day baseline, `cycle-aware`, `luteal-phase`, 5 scenarios and 4 correlations
- ⏳ Light theme + switch, P3 (baseline + cycle), Today/Body/Decision, Trends and Mission Control (see `docs/PLAN.md` and `docs/TEAM.md`)

The current code still uses a 14-day baseline, 3 correlations and 4 scenarios; P3 closes the gap.

The root opens the home. The EVA demo lives at `?view=eva` and the console at `?view=console`.
To jump to a moment of the demo: `/?view=eva&t=18` (no sync) or `/?view=eva&t=24`
(inertial return active).

## Development

```bash
nvm use            # Node 22
npm ci
npm run gen        # regenerates the deterministic scenarios
npm run dev        # Vite
npm run check      # typecheck + Biome + tests
npm run build      # production build in dist/
```

## Branching and release

- `development` is the default branch and the integration target for every PR.
- Create work branches from `development` and rebase on `development`, not `main`.
- The integrator (`@Agupane`, backup `@atapiamallea`) merges PRs into `development`.
- Release: the integrator opens a `development` → `main` PR. Merging it runs CI and the
  automatic deploy to the preview at **https://orbi.agustinpane.xyz**.
- `main` is release-only. Do not push directly to it or open feature PRs against it.

## Deploy

Release preview: **https://orbi.agustinpane.xyz** (Dokploy BCN, Cloudflare in front).
The build uses the root `Dockerfile`; a release merge into `main` triggers the automatic deploy.
Details and troubleshooting: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Key dates

| Milestone | When |
|---|---|
| Level 0 (core) running at the URL | Saturday afternoon |
| Code freeze | **Sunday 12:00** |
| Project submission | **Sunday 14:00** (official deadline: 16:00) |

## How we work

- One branch per block and small PRs to `development`. The integrator (`@Agupane`, backup `@atapiamallea`) reviews and merges.
- `main` is release-only: the integrator promotes `development` to `main`, and that merge deploys the preview.
- The contract between blocks is `src/domain/types.ts`: **it is not changed without notifying the whole team.**
- UI, final README and submission **in English**; all project docs are in English.
- Before each PR: `npm run check` and `npm run build`.
