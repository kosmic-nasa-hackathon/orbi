# PITCH — ORBI

Navigable deck at **`/pitch/`** (same app URL). It is a static page inside
`public/pitch/`, so Vite copies it as-is to `dist/` and it needs no backend or separate build.

- Production: `https://orbi.agustinpane.xyz/pitch/`
- Local: `npm run dev` and open `http://localhost:5173/pitch/`
- Reading mode: `/pitch/?view=scroll`
- Content source: `public/pitch/deck.json`
- Engine and styles: `public/pitch/deck.js` + `public/pitch/theme.css`

The architecture replicates the one in `agents-101`: a minimal `index.html`, the content in `deck.json`
and an engine that renders slides. The difference is that here the engine is our own and lightweight,
with no external dependencies, to respect nginx's CSP (`script-src 'self'`).

## How to present

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

On tablet or phone you can advance slides with a horizontal swipe.

## Script (15 slides)

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

- [ ] Open `/pitch/` on the tablet or the laptop that will be used and test `F`, `S` and `G`.
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

To change the pitch, edit `public/pitch/deck.json` and reload. No need to touch the engine
unless a new slide type is added. If a layout is added, also update the CSS and
test at `1280×720`, `1180×820` (tablet) and mobile.

The deck does not replace `docs/CONCEPT.md` or `docs/BRIEF.md`: it is the presentation layer.
If a rule, a scenario or the product state changes, update both.
