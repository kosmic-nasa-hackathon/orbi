# Challenge resources

Resources published by NASA Space Apps 2026 for *Create Health Monitoring Software for Astronauts on Space Missions*. One file per resource, each with its summary and a **"How we use it in ORBI"** section.

| # | Resource | Organization | What it mainly helps us with |
|---|---|---|---|
| 01 | [5 Hazards of Human Spaceflight](01-nasa-hrp-hazards.md) (+ the 5 subpages) | NASA HRP | Basis for the body map; quotes on sleep/circadian/load, latency of up to 20 min and bone loss of 1–1.5 %/month |
| 02 | [Risks of Human Spaceflight](02-nasa-hrp-risks.md) | NASA HRP | System → official risk mapping; *Inadequate Systems Operations Support* = the problem ORBI solves |
| 03 | [Ongoing HRP Research](03-nasa-hrp-ongoing-research.md) | NASA HRP | ARCHeR and Standard Measures validate the check-in; Tempus Pro as precedent |
| 04 | [Monitoring radiation for astronaut health](04-csa-monitoring-radiation.md) | CSA | Source of the halo (CANS, continuous and autonomous); ~30 % of the radiation on the ISS is neutrons |
| 05 | [Why do we conduct science in space?](05-csa-why-science-in-space.md) | CSA | Latency and lack of medical assistance as risks; impact on Earth |
| 06 | [Space Radiation – monitoring](06-nasa-space-radiation-monitoring.md) | NASA JSC | Real dosimeters (CPD, RAM, TEPC); NASA acknowledges that **there are no dose limits for long missions** |
| 07 | [Evidence Report: Bone Fracture](07-hrp-evidence-report-bone-fracture.md) | NASA HRP | Bone loss of 1–1.5 %/month, mission durations, risk factor after returning from Mars; rules for Musculoskeletal |

### External resources (not official challenge resources)

Added when the team decided to take female astronauts and the ground-training phase into account. They are scientific reviews and NASA documents; each file cites its sources.

| # | Resource | Sources | What it mainly helps us with |
|---|---|---|---|
| 08 | [Women's health in spaceflight](08-womens-health.md) | NASA/NSBRI (J Women's Health 2014), Front. Physiol. 2025, NTRS, JMIR | The luteal phase raises temperature and HR → **cycle-aware baseline**; menstrual suppression, the 2019 thrombosis, single 600 mSv radiation limit since 2022 |
| 09 | [Ground training](09-ground-training.md) | NASA Standard Measures, HERA, LSAH | Ground data **does** correlate with flight: it is the personal baseline. L-180…R+30 schedule and "Train like you fly" |

## Conclusions for the team

1. **The resources confirm the concept and broaden the scope.** The 5 hazards, the HRP risks and the ongoing studies (ARCHeR, Standard Measures) fit ORBI's design. The external resources (08, 09) add the product pivot: ground-training baseline and phase-aware cycle baseline.
2. **Almost no resource gives numeric thresholds.** The exception is bone (07: 1–1.5 %/month, > 90 days, > 6 months). For radiation, NASA says there **are no limits for long missions** (06): the halo shows a configurable budget, not an invented threshold. The 600 mSv value does have a primary source (08: single limit since 2022). The rest of the values in `src/domain/rules.ts` still come from NASA-STD-3001 and standard clinical criteria. If there is time, review the individual risk cards linked in 02 (sleep, immune, nutrition).
3. **Three pitch lines with official backing:**
   - *"NASA says the five hazards feed off one another. That's why ORBI correlates signals instead of showing isolated numbers."* (01)
   - *"ORBI addresses a named HRP risk: inadequate systems operations support."* (02)
   - *"Deep-space crews can rely less on Earth for emergency medical assistance, so ORBI decides on board."* (05)
4. **The external resources (08, 09) add the project pivot.** The luteal phase can mimic the onset of an infection (+0.28–0.56 °C, +2–7 bpm), so the baseline takes the cycle into account. Ground-training data is the personal baseline (operational use), not just history. The 600 mSv default is confirmed as a single limit for all sexes and ages.
5. **Cite both agencies** (NASA and CSA) on the project page and in the app credits.

References can be linked from `content/explain.ts` (`source` field) so that each "Why this matters" text shows its source.
