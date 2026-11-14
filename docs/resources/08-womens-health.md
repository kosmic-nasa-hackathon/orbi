# Women's health in spaceflight: cycle, hormones and contraception

- **Type:** **external** resource (not among the official challenge resources). We looked for it because the team decided to take female astronauts into account.
- **Consulted:** 14 Nov 2026
- **Main sources:**
  - Mark, Scott, Donoviel, Leveton, Mahoney, Charles & Siegel. *The Impact of Sex and Gender on Adaptation to Space: Executive Summary.* **J Women's Health** 2014;23(11):941–947. Review commissioned by NASA and NSBRI. https://pmc.ncbi.nlm.nih.gov/articles/PMC4236030
  - Cutigni, Cucina, Galante, Cerri & Bizzarri. *Microgravity impairs endocrine signaling and reproductive health of women. A narrative review.* **Frontiers in Physiology** 2025. https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2025.1558711/full
  - Jain & Wotring. *Menstrual Cycle Control in Female Astronauts* (NASA NTRS). https://ntrs.nasa.gov/api/citations/20150008176/downloads/20150008176.pdf
  - Goodale et al. *Wearable sensors reveal menses-driven changes in physiology…* **JMIR** 2019 (n=237). https://www.jmir.org/2019/4/e13404/
  - *Tracking sleep, temperature, heart rate and daily symptoms across the menstrual cycle* (Oura ring). **Int J Women's Health** 2022. https://www.dovepress.com/tracking-sleep-temperature-heart-rate-and-daily-symptoms-across-the-me-peer-reviewed-fulltext-article-IJWH
  - Jugular thrombosis on the ISS: Auñón-Chancellor et al., **NEJM** 2020;382:89-90. Summary at https://www.auntminnie.com/clinical-news/ultrasound/article/15624993/ultrasound-detects-astronauts-blood-clot-in-space
  - Single radiation limit since 2022: https://www.nationalacademies.org/news/nasa-should-update-astronaut-radiation-exposure-limits-improve-communication-of-cancer-risks · https://www.frontiersin.org/articles/10.3389/fnume.2022.997718

> None of these sources gives clinical thresholds for a software. They are evidence to **design** ORBI, not to diagnose. Most of what is known about hormones in microgravity comes from **rodents and cells**. There are very few human data.

## The key idea in one line

If ORBI uses the same baseline all month, **the luteal phase of the cycle can look like the onset of an infection**: temperature rises and resting HR rises. A cycle-aware baseline avoids that false alarm and is an "it's not you" of the same kind as *"Cabin issue, not you"*.

## Key data

### 1. The cycle changes the constants ORBI monitors
- After ovulation, progesterone raises **wrist skin temperature by 0.28–0.56 °C** (Goodale 2019, wrist wearable; HR and respiratory rate also change, all with *p* < 0.001).
- **Resting HR rises 2–7 bpm** from the follicular to the luteal phase. In a prospective study of 91 women it was **+3.8 bpm** at mid-luteal phase versus menstruation.
- The Oura study (2022) finds a **biphasic** pattern: distal temperature and HR during sleep are higher in the mid- and late luteal phase.
- 👉 In ORBI, the temperature rule "+2σ over baseline" and the HR rule "+10 bpm" can fire because of the cycle and not because of illness.

### 2. Many astronauts suppress menstruation, but it is not mandatory
- Common option: **combined oral contraceptive taken continuously** (without a rest week) to avoid menstruation. *"There is no official requirement to do so"* (Cutigni 2025).
- Practical reason: in the US segment, the water-recycling system **was not designed to process menstrual blood** (Jain & Wotring).
- Open issues:
  - The **stability of hormonal drugs** over such a long time and under deep-space radiation has not been tested. For a Mars mission of about 3 years, **~1,100 pills** would have to be carried.
  - **IUDs and implants** (long-acting contraception) are seen as an alternative, but have barely been studied in astronauts. Placing them **1.5–2 years before** the mission is recommended.
  - Some injectable methods (**DMPA / Depo-Provera**) are associated on Earth with **lower bone density**, which in space is already lost at 1–1.5 %/month.

