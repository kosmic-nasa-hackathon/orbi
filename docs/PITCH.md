# PITCH — ORBI

There are two static decks inside `public/pitch/`; Vite copies them as-is to `dist/` and they need no
backend or separate build.

- **5-slide pitch at `/pitch/`** — 2:55, timed to `docs/ORBI_Organizacion_Diapositivas_Pitch.pdf`,
  with the speaker script in the notes panel and a rehearsal timer.
- **Expanded 15-slide deck at `/pitch/full/`** — the long-form deck with overview, speaker notes,
  reading mode and print.
- Production: `https://orbi.agustinpane.xyz/pitch/` · `https://orbi.agustinpane.xyz/pitch/full/`
- Local: `npm run dev` and open `http://localhost:5173/pitch/` or `/pitch/full/`
- Reading mode (full deck): `/pitch/full/?view=scroll`
- 5-slide sources: `public/pitch/index.html`, `styles.css`, `deck.js` and `assets/`
- Full-deck sources: `public/pitch/full/deck.json`, `deck.js` and `theme.css`

The spoken demo script (90-second check-in + 30 s differentiator) and the 3-minute talk are in
`docs/DEMO.md`.

Both engines are our own and lightweight, with no external dependencies, to respect nginx's CSP
(`script-src 'self'`). The 5-slide deck uses real captures of the running prototype.

## How to present

**5-slide pitch (`/pitch/`)**

| Key | Action |
|---|---|
| `→` · `↓` · `Space` | Next slide |
| `←` · `↑` | Previous slide |
| `Home` / `End` | First / last |
| `N` | Speaker notes |
| `T` | Start / pause the rehearsal timer |
| `R` | Reset the timer |
| `F` | Full screen |
| `P` | Print / save as PDF |
| `?` | Keyboard help |

**Full deck (`/pitch/full/`)**

| Key | Action |
|---|---|
| `→` · `↓` · `Space` | Next slide |
| `←` · `↑` | Previous slide |
| `Home` / `End` | First / last |
| `G` | Slide grid |
| `S` | Speaker notes |
| `F` | Full screen |
| `P` | Print / save as PDF |
| `Esc` | Close panels |
| `?` | Keyboard help |

## Script — 5 slides (`/pitch/`)

1. **0:00–0:25 · The challenge** — team, ORBI logo and the brand animation; health monitoring when Earth is 14 minutes away.
2. **0:25–0:55 · The problem / the solution** — sleep, fatigue and heart rate; stress, infection or the cabin? ORBI turns the data into a decision.
3. **0:55–1:35 · How ORBI works** — 90-second check-in → body map + halo → explained decision; cabin vs crew.
4. **1:35–2:15 · Women's health in space** — same sensors, different bodies, smarter decisions; optional cycle-aware baseline, in development (P3), private by default.
5. **2:15–2:55 · From drift to decision** — on-board first, honest gaps and the close. Target: 2:55.

The notes panel contains the full English script and the PDF timing for each slide.

## Full deck script (15 slides) at `/pitch/full/`

1. **Cover** — ORBI, from drift to decision.
2. **The problem** — Day 148, 14 minutes of latency, no clinician on board.
3. **The insight** — latency is a clinical variable.
4. **The product** — 90 s check-in → ground baseline + opt-in cycle → engine → decision → escalation.
5. **Challenge fit** — prompt → ORBI table.
6. **Body** — 6 systems + halo, mapped to NASA's 5 hazards.
7. **Decision** — level, "Because…", action card, escalation.
8. **Correlations** — early infection, cycle (`cycle-aware`), cabin air, solar event.
9. **Honesty** — estimated bone, radiation as a budget, auditable thresholds.
10. **Architecture** — pure domain, consuming UI, optional coach with guardrails.
11. **Evidence** — NASA HRP, NASA-STD-3001, CSA, women's health and ground training.
12. **Live now** — what can be opened today and the 4 current demo scenarios.
13. **Roadmap** — now: the daily flow and Trends; next: P3 (90-day baseline and cycle); then Mission Control and extras.
14. **Team** — what we bring, what we need (clinical review and a pilot).
15. **Close** — "ORBI doesn't diagnose. It prioritizes, explains and escalates."

Full notes for each slide are in `deck.json` (`notes`) and are shown with `S`.

## Before presenting

- [ ] Open `/pitch/` and `/pitch/full/` on the tablet or the laptop that will be used. Test `F` in both, `N`/`T`/`R` in the 5-slide deck and `S`/`G` in the full deck.
- [ ] Confirm the 5-slide deck uses the real captures and that slide 4 labels the cycle-aware baseline as in development (P3).
- [ ] Verify that `/?view=console` responds in production.
- [ ] Have the backup demo video downloaded, not just the link.
- [ ] Confirm the demo scenario: `early-infection`, day 148, Mars → ISS.
- [ ] Check that the deck's numbers stay aligned with `src/domain/rules.ts` and `HANDOFF.md`.
- [ ] Do not promise Today/Body/Decision as finished if they are not on the URL yet.
- [ ] Do not present `cycle-aware`/`luteal-phase` as live until P3 is deployed; the deck shows them
  as design/roadmap.
- [ ] Verify that the live counts are still 4 scenarios and 3 correlations until P3.

## Honesty rules

- Say **"decision support"**, **"prioritizes, explains and escalates"**, **"auditable rules"**.
- Do not say **"diagnoses"**, **"replaces the doctor"**, **"AI predicts"**.
- Bone loss is **estimated** (DXA only on Earth); radiation is shown against a
  **budget** because NASA acknowledges that deep-space limits remain open. The
  default value of 600 mSv has a source (single limit since 2022, `resources/08`).
- Cycle data is **opt-in and private**; absolute thresholds are never relaxed to hide
  a real fever.
- Unverified thresholds are shown as such. Do not invent numbers in the talk.

## Maintenance

- **5-slide pitch:** edit `public/pitch/index.html` for copy, `public/pitch/styles.css` for layout,
  `public/pitch/deck.js` for navigation/timer and `public/pitch/assets/` for captures. Speaker notes
  live in each slide’s hidden `.slide-notes`; timings live in `data-start`/`data-end`.
- **Full deck:** edit `public/pitch/full/deck.json` and reload. No need to touch the engine unless a
  new slide type is added. If a layout is added, also update the CSS.
- Test both decks at `1440×900`, `1180×820` (tablet), `390px` and print.

The deck does not replace `docs/CONCEPT.md` or `docs/BRIEF.md`: it is the presentation layer.
If a rule, a scenario or the product state changes, update both.
