# STACK — ORBI

> What to install, in what order and why. No theory: decisions and commands.
> Scope and product: `CONCEPT.md` · Team summary: `BRIEF.md`

---

## Decision in one line

**A React + TypeScript SPA with Vite. Tailwind (with optional shadcn/ui) for the skin, Recharts for the charts, the rules engine in pure TypeScript, the data in local JSON and static deployment on Dokploy (Cloudflare in front). No backend, no database, no authentication. *Tablet-first* design and UI in English.**

It is the stack with which a small team can have something impressive and *stable* in 48 hours, and the one that fails least in a live demo.

---

## 1. The stack, layer by layer

| Layer | Tool | Why this and not another | Alternative | Setup |
|---|---|---|---|---|
| **Runtime** | **Node 22 LTS** pinned with `.nvmrc` | With 4–5 people, each will have a different Node version. Node 25 is too new. | — | 5 min |
| **Build** | **Vite** | Instant startup, zero configuration, static output. No SSR or hydration errors at 3 a.m. | Next.js (only if the team already masters it) | 2 min |
| **Language** | **TypeScript** | The rules engine needs types, and types are the contract between blocks. | JS | 0 |
| **UI** | **React 19** | Ecosystem, familiarity, and every charting and SVG library assumes it. | — | 0 |
| **Styles** | **Tailwind CSS v4** (+ **shadcn/ui**, optional and recommended) | Professional look without designing from scratch. shadcn copies the code into your repo: it is not a dependency, it is your code. shadcn is not installed yet; adopt it only if it pays for itself. | Tailwind by hand | 20 min |
| **Charts** | **Recharts 3** | Declarative, sparklines in 10 lines. v3 is the one compatible with React 19 (2.x has dependency issues). | visx | 15 min |
| **Animation** | **Motion** (formerly framer-motion) | Panel transitions and switching to emergency mode. Better 3 well-made animations than 20. | CSS transitions | 10 min |
| **Body map** | **Custom SVG** + **Servier Medical Art** illustrations | Layer control, colour per system, accessible, animatable. | three.js (pretty, expensive and fragile in a demo) | 1–2 h |
| **State** | **Zustand** + `persist` | 1 KB and no boilerplate. Saves the streak and the current day in localStorage. | Context API | 10 min |
| **Validation** | **Zod** (optional and recommended) | Validates the clinical rules file: a badly written rule fails in the test, not in the demo. *Optional*: if it slows down whoever owns the engine, use plain TS types. Not installed yet. | nothing | 10 min |
| **Rules engine** | **Pure TypeScript** | Explainable, testable, dependency-free. | `json-rules-engine` (overkill) | 0 |
| **Tests** | **Vitest** | Shares the Vite config. Engine tests are credibility before the jury. | Jest | 15 min |
| **Scripts** | **tsx** | Runs `scripts/generate-mission.ts` directly with `npm run gen`. | vite-node | 2 min |
| **Dates** | **date-fns** | Lightweight. For comms-window times. | dayjs | 2 min |
| **Icons** | **lucide-react** | Same stroke as shadcn. Also useful for the state icons (see §5). | heroicons | 2 min |
| **Fonts** | **@fontsource** | Fonts live in the repo, not via CDN: they work without wifi. | Google Fonts | 5 min |
| **Data** | **TS generator with seeded RNG → JSON** | Deterministic demo: always the same day 148, always the same curve. | hand-written mocks (fragile) | 1 h |
| **Quality** | **Biome** | Lint + format in one tool and in milliseconds. | ESLint + Prettier | 5 min |
| **Repo** | **GitHub** + **GitHub Actions** | CI with `test` + `build` on every PR: nobody breaks `development`/`main` without knowing. | — | 15 min |
| **Deploy** | **Dokploy BCN** | Dockerfile app + nginx at `orbi.agustinpane.xyz`, release auto-deploy on `main` and TLS at Cloudflare. Release preview only; no per-PR previews. | Vercel (previews) | 15 min |
| **Sketches** | **Figma** or **Excalidraw** | 30 minutes on Saturday to sketch the screens before coding. Design is discussed in a drawing, not in code. | paper | 30 min |
| **Offline** (level 2) | **vite-plugin-pwa** | Makes the promise of working without Earth verifiable (airplane mode in the demo). | — | 15 min |