### 3. Venous thrombosis: the 2019 case
- Two months after starting a 6-month mission on the ISS, an astronaut found a **clot in the jugular vein** with an **ultrasound she performed on herself** for a study. Radiologists on the ground guided the confirmation.
- She was treated from the ground: enoxaparin from the medical kit and later apixaban, which arrived on a cargo vehicle. On the ISS **there was no drug to reverse the anticoagulant**.
- After the case, NASA launched occupational surveillance of venous thrombosis.
- Hormonal contraception increases the risk of thrombosis on Earth. A NASA review concludes that astronauts who take it are not at higher risk than the general population that takes it.
- 👉 It is the perfect example of the challenge: **early detection on board + a decision with Earth far away**.

### 4. Other sex differences (Mark 2014)
| System | What is observed | Relevance |
|---|---|---|
| **Cardiovascular** | Women suffer more **orthostatic intolerance** on returning to gravity (they lose more plasma and have less vascular resistance in the legs) | Arrival on Mars: the astronaut must stand up after ~6 months of transit |
| **Vision (VIIP/SANS)** | Affects 82 % of the men and 62 % of the women studied (no significant difference). *"All clinically significant cases described thus far have occurred in male astronauts"* | No need to treat it differently |
| **Immune** | Stronger immune response in women: fewer infections, more autoimmunity | — |
| **Urinary** | **More frequent urinary infections in women** in flight; only women required catheterization | Possible cause to consider when there is fever |
| **Space motion sickness** | 50 % of women versus 38 % of men on arriving in microgravity (no significant difference) | — |
| **Bone** | **No sex difference** in the rate of loss: ~1.5 %/month on missions of 49–215 days (Smith 2014, cited in Cutigni) | ORBI's bone formula works for everyone |
| **Behavior** | *"There is no evidence of sex differences in terms of behavioral or psychological responses to spaceflight"* | — |

### 5. Radiation: the limit no longer depends on sex
- **Before 2022:** the limit depended on age and sex. At 45 years old, the maximum radiation mission duration was **187 days for women** and **344 for men** (Mark 2014).
- **Since 2022:** NASA sets a **single career limit of 600 mSv for all ages and sexes**. It follows the National Academies' recommendation (2021), calculated on the most sensitive case: a 35-year-old woman (3 % risk of death from induced cancer).
- There are criticisms: F. Cucinotta (former NASA radiation lead) warns that a 35-year-old woman at the limit would have *"over 10 percent chance of dying in 15 to 20 years"* after a Mars mission.
- 👉 This **confirms the 600 mSv default** of ORBI's exposure budget.

### 6. Data are missing, and that is also an argument
- **155 of 681** people who have been to space are women (**22.7 %**) (Cutigni 2025).
- **There are no direct measurements** of ovarian hormones in flight, only *"some anecdotal cases"*. Moreover, the contraceptive masks any measurement.
- *"The impact of the space environment outside of LEO on gynecological concerns remains unknown."* (Steller 2020, cited in Cutigni)
- *"These findings reinforce the need for a specific women's health database."* (Cutigni 2025)
- In the HERA study, the biometric test shirt **did not fit the crew members well**: *"current prototype garment design is less than optimal for female crew"*. Hardware also has bias.

## How we use it in ORBI

1. **Cycle-aware baseline** (`baseline.ts`). If the astronaut enables it (`cycle: "tracked"`), the baseline is computed **by phase** (follicular / luteal) with the cycles recorded during ground training. The "+Nσ" rules use the baseline of the phase she is in.
   - **Safety rule:** the adjustment only affects the baseline-relative rules. **Absolute clinical thresholds (≥ 38.0 °C, > 100 bpm…) are never relaxed.**
2. **`luteal-phase` scenario.** Temperature and HR rise as at the onset of `early-infection`, but sleep is fine and the rises match her luteal phase. ORBI shows *"Expected cycle variation, not infection"* in NOMINAL, with the "Because…".
3. **Crew member profile** with `cycle: tracked / suppressed / n/a` and the contraceptive method (optional).
   - If `suppressed`: logistical warning that the medication reserve must cover the mission with margin (Level 2).
   - If `dmpa`: note on the bone card (Level 2).
4. **Privacy.** Reproductive data is *opt-in*, only she sees it and it **does not travel to Mission Control** unless she authorizes it (`shareReproductiveWithGround`). What reaches the control center is the conclusion ("expected cycle variation"), not the data.
5. **Future work with backing:** guided jugular ultrasound procedure (2019 case), orthostatic preparation before arriving at the surface, and urinary infection as a possible cause in `early-infection`.
6. **Pitch:** *"Most spaceflight data comes from men. ORBI treats a woman's cycle as part of her baseline, not as noise, and she decides who sees it."*
