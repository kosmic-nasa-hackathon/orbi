# NASA JSC — Space Radiation (monitoring)

- **Source:** https://www.nasa.gov/directorates/esdmd/hhp/space-radiation/
- **Organization:** NASA · Johnson Space Center · Human Health and Performance
- **Published:** 16 Mar 2023 · **Updated:** 13 Mar 2026 · **Consulted:** 13 Nov 2026
- **Linked from:** the *Space Radiation* subpage of the Hazards (`01-nasa-hrp-hazards.md`)

## Summary

Explains how NASA protects and monitors astronauts against radiation: the 24/7 continuous surveillance by the **Space Radiation Analysis Group (SRAG)**, the dosimeters crew members wear, the measurement hardware, and the research of the Radiation Biophysics Laboratory.

## Protecting Against the Unseen

- Radiation exposure is *"one of the greatest threats to an astronaut's health"*.
- **Associated risks:** carcinogenesis, degenerative effects on tissues, effects on the central nervous system and **acute radiation syndromes**.
- Outside the atmosphere, the environment consists of **energetic protons and heavy nuclei**, which produce biological damage different from that of radiation on Earth. Hence the great uncertainty when projecting risks.
- ⚠️ **Key fact:** *"Although information exists to recommend crew exposure limits... for missions in low Earth orbit, there is **insufficient knowledge**... to provide recommendations on crew exposure limits and design requirements for **long-duration missions**."*

## Continuous Monitoring: 24/7/365

- **SRAG** (Johnson Space Center) keeps the crew *"within acceptable levels of risk"* with **continuous monitoring of the solar radiation environment** and support to operations **24 hours a day**.
- **Dosimeters**, sometimes in the form of **badges** worn by each crew member. They are returned to Earth for analysis. Types: TLD (thermoluminescent), OSLD (optically stimulated) and PNTD (passive nuclear track detectors).
- **Hardware and tools:**
  - Time-resolved models of Earth's magnetic field
  - Maps of the trapped radiation flux in the magnetosphere
  - Trajectory propagation algorithms
  - **TEPC** (Tissue Equivalent Proportional Counter)
  - **CPDS** (Charged Particle Directional Spectrometer)
  - **RAM** (Radiation Area Monitor)
  - **CPD** (Crew Passive Dosimeter)
- In the Mission Control Center there is a dedicated room (*Space Radiation Analysis Multipurpose Support Room*).

## How Safe is Safe Enough?

The **Radiation Biophysics Laboratory** conducts research to reduce uncertainty, especially the **combined effect of radiation + microgravity**: DNA damage, transcriptomics in ISS crew members, and low- and high-LET radiation in cells and animals (with the NSRL accelerator at Brookhaven). It also develops **computational models to project the risk of cancer and acute radiation syndrome**.

## How we use it in ORBI

**What we were looking for (dose limits): this page does NOT give them.** On the contrary, it explicitly says that **there is not enough knowledge to recommend limits for long missions**. Consequences:

1. **Change the focus of the halo in `rules.ts`:**
   - The "% of the career limit" should be presented as **"exposure budget set by mission medical ops"**: a configurable value, not a NASA figure for Mars.
   - The 600 mSv value we have in `CONCEPT.md` §4.2 comes from NASA-STD-3001 Vol. 1 and was confirmed by `resources/08`: since 2022 it is a single career limit for all sexes and ages. It is no longer `TODO verify`; explain it like this: *"current NASA career limit; deep-space limits are still an open research question."*
   - This **works in our favor** in the pitch: *"NASA itself says deep-space exposure limits are still unknown. That's why ORBI shows the budget, the trend and the uncertainty, not a fake precise threshold."*
2. **More realistic halo data source** (for "How it is used on the ship"):
   - **CPD** (personal passive dosimeter) → **accumulated dose**, read periodically: it is a weekly reading, not real time.
   - **RAM / TEPC** (area monitors on the ship) → **dose rate** in real time.
   - **SPE alert** → from continuous solar monitoring of the SRAG type. On Mars, with up to 20 min of delay, the alert must be generated **on board** with the ship's monitors.
3. **Risks for the halo's "Why this matters":** cancer, degenerative tissue damage, central nervous system and **acute radiation syndrome** (the latter is what justifies URGENT mode during an SPE).
4. **Radiation + microgravity combined** is another official quote in favor of the correlations between systems.

**Correction for "How it is used on the ship" (`CONCEPT.md`):** in the dosimeter row, name CPD (personal) + RAM/TEPC (area) + CANS (neutrons, CSA, see `04-csa-monitoring-radiation.md`).