**Real setup total:** ~2.5 h (including repo, CI and deploy). Done **on Friday**, not Saturday.

> **Actual status (Nov 14, 2026):** the scaffold already exists (Vite 8, React 19.3, TypeScript 5.9,
> Tailwind 4, Vitest 5, Biome 2), the engine and the coach are implemented, and CI/Dockerfile/nginx
> are in the repo. The Level 0 screens (Today, Body, Decision) and the light theme are still missing. Dokploy and Cloudflare are already provisioned and
> the app is deployed at `https://orbi.agustinpane.xyz`. Until P3 lands, the engine still uses a
> 14-day pre-flight baseline, 3 correlations and 4 scenarios; the 90-day ground baseline,
> 4 correlations (including `cycle-aware`) and 5 scenarios (including `luteal-phase`) are the
> documented target. See `HANDOFF.md`.

---

## 2. How to set it up (commands, in order)

```bash
# 0. Node 22 (once per person)
nvm install 22 && nvm use 22

# 1. Create the project at the repo root (it already exists, with docs/ inside)
git clone https://github.com/kosmic-nasa-hackathon/orbi.git   # if you don't have it yet
cd orbi
npm create vite@latest . -- --template react-ts
#   → Vite warns that the folder is not empty: choose "Ignore files and continue"
#   → afterwards check that it has not overwritten README.md or .gitignore (git diff)
echo "22" > .nvmrc
npm install

# 2. Tailwind v4 (Vite plugin, no postcss config)
npm install tailwindcss @tailwindcss/vite

# 3. Product dependencies
npm install zustand recharts motion date-fns lucide-react clsx tailwind-merge @fontsource-variable/inter

# 4. Development dependencies
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @biomejs/biome tsx
```

