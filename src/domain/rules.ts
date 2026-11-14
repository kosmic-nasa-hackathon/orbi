import type { SourceRef, SystemId } from "./types";

/**
 * Every threshold lives here with its source and a verification flag.
 * A clinician should be able to audit this file without reading the UI.
 */
export const THRESHOLDS = {
  tempC: { watch: 37.5, concern: 38, urgent: 39.5 },
  spo2: { watch: 95, concern: 92, urgent: 90 },
  restingHr: { baselineDelta: 10, concern: 100, urgent: 130 },
  glucoseMgDl: { watchHigh: 140, watchLow: 70, concernHigh: 180, concernLow: 54, urgentLow: 40 },
  sleepHours: { watchNights: 2, concernNights: 3, low: 6 },
  mood: { watchDays: 3, concernDays: 5, low: 2 },
  cabinCo2MmHg: { watch: 4.0 },
  radiationPct: { watch: 50, concern: 80 },
  bone: { missionDaysWatch: 90, missionDaysConcern: 180, adherenceWindowDays: 14 },
} as const;

export const SOURCES = {
  clinical: {
    label: "Standard clinical triage thresholds — spaceflight adaptation pending",
    verified: false,
  },
  ada: {
    label: "ADA Standards of Care — glucose ranges (exact triage cut-offs pending)",
    url: "https://diabetesjournals.org/care",
    verified: false,
  },
  sleep: {
    label: "NASA HRP — sleep and circadian risk (qualitative; numeric cutoff pending)",
    url: "https://www.nasa.gov/hrp/risks/",
    verified: false,
  },
  behavioral: {
    label: "NASA HRP — behavioral health risk (qualitative; numeric cutoff pending)",
    url: "https://www.nasa.gov/hrp/risks/",
    verified: false,
  },
  co2: {
    label: "NASA-STD-3001 Vol. 2 — cabin CO₂ SMAC (value pending)",
    url: "https://standards.nasa.gov/standard/NASA/NASA-STD-3001",
    verified: false,
  },
  radiation: {
    label:
      "NASA career limit — 600 mSv since 2022, single limit for all sexes and ages (deep-space limits still open)",
    url: "https://www.frontiersin.org/articles/10.3389/fnume.2022.997718",
    verified: true,
  },
  bone: {
    label: "NASA HRP Evidence Report — Bone Fracture (1–1.5% bone loss/month)",
    url: "https://www.nasa.gov/hrp/",
    verified: true,
  },
  immune: {
    label: "NASA HRP — immune system changes in spaceflight (qualitative)",
    url: "https://www.nasa.gov/hrp/risks/",
    verified: false,
  },
} satisfies Record<string, SourceRef>;

export interface RuleMeta {
  id: string;
  system: SystemId;
  title: string;
  source: SourceRef[];
}

export const RULES: Record<string, RuleMeta> = {
  temperature: {
    id: "temperature",
    system: "immune",
    title: "Temperature above your range",
    source: [SOURCES.clinical, SOURCES.immune],
  },
  spo2: {
    id: "spo2",
    system: "respiratory",
    title: "Oxygen saturation below range",
    source: [SOURCES.clinical],
  },
  restingHr: {
    id: "restingHr",
    system: "cardio",
    title: "Resting heart rate drifting up",
    source: [SOURCES.clinical],
  },
  glucose: {
    id: "glucose",
    system: "metabolic",
    title: "Glucose out of range",
    source: [SOURCES.ada],
  },
  sleep: {
    id: "sleep",
    system: "behavioral",
    title: "Sleep debt accumulating",
    source: [SOURCES.sleep],
  },
  mood: {
    id: "mood",
    system: "behavioral",
    title: "Mood below baseline",
    source: [SOURCES.behavioral],
  },
  cabinCo2: {
    id: "cabinCo2",
    system: "respiratory",
    title: "Cabin CO₂ above limit",
    source: [SOURCES.co2],
  },
  radiation: {
    id: "radiation",
    system: "radiation",
    title: "Radiation budget",
    source: [SOURCES.radiation],
  },
  bone: {
    id: "bone",
    system: "msk",
    title: "Bone countermeasure adherence",
    source: [SOURCES.bone],
  },
  "early-infection": {
    id: "early-infection",
    system: "immune",
    title: "Possible early infection",
    source: [SOURCES.immune, SOURCES.sleep, SOURCES.clinical],
  },
  "cabin-air": {
    id: "cabin-air",
    system: "respiratory",
    title: "Cabin air, not you",
    source: [SOURCES.co2, SOURCES.clinical],
  },
  "solar-event": {
    id: "solar-event",
    system: "radiation",
    title: "Solar particle event",
    source: [SOURCES.radiation],
  },
};

export const ACTIONS: Record<string, string[]> = {
  temperature: [
    "Re-measure temperature every 4 h",
    "Hydrate and rest in crew quarters",
    "Notify the CMO if it stays at or above 38 °C",
  ],
  spo2: [
    "Sit down and re-measure SpO₂",
    "Check cabin CO₂ and ventilation",
    "Escalate immediately if it drops below 90%",
  ],
  restingHr: [
    "Rest for 5 minutes and re-measure",
    "Compare with today's activity and fluid intake",
    "Flag to the CMO if it stays above 100 bpm at rest",
  ],
  glucose: [
    "Re-check glucose and log the meal",
    "If below 70 mg/dL, take 15 g of fast carbohydrates",
    "Follow the metabolic protocol for your mission",
  ],
  sleep: [
    "Protect a 7.5 h sleep window tonight",
    "Reduce non-critical workload today",
    "Log caffeine, light exposure and shift changes",
  ],
  mood: [
    "Schedule a private check-in with the CMO",
    "Use the crew support channel today",
    "Protect sleep and exercise as countermeasures",
  ],
  cabinCo2: [
    "Inspect the CO₂ scrubber and ventilation",
    "Move to a better-ventilated module",
    "Notify the crew — this is an environment problem",
  ],
  radiation: [
    "Move to the radiation shelter",
    "Follow the SPE checklist",
    "Log the dose and postpone EVA",
  ],
  bone: [
    "Complete today's resistive exercise target",
    "Log the ARED session",
    "Review nutrition, vitamin D and protein intake",
  ],
  "early-infection": [
    "Measure temperature every 4 h",
    "Rest in crew quarters; mask in common areas",
    "Prepare the flight-surgeon packet",
  ],
  "cabin-air": [
    "Inspect the CO₂ scrubber and ventilation",
    "Move to a better-ventilated module",
    "Do not treat the astronaut as the source of the problem",
  ],
  "solar-event": [
    "Move to the radiation shelter now",
    "Follow the SPE checklist",
    "Log the dose and postpone EVA",
  ],
};
