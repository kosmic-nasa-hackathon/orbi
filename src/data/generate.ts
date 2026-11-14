import type { DailyReading, EnvReading, Scenario } from "../domain/types";
import { clamp, gaussian, mulberry32, type Rng, round } from "./rng";

const PREFLIGHT_DAYS = 14;
const MISSION_DAYS = 30;
const FIRST_MISSION_DAY = 119;

interface Profile {
  sleep: number;
  temp: number;
  hr: number;
  spo2: number;
  glucose: number;
  mood: 1 | 2 | 3 | 4 | 5;
  fatigue: 1 | 2 | 3 | 4 | 5;
  exercise: number;
}

const BASE: Profile = {
  sleep: 7.8,
  temp: 36.6,
  hr: 58,
  spo2: 98,
  glucose: 92,
  mood: 4,
  fatigue: 2,
  exercise: 31,
};

const SOURCES = {
  sleepHours: "wearable",
  mood: "manual",
  fatigue: "manual",
  restingHr: "wearable",
  tempC: "wearable",
  spo2: "wearable",
  glucoseMgDl: "manual",
  resistiveExerciseMin: "device",
} as const;

function clampMood(value: number): 1 | 2 | 3 | 4 | 5 {
  return clamp(Math.round(value), 1, 5) as 1 | 2 | 3 | 4 | 5;
}

function baseReading(rng: Rng, day: number): DailyReading {
  return {
    day,
    sleepHours: round(clamp(gaussian(rng, BASE.sleep, 0.45), 4.2, 9.6), 1),
    mood: clampMood(gaussian(rng, BASE.mood, 0.35)),
    fatigue: clampMood(gaussian(rng, BASE.fatigue, 0.45)),
    restingHr: Math.round(clamp(gaussian(rng, BASE.hr, 3.2), 48, 82)),
    tempC: round(clamp(gaussian(rng, BASE.temp, 0.12), 36.1, 37.0), 1),
    spo2: Math.round(clamp(gaussian(rng, BASE.spo2, 0.5), 96, 100)),
    glucoseMgDl: Math.round(clamp(gaussian(rng, BASE.glucose, 7), 72, 132)),
    resistiveExerciseMin: Math.round(clamp(gaussian(rng, BASE.exercise, 4), 0, 55)),
    sources: { ...SOURCES },
  };
}

function preflight(seed: number): DailyReading[] {
  const rng = mulberry32(seed);
  const readings: DailyReading[] = [];
  for (let i = PREFLIGHT_DAYS; i >= 1; i--) readings.push(baseReading(rng, -i));
  return readings;
}

type Kind = "nominal" | "early-infection" | "cabin-co2" | "solar-event";

function missionReadings(kind: Kind, seed: number): DailyReading[] {
  const rng = mulberry32(seed);
  const readings: DailyReading[] = [];
  for (let index = 0; index < MISSION_DAYS; index++) {
    const day = FIRST_MISSION_DAY + index;
    const reading = baseReading(rng, day);
    const t = index - (MISSION_DAYS - 1);

    if (kind === "early-infection" && t >= -4) {
      reading.sleepHours = round(clamp(gaussian(rng, 4.9, 0.3), 4.2, 5.6), 1);
      reading.tempC = round(clamp(gaussian(rng, 37.5 + ((t + 4) / 4) * 0.4, 0.1), 37.4, 38.0), 1);
      reading.restingHr = Math.round(clamp(gaussian(rng, 73 + -t, 2), 70, 82));
      reading.mood = clampMood(2);
      reading.fatigue = clampMood(4.6);
      reading.resistiveExerciseMin = Math.round(clamp(gaussian(rng, 17, 3), 8, 25));
    }

    if (kind === "cabin-co2" && t >= -4) {
      reading.spo2 = Math.round(clamp(gaussian(rng, 94, 0.4), 93, 95));
      reading.fatigue = clampMood(3.2);
      reading.resistiveExerciseMin = Math.round(clamp(gaussian(rng, 26, 3), 18, 32));
    }

    if (kind === "solar-event" && t >= -1) {
      reading.fatigue = clampMood(3.4);
    }

    readings.push(reading);
  }
  return readings;
}

function envReadings(kind: Kind, seed: number): EnvReading[] {
  const rng = mulberry32(seed + 7);
  const env: EnvReading[] = [];
  for (let index = 0; index < MISSION_DAYS; index++) {
    const day = FIRST_MISSION_DAY + index;
    const t = index - (MISSION_DAYS - 1);
    const co2 =
      kind === "cabin-co2" && t >= -4 ? gaussian(rng, 5.0, 0.25) : gaussian(rng, 2.4, 0.2);
    const dose = kind === "solar-event" && t >= -1 ? gaussian(rng, 22, 4) : gaussian(rng, 0.8, 0.1);
    env.push({
      day,
      cabinCo2MmHg: round(clamp(co2, 1.8, 6.2), 2),
      doseMSv: round(clamp(dose, 0.4, 40), 2),
      spe: kind === "solar-event" && t >= -1,
    });
  }
  return env;
}

const META: Record<Kind, Omit<Scenario, "readings" | "env">> = {
  nominal: {
    id: "nominal",
    title: "Nominal",
    description: "Everything inside the personal baseline. The body map stays green.",
    firstMissionDay: FIRST_MISSION_DAY,
    exposureBudgetMSv: 400,
    priorDoseMSv: 40,
    exerciseTargetMinPerDay: 30,
  },
  "early-infection": {
    id: "early-infection",
    title: "Early infection",
    description: "Sleep debt, a low-grade fever and a rising resting heart rate converge.",
    firstMissionDay: FIRST_MISSION_DAY,
    exposureBudgetMSv: 400,
    priorDoseMSv: 80,
    exerciseTargetMinPerDay: 30,
  },
  "cabin-co2": {
    id: "cabin-co2",
    title: "Cabin CO₂",
    description: "SpO₂ falls while cabin CO₂ rises: the environment, not the astronaut.",
    firstMissionDay: FIRST_MISSION_DAY,
    exposureBudgetMSv: 400,
    priorDoseMSv: 80,
    exerciseTargetMinPerDay: 30,
  },
  "solar-event": {
    id: "solar-event",
    title: "Solar particle event",
    description: "An on-board SPE warning pushes the radiation halo to urgent.",
    firstMissionDay: FIRST_MISSION_DAY,
    exposureBudgetMSv: 400,
    priorDoseMSv: 300,
    exerciseTargetMinPerDay: 30,
  },
};

export function generateScenarios(): Scenario[] {
  return (Object.keys(META) as Kind[]).map((kind, index) => {
    const seed = 2026 + index * 101;
    return {
      ...META[kind],
      readings: [...preflight(seed + 13), ...missionReadings(kind, seed)],
      env: envReadings(kind, seed),
    };
  });
}
