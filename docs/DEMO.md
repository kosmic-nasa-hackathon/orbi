# DEMO — ORBI in one page, the demo script and the 3-minute pitch

Three parts, each usable on its own:

1. **The concept**: what ORBI is, why it matters for women astronauts, and which variables we
   track.
2. **The demo script**: 30 seconds on what matters most in ORBI, told through the astronaut's
   90-second check-in.
3. **The 3-minute pitch**: the spoken talk for the presentation, timed per block.

Sources: `docs/BRIEF.md`, `docs/CONCEPT.md`, `docs/resources/08-womens-health.md`,
`docs/resources/09-ground-training.md`. The slides live in `/pitch/` (`docs/PITCH.md`).

> **Honesty line.** The demo shows the live app: `early-infection`, Mars, day 148. Cycle notes and
> the cycle card on Body are live. The cycle-aware *engine* (phase baselines learned in 90 days of
> ground training, and the `luteal-phase` scenario) is designed and sourced, but it is **P3, not
> deployed**. Say "designed for", not "already does", for anything marked *roadmap* below.

---

## 1. The concept

### In one sentence

ORBI is a tablet console that turns a 90-second daily check-in into an explained, prioritized
decision for an astronaut who is 14 minutes away from the nearest doctor.

### The problem

On day 148 of a Mars transit there is no clinician on board, and every question to Earth takes up to
20 minutes each way. Small drifts (worse sleep, a slightly higher temperature, a faster resting
heart) are the early signs that matter, and they are easy to miss or to overreact to.

### What ORBI does

1. **Collects** in 90 seconds: wearables pre-fill sleep, resting heart rate, temperature and SpO₂;
   the astronaut confirms them and adds mood, fatigue and glucose.
2. **Compares** each reading with *her own* baseline, not a population average.
3. **Shows** her body: six systems mapped to NASA's five hazards of human spaceflight, plus a
   radiation halo.
4. **Decides and explains**: a traffic-light level, the rule that fired ("Because…"), an action
   card and who to tell.
5. **Escalates by latency**: on the ISS call the ground; on Mars act on board first and queue the
   packet for the next window.

ORBI does not diagnose. It prioritizes, explains and escalates. Every threshold lives in one file
with its source; there is no black box.

### Our differentiator: designed for women astronauts too

Most spaceflight medical data comes from men: only 155 of 681 people who have flown are women
(22.7 %), and there are no direct in-flight measurements of ovarian hormones. ORBI starts from that
gap instead of ignoring it.

- **The cycle is baseline, not noise.** After ovulation, temperature and resting heart rate rise
  naturally. With one flat baseline, the luteal phase can look like the start of an infection.
  ORBI tells her how much her cycle can move each reading, and is designed to read each value
  against the phase she is in.
- **Safety first.** The cycle adjustment only touches baseline-relative rules. Absolute clinical
  thresholds (≥ 38.0 °C, > 100 bpm) are never relaxed, so a real fever is never hidden.
- **Her data, her choice.** Cycle tracking is opt-in. Reproductive data stays on board; the ground
  sees the conclusion ("expected cycle variation"), not the data, unless she shares it.
- **Train like you fly** *(roadmap, P3)*. ORBI is used during 90 days of ground training and learns
  her personal baseline per cycle phase before launch.

### The variables we track and the values we use

