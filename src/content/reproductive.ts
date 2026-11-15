/**
 * Design preview of a seventh system: reproductive, hormonal and gynecological health.
 * The engine does not evaluate it yet. The level, the findings and the series below are fixed,
 * deterministic demo values for the day-148 story (breakthrough bleeding while the contraceptive
 * drug level falls), labelled "Demo values" on screen. No source gives thresholds for these
 * signals, so values are shown as a percentage of her own ground-training level, never as
 * clinical units. Priorities are design priorities (what ORBI would watch first), not health
 * states. Design and evidence: docs/DEMO.md and docs/resources/08-womens-health.md.
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

export interface ReproductiveCorrelation {
  when: string;
  and: string;
  says: string;
}

export const REPRODUCTIVE_PREVIEW: {
  title: string;
  level: Level;
  finding: string;
  demoTag: string;
  why: string;
  groups: ReproductiveGroup[];
  correlations: ReproductiveCorrelation[];
  safety: string;
  privacy: string;
  pending: string;
} = {
  title: "Reproductive & hormonal",
  level: "WATCH",
  finding: "Breakthrough bleeding, drug level falling",
  demoTag: "Demo values",
  why: "Hormonal, reproductive and gynecological health, managed far from Earth and while on contraception. ORBI reads each value against her own ground-training level.",
  groups: [
    {
      label: "Hormonal",
      items: [
        { label: "Estrogen (E2)", priority: "High" },
        { label: "Progesterone", priority: "High" },
        { label: "AMH", priority: "High" },
        { label: "LH", priority: "Medium" },
        { label: "FSH", priority: "Medium" },
      ],
    },
    {
      label: "Reproductive",
      items: [
        { label: "Ovarian function", priority: "High" },
        { label: "Ovarian cysts", priority: "High" },
        { label: "Endometrial thickness", priority: "Medium" },
      ],
    },
    {
      label: "Gynecological",
      items: [
        { label: "Breakthrough bleeding", priority: "High" },
        { label: "Vaginal microbiome", priority: "Medium" },
      ],
    },
    {
      label: "Medication",
      items: [
        { label: "Contraceptive drug concentration", priority: "High" },
        { label: "Drug stability", priority: "High" },
      ],
    },
  ],
  correlations: [
    {
      when: "Breakthrough bleeding",
      and: "drug concentration below her level",
      says: "Check contraceptive efficacy",
    },
    {
      when: "Drug stability falling",
      and: "radiation dose rising",
      says: "Check the pharmacy stock",
    },
    {
      when: "E2 and LH rising",
      and: "on continuous contraception",
      says: "Ovulation may not be suppressed",
    },
    {
      when: "Breakthrough bleeding",
      and: "endometrial thickness changing",
      says: "Guided ultrasound follow-up",
    },
    {
      when: "Ovarian cysts",
      and: "E2 rising",
      says: "Guided ultrasound, tell the ground",
    },
    {
      when: "Vaginal microbiome change",
      and: "temperature rising",
      says: "Possible infection",
    },
  ],
  safety: "Safety alerts always on, whatever she chooses to share.",
  privacy: "The detail stays on board. Mission Control gets the conclusion unless you share more.",
  pending:
    "Demo values: this system is not in the engine yet, and its rules need sourced thresholds first.",
};

/** Parameters without a daily trend, with their last check (demo values). */
export const REPRODUCTIVE_CHECKS: { label: string; cadence: string; result: string }[] = [
  {
    label: "Ovarian function",
    cadence: "From E2, progesterone and LH",
    result: "Partly active: E2 and LH rising",
  },
  { label: "Ovarian cysts", cadence: "Guided ultrasound, day 120", result: "None seen" },
  {
    label: "Endometrial thickness",
    cadence: "Guided ultrasound, day 120",
    result: "Within her range · recheck after bleeding",
  },
  { label: "AMH", cadence: "Measured on Earth, pre-flight", result: "Within her range" },
  { label: "Vaginal microbiome", cadence: "Measured on Earth, pre-flight", result: "Balanced" },
];

/** Demo bleeding days logged in the mission window. */
export const BLEEDING_DAYS = [141, 142, 145];

export interface ReproductivePoint {
  day: number;
  /** Percent of her ground-training level. */
  drug: number;
  stability: number;
  e2: number;
  progesterone: number;
  lh: number;
  fsh: number;
  bleeding: boolean;
}

const WINDOW_START = 119;
const WINDOW_END = 148;

/**
 * Daily points over the last `window` mission days up to `day`. Deterministic: each value moves
 * linearly from her ground level (100 %) on day 119 to the day-148 demo value.
 */
export function reproductiveSeries(day: number, window = 30): ReproductivePoint[] {
  const points: ReproductivePoint[] = [];
  for (let d = Math.max(1, day - window + 1); d <= day; d++) {
    const t = Math.min(1, Math.max(0, (d - WINDOW_START) / (WINDOW_END - WINDOW_START)));
    const at = (end: number) => Math.round(100 + (end - 100) * t);
    points.push({
      day: d,
      drug: at(82),
      stability: at(88),
      e2: at(130),
      progesterone: at(104),
      lh: at(120),
      fsh: at(108),
      bleeding: BLEEDING_DAYS.includes(d),
    });
  }
  return points;
}
