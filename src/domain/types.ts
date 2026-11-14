/**
 * ORBI domain contract.
 *
 * This file is the boundary between the rules engine, the UI and the coach.
 * Do not change it without announcing it to the whole team (see docs/TASKS.md).
 */

export type Level = "NOMINAL" | "WATCH" | "CONCERN" | "URGENT";

export const LEVEL_ORDER: Record<Level, number> = {
  NOMINAL: 0,
  WATCH: 1,
  CONCERN: 2,
  URGENT: 3,
};

export type SystemId =
  | "cardio"
  | "msk"
  | "immune"
  | "metabolic"
  | "respiratory"
  | "behavioral"
  | "radiation";

export const SYSTEM_IDS: SystemId[] = [
  "cardio",
  "msk",
  "immune",
  "metabolic",
  "respiratory",
  "behavioral",
  "radiation",
];

export type Mission = "ISS" | "MOON" | "MARS";

export interface SourceRef {
  /** Short citation shown in the UI. */
  label: string;
  url?: string;
  /** False means the threshold still needs a primary-source check. */
  verified: boolean;
}

export type ReadingField =
  | "sleepHours"
  | "mood"
  | "fatigue"
  | "restingHr"
  | "tempC"
  | "spo2"
  | "glucoseMgDl"
  | "resistiveExerciseMin";

export type SourceKind = "wearable" | "device" | "manual" | "synthetic";

export interface DailyReading {
  /** Mission day. Negative values are pre-flight baseline days. */
  day: number;
  sleepHours: number;
  mood: 1 | 2 | 3 | 4 | 5;
  fatigue: 1 | 2 | 3 | 4 | 5;
  restingHr: number;
  tempC: number;
  spo2: number;
  glucoseMgDl: number;
  resistiveExerciseMin?: number;
  notes?: string;
  sources?: Partial<Record<ReadingField, SourceKind>>;
}

export interface EnvReading {
  day: number;
  cabinCo2MmHg: number;
  /** Daily dose from the personal passive dosimeter (mSv). */
  doseMSv: number;
  /** Solar particle event / storm warning, generated on board. */
  spe: boolean;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  /** First day of the 30-day mission slice. */
  firstMissionDay: number;
  exposureBudgetMSv: number;
  priorDoseMSv: number;
  exerciseTargetMinPerDay: number;
  readings: DailyReading[];
  env: EnvReading[];
}

export interface Escalation {
  now: string;
  next?: string;
  note: string;
}

export interface Assessment {
  level: Level;
  system: SystemId;
  ruleId: string;
  title: string;
  /** Human-readable evidence, one line per signal. */
  because: string[];
  actions: string[];
  escalation: Escalation;
  source: SourceRef[];
}

export interface CoachFact {
  id: string;
  label: string;
  value: string;
  source?: string;
}

export interface Estimates {
  boneLossPct: { min: number; max: number; months: number };
  radiationPct: number;
  radiationDoseMSv: number;
  radiationBudgetMSv: number;
  exerciseAdherencePct: number;
}

export interface Evaluation {
  scenarioId: string;
  day: number;
  mission: Mission;
  bySystem: Record<SystemId, Level>;
  assessments: Assessment[];
  estimates: Estimates;
  facts: CoachFact[];
  /** Latency in seconds, one way. MARS uses the 14-minute demo value. */
  latencySeconds: number;
}

export const MISSION_LATENCY_SECONDS: Record<Mission, number> = {
  ISS: 0,
  MOON: 1.3,
  MARS: 14 * 60,
};
