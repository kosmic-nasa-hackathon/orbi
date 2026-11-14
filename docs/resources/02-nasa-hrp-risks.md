# NASA HRP — Risks of Human Spaceflight

- **Source:** https://www.nasa.gov/hrp/risks/
- **Organization:** NASA · Human Research Program (HRP)
- **Consulted:** 13 Nov 2026

## Summary

The HRP turns the five hazards into **specific health risks**, grouped into three blocks: physiology, behavioral performance and radiation. The page notes that *"the effects of these risks vary depending on whether humans are traveling to low Earth orbit, the Moon, or Mars"*, which is exactly our ISS / Moon / Mars selector.

## Human physiology risks

| Risk | What NASA says (summary) | Fact sheet |
|---|---|---|
| **Altered Immune System Responses** | Spaceflight stress can **reactivate latent viruses**, with rashes and other symptoms. | [link](https://www.nasa.gov/reference/risk-of-altered-immune-system-responses/) |
| **Altered Sensorimotor and Vestibular Function** | Dizziness, problems with hand-eye and gait coordination, vertigo during gravity changes. | [link](https://www.nasa.gov/reference/risk-of-altered-sensorimotor-and-vestibular-function/) |
| **Cardiovascular Adaptations** | Weightlessness alters circulation and heart and vessel function; it can increase the risk of cardiovascular events. | [link](https://www.nasa.gov/reference/risk-of-cardiovascular-adaptations/) |
| **Decompression Sickness** | When moving from the pressurized vehicle to the lower-pressure suit, dissolved nitrogen forms bubbles in the tissues. | [link](https://www.nasa.gov/reference/risk-of-decompression-sickness/) |
| **Host-Microorganism Interactions** | Skin and gut microbiomes change, which can increase the risk of illness. | [link](https://www.nasa.gov/reference/risk-of-host-microorganism-interactions/) |
| **Hypoxia** | Measures to prevent decompression during EVAs raise the risk of **mild hypoxia** (low oxygen in the tissues). | [link](https://www.nasa.gov/reference/risk-of-hypoxia/) |
| **Inadequate Food and Nutrition** | A balanced diet is essential for health and performance; the consequences of inadequate nutrition are being studied. | [link](https://www.nasa.gov/reference/risk-of-inadequate-food-and-nutrition/) |
| **Injury and Compromised Performance from Spacewalks** | Cognitive fatigue, injuries, decompression, **low oxygen and high CO₂** in the suit. | [link](https://www.nasa.gov/reference/risk-of-injury-and-compromised-performance-from-extravehicular-activity-eva/) |
| **Reduced Cardiorespiratory and Musculoskeletal Fitness** | All astronauts exercise to counteract loss of bone density, strength and cardiovascular performance. | [link](https://www.nasa.gov/reference/risk-of-reduced-cardiorespiratory-and-musculoskeletal-fitness/) |
| **Spaceflight Associated Neuro-ocular Syndrome (SANS)** | The structure of the eyes and brain can change with spaceflight. | [link](https://www.nasa.gov/reference/risk-of-spaceflight-associated-neuro-ocular-syndrome-sans/) |
| **Spaceflight-Induced Bone Changes** | Without gravity, bones degrade and become fragile; they are protected with diet, exercise and medication. | [link](https://www.nasa.gov/reference/risk-of-spaceflight-induced-bone-changes/) |

## Behavioral performance and human factors risks

| Risk | What NASA says (summary) | Fact sheet |
|---|---|---|
| **Behavioral Changes and Psychiatric Disorders** | Isolation, radiation, distance and other stressors can affect mental health. | [link](https://www.nasa.gov/reference/risk-of-behavioral-conditions-and-psychiatric-disorders/) |
| **Inadequate Teamwork** | Teams must work well in prolonged isolation and recover from setbacks; misunderstandings and tensions are a risk. | [link](https://www.nasa.gov/reference/risk-of-inadequate-teamwork/) |
| **Inadequate Sleep and Irregular Schedules** | **Chronic sleep loss**, constant work demand and a misaligned biological clock. | [link](https://www.nasa.gov/reference/risk-from-inadequate-sleep-and-irregular-schedules/) |
| **Inadequate Systems Operations Support** | Deep-space crews will face unexpected problems; research studies **when they need information**, what training and what support. | [link](https://www.nasa.gov/reference/risk-of-inadequate-systems-operations-support/) |
| **Injury from Dynamic Loads** | Risk of injury during landing. | [link](https://www.nasa.gov/reference/risk-of-injury-from-dynamic-loads/) |

## Radiation risks

| Risk | What NASA says (summary) | Fact sheet |
|---|---|---|
| **Radiation-Induced Cancers** | Exposure to space radiation can increase the likelihood of cancer. | [link](https://www.nasa.gov/reference/risk-of-radiation-induced-cancers/) |

## How we use it in ORBI

**ORBI system → official risk mapping** (for the "Why this matters" texts and for the pitch):

| ORBI system | HRP risk(s) | ORBI indicators |
|---|---|---|
| Cardiovascular | Cardiovascular Adaptations · Reduced Cardiorespiratory Fitness | Resting HR, BP |
| Musculoskeletal | Bone Changes · Reduced Musculoskeletal Fitness | Mass, exercise adherence |
| Immune | Altered Immune System Responses · Host-Microorganism Interactions | Temperature |
| Metabolic | Inadequate Food and Nutrition | Glucose |
| Respiratory | Hypoxia · (CO₂ in EVA / cabin) | SpO₂, cabin CO₂ |
| Behavioral | Behavioral Changes · Inadequate Sleep · Inadequate Teamwork | Sleep, mood, fatigue |
| Radiation halo | Radiation-Induced Cancers | Cumulative dose, SPE |
| *(roadmap)* Neuro-ocular | SANS | Amsler test (Level 2) |
| *(roadmap)* Vestibular | Altered Sensorimotor and Vestibular Function | — |

**Ideas that come out of this:**
- **`early-infection` correlation:** the official immune risk mentions *latent viruses reactivated by stress*. It fits "sleep debt → symptoms". Use this formulation in the action card and in the pitch.
- **`Inadequate Systems Operations Support`** is, literally, the problem ORBI solves: *when the crew needs information and what support*. It is a strong argument for the jury: *"ORBI addresses a named HRP risk: inadequate systems operations support."*
- **`Inadequate Teamwork`** justifies the CMO view with 3 crew members (Level 2).
- **Hypoxia + CO₂ in EVA** reinforces the cabin correlation and the "high dose + planned EVA" rule.
- The risks **vary by LEO / Moon / Mars**: it is the official basis for the mission selector.

⚠️ **What this page does NOT give:** numerical thresholds. For the `rules.ts` values we still need NASA-STD-3001 and standard clinical criteria (see `CONCEPT.md` §4.2). The individual fact sheets may bring more detail: it is worth reviewing at least the **sleep**, the **immune** and the **nutrition** ones.
