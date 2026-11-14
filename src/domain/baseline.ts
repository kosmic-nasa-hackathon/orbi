import type { DailyReading } from "./types";

export interface Stat {
  mean: number;
  sd: number;
}

export interface Baseline {
  n: number;
  sleepHours: Stat;
  tempC: Stat;
  restingHr: Stat;
  spo2: Stat;
  glucoseMgDl: Stat;
}

function stat(values: number[]): Stat {
  if (values.length === 0) return { mean: 0, sd: 0 };
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  if (values.length === 1) return { mean, sd: 0 };
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / (values.length - 1);
  return { mean, sd: Math.sqrt(variance) };
}

/**
 * Personal baseline = mean ± SD of the pre-flight days.
 * If the scenario has no negative days, fall back to the first 14 readings.
 */
export function computeBaseline(readings: DailyReading[]): Baseline {
  const preflight = readings.filter((r) => r.day < 0);
  const sample = preflight.length >= 3 ? preflight : readings.slice(0, 14);
  return {
    n: sample.length,
    sleepHours: stat(sample.map((r) => r.sleepHours)),
    tempC: stat(sample.map((r) => r.tempC)),
    restingHr: stat(sample.map((r) => r.restingHr)),
    spo2: stat(sample.map((r) => r.spo2)),
    glucoseMgDl: stat(sample.map((r) => r.glucoseMgDl)),
  };
}

export function sigma(value: number, s: Stat): number {
  if (s.sd <= 0) return 0;
  return (value - s.mean) / s.sd;
}

export function round(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}
