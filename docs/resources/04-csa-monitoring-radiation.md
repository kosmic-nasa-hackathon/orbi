# CSA — Monitoring radiation for astronaut health

- **Source:** https://www.asc-csa.gc.ca/eng/news/articles/2026/2026-02-26-monitoring-radiation-astronaut-health.asp
- **Organization:** Canadian Space Agency (CSA)
- **Article date:** 26 Feb 2026 · **Consulted:** 13 Nov 2026

## Summary

Radiation is one of the key challenges outside Earth's atmosphere. With a view to missions to the Moon and Mars, CSA has awarded **$5.5 million** to Bubble Technology Industries to continue developing **CANS** (*Canadian Active Neutron Spectrometer*), a **compact and autonomous** instrument that measures exposure to neutron radiation.

## Key data

- **Neutrons account for ~30% of total radiation on the ISS** and are especially harmful: they can cause serious biological damage and require specific shielding.
- **What is new about CANS:** it measures **continuously and autonomously**. Its predecessor was the *bubble detectors* (in the photo, astronaut David Saint-Jacques on the ISS).
- **Canada's previous experience** in radiation detection on the ISS: MOSFET, EVARM, Radi-N and Radi-N2.
- **Applications on Earth:** cancer therapy, protection of aircrews, detection of nuclear threats and public safety.
- The ISS has served for **more than 25 years** as a testbed for new technologies.

## How we use it in ORBI

- **Source of the radiation halo:** in "How it is used on the ship", the dosimeter row becomes concrete. **Personal dosimeters + a continuous, autonomous neutron spectrometer of the CANS type** feed the halo without the astronaut doing anything (`EnvReading.doseMSv`).
- **"Continuous and autonomous"** is exactly our model: the station measures and ORBI interprets. Pitch line: *"Instruments like CSA's CANS already measure radiation continuously and autonomously. ORBI turns that stream into a decision."*
- **The 30% figure** for the halo's "Why this matters" text: *"About 30% of the radiation on the ISS comes from neutrons, which are especially harmful."*
- **Example that NASA is not the only source:** the statement allows using resources from other agencies. Citing CSA shows that we have used them.
- Possible detail in the halo card: separate the dose by **type** (total / neutrons). Only if there is time left; it is not in the MVP.

⚠️ The article **does not give dose limits**. The career limit still comes from NASA-STD-3001 (`CONCEPT.md` §4.2).
