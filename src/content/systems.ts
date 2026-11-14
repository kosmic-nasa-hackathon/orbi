import type { Level, SystemId } from "../domain/types";

export interface SystemInfo {
  label: string;
  short: string;
  why: string;
  source: string;
}

export const SYSTEM_INFO: Record<SystemId, SystemInfo> = {
  cardio: {
    label: "Cardiovascular",
    short: "Heart and vessels",
    why: "In microgravity the heart deconditions. A resting heart rate that drifts up can be an early sign of infection, dehydration or stress.",
    source: "NASA HRP — Gravity fields",
  },
  msk: {
    label: "Musculoskeletal",
    short: "Bones and muscles",
    why: "Weight-bearing bones lose 1–1.5% of mineral density per month in weightlessness. Resistance exercise is the countermeasure that works; bone density itself can only be measured with DXA on Earth.",
    source: "NASA HRP — Bone Fracture Evidence Report",
  },
  immune: {
    label: "Immune",
    short: "Immune response",
    why: "Spaceflight changes immune function. Temperature is the earliest signal a crew member can measure on board.",
    source: "NASA HRP — Immune system changes",
  },
  metabolic: {
    label: "Metabolic",
    short: "Energy and nutrition",
    why: "Glucose balance reflects nutrition, workload and metabolic risk. On a long mission it is also a nutrition countermeasure.",
    source: "NASA HRP — Nutrition and metabolism",
  },
  respiratory: {
    label: "Respiratory",
    short: "Lungs and cabin air",
    why: "SpO₂ separates a body problem from a cabin-air problem. If CO₂ rises at the same time, the environment is the patient.",
    source: "NASA-STD-3001 · HRP — Hostile closed environment",
  },
  behavioral: {
    label: "Behavioral",
    short: "Sleep, mood and workload",
    why: "Isolation and confinement erode sleep and mood gradually. The first signal is drift, not a crisis.",
    source: "NASA HRP — Isolation and confinement",
  },
  radiation: {
    label: "Radiation halo",
    short: "Cumulative exposure",
    why: "You cannot see or feel space radiation. NASA says deep-space exposure limits are still open, so ORBI tracks a mission budget and a trend instead of inventing a precise threshold.",
    source: "NASA-STD-3001 Vol. 1 · CSA radiation monitoring",
  },
};

export const SYSTEM_LABEL: Record<SystemId, string> = Object.fromEntries(
  Object.entries(SYSTEM_INFO).map(([id, info]) => [id, info.label]),
) as Record<SystemId, string>;

export const LEVEL_COLOR: Record<Level, string> = {
  NOMINAL: "#34d399",
  WATCH: "#fbbf24",
  CONCERN: "#fb923c",
  URGENT: "#f87171",
};

export const LEVEL_BG: Record<Level, string> = {
  NOMINAL: "rgba(52, 211, 153, 0.12)",
  WATCH: "rgba(251, 191, 36, 0.14)",
  CONCERN: "rgba(251, 146, 60, 0.16)",
  URGENT: "rgba(248, 113, 113, 0.18)",
};
