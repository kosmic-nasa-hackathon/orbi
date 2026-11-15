import type { SourceRef, SystemId } from "../domain/types";

/**
 * Women's-health context shown next to the body. Copy only: none of these numbers drives a level.
 * Every figure comes from docs/resources/08-womens-health.md. Sources stay here for audit and the
 * pitch; the astronaut sees the ranges, not the citations. The engine does not apply a phase-aware
 * baseline yet (P3, #12).
 */

export const CYCLE_SOURCES = {
  goodale: {
    label: "Goodale et al., JMIR 2019 (n = 237)",
    url: "https://www.jmir.org/2019/4/e13404/",
    verified: true,
  },
  oura: {
    label: "Menstrual-cycle wearable study, Int J Women's Health 2022",
    url: "https://www.dovepress.com/tracking-sleep-temperature-heart-rate-and-daily-symptoms-across-the-me-peer-reviewed-fulltext-article-IJWH",
    verified: true,
  },
} satisfies Record<string, SourceRef>;

/** One line under the systems whose signal the cycle moves. */
export const CYCLE_NOTE: Partial<
  Record<SystemId, { short: string; text: string; source: SourceRef }>
> = {
  immune: {
    short: "Your cycle can raise this +0.28–0.56 °C",
    text: "After ovulation, skin temperature can rise 0.28–0.56 °C, which can look like an early fever.",
    source: CYCLE_SOURCES.goodale,
  },
  cardio: {
    short: "Your cycle can raise this +2–7 bpm",
    text: "Resting heart rate can rise 2–7 bpm in the luteal phase of the cycle.",
    source: CYCLE_SOURCES.oura,
  },
};

export const CYCLE_CARD = {
  title: "Your cycle, your baseline",
  privacy: "Opt-in. It stays on board and reaches Mission Control only if you share it.",
  ranges: [
    { label: "Temperature", value: "+0.28–0.56 °C", source: CYCLE_SOURCES.goodale },
    { label: "Resting HR", value: "+2–7 bpm", source: CYCLE_SOURCES.oura },
  ],
  why: "In the luteal phase these rises can look like the start of an infection. ORBI reads them against your own cycle phase, learned during ground training.",
};
