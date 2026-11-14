# ORBI — Concept (hackathon scope)

> Health Autonomy Console for astronauts on long-duration missions.
> NASA Space Apps 2026 · Challenge: *Create Health Monitoring Software for Astronauts on Space Missions*
> Due: **Sunday 16:00** · Target submission: **Sunday 14:00**

This document replaces the original concept (AURA) as the working document. The original is kept by Andrea and is not in the repo. If something is not here, **it is not in the MVP**.

---

## 0. In one sentence

**ORBI turns simple daily measurements into a reading of the body, an explained triage decision and a plan of action, with Earth close by or 20 minutes away.**

> *"Health in space doesn't fail all at once: it fails through silent accumulation. We don't build a dashboard of vitals: we build a system that watches for drift, translates it into a body, and turns it into a decision."*

Tagline in English (for the UI and the submission): ***"From drift to decision."*** · Pitch: *"ORBI keeps your body in orbit."*

**The twist (Nov 2026): a baseline that is truly yours.**
- **It starts on the ground.** ORBI is used from training (*"Train like you fly"*): that is where it learns what is normal for each astronaut.
- **It accounts for the menstrual cycle.** In the luteal phase, temperature and HR rise. Without accounting for it, ORBI would mistake that rise for the start of an infection.
- **The reproductive data belongs to her.** It is *opt-in* and does not travel to Earth without her permission.
- Evidence: `resources/08` (women's health in spaceflight) and `resources/09` (ground training).

**Why ORBI and not AURA:** "Aura" sounds almost the same as *Oura*, a very well-known commercial health ring, and a judge might think it is a copy. ORBI is approachable, sounds like a crewmate, evokes orbit and fits the gamification. The ring around the figure is still called the **halo** of radiation.

---

## How it is used on the ship

### What each thing measures

There is no single device: wearables and the station measure on their own, and the astronaut **confirms** and adds what only they can provide. That is why the check-in lasts 90 seconds and is not about typing seven numbers.

| Device | What it measures | How it reaches ORBI |
|---|---|---|
| **Biometric shirt** (on the ISS: CSA's *Bio-Monitor*) | HR, respiration, SpO₂, skin temperature, activity | ✅ Automatic, continuous |
| **Actigraphy watch** | Hours and quality of sleep, activity | ✅ Automatic, continuous |
| **Glucose meter** (fingerstick) | Glucose (mg/dL) | ✋ Manual |
| **Thermometer** from the medical kit | Temperature (if there is no shirt) | ✋ Manual |
| **Automated cuff** | Blood pressure (weekly) | 🔌 Device |
| **SLAMMD** (in microgravity there are no scales: mass is measured by acceleration) | Body mass (weekly) | 🔌 Device |
| **Resistive exercise equipment** (on the ISS: ARED) | Exercise minutes and load → adherence to the bone countermeasure | ✅ Automatic |
| **Personal passive dosimeter** (CPD, a badge each crew member wears) | Personal accumulated dose | 🔌 Periodic reading |
| **Area radiation monitors** (RAM, TEPC) + **neutron spectrometer** such as CANS (CSA) | Real-time dose rate, neutrons | ✅ Station, continuous |
| **Solar monitoring** (on the ground: NASA SRAG, 24/7) | Solar storm (SPE) warning | ✅ Station. On Mars, the alert is generated **on board**: from the ground it would arrive up to 20 min late |
| **Cabin sensors** | CO₂, air quality | ✅ Station |
| **Tablet** | Mood, fatigue, symptoms | ✋ Astronaut |
| **Tablet (opt-in)** | Menstrual cycle: period day yes/no. ORBI calculates the cycle day | ✋ Astronaut. **It does not leave the tablet without her permission** |

### Where the screens are

| Screen | For whom | What it shows | MVP |
|---|---|---|---|
| **Personal tablet** | The astronaut | Full ORBI: Today, Body, Decision | ✅ (*tablet-first*) |
| **Watch** | The astronaut | Notifications only: "check-in due", alerts | Pitch only |
| **Medical module panel** | CMO | Status of the whole crew | Pitch only |
| **Ground console** | Flight surgeon | The packet received in the comms window | Pitch only |

### Before liftoff: ORBI in training

- **~90 days before launch** (L-90), the astronaut starts using ORBI on the ground, with the same wearables and the same 90 s check-in.
- ORBI learns her **personal baseline**. If she enables cycle tracking, it also learns her phase pattern over 2–3 cycles.
- The flight surgeon reviews the rules and thresholds with her before the flight.
- Once in flight, each reading is compared with *her* ground range, just as NASA compares its measurements with the prior baseline (L-180…L-30, see `resources/09`).

### A day with ORBI

1. **07:00, on waking.** The watch and the shirt have already recorded the night: 4.5 h of sleep, HR and SpO₂.
2. **Today.** On the tablet, the automatic fields appear pre-filled with the label *"Synced"*. She only pricks her finger for glucose, moves two controls (mood and fatigue) and confirms. It takes 90 s and the streak adds +1 🔥.
3. **Body.** The figure fills with colour: Immune and Behavioral in amber. Tapping Immune shows the 30-day trend against her baseline: *"Your temperature has been above baseline for 3 days."*
4. **Decision.** Level CONCERN, the "Because…" and 3 concrete steps. ORBI knows the ship is 14 min from Earth: *"Start local protocol now."*
5. **Escalation.** A notification reaches the CMO's watch. The packet for the flight surgeon is queued for the next comms window.
6. **During the day.** The watch reminds her of tasks: on Monday blood pressure and mass are due, and exercise adherence counts itself.
7. **Solar event.** The station sensors detect a solar storm. All tablets and watches switch to emergency mode: red halo, route to the shelter and checklist.

---

## 1. How we cover the brief

Judges compare against the brief. This table is our checklist.

| The brief asks / suggests | Where it is in ORBI | MVP |
|---|---|---|
| Visual self-assessment tool | **Body** screen | ✅ |
| Clickable human figure with state and function | 6 systems + radiation halo | ✅ |
| Treatment and improvement guidance | **Action card** in Decision | ✅ |
| Indicators: BP, HR, **glucose**, temperature, sleep, mood | Daily check-in (all except BP, which is weekly) | ✅ (BP in synthetic data) |
| Prompt for measurements periodically | Daily check-in + "Today" reminder | ✅ |
| Colour coding | NOMINAL / WATCH / CONCERN / URGENT | ✅ |
| Dynamic charts over time | 30-day sparkline per system | ✅ |
| Gamification | Check-in and countermeasure streak | ✅ (light) |
| Different environments (ship, station, base) | Mission selector: ISS / Moon / Mars | ✅ |
| When to alert the crew or the flight surgeons | L0–L4 escalation based on latency | ✅ |
| Don't assume the astronaut knows | "Why this matters" + "Why we ask" on every field | ✅ |
| Camera / image input | Attached photo in a check-in (no analysis) | ⏳ desirable |

---

## 2. The 5 hazards → the 7 elements of the body

Each element of the figure exists because it responds to a hazard from the NASA Human Research Program.

| HRP hazard | Element in ORBI | Indicators (MVP) |
|---|---|---|
| **Space radiation** | **Halo** around the figure | Accumulated dose vs. exposure budget, dose rate, SPE alert |
| **Isolation & confinement** | **Behavioral** (brain) | Sleep, mood, fatigue |
| **Distance from Earth** | Not an organ: it is the **escalation** | Mission latency |
| **Gravity fields** | **Cardiovascular** · **Musculoskeletal** | Resting HR, BP · body mass, exercise adherence, **estimated bone loss** |
| **Hostile closed environment** | **Respiratory** (+ cabin badge) | SpO₂, cabin CO₂ |
| *(cross-cutting: immunity and nutrition)* | **Immune** · **Metabolic** | Temperature · glucose |

**The 6 systems of the MVP:** Cardiovascular, Musculoskeletal, Immune, Metabolic, Respiratory, Behavioral. **Plus the radiation halo.**
Out of scope for the MVP (future work, mentioned in the pitch): neuro-ocular (SANS), neurovestibular, skin.

**Pitch line:** *"Six systems and a halo. Every element on this body maps to one of NASA's five hazards of human spaceflight."*

---

## 3. Measurement cadence

| Cadence | What is measured | In the MVP |
|---|---|---|
| **Daily (~90 s)** | The 7 check-in fields (see below) | **Entered by hand** |
| **Weekly** | BP, body mass, countermeasure adherence, weekly dose | Comes in the synthetic data |
| **Monthly** | Visual acuity, accumulated dose vs. budget | Mentioned only (future work) |
| **Ground training (~L-90 → L-1)** | The same daily check-in → **personal baseline** (and per cycle phase, if enabled) | 90 days in the synthetic data |
| **Pre/post-flight (on Earth)** | **Bone density by DXA** (cannot be measured in flight) | In flight, ORBI shows an **estimate** (§4.3) |
| **Event** | SPE, out-of-range reading, acute symptom | Triggered by the scenario |
| **Cabin sensors** | CO₂, area dosimeter | Synthetic data (not entered by the astronaut) |

### Daily check-in: the 7 fields (closed list)

| # | Field | Unit | "Why we ask" (short text in the UI) |
|---|---|---|---|
| 1 | Sleep | hours | Sleep debt is the first sign of deterioration, before illness. |
| 2 | Mood | 1–5 | Isolation erodes mood little by little; we measure it to see it coming. |
| 3 | Fatigue / workload | 1–5 | Sustained load combined with little sleep is a risk factor. |
| 4 | Resting heart rate | bpm | In microgravity the heart deconditions; a rise can indicate infection or stress. |
| 5 | Body temperature | °C | Early detection of infection; in flight the immune system changes. |
| 6 | SpO₂ | % | Oxygenation; if it drops together with cabin CO₂, the problem may be the air. |
| 7 | Blood glucose | mg/dL | Metabolic and nutritional balance, one of the HRP risks. |

Optional: free-text symptoms (not used by the engine; goes into the surgeon's packet).

**Optional and opt-in: menstrual cycle.** One tap, "period today: yes/no". It is a separate field and does not count as one of the 7.
- Only appears if the profile has `cycle: "tracked"`.
- *Why we ask:* "Your temperature and resting heart rate rise naturally after ovulation. Knowing your cycle keeps ORBI from mistaking that for an infection."
- If the cycle is suppressed with continuous contraception, the field does not appear.

---

## 4. Decision engine: explainable rules, no ML

### 4.1 Levels

| Level | Color | Meaning | Action |
|---|---|---|---|
| **NOMINAL** | green | Within your range | Nothing |
| **WATCH** | yellow | Incipient drift | Repeat measurement in 24 h, self-care |
| **CONCERN** | amber | Pattern that requires attention | Action card + escalate to the CMO |
| **URGENT** | red | Acute risk | Immediate protocol + the whole crew |

### 4.2 Simple rules (one signal → one level)

Thresholds are **indicative and are marked with their source**. The official resources have already been reviewed (`resources/`): only the fracture report gives applicable numbers. The rest is still pending verification against NASA-STD-3001 and clinical criteria. Anything that cannot be verified is marked `TODO verify` and said in the pitch.

| Indicator | WATCH | CONCERN | URGENT | Source (to verify) |
|---|---|---|---|---|
| Temperature | ≥ 37.5 °C or +2σ over baseline | ≥ 38.0 °C | ≥ 39.5 °C | Standard clinical fever criterion |
| SpO₂ | < 95 % | < 92 % | < 90 % | Standard clinical criterion |
| Resting HR | +10 bpm over baseline (2 days) | > 100 bpm | > 130 bpm | Clinical criterion + personal baseline |
| Glucose | > 140 or < 70 mg/dL | > 180 or < 54 mg/dL | < 40 mg/dL | ADA ranges for hyper/hypoglycemia |
| Sleep | < 6 h × 2 nights | < 6 h × 3 nights | — | HRP: sleep and fatigue risk |
| Mood | ≤ 2 × 3 days | ≤ 2 × 5 days | — | HRP: behavioral risk |
| Cabin CO₂ | Above NASA's limit | — | — | NASA-STD-3001 Vol. 2 (`TODO verify` exact value) |
| Accumulated dose | > 50 % of the budget | > 80 % of the budget | SPE active | Configurable budget (§4.3). Reference: NASA career limit since 2022, **600 mSv, the same for all sexes and ages** (`resources/08`) |
| Bone (exercise adherence) | Mission > 90 days and adherence < target for 2 weeks in a row | The above + mission > 6 months **or** surface phase (partial gravity) | — | HRP Evidence Report – Fracture (`resources/07`) |
| Bone (risk activity) | — | Notice in Decision if an EVA or construction is planned with Musculoskeletal in CONCERN | — | Fracture report: lateral falls and jumps, the highest-risk events |

**Personal baseline:** mean ± deviation of the **90 days of ground training** (days −90 to −1) from the synthetic data. The "+Nσ" and "+10 bpm over baseline" rules use that baseline.

**Cycle-aware baseline** (if `cycle: "tracked"`):
- The temperature and HR baseline is computed **per phase**: follicular (from cycle day 1 to ovulation, ~day 14) and luteal (from there to the next period).
- In the luteal phase it is normal for temperature to rise **+0.28–0.56 °C** and HR **+2–7 bpm** (`resources/08`). With the phase-aware baseline, that rise does not surface as an anomaly.
- **Safety rule:** the adjustment only affects the rules relative to the baseline (+Nσ, +10 bpm). **The absolute thresholds (≥ 38.0 °C, > 100 bpm, etc.) are never relaxed.** A real fever in the luteal phase still fires.
- When a reading stays within expectations thanks to the adjustment, the "Because…" explains it: *"Temperature +0.4 °C, within your luteal-phase range."*

### 4.3 Two indicators ORBI estimates instead of measuring

The official sources make it clear that there are two things that **cannot be precisely measured or fixed in flight**. ORBI does not pretend: it shows them as an **estimate** or a **budget**, with their source. That is a strong point before the jury.

**Estimated bone loss (Musculoskeletal)**
- Bone density is only measured with DXA **on Earth**, before and after the flight.
- ORBI computes `months in microgravity × 1–1.5 %` and shows it as a **range**, always labelled *"Estimated · NASA HRP evidence"*.
- Resistance exercise adherence changes the **state**, not the number: *"On track with countermeasures"* or *"At risk: low exercise adherence"*. The report says exercise + nutrition *"sufficiently reduced"* the losses, but does not give a percentage, so we do not invent one.
- Demo (day 148, ~4.9 months): **~4.9–7.4 % estimated without countermeasures**.

**Radiation exposure budget (halo)**
- NASA recognizes that there is not enough knowledge to set exposure limits for long missions (`resources/06`).
- ORBI shows the accumulated dose as a **% of a budget set by the mission's medical team** (`Scenario.exposureBudgetMSv`), with the trend and the current dose rate.
- The 600 mSv are used as the **default value** of the budget, presented as *"current NASA career limit"*.
- The demo scenarios use a budget of **400 mSv** so that the halo is legible on the tablet;
  600 mSv remains the career-limit reference and the contract default.
- Since 2022 that limit is **the same for all sexes and ages**. Before, a 45-year-old woman had a mission limit of 187 days versus 344 for a man (`resources/08`).

**"Why this matters" texts with official backing:**
- **Musculoskeletal:** *"In weightlessness, weight-bearing bones lose 1–1.5% of their mineral density every month, roughly what an elderly person loses in a year. Resistance exercise and good nutrition are the countermeasures that work."*
- **Halo:** *"You can't see or feel space radiation. It raises cancer risk and can affect your nervous system. NASA itself says deep-space exposure limits are still an open question, so ORBI tracks your budget and trend."*

### 4.4 The 4 correlations of the MVP (this is where we win the jury)

| Id | Signals | Reading | Level | Action card |
|---|---|---|---|---|
| `early-infection` | Sleep < 6 h × 3 + temp ≥ 37.5 + HR ↑ | Possible early infection favoured by sleep debt. In women, urinary infection is a frequent cause in flight (`resources/08`) | CONCERN | Measure temp every 4 h · isolate in the rest area · prepare packet for the surgeon |
| `cycle-aware` | Temp ↑ and HR ↑ over the general baseline, but **within her luteal-phase range**, with normal sleep and without exceeding absolute thresholds | **It is not an infection, it is the cycle** | NOMINAL (with explanation) | None. *"Expected cycle variation, not infection."* Reviewed tomorrow as usual |
| `cabin-air` | SpO₂ ↓ **and** cabin CO₂ ↑ in the same period | **It is not the body, it is the environment** | WATCH (person) + cabin alert | Check ventilation/scrubber · notify · do not treat the patient |
| `solar-event` | SPE active (event) | Acute radiation exposure | URGENT | Go to the shelter · checklist · log dose · postpone EVA |

`cycle-aware` and `cabin-air` are the two **"it's not you"** moments: ORBI not only detects, it also avoids false alarms and explains why.

The other correlations from the original document (orthostatic, nutritional, behavioral risk) remain as **future work** and are mentioned in the pitch. The orthostatic one gains weight because it is more frequent in women returning to gravity.

### 4.5 Engine output

```ts
{
  level: "CONCERN",
  system: "immune",
  ruleId: "early-infection",
  because: [
    "Temperature 37.9 °C (watch ≥ 37.5)",
    "Sleep 4.5 h × 5 nights (2.1σ below your baseline)",
    "Resting HR +11 bpm vs. your baseline"
  ],
  actions: ["Measure temperature every 4 h", "Rest in crew quarters, mask in common areas", "Prepare flight surgeon packet"],
  escalation: { now: "L1_CMO", next: "L2_FLIGHT_SURGEON", note: "Mars: 14 min one-way · reply in ~28 min+" }
}
```

---

## 5. Escalation × latency

Latency changes the response: the same CONCERN is not handled the same at 0 seconds as at 14 minutes.

| Mission | Latency (one way) | CONCERN | URGENT |
|---|---|---|---|
| **ISS** | ~0 s | Flight surgeon now | Surgeon + ground team live |
| **Moon** | ~1.3 s | Flight surgeon now | Surgeon + ground team |
| **Mars** | up to 20 min (NASA; demo: 14 min) | **Local protocol first** + packet to the surgeon | **Immediate local action**, the decision is made on board |

**Ladder:** L0 guided self-care → L1 CMO (crewmate with medical training) → L2 flight surgeon → L3 ground specialists → L4 emergency (whole crew).

> *"Communication delay isn't a network detail: it's a clinical variable."*

**Privacy in the packet to the surgeon.** If `shareReproductiveWithGround` is `false` (the default value), the packet does not carry the cycle day or the period days. It only carries the conclusion, for example *"Temperature rise consistent with expected cycle variation (details private)"*. The astronaut can authorize sharing the detail if the surgeon needs it.

---

## 6. MVP screens (UI in English)

| # | Screen | Question | Content |
|---|---|---|---|
| 1 | **Today** | What do I need to do? | 7-field check-in: sleep, HR, SpO₂ and temperature arrive pre-filled with the label *"Synced from wearable"*; mood, fatigue and glucose are manual. "Confirm" button. Streak 🔥, overall status, current mission/latency |
| 2 | **Body** | How am I? | SVG with 6 systems + halo. On click: state, 30-day sparkline with baseline band, "Why this matters" |
| 3 | **Decision** | How serious is it and what do I do? | Level, "Because…", action card, escalation based on latency, "Generate flight surgeon packet" button |

**Demo bar** (always visible, at the top): scenario selector · mission selector (ISS/Moon/Mars) · **"Next day ▶"** button.

**Light gamification:** streak of days with a check-in + counter of the week's countermeasures. No empty points.

---

## 7. Data and scenarios

One crew member (the commander) with **90 days of ground training (baseline) + 30 days of mission**, generated by script with realistic noise.
- **Default profile:** `sex: "F"`, `cycle: "tracked"`, cycle of ~28 days ± 2, `shareReproductiveWithGround: false`.
- In the luteal phase, the generator adds ~+0.4 °C and ~+4 bpm.
- Scenarios that are not about the cycle also include it. Thus, the phase-aware baseline is always exercised.

| Scenario | What happens | What ORBI should show |
|---|---|---|
| `nominal` | Everything within range | Body in green, active streak |
| `luteal-phase` | Days 24–30 in the luteal phase: temperature rises ~0.4 °C and HR ~4 bpm over the general baseline. Sleep is normal | Immune **in green** with *"Expected cycle variation, not infection"*. With the cycle-aware baseline disabled (DemoBar toggle), it would show WATCH |
| `early-infection` | Days 24–30: sleep drops, temperature and HR rise | Immune + Behavioral in amber → CONCERN, packet for the surgeon |
| `cabin-co2` | Days 26–30: cabin CO₂ rises and SpO₂ drops slightly | Respiratory in yellow + **"Cabin issue, not you"** |
| `solar-event` | Day 30: SPE | Red halo, emergency mode, shelter protocol |

---

## 8. Type contract (frozen)

The canonical contract lives in **`src/domain/types.ts`**; the coach types, in **`src/ai/types.ts`**.
This document does not duplicate the definition to avoid drift: the source of truth is the code.

It includes, at minimum:

- `Level`, `SystemId`, `Mission`, `MISSION_LATENCY_SECONDS`.
- `DailyReading`, `EnvReading`, `Scenario` (with `description`, `exposureBudgetMSv`, `priorDoseMSv`
  and `exerciseTargetMinPerDay`).
- `Assessment` (level, system, rule, `title`, `because`, `actions`, `escalation`, `source`).
- `Evaluation` (`bySystem`, `assessments`, `estimates`, `facts`, `latencySeconds`).
- `CoachFact`, `Estimates`; the coach adds `CoachSuggestion` and `CoachRequest`.

Contract rules:

- `src/domain/` does not import React, the DOM or browser APIs.
- The scenario JSON format is generated with `npm run gen` and committed.
- Changing `src/domain/types.ts`, `src/ai/types.ts`, `src/content/systems.ts` or the JSON shape
  requires notifying the whole team.

### Proposed contract extension (pending announcement to the team)

The ground baseline and the cycle baseline (§4.2, §7) need these fields. **They have not been applied to `src/domain/types.ts`**: they are announced to the team and implemented in an `engine/…` PR with `npm run gen`.

```ts
export type Phase = "TRAINING" | "TRANSIT" | "SURFACE" | "RETURN";

export interface CrewProfile {
  name: string;
  sex: "F" | "M";
  cycle: "tracked" | "suppressed" | "n/a";  // "n/a" for men or if she does not want to track it
  contraception?: "oral-continuous" | "iud" | "implant" | "dmpa" | "none";
  shareReproductiveWithGround: boolean;     // default false
}

// DailyReading: + phase: Phase; menses?: boolean (private data); cycleDay?: number (computed by ORBI)
// Scenario:     + crew: CrewProfile; trainingDays: number (default 90)
// evaluate():   + opts?: { cycleAware?: boolean } (DemoBar toggle; default true if cycle === "tracked")
```

---

## 9. Stack and structure

All the detail (dependencies, commands, folders, CI and risks) is in **`STACK.md`**. In short: Vite + React 19 + TypeScript, Tailwind, Recharts 3, Zustand, Vitest and Dokploy (Cloudflare in front). No backend. Node 22 pinned with `.nvmrc`. The engine lives in `src/domain/` and does not import React.

---

## 10. Scope levels and assignment

**Rule: do not start a level until the previous one can be demonstrated complete on the deployed URL.**

| Level | What goes in | With how many people |
|---|---|---|
| **0 · Core** | Today (with the opt-in cycle field), Body, Decision, DemoBar (with the "Cycle-aware baseline" toggle), 4 correlations, 5 scenarios, 90-day ground baseline | 2–3 |
| **1 · Differentiator** | **Trends** (charts with the *"Your ground baseline"* band and the cycle overlaid: the challenge asks for "dynamic charts") + **Mission Control** (ship ↔ ground in two windows with the latency countdown; respects cycle privacy) | 4–5 |
| **2 · Extra** | 2 guided procedures (BP in microgravity, orthostatic test) · **guided jugular ultrasound** (2019 thrombosis case) · **Amsler grid vision test** (SANS, covers "camera/images") · contraceptive supply warning · offline PWA | 5, and only if level 1 is done by Saturday night |

**Mission Control is the wow moment:** the jury *sees* the distance to Earth. The surgeon's packet travels from the ship window to the ground window with a 14 min countdown (accelerated), and the reply takes the same time to come back.

### Assignment

| Block | Deliverable | Team of 3 | Team of 5 |
|---|---|---|---|
| **A · Engine + data** | `src/domain/*`, tests, generator, scenario JSON | 1 person | 1 person |
| **B · Body + Trends** | `BodyMap`, system sheet, sparkline · (L1) `Trends` | 1 person (without Trends) | 1 person |
| **C · Today + Decision** | Check-in with "Synced", streak, action card, escalation, DemoBar | 1 person | 1 person |
| **D · Mission Control + extras** | (L1) `MissionControl` · (L2) procedures, Amsler | — | 1 person |
| **E · Design + pitch** | Sketches, "explain" copy, project page, video, slides | Everyone splits it on Sunday | 1 person |

**Integrator:** `@Agupane` reviews and merges PRs into `development`; `@atapiamallea` is backup. The release goes `development` → `main`, and that merge triggers the automatic deploy to the preview. Assignment in `docs/TEAM.md`. Team rules in `STACK.md` §2. **Changing `src/domain/types.ts` requires notifying the whole team.**

---

## 11. Schedule

| When | What | Done when… |
|---|---|---|
| **Thursday night** | Close this v2 + BRIEF | It fits on one page |
| **Friday** | Read published resources · adjust thresholds/sources · scaffold Vite + repo + CI + Dokploy · `types.ts` · engine + tests · data generator | CI green, public URL |
| **Saturday morning** | Onboarding (15 min with BRIEF) · sketches in Figma/Excalidraw (30 min) · block assignment · B and C in parallel | Body shows real engine colours |
| **Saturday afternoon** | Decision + escalation + DemoBar + streak | **Level 0 complete on the URL** |
| **Saturday night** | If there are 4–5 people: level 1 (Trends + Mission Control) | Level 1 demonstrable |
| **Sunday until 12:00** | Visual polish, copy, video, project page in English | Code frozen |
| **Sunday 12:00–14:00** | Submission form (check requirements in *Participant Guides*) | **Submitted by 14:00** |
| **Sunday 14:00–16:00** | Buffer for contingencies | — |

---

## 12. Roadmap (anything not shipped is told to the jury as future work)

Anything not built from levels 1 and 2 (§10), plus: **CMO view with 3 crew members**, threshold calibration with training tests (*"Calibrated on your training data"*, e.g. HR recovery in pool EVA training), anonymized export with consent to LSAH / Standard Measures (the "women's health database" that reviews call for), before/after return comparison (R+5, R+30), orthostatic preparation before surface arrival, cadence calendar, confidence score, full "explain" mode, orthostatic/nutritional/behavioral correlations, vestibular and skin systems, integration with real wearables, voice.
**Do not build:** decision ML, computer vision, 3D figure, real wearables, backend.
The optional local coach is an explanation layer, not a decision model.

---

## 13. Demo script (3 min)

1. **Hook (20 s):** *"Day 148 on the way to Mars. 14 minutes from Earth, each way. The commander slept 4.5 hours for the fifth night in a row and has a temperature of 37.9 °C. No hospital. No evacuation."*
2. **Today (20 s):** *"07:00. The watch has already logged her sleep; the shirt, her heart rate and SpO₂."* Show the "Synced" labels, enter glucose and mood, press Confirm: the streak goes up. *"90 seconds. She confirms, she doesn't type."*
3. **Body (40 s):** Immune and Behavioral in amber; tap → sparkline with the baseline. *"Six systems and a halo, each mapped to a NASA hazard."*
4. **Decision (50 s):** CONCERN, "Because…", action card. Change the selector from Mars to ISS: the escalation changes. *"Delay is a clinical variable."*
   - *With level 1:* press "Send to flight surgeon". In the ground window, on the right, the packet arrives after the 14 min countdown (accelerated). *"This is what distance from Earth looks like."*
5. **Luteal phase (25 s):** scenario `luteal-phase`. Temperature +0.4 °C and HR +4 bpm, but Immune is in green: *"Expected cycle variation, not infection."* Turn off the "Cycle-aware baseline" toggle: it switches to WATCH. *"Most spaceflight data comes from men. ORBI learned her cycle during ground training, and she decides who sees it."*
6. **Cabin CO₂ (15 s):** *"Cabin issue, not you."* The system distinguishes the body from the environment.
7. **Solar event (15 s):** red halo, shelter protocol.
8. **Close (10 s):** *"ORBI doesn't diagnose. It prioritizes, explains and escalates."*

Backup: record the demo video on Sunday morning.

---

## 14. Jury questions (short answers)

- **Does it diagnose?** No. It is decision support: it prioritizes, explains and refers.
- **Why not ML?** Because in space medicine explainability weighs more than accuracy: every alert shows its rule, its threshold and its source. The decision engine is deterministic. A local model can only be added as an optional explanation layer, validated by guardrails and with a fallback to the template; it never computes thresholds or levels.
- **Where do the thresholds come from?** From standard clinical criteria and NASA-STD-3001, adjusted to the personal baseline. They are in a single file with their source, so that a doctor can review them.
- **What if communication is lost?** ORBI is designed to work without Earth: it decides on board and the packet is sent in the next window.
- **How do you measure bone density in flight?** We don't: it can only be done with DXA on Earth. ORBI **estimates** it with the HRP evidence (1–1.5 %/month) and monitors the countermeasure that can be measured, exercise.
- **What is the radiation limit for Mars?** NASA recognizes that it cannot be set yet. ORBI shows the dose against a budget decided by the medical team (by default, NASA's current career limit).
- **Do women have a different radiation limit?** No longer. Since 2022, NASA applies 600 mSv to all sexes and ages. Before, at 45, a woman could serve 187 days versus 344 for a man.
- **Why track the cycle?** Because in the luteal phase temperature rises 0.28–0.56 °C and HR 2–7 bpm. Without accounting for it, ORBI would raise false infection alarms. It is optional, and the absolute clinical thresholds are never relaxed.
- **Who sees that data?** Only her, unless she authorizes sharing it. The surgeon receives the conclusion, not the data.
- **What if she suppresses her period with contraceptives?** It is common, but not mandatory. With `cycle: "suppressed"` ORBI uses the normal baseline. On the roadmap: medication supply warning, because its stability on long missions has not been tested.
- **Is the ground training data useful in flight?** Yes: it is the personal baseline, just as NASA compares its in-flight measurements with those from L-180…L-30. Prediction from ground tests has hints but no validated models, so ORBI would only use it as a cautious label (roadmap). The rest is historical for research (LSAH).
- **Is there enough data on women?** No: they are 22.7 % of the people who have gone to space and there are no hormonal measurements in flight. Reviews call for a women's health database, and ORBI could feed it with consent.

**Vocabulary:** say "prioritizes and escalates", "decision support", "auditable rules on your personal baseline". Do not say "diagnoses", "replaces the doctor", "AI predicts".