| Variable | Source in the app | Why it matters | Cycle effect (sourced) |
|---|---|---|---|
| Sleep | Wearable, confirmed | Sleep debt precedes infection and errors | Biphasic pattern in sleep data (Int J Women's Health 2022) |
| Resting heart rate | Wearable, confirmed | Early infection, stress, deconditioning | **+2–7 bpm** in the luteal phase (+3.8 bpm mid-luteal, n = 91) |
| Temperature | Wearable, confirmed | Infection signal | **+0.28–0.56 °C** after ovulation (Goodale, JMIR 2019, n = 237) |
| SpO₂ | Wearable, confirmed | Respiratory system and cabin air | — |
| Mood | Astronaut, 5-point scale | Behavioral health | No sex difference in behavioral response (Mark 2014) |
| Fatigue | Astronaut, 5-point scale | Workload, sleep, illness | — |
| Glucose | Astronaut, mg/dL | Metabolic system | — |
| Period today? | Astronaut, opt-in *(hidden until P3)* | Anchors the cycle phase | — |
| Cabin CO₂ | Habitat sensors | "Cabin issue, not you" | — |
| Radiation | Dosimeter | Shown as % of a 600 mSv career budget (single limit for all sexes since 2022) | Limit no longer depends on sex |
| Bone | Estimated, not measured | ~1–1.5 %/month loss; tracked through exercise adherence | No sex difference in loss rate |

What we deliberately **don't** claim: thresholds for women specifically (no source gives them), any
hormone measurement in flight, or a diagnosis. Where data is missing, ORBI says so.

### Designed next for women's health *(roadmap)*

- `luteal-phase` scenario: temperature and heart rate rise, sleep is fine, the rise matches her
  phase. ORBI shows "Expected cycle variation, not infection", in green, with the "Because…".
- Contraception-aware notes: medication reserve for suppressed cycles (~1,100 pills for a 3-year
  Mars mission) and a bone note for DMPA.
- Guided jugular ultrasound, after the 2019 ISS thrombosis case found by an astronaut's own scan.
- Orthostatic preparation before landing (women show more orthostatic intolerance on return).

---

## 2. The demo script

**Setup:** tablet at 1180 × 820, landscape. `/?view=today`, scenario `early-infection`, Mars,
day 148, cycle-aware on. *Stage directions in italics.*

**Length: 30 seconds, ~65 words.** The check-in is the star: the voice-over follows her taps, and
the screen does the rest. Before recording, check that the numbers on screen still match (5.0 h,
77 bpm, 37.9 °C, 98 %).

> *[Today screen, "Good morning".]*
>
> Day 148, on the way to Mars. Every morning, the commander checks in in ninety seconds.
>
> *[Point at the synced chips.]*
>
> Her wearables already filled in sleep, heart rate, temperature and oxygen. She just confirms,
>
> *[Mood "Low", fatigue "Exhausted", tap Confirm.]*
>
> and adds what no sensor knows: how she feels.
>
> *[Body opens on its own; hold on the Immune card and its cycle note.]*
>
> ORBI reads it against her own baseline, cycle included,
>
> *[Tap "What to do".]*
>
> and gives one clear decision: act now, here's why, and on Mars, act on board first.

---

## 3. The 3-minute pitch

**Total: about 2:50, ~400 words.** Each block maps to a slide in `/pitch/`. Leave 10 seconds of
margin; cut the lines in [brackets] if you are running late.

### 0:00–0:20 · The hook (slides 1–2)

> Day 148. You're halfway to Mars. You slept badly all week, you feel warm, your heart is racing.
> Is it an infection, stress, or just your body? The nearest doctor is fourteen minutes away, each
> way. What do you do?

### 0:20–0:45 · The insight (slide 3)

> On a long mission, latency becomes a clinical variable. The question isn't "what does the doctor
> say", it's "what should I do *now*, on board, and what should I tell Earth". Astronauts need
> autonomy, but autonomy without explanation isn't safe.

### 0:45–1:15 · The product (slides 4, 6, 7)

> ORBI is a tablet console. Every morning, a ninety-second check-in: wearables pre-fill sleep, heart
> rate, temperature and oxygen; she adds mood, fatigue and glucose. ORBI compares each reading with
> her own baseline, shows her body as six systems mapped to NASA's five hazards, plus a radiation
> halo, and gives one decision: how serious, why, what to do and who to tell, adapted to the delay.

### 1:15–1:50 · Our differentiator: women astronauts (slide 8)

> Fewer than one in four people who have flown to space are women, and there are almost no in-flight
> data on their hormones. We didn't want to ignore that. In the second half of the cycle, temperature
> rises up to half a degree and resting heart rate up to seven beats. With one flat baseline, that
> looks like an infection. ORBI treats her cycle as part of her baseline, not as noise. Absolute
> fever thresholds never change, so nothing real is hidden. And it's opt-in: her data stays with her,
> and the ground sees the conclusion, not the data.

### 1:50–2:20 · Honesty and trust (slides 9–10)

> ORBI is deliberately honest. It doesn't diagnose. Every threshold has a source and is auditable.
> What can't be measured in flight, it says so: bone loss is estimated from NASA evidence, and
> radiation is shown against a budget, because deep-space limits are still open. [The engine is
> deterministic; an optional on-board model may explain, but never decides.]

### 2:20–2:40 · Live now and next (slides 12–13)

> What you've seen is live: the check-in, the body, the decision and the escalation, on synthetic
> mission data. Next, the ninety-day ground-training baseline that learns her cycle before launch:
> train like you fly. [Then Mission Control, where the ground sees the packet arrive with the
> delay.]

### 2:40–2:50 · Close (slide 15)

> When Earth is fourteen minutes away, the crew needs more than data. ORBI doesn't diagnose. It
> prioritizes, explains and escalates. Thank you.

### Rules while speaking

- Say "decision support", "prioritizes, explains and escalates", "designed for". Never "diagnoses",
  "AI decides" or "predicts".
- Don't present the cycle-aware engine or the `luteal-phase` scenario as live until P3 ships.
- Every number in the talk is in this file with its source. Don't add new ones on stage.
