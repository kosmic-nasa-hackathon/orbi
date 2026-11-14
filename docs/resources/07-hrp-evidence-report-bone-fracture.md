# HRP Evidence Report — Risk of Bone Fracture due to Spaceflight-induced Changes to Bone

- **Source (PDF, 34 pages):** https://humanresearchroadmap.nasa.gov/Evidence/reports/Fracture.pdf
- **Organization:** NASA · Human Research Program · Exploration Medical Capabilities Element · Johnson Space Center
- **Published:** 12 May 2017 (*Approved for Public Release*) · **Consulted:** 13 Nov 2026
- **Authors:** Jean D. Sibonga (NASA JSC), Harlan J. Evans, Scott A. Smith, Elisabeth R. Spector, Greg Yardley (KBRwyle)
- **Linked from:** the *Gravity Fields* subpage of the Hazards (cites the 1–1.5%/month loss)

> This is an evidence report, not a clinical guideline. It is from 2017: there may be more recent data.

## Risk statement

*"Given that spaceflight may induce adverse changes in bone ultimate strength... there is a possibility a fracture may occur for activities otherwise unlikely to induce fracture prior to initiating spaceflight."*

## Key data

### Rate of bone loss
- **Bone mineral density (BMD) loss of 1–1.5% per month** in weight-bearing areas on Earth (**hip, lumbar spine, legs**). Measured by DXA before and after typical **4–6 month** missions.
- There is **a lot of variation** between skeletal sites and between crew members.
- An astronaut's monthly loss is **almost equal to the annual loss** of an older person in the same areas.
- **It is not known** whether the loss plateaus or continues on longer missions, nor whether it is **linear or exponential**. Since recovery on Earth is asymptotic, it is speculated that the loss follows a similar pattern.
- **It is not known** whether partial gravity (Moon, Mars) mitigates it. Rodent studies suggest that partial loading **does not prevent** it or only **reduces it proportionally**.
- In missions of **less than 90 days**, no significant losses are detected.

### What is measured today (medical requirements)
- **DXA** of hip, lumbar spine, whole body, forearm and calcaneus: **within 45 days before launch** and **~5 days after landing**. *It is not done in flight.*
- **Bone turnover biomarkers** in blood and urine: before, during and after flight (samples are analyzed on Earth).
  - **Resorption** markers (bone breakdown) **rise early in flight** and stay high until return.
  - **Formation** markers do not change or fall in flight, and rise ~1 month after landing.
- **NASA standard:** no astronaut should return with a **T-score ≤ −2.0** (femoral neck, trochanter or spine). No long-duration astronaut has exceeded it.

### Recovery
- Recovering bone costs **much more** than losing it; in some cases BMD is recovered **6 months** after return, depending on age, nutrition and activity.
- In 8 ISS crew members, deficits persisted in hip and spine **2–4 years after** returning.

### Countermeasures that work
- **ARED** (Advanced Resistive Exercise Device, since 2009) together with **adequate nutrition** have **sufficiently reduced** the losses observed after flight.
- **Vitamin D:** deficits are observed after ~6-month missions; they can affect neuromuscular coordination and increase the risk of falling if supplementation is not maintained outside low Earth orbit.
- **Calcium:** the skeleton is the body's calcium reserve. On missions of more than a year, **calcium balance could be a bigger problem than fractures**.

### Fracture risk per mission (Table 5 and Figure 4)

| Mission | Outbound (days) | Stay (days) | Return (days) |
|---|---|---|---|
| Short Moon | 3 | 8 | 3 |
| Long Moon | 5 | 170 | 5 |
| Short Mars | 162 | 40 | 162 |
| Long Mars | 189 | 540 | 189 |

- The probability of fracture **increases with duration**: **0.02% (Moon) → 2.0% (Mars)**.
- Moon gravity is ~1/6 g and Mars is ~1/3 g (the report uses **0.38 g** for Mars).
- The highest-risk activities are **lateral falls** and **jumps from 2 m**.

### Risk factor (applied load / fracture load; > 1 = probable fracture)

| Situation | Risk factor |
|---|---|
| Astronaut before flight | 0.89 ± 0.21 |
| **Astronaut on Earth after a Mars mission** | **1.07 ± 0.30** |
| Women aged 70–80 | 1.04 ± 0.37 |
| Astronaut on Mars (0.38 g) | 0.66 ± 0.15 |

**Report conclusion:** a crew member returning from Mars would have a fracture risk on Earth **comparable to that of an older postmenopausal woman** (especially in posterolateral falls).

### Other factors that increase fall/fracture risk
**Vision** problems, loss of **neuromuscular coordination**, **muscle atrophy**, mobility problems, reduced cognition or judgment; heavy EVA suits; surface tasks (building habitats, jumping off ladders, vehicle egress). After returning: postural instability, gait and dynamic visual acuity alterations.

### Knowledge gaps
1. It is not known how flight affects **fracture healing** in flight (microgravity could prevent it and cause complications such as **sepsis or thrombi**).
2. The loads on bone during normal mission activities need to be characterized.
3. There is no validated method to estimate fracture risk.

## How we use it in ORBI

**Thresholds and data for the Musculoskeletal system:**

1. **What cannot be measured daily:** bone density is only measured with DXA on Earth. ORBI **must not pretend to measure BMD in flight**. Instead:
   - **Bone loss estimate** = days in microgravity × 1–1.5%/month, **modulated by exercise adherence**. Always label it as *"estimated, based on NASA HRP evidence"*.
   - In the demo (day 148, ~4.9 months): **~4.9–7.4% estimated without countermeasures**. With good adherence to resistive exercise, the text says that ARED + nutrition *"sufficiently reduced"* the losses.
   - ⚠️ Do not invent a % reduction from exercise: the report does not give one. Show two states: *"on track with countermeasures"* / *"at risk: low exercise adherence"*.
2. **Possible rules for `rules.ts` (Musculoskeletal):**

   | Rule | Level | Source |
   |---|---|---|
   | Mission > 90 days and exercise adherence < target for 2 consecutive weeks | WATCH | Fracture report: no losses < 90 days; ARED as countermeasure |
   | The above + mission > 6 months or surface phase (partial gravity) | CONCERN | Fracture report: *"missions >6 months or fractional gravity could create higher fracture risk"* |
   | Planned high-risk activity (EVA, construction) with CONCERN status | Notice in Decision | Fracture report: falls and jumps as higher-risk events |

3. **Musculoskeletal "Why this matters"** (supported text):
   *"In weightlessness, weight-bearing bones lose 1–1.5% of their mineral density every month, roughly what an elderly person loses in a year. Resistance exercise and good nutrition are the countermeasures that work."*
4. **Strong pitch argument (Mars return):** *"After a Mars mission, an astronaut's hip-fracture risk on Earth is estimated to be comparable to a woman in her 70s."* (Risk factor 1.07 vs. 1.04, Table 6.)
5. **New correlations (roadmap):** low exercise adherence + dizziness/gait alteration → **fall risk** (links Musculoskeletal with Cardiovascular/Vestibular).
6. **Mission phases:** Table 5 gives **real reference durations** (long Mars: 189 + 540 + 189 days). They are useful for the mission selector and for the demo day: day 148 falls **in transit to Mars** (the outbound leg lasts 162–189 days), consistent with the hook *"Day 148 on the way to Mars"*.
7. **Metabolic / nutrition:** **vitamin D** and **calcium** are candidates for action cards (*"Take vitamin D supplement as prescribed"*) and connect bone with nutrition.
8. **Uncertain fracture healing + risk of sepsis/thrombi** supports the central idea: on Mars, **preventing** is much more important than treating.
