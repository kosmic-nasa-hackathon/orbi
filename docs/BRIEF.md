# ORBI — Team brief (read it in 2 minutes)

**Challenge:** NASA Space Apps 2026 · *Create Health Monitoring Software for Astronauts on Space Missions*
**Submission:** Sunday 16:00 (we submit at **14:00**) · **Code frozen Sunday 12:00**

## What it is
A tablet app where the astronaut does a **90-second daily check-in**. The watch and the biometric shirt already bring sleep, HR, SpO₂ and temperature; they confirm and add mood, fatigue and glucose. ORBI then shows them:
1. **Body**: a figure with 6 systems in colors and a radiation **halo** around it.
2. **Decision**: how serious it is, **why** (the rule that fired) and **what to do**.
3. **Who to notify**, based on mission latency (ISS ≈ 0 s · Moon ≈ 1.3 s · Mars up to 20 min each way; in the demo, 14 min).

> *From drift to decision.* ORBI does not diagnose: it prioritizes, explains and escalates.

## Why it wins
- Each body element maps to one of NASA's **5 hazards**.
- **Explainable rules** with a source, not a black box.
- **Latency is a clinical variable**: on Mars you act on board first.
- It separates **the body from the environment**: "Cabin issue, not you" (CO₂).
- **Also designed for the female astronaut.** In the luteal phase temperature and HR rise, and ORBI does not mistake it for an infection: *"Expected cycle variation, not infection."* The data is opt-in and **does not travel to Earth without her permission**. Absolute clinical thresholds are never relaxed.
- **"Train like you fly":** ORBI is used from ground training (90 days), and there it learns the **personal baseline** against which it compares each in-flight reading.
- **It is honest about what cannot be measured:** bone loss is **estimated** with NASA evidence (1–1.5%/month) and radiation is shown against a **budget**, because NASA acknowledges that there are still no limits for long missions.
- **Everything with sources**: NASA's and CSA's official ones, plus scientific reviews on female health and training (`resources/08` and `09`).

## Scope by levels
**Level 0 · Core (mandatory)**
- 3 screens: **Today** (check-in + streak), **Body**, **Decision**
- 7 daily fields: sleep, mood, fatigue, HR, temperature, SpO₂, glucose, plus an opt-in cycle field ("period today?")
- 4 correlations: early infection · **cycle (false alarm avoided)** · cabin air · solar event
- 2 bone rules: exercise adherence on missions longer than 90 days / longer than 6 months or on surface
- 2 estimates: **estimated bone loss** (Musculoskeletal) and **% of the radiation budget** (halo)
- Demo bar: scenario · mission · "Next day ▶" · Reset · "Cycle-aware baseline" toggle
- Synthetic data for a commander: **90 days of ground training** (baseline) + 30 of mission (days 119–148 en route to Mars); **5 scenarios** (nominal, early-infection, luteal-phase, cabin-co2, solar-event); no backend

**Level 1 · If we are 4–5:** **Trends** (charts with the *"Your ground baseline"* band and the cycle overlaid) + **Mission Control**: ship and ground in two windows, and the surgeon's packet travels with the latency countdown.
**Level 2 · If there is time left:** guided procedures (incl. jugular ultrasound) · vision test (Amsler grid) · offline.

A level is not started until the previous one works on the deployed URL.

## Stack
Vite + React 19 + TypeScript · Tailwind + own design system (`docs/DESIGN.md`) · Recharts 3 · Zustand · Vitest · Dokploy · Node 22. **UI, project docs and submission in English.** Detail in `STACK.md`.

## Blocks (choose one)
| Block | What | Profile |
|---|---|---|
| A · Engine + data | Rules, correlations, estimates, `evaluate()`, phase-aware baseline, tests (the 6 rules + the cycle safety rule), JSON scenarios | Logic-oriented TS |
| B · Body + Trends | Clickable SVG figure, sparkline, charts | Frontend / design |
| C · Today + Decision | Check-in, streak, action card, escalation | React frontend |
| D · Mission Control + extras | Ground window, procedures, Amsler | React frontend |
| E · Design + pitch | Sketches, copy, project page, video, slides | Communications / design |

The contract between blocks is `src/domain/types.ts`: **it is not changed without notifying the whole team.** Small PRs with CI green; `@Agupane` merges into `development` every 3–4 h (`@atapiamallea` as backup) and promotes `development` to `main` for releases. Assignment in `docs/TEAM.md`.

## Milestones
- **Friday:** repo + CI + deployed URL, engine with tests green
- **Saturday afternoon:** Level 0 complete on the URL
- **Saturday night:** Level 1 (if we are 4–5)
- **Sunday 12:00:** code frozen → video + submission

Full detail in `CONCEPT.md`. Sources summarized in `resources/README.md`.

---

### Project summary (EN, for the submission form)
ORBI is a health autonomy console for astronauts on long-duration missions. Wearables pre-fill sleep, heart rate, SpO₂ and temperature; in a 90-second daily check-in the astronaut confirms them and adds mood, fatigue and blood glucose. This feeds an auditable rules engine that compares each reading against the astronaut's personal baseline, learned during ground training ("train like you fly"). The baseline is cycle-aware: when a crew member opts in, ORBI knows that temperature and resting heart rate rise naturally in the luteal phase and doesn't mistake that for an infection, while absolute clinical thresholds always apply. Reproductive data stays with her unless she chooses to share it with the ground. The result is shown on an interactive body map: six physiological systems, each mapped to one of NASA's five hazards of human spaceflight, plus a radiation "halo". When a pattern emerges, ORBI explains why, gives a step-by-step action card and adapts escalation to communication delay: on Mars, act on board first. It also tells cabin problems apart from crew health problems. Where something can't be measured in flight, ORBI says so: bone loss is estimated from NASA Human Research Program evidence and tracked through exercise adherence, and radiation is shown against an exposure budget, since NASA notes that deep-space limits are still an open question. ORBI doesn't diagnose: it prioritizes, explains and escalates.
