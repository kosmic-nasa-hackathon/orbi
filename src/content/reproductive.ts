/**
 * Design preview of a seventh system: reproductive, hormonal and gynecological health.
 * The engine does not evaluate it yet: the level below is a fixed demo value for the day-148
 * story (the pill reserve no longer covers the rest of the mission), labelled "Demo values" on
 * screen. No source gives thresholds
 * for these signals yet. Priorities are design priorities (what ORBI would watch first), not
 * health states.
 * Design and evidence: docs/DEMO.md ("A seventh system") and docs/resources/08-womens-health.md.
 */

import type { Level } from "../domain/types";

export type Priority = "High" | "Medium" | "Low";

export interface ReproductiveParameter {
  label: string;
  priority?: Priority;
}

export interface ReproductiveGroup {
  label: string;
  items: ReproductiveParameter[];
}

export const REPRODUCTIVE_PREVIEW: {
  title: string;
  level: Level;
  finding: string;
  demoTag: string;
  why: string;
  groups: ReproductiveGroup[];
  safety: string;
  privacy: string;
  pending: string;
  trend: string;
} = {
  title: "Reproductive & hormonal",
  level: "WATCH",
  finding: "Pill reserve shorter than the mission",
  demoTag: "Demo values",
  why: "Contraception and reproductive health, managed far from the nearest pharmacy and with no resupply. ORBI will track only what can honestly be known on board.",
  groups: [
    {
      label: "Daily, you log it",
      items: [
        { label: "Breakthrough bleeding", priority: "High" },
        { label: "Pill taken and pills left", priority: "High" },
        { label: "Pelvic pain", priority: "High" },
        { label: "Urinary symptoms", priority: "High" },
        { label: "Neck or arm swelling, new headache", priority: "High" },
        { label: "Vaginal symptoms", priority: "Medium" },
        { label: "Cycle day or phase", priority: "Medium" },
      ],
    },
    {
      label: "Profile and pharmacy",
      items: [
        { label: "Contraceptive method", priority: "High" },
        { label: "Drug expiry and radiation dose", priority: "High" },
      ],
    },
    {
      label: "On board, periodic",
      items: [
        { label: "Ovarian cysts (guided ultrasound)", priority: "Medium" },
        { label: "LH urine strip", priority: "Medium" },
        { label: "Endometrial thickness (ultrasound)", priority: "Low" },
        { label: "Vaginal pH strip", priority: "Low" },
      ],
    },
    {
      label: "Measured on Earth, before and after flight",
      items: [
        { label: "Estrogen, progesterone, FSH, AMH" },
        { label: "Contraceptive drug concentration" },
        { label: "Vaginal microbiome" },
      ],
    },
  ],
  safety:
    "Safety alerts always on: thrombosis signs, urinary infection with fever, medication reserve.",
  privacy: "The detail stays on board. Mission Control gets the conclusion unless you share more.",
  pending:
    "Demo values: this system is not in the engine yet, and its rules need sourced thresholds first.",
  trend:
    "When the solid line drops below the dashed one, the pills left no longer cover the mission days left.",
};

/**
 * Demo pill-reserve story for Trends. Deterministic, no randomness: ~1,100 pills packed for a
 * ~1,100-day (3-year) Mars mission (docs/resources/08), one pill a day, and one demo event on
 * day 131 when 14 pills are set aside after a stability check. Shown as "Demo values" only.
 */
export const PILL_DEMO = {
  packed: 1100,
  missionDays: 1100,
  setAside: { day: 131, pills: 14 },
  assumptions:
    "Demo values: about 1,100 pills packed for a 3-year Mars mission, one a day, and 14 set aside on day 131 after a stability check.",
} as const;

export interface PillReservePoint {
  day: number;
  /** Pills left after today's dose. */
  reserve: number;
  /** Mission days left after today. */
  daysLeft: number;
  pillTaken: boolean;
  bleeding: boolean;
}

/** The last `window` mission days up to `day` of the demo pill-reserve story. */
export function pillReserveSeries(day: number, window = 30): PillReservePoint[] {
  const first = Math.max(1, day - window + 1);
  const points: PillReservePoint[] = [];
  for (let d = first; d <= day; d++) {
    const setAside = d >= PILL_DEMO.setAside.day ? PILL_DEMO.setAside.pills : 0;
    points.push({
      day: d,
      reserve: PILL_DEMO.packed - d - setAside,
      daysLeft: PILL_DEMO.missionDays - d,
      pillTaken: true,
      bleeding: false,
    });
  }
  return points;
}
