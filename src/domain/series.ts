import { computeBaseline, type Stat } from "./baseline";
import { THRESHOLDS } from "./rules";
import type { Level, Scenario, SystemId } from "./types";

export type VitalField =
  | "sleepHours"
  | "restingHr"
  | "tempC"
  | "spo2"
  | "glucoseMgDl"
  | "resistiveExerciseMin";

/**
 * The daily signal that tracks each system on the chart. Bone loss cannot be measured in flight,
 * so Musculoskeletal charts its countermeasure, resistive exercise. Radiation has no daily vital.
 */
export const SYSTEM_VITAL: Partial<Record<SystemId, VitalField>> = {
  immune: "tempC",
  cardio: "restingHr",
  respiratory: "spo2",
  metabolic: "glucoseMgDl",
  behavioral: "sleepHours",
  msk: "resistiveExerciseMin",
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
const REFERENCES: Record<Exclude<VitalField, "resistiveExerciseMin">, ReferenceLine[]> = {
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
  const { mean, sd } =
    field === "resistiveExerciseMin" ? exerciseBaseline(scenario) : baseline[field];
  const low = mean - sigmas * sd;
  const high = mean + sigmas * sd;

  const points = scenario.readings
    .filter((reading) => reading.day < 0 || (reading.day <= day && reading.day > day - missionDays))
    .sort((a, b) => a.day - b.day)
    .map((reading): SeriesPoint => {
      const value = reading[field] ?? 0;
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
    references:
      field === "resistiveExerciseMin"
        ? [{ label: "Target", value: scenario.exerciseTargetMinPerDay, level: "WATCH" }]
        : REFERENCES[field],
  };
}

/** Exercise is not part of the engine baseline; same sample (pre-flight days), same formula. */
function exerciseBaseline(scenario: Scenario): Stat {
  const preflight = scenario.readings.filter((reading) => reading.day < 0);
  const sample = (preflight.length >= 3 ? preflight : scenario.readings.slice(0, 14)).map(
    (reading) => reading.resistiveExerciseMin ?? 0,
  );
  const mean = sample.reduce((a, b) => a + b, 0) / Math.max(sample.length, 1);
  const sd =
    sample.length > 1
      ? Math.sqrt(sample.reduce((a, b) => a + (b - mean) ** 2, 0) / (sample.length - 1))
      : 0;
  return { mean, sd };
}