Scripts in `package.json`:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc --noEmit && vite build",
  "typecheck": "tsc --noEmit",
  "lint": "biome check .",
  "test": "vitest run",
  "gen": "tsx scripts/generate-mission.ts",
  "check": "npm run typecheck && npm run lint && npm run test"
}
```

Minimal `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
```

`src/index.css`:

```css
@import "tailwindcss";
```

### shadcn/ui

*Optional and recommended; not part of the current dependencies.*

```bash
npx shadcn@latest init
```

Before running it you need to prepare **two things**; otherwise it fails without an error:

1. The `@/*` alias in `tsconfig.json` and in `tsconfig.app.json` (`"baseUrl": "."`, `"paths": { "@/*": ["./src/*"] }`).
2. The alias in `vite.config.ts` (above).

Components that will actually be used: `card`, `button`, `badge`, `dialog`, `sheet`, `progress`, `tabs`, `tooltip`, `separator`, `slider` (mood and fatigue).

> **If shadcn slows you down more than 20 minutes, drop it.** A `Card` with Tailwind by hand is 8 lines.

### CI (`.github/workflows/ci.yml`)

```yaml
name: ci
on:
  push: { branches: [main, development] }
  pull_request:
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version-file: .nvmrc, cache: npm }
      - run: npm ci
      - run: npm run gen && git diff --exit-code -- src/data/scenarios
      - run: npm run check
      - run: npm run build
```

### Repo rules

- `development` is the default integration branch; every PR targets it. `main` is release-only:
  the integrator opens `development` → `main`, and that release merge triggers the auto-deploy.
  The free private repo does not allow branch protection: the real gate is the PR + the integrator.
- **One integrator** (`@Agupane`; backup `@atapiamallea`) reviews and merges PRs. That way there is no debate about what goes in.
- Branches per block: `engine/…`, `body/…`, `today/…`, `ai/…`, `mission-control/…`, `design/…`, `deploy/…`.
- Small PRs and integration every 3–4 h. **Changing `src/domain/types.ts` requires notifying the whole team.**

---

## 3. Folder structure

```
orbi/                            # = root of the kosmic-nasa-hackathon/orbi repo
├─ README.md
├─ docs/                         # BRIEF, CONCEPT, STACK, resources/
├─ .nvmrc
├─ .github/workflows/ci.yml
├─ public/
│  └─ body/body-base.svg
├─ scripts/
│  └─ generate-mission.ts        # npm run gen → src/data/scenarios/*.json
├─ src/
│  ├─ domain/                    # ⚠️ ZERO React imports here
│  │  ├─ types.ts                # the contract (see CONCEPT.md §8)
│  │  ├─ baseline.ts             # mean ± σ of the 90 training days; per cycle phase if cycle = tracked (proposal)
│  │  ├─ rules.ts                # thresholds, sources and action cards
│  │  ├─ levels.ts               # level order and labels
│  │  ├─ escalation.ts           # level × latency
│  │  ├─ evaluate.ts             # correlations, estimates, facts and evaluate()
│  │  └─ *.test.ts
│  ├─ ai/                        # deterministic coach + local adapter + guardrails
│  │  ├─ types.ts
│  │  ├─ coach.ts
│  │  ├─ guardrails.ts
│  │  └─ providers/
│  ├─ data/
│  │  ├─ rng.ts                  # seeded mulberry32
│  │  ├─ generate.ts             # scenario generator
│  │  └─ scenarios/*.json        # generated (committed to the repo)
│  ├─ content/
│  │  └─ systems.ts              # labels, "why this matters" and colours
│  ├─ store/
│  │  └─ orbiStore.ts            # Zustand: scenario, day, mission, streak
│  ├─ components/
│  │  ├─ DemoBar.tsx             # scenario · mission · Next day ▶ · Reset
│  │  ├─ LevelBadge.tsx          # colour + icon + text
│  │  ├─ body/BodyMap.tsx
│  │  ├─ body/SystemSheet.tsx
│  │  ├─ charts/Sparkline.tsx
│  │  ├─ decision/BecauseList.tsx
│  │  ├─ decision/ActionCard.tsx
│  │  ├─ decision/EscalationPanel.tsx
│  │  └─ ui/                     # shadcn
│  └─ screens/
│     ├─ Today.tsx               # level 0
│     ├─ Body.tsx                # level 0
│     ├─ Decision.tsx            # level 0
│     ├─ Trends.tsx              # level 1
│     ├─ MissionControl.tsx      # level 1 (second window: ground)
│     ├─ Procedures.tsx          # level 2
│     ├─ VisionTest.tsx          # level 2 (Amsler grid)
│     └─ CrewPanel.tsx           # level 2 (CMO view)
```

**The golden architectural rule:** `src/domain/` does not import anything from React.

That gives three things: the engine can be tested with Vitest without mounting components, the clinical logic can be defended as "independent of the interface", and if the UI breaks, the brain keeps working. It is the argument that impresses a technical jury the most.

**Navigation:** a `useState<Screen>` + `AnimatePresence`. The only exception is Mission Control, which opens in another window with `?view=ground`, without a router.

---

## 4. Scope levels (what gets built depending on the team)

Rule: **do not start a level until the previous one can be demonstrated complete on the deployed URL.**

| Level | What goes in | Hours | With how many people |
|---|---|---|---|
| **0 · Core** | Today (check-in + streak), Body (6 systems + halo), Decision (because, action card, escalation), DemoBar (+ cycle toggle), 4 correlations + 2 bone rules + 2 estimates, 5 scenarios, phase-aware ground baseline | ~28 h | 2–3 |
| **1 · Differentiator** | **Trends** (charts with the *"Your ground baseline"* band + cycle overlaid) + **Mission Control** (ship ↔ ground in two windows, §8) | +8 h | 4–5 |
| **2 · Extra** | 2 guided procedures + jugular ultrasound, contraceptive supply warning, **Amsler grid vision test**, CMO view with 3 crew members, offline PWA | +10 h | 5, and only if level 1 is done by Saturday night |

### Level 0 budget

| Component | Hours | Cuttable? |
|---|---|---|
| Setup + repo + CI + deploy | 2.5 | No |
| `types.ts` + baseline (with phase-aware cycle baseline) + rules with source | 3.5 | **No** |
| Data generator (90 ground days + cycle model) + 5 scenarios | 2.5 | **No** |
| Correlations (incl. `cycle-aware`) + bone rules + estimates + escalation + tests | 4.5 | **No** |
| Body (SVG + interaction + halo + sheet) | 4 | Partially (simple silhouette) |
| Decision | 3 | **No** |
| Today (check-in with "Synced" + streak) | 2 | Partially |
| DemoBar + reset | 1 | **No** |
| Visual polish on tablet | 2 | Partially |
| Script, slides, backup video | 3 | **No** |
| **Total** | **~28 h** | |

---

## 5. The body map: the most delicate decision

It is what is seen the most and what breaks most easily.

### Option A — Servier Medical Art *(recommended)*
Free anatomical illustrations under **CC BY 4.0**, intended for medical outreach. They are recoloured in an SVG editor.
- ✅ Real clinical quality, consistent across pieces
- ⚠️ Requires visible attribution ("Illustrations: Servier Medical Art, CC BY 4.0") in the footer and in the credits.

### Option B — Custom silhouette *(plan B, prepared from Friday)*
Stylized figure in Figma with 6 zones. **45 minutes, zero risk**, less impactful.

### Implementation

A **single SVG** with groups identified by system. The class sets the colour:

```html
<svg viewBox="0 0 400 800">
  <ellipse class="halo" cx="200" cy="400" rx="170" ry="380" />
  <g data-system="cardio"      class="system-fill cursor-pointer">…</g>
  <g data-system="msk"         class="system-fill cursor-pointer">…</g>
  <g data-system="immune"      class="system-fill cursor-pointer">…</g>
  <g data-system="metabolic"   class="system-fill cursor-pointer">…</g>
  <g data-system="respiratory" class="system-fill cursor-pointer">…</g>
  <g data-system="behavioral"  class="system-fill cursor-pointer">…</g>
</svg>
```

```tsx
<svg onClick={(e) => {
  const g = (e.target as Element).closest('[data-system]')
  if (g) selectSystem(g.getAttribute('data-system') as SystemId)
}}>
```

```css
.system-fill { fill: var(--state-color); transition: fill 400ms ease; }
.halo { filter: blur(28px); opacity: var(--radiation-opacity); }
```

### Colour-code accessibility

The challenge asks for colour coding, but **colour never stands alone**. Every state carries colour + icon + text, so that a colour-blind judge or a washed-out projector does not confuse it:

| Level | Color | Icon (lucide) | Text |
|---|---|---|---|
| NOMINAL | green | `CircleCheck` | Nominal |
| WATCH | yellow | `Eye` | Watch |
| CONCERN | amber | `TriangleAlert` | Concern |
| URGENT | red | `Siren` | Urgent |

On the map: in addition to colour, a small marker with the icon over the affected system.

### Tablet-first

- Design at **1180 × 820** (landscape iPad) and test in DevTools with that viewport.
- Touch targets of ≥ 44 px; nothing depends on hover.
- On the projector laptop it looks just as good.

---

## 6. Synthetic data

Without data there is no demo, and with bad data the demo lies.

```ts
// mulberry32: seeded RNG → always the same curve
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
```

**One crew member, 90 days of ground training (baseline, days −90 to −1, `phase: "TRAINING"`) + 30 days of mission (`phase: "TRANSIT"`).** Per day: the 7 check-in indicators + minutes of resistive exercise (device) + environment (cabin CO₂, dose, SPE). The 30 days correspond to days **119–148** of the Mars mission (`firstMissionDay` field): they are still in transit, because the outbound leg lasts 162–189 days according to the HRP, so the "Day 148 on the way to Mars" hook fits.

Scenario fields that the estimates need (see `CONCEPT.md` §4.3 and §8):

| Field | Default value | What for |
|---|---|---|
| `exposureBudgetMSv` | 600 (NASA career limit since 2022, the same for all sexes and ages; `resources/08`); the demo scenarios use 400 so the halo is legible | % of the budget in the halo |
| `priorDoseMSv` | the accumulated dose on days 1–118 | So the halo does not start at 0 on day 119 |
| `exerciseTargetMinPerDay` | the mission target | Exercise adherence rule (bone) |
| `trainingDays` | 90 | Ground baseline days (2–3 cycles) |
| `crew` | `{ sex: "F", cycle: "tracked", contraception: "none", shareReproductiveWithGround: false }` | Phase-aware baseline and packet privacy |

**Estimated bone loss** (`evaluate.ts`): `monthsInMicrogravity × [1 %, 1.5 %]` → returned as a **range**, never as a single number, and the UI labels it as *"Estimated · NASA HRP evidence"*. Adherence changes the state (*on track* / *at risk*), not the percentage.

**Cycle model** (generator, only if `crew.cycle === "tracked"`):
- Cycle of 28 ± 2 days, seeded with the RNG. Period (`menses: true`) on days 1–5. Ovulation around day 14.
- In the luteal phase (days ~15–28) **+0.4 °C ± 0.1** is added to temperature and **+4 bpm ± 1** to resting HR. It is the `resources/08` range: +0.28–0.56 °C and +2–7 bpm.
- `baseline.ts` computes mean ± σ per phase with the training days. The relative rules ("+2σ", "+10 bpm") use the current phase's baseline; **the absolute thresholds do not change**.
- Mandatory test: with a temperature of 38.1 °C in the luteal phase, it still fires CONCERN.

The same 5 scenarios as in `CONCEPT.md` §7:

| Scenario | What it tells | What it demonstrates |
|---|---|---|
| `nominal` | Everything within range | Body in green, active streak |
| `early-infection` | Sleep debt → temperature and HR rise | The behavioral-to-physiological correlation |
| `luteal-phase` | Days 24–30 in the luteal phase: temperature and HR somewhat higher, normal sleep | **"Expected cycle variation, not infection"**; with the toggle off, WATCH |
| `cabin-co2` | Cabin CO₂ rises, SpO₂ drops slightly | **"Cabin issue, not you"** |
| `solar-event` | SPE on the last day | Red halo, shelter protocol |

**Quality rule:** no flat values. Realistic daily noise + a slow drift + an inflection point. If the curve looks like a straight line, the jury knows it is made up.

Every value carries its `sources` (`wearable` / `device` / `manual`) so that Today shows "Synced" or "Manual".

**Demo detail:** in `early-infection`, make exercise adherence also drop in the last days (fatigue makes her skip sessions). That way Musculoskeletal switches to WATCH with the bone rule, and the demo shows the two new rules without an extra scenario.

---

## 7. What NOT to install

| No | Why |
|---|---|
| Backend (Express, Spring, FastAPI) | There is nothing to serve. Everything runs on the client. |
| Database (Postgres, Supabase, Firebase) | `localStorage` + JSON are enough for a weekend. |
| Authentication | There are no users in a demo. |
| three.js / react-three-fiber | 3D eats 8 hours and fails on the projector. SVG gives 90 % of the effect. |
| Decision ML | The jury rewards explainability; the engine is deterministic. The local coach is only an optional explanation layer. |
| MUI / Ant Design | Heavy and with a visual personality that is not yours. |
| Docker for development | The app is static; Docker is only used as a deploy artifact (nginx + `dist/`). |
| React Router | An extra screen in another window is handled with `?view=ground`. |

---

## 8. Mission Control: ship ↔ ground without a backend (level 1)

Communication latency is an **interface simulation**, not a network fact. In the demo you control the clock: you can accelerate 14 minutes into 5 seconds in front of the jury.

```ts
// Window A — ORBI on board (tablet)
const comms = new BroadcastChannel('orbi-comms')
comms.postMessage({ type: 'surgeon-packet', payload, sentAt: Date.now(), latencyMin: 14 })

// Window B — Mission Control / Flight Surgeon (?view=ground)
comms.onmessage = (e) => setInbox(prev => [...prev, e.data])
```

Two browser windows, side by side: the ship on the left and the ground on the right. The packet travels with a progress bar and a latency countdown (accelerated ×100 in demo mode). The surgeon replies and the reply takes the same time to come back. **It is the wow moment of the demo**: the jury *sees* the distance to Earth, one of the 5 hazards.

> Limitation: `BroadcastChannel` only works between tabs of the **same browser and the same origin**. For the demo that is exactly what is needed.

| If some day… | You would need | In the hackathon? |
|---|---|---|
| Several real crew members synchronized | Database + backend | No |
| Real data transmission to the ground | Backend + queue | No |
| Just show it and have it work | `npm run build` and deploy `dist/` | **Yes, this** |

---

## 9. Technical risks and mitigation

| Risk | Mitigation |
|---|---|
| Different Node versions on the team | `.nvmrc` + `nvm use` + CI with the same version. |
| Dependency conflicts with React 19 | Recharts 3. If a package complains, `npm ls` and pin the version. **No `--force`** without telling the integrator. |
| shadcn does not start because of the aliases | Follow §2 to the letter. If it fails, Tailwind by hand. |
| Someone breaks `development`/`main` | CI + integrator review. The free private repo does not allow branch protection; the gate is the PR. |
| Private repo in an org without a GitHub App | Solved with an SSH deploy key + self-hosted runner; see `docs/DEPLOYMENT.md`. |
| The anatomical SVG is not ready | 6-zone silhouette as plan B from Friday. |
| Illustration license | Servier is CC BY 4.0: visible attribution from the first commit. |
| The demo is not reproducible | Seeded RNG + Reset button. Never random data live. |
| The demo depends on wifi | Static deploy + local build (`npx serve dist`) + recorded video. Triple safety net. |
| Fonts that do not load | `@fontsource` in the repo. |
| Something breaks at the last minute | Code frozen on Sunday at 12:00. After that, only rehearsal. |

---

## 10. Next.js? Backend? No and no

- **Next.js:** file-based routing, Server Components, API routes and SSR add nothing to a 100 % interactive app without a server. It would only make sense if the team already masters it, and even then exported as an SPA (`output: 'export'`).
- **Backend:** store data → `localStorage`; compute triage → JS in microseconds; serve data → JSON at build time; send the packet to the ground → `BroadcastChannel` + timer.
- **Java:** even though Andrea masters it, a Spring backend adds deployment, CORS and a point of failure in exchange for nothing visible to the jury.

---

## 11. "This can be shown" checklist

- [ ] `npm run check` and `npm run build` pass; CI green on every PR
- [ ] `npm run gen` reproduces the JSON without diff (`git diff --exit-code -- src/data/scenarios`)
- [ ] `src/domain/` does not import React, the DOM or browser APIs
- [ ] Public URL deployed + QR on a slide
- [ ] **Reset demo** button visible in the DemoBar
- [ ] Works with wifi off after loading
- [ ] Green tests: correlations (incl. `cycle-aware`), 2 bone rules, 2 estimates, cycle safety rule and coach guardrails
- [ ] Every threshold in `rules.ts` has its `source`; unverified ones marked `TODO verify`
- [ ] States with colour + icon + text
- [ ] Tested on a tablet viewport **and** at projector resolution
- [ ] All UI in English
- [ ] Illustration credits visible
- [ ] Backup video recorded
- [ ] Final README in English (what it is, how to run it, threshold sources)
