import { computeBaseline } from "./baseline";
import { THRESHOLDS } from "./rules";
import type { Level, Scenario, SystemId } from "./types";

export type VitalField = "sleepHours" | "restingHr" | "tempC" | "spo2" | "glucoseMgDl";

/** The vital that tracks each system on the chart. Bone and radiation have no daily vital. */
export const SYSTEM_VITAL: Partial<Record<SystemId, VitalField>> = {
  immune: "tempC",
  cardio: "restingHr",
  respiratory: "spo2",
  metabolic: "glucoseMgDl",
  behavioral: "sleepHours",
};

export type SeriesPhase = "training" | "mission";

export interface SeriesPoint {
  day: number;
  value: number;
  phase: SeriesPhase;
  /** Outside mean ± `sigmas` SD of the ground baseline. Descriptive only; levels come from evaluate(). */
  outsideNormal: boolean;
}

export interface ReferenceLine {
  label: string;
  value: number;
  level: Level;
}

export interface VitalSeries {
  field: VitalField;
  points: SeriesPoint[];
  normal: { mean: number; low: number; high: number; sigmas: number; n: number };
  references: ReferenceLine[];
}

/** Absolute thresholds from rules.ts, shown as reference lines. Baseline-relative rules are not drawn. */
const REFERENCES: Record<VitalField, ReferenceLine[]> = {
  tempC: [
    { label: "Watch", value: THRESHOLDS.tempC.watch, level: "WATCH" },
    { label: "Concern", value: THRESHOLDS.tempC.concern, level: "CONCERN" },
  ],
  spo2: [
    { label: "Watch", value: THRESHOLDS.spo2.watch, level: "WATCH" },
    { label: "Concern", value: THRESHOLDS.spo2.concern, level: "CONCERN" },
  ],
  restingHr: [{ label: "Concern", value: THRESHOLDS.restingHr.concern, level: "CONCERN" }],
  glucoseMgDl: [
    { label: "Watch high", value: THRESHOLDS.glucoseMgDl.watchHigh, level: "WATCH" },
    { label: "Watch low", value: THRESHOLDS.glucoseMgDl.watchLow, level: "WATCH" },
  ],
  sleepHours: [{ label: "Short night", value: THRESHOLDS.sleepHours.low, level: "WATCH" }],
};

/**
 * Ground-training readings plus the last `missionDays` mission days up to `day`,
 * with the personal baseline band from computeBaseline().
 */
export function buildSeries(
  scenario: Scenario,
  field: VitalField,
  day: number,
  { missionDays = 30, sigmas = 1 }: { missionDays?: number; sigmas?: number } = {},
): VitalSeries {
  const baseline = computeBaseline(scenario.readings);
  const { mean, sd } = baseline[field];
  const low = mean - sigmas * sd;
  const high = mean + sigmas * sd;

  const points = scenario.readings
    .filter((reading) => reading.day < 0 || (reading.day <= day && reading.day > day - missionDays))
    .sort((a, b) => a.day - b.day)
    .map((reading): SeriesPoint => {
      const value = reading[field];
      return {
        day: reading.day,
        value,
        phase: reading.day < 0 ? "training" : "mission",
        outsideNormal: value < low || value > high,
      };
    });

  return {
    field,
    points,
    normal: { mean, low, high, sigmas, n: baseline.n },
    references: REFERENCES[field],
  };
}
