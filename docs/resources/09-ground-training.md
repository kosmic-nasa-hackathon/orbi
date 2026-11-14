# Ground training phase: are the data useful for flight?

- **Type:** **external** resource (not among the official challenge resources). It answers the team's question: *can ground-training data be correlated with space data, or is it only useful as history or for research?*
- **Consulted:** 14 Nov 2026
- **Main sources:**
  - NASA, *Spaceflight Standard Measures*. https://www.nasa.gov/reference/standard-measures/ (see also `03-nasa-hrp-ongoing-research.md`)
  - HERA study of the AstroSkin biometric garment (NASA NTRS). https://ntrs.nasa.gov/api/citations/20190001996/downloads/20190001996.pdf
  - Orthostatic tolerance after flight, with familiarization at L-180 and measurements at L-90 and L-60. **Frontiers in Physiology** 2020. https://www.frontiersin.org/articles/10.3389/fphys.2020.00784/pdf
  - *Lifetime Surveillance of Astronaut Health* (LSAH) and vision studies (NASA NTRS). https://ntrs.nasa.gov/api/citations/20180004705/downloads/20180004705.pdf
  - Mark et al. 2014, *J Women's Health* (individual variability). https://pmc.ncbi.nlm.nih.gov/articles/PMC4236030
  - `07-hrp-evidence-report-bone-fracture.md` (DXA before and after flight)

## Short answer

**Both, with different weight:**

| Layer | What for | In real time? | Strength of evidence |
|---|---|---|---|
| **1. Personal baseline** | Compare each in-flight reading with *that person's normal range*, measured on the ground | ✅ Yes, this is the operational use | **High.** It is what NASA already does with its pre-flight measurements |
| **2. Calibration / prediction** | Use the response to training tests to adjust thresholds or anticipate who is at higher risk | ⚠️ With caution | **Medium-low.** There are hints, not validated models |
| **3. History and research** | Compare before, during and after flight, and feed long-term studies | ❌ No | **High**, but only useful for the future |

## Key data

### NASA already measures a lot before launch
"L-180" means 180 days before launch, "FD14" flight day 14 and "R+30" 30 days after return.

| Measurement | Before flight | In flight | After |
|---|---|---|---|
| Aerobic capacity (VO2peak) | L-180, L-60 | Yes | Yes |
| Muscle strength | L-90, L-30 | FD14 and before return | R+5, R+14, R+30 |
| Standard Measures (actigraphy, cognition, microbiome, carotid thickness, sensorimotor) | L-180, L-90 | Yes | Yes |
| Orthostatic tolerance | Familiarization ~L-180, measurements at L-90 and L-60 | — | After landing |
| Bone density (DXA) | In the 45 days before | **Cannot be done** | ~R+5 |
| Body measurements (2026 requirement) | L-30 | Days 7, 90, 180 and R-14 | R+1 to R+5 |

- The goal of Standard Measures is to build a **common archive**: *"The data from these measures will be placed in an archive managed by HRP."*
- Cognitive scores are expressed as **deviation from each person's pre-flight baseline**. It is the same logic as ORBI.
- One report mentions three subjects with in-flight data **and no prior measurements**: the authors could not tell whether those data were valid. **Without a ground baseline, in-flight data loses value.**

### Ground analogs are used precisely for this
- In **HERA** (30-day isolation missions in Houston), the AstroSkin garment was tested with a **pre-mission baseline** (training + submaximal exercise) and another 24-h one afterward. One of the goals: *"obtain baseline data used for further development of algorithms and tools that facilitate decision making for medical support"*. Conclusion: it can be used by an *"autonomous crew for health monitoring, evaluating countermeasure efficacy, and fitness evaluations"*.
- Other analogs: CHAPEA (simulated Mars habitat for a year), NEEMO (underwater) and EVA training in the pool (NBL).

### Hints of prediction (layer 2)
- Muscle and bone response to unloading **varies about 10-fold between people** (Mark 2014). That is why personal comparison matters more than population comparison.
- Those who developed **optic disc edema** (SANS) had a **larger optic nerve sheath diameter before flight** (LSAH). It is a hint that a value measured on the ground signals risk.
- In one study, the in-flight test **did not predict** who would have orthostatic hypotension on return (2 of 8 subjects). **Prediction does not always work.**

### For a female astronaut, the ground phase is essential
- To learn *her* cycle pattern (how much her temperature and HR rise in the luteal phase), ORBI needs **2–3 recorded cycles** (~90 days). That can only come from training. See `08-womens-health.md`.

### A gap that ORBI fills
- *"Information about inflight astronaut health is also obtained in multiple research protocols but the data is not available to astronauts until after the mission is completed"* (UCSF Space Health). ORBI gives the data back to the astronaut **during** the mission.

## How we use it in ORBI

1. **Mission timeline:** `TRAINING → TRANSIT → SURFACE → RETURN` (`Phase` in the types). ORBI is used already on the ground, with the idea of **"Train like you fly"**:
   - the astronaut gets used to the 90 s check-in;
   - her baseline is generated (and the cycle baseline, if she enables it);
   - the flight surgeon tests the rules with her before liftoff.
2. **Synthetic data:** **90 days of training** (days −90 to −1), not 14. The baseline comes from there.
3. **Layer 1 in the UI (Level 1):** in Trends, the *"Your ground baseline"* band behind each chart, with the cycle overlaid if active.
4. **Layer 2, only as a prudent label:** when a threshold is adjusted with training data, *"Calibrated on your training data"* is shown. It is never presented as a prediction or diagnosis. Example for the pitch: HR recovery in pool EVA training as a reference for EVAs on Mars.
5. **Layer 3 (roadmap):** export anonymized data, with consent, to LSAH and Standard Measures, and show the before/after of return (R+5, R+30).
6. **Pitch:** *"Ground training isn't just history. It's how ORBI learns what normal looks like for you, before you leave Earth."*
