import { computeBaseline, round, sigma } from "./baseline";
import { escalate } from "./escalation";
import { maxLevel } from "./levels";
import { ACTIONS, RULES, type RuleMeta, THRESHOLDS } from "./rules";
import {
  type Assessment,
  type CoachFact,
  type DailyReading,
  type Estimates,
  type Evaluation,
  LEVEL_ORDER,
  type Level,
  MISSION_LATENCY_SECONDS,
  type Mission,
  type Scenario,
  type SystemId,
} from "./types";

function findAtOrBefore<T extends { day: number }>(items: T[], day: number): T | undefined {
  let best: T | undefined;
  for (const item of items) {
    if (item.day <= day && (!best || item.day > best.day)) best = item;
  }
  return best;
}

function consecutive(
  readings: DailyReading[],
  day: number,
  predicate: (r: DailyReading) => boolean,
): number {
  const sorted = readings
    .filter((r) => r.day <= day)
    .slice()
    .sort((a, b) => b.day - a.day);
  let count = 0;
  for (const reading of sorted) {
    if (predicate(reading)) count++;
    else break;
  }
  return count;
}

function windowAvg(
  readings: DailyReading[],
  day: number,
  days: number,
  pick: (r: DailyReading) => number | undefined,
): number | undefined {
  const values: number[] = [];
  for (const reading of readings) {
    if (reading.day <= day && reading.day > day - days) {
      const value = pick(reading);
      if (typeof value === "number") values.push(value);
    }
  }
  if (values.length === 0) return undefined;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function formatLatency(seconds: number): string {
  if (seconds < 1) return "0 s";
  if (seconds < 60) return `${seconds.toFixed(1)} s`;
  return `${Math.round(seconds / 60)} min`;
}

export function evaluate(scenario: Scenario, day: number, mission: Mission): Evaluation {
  const baseline = computeBaseline(scenario.readings);
  const reading = findAtOrBefore(scenario.readings, day);
  const env = findAtOrBefore(scenario.env, day);
  const bySystem: Record<SystemId, Level> = {
    cardio: "NOMINAL",
    msk: "NOMINAL",
    immune: "NOMINAL",
    metabolic: "NOMINAL",
    respiratory: "NOMINAL",
    behavioral: "NOMINAL",
    radiation: "NOMINAL",
  };
  const assessments: Assessment[] = [];

  const raise = (system: SystemId, level: Level) => {
    bySystem[system] = maxLevel(bySystem[system], level);
  };

  const add = (
    ruleId: string,
    level: Level,
    because: string[],
    actions?: string[],
    meta?: RuleMeta,
  ) => {
    const rule = meta ?? RULES[ruleId];
    if (!rule) return;
    raise(rule.system, level);
    assessments.push({
      level,
      system: rule.system,
      ruleId,
      title: rule.title,
      because,
      actions: actions ?? ACTIONS[ruleId] ?? [],
      escalation: escalate(level, mission),
      source: rule.source,
    });
  };

  if (!reading) {
    return {
      scenarioId: scenario.id,
      day,
      mission,
      bySystem,
      assessments,
      estimates: {
        boneLossPct: { min: 0, max: 0, months: 0 },
        radiationPct: 0,
        radiationDoseMSv: scenario.priorDoseMSv,
        radiationBudgetMSv: scenario.exposureBudgetMSv,
        exerciseAdherencePct: 0,
      },
      facts: [
        {
          id: "no-reading",
          label: "No check-in",
          value: "There is no reading at or before this mission day.",
        },
      ],
      latencySeconds: MISSION_LATENCY_SECONDS[mission],
    };
  }

  // 1. Simple signals.
  const temp = reading.tempC;
  const tempSigma = sigma(temp, baseline.tempC);
  if (temp >= THRESHOLDS.tempC.urgent) {
    add("temperature", "URGENT", [
      `Temperature ${temp.toFixed(1)} °C (urgent ≥ ${THRESHOLDS.tempC.urgent} °C)`,
    ]);
  } else if (temp >= THRESHOLDS.tempC.concern) {
    add("temperature", "CONCERN", [
      `Temperature ${temp.toFixed(1)} °C (concern ≥ ${THRESHOLDS.tempC.concern} °C)`,
    ]);
  } else if (temp >= THRESHOLDS.tempC.watch || tempSigma >= 2) {
    const because = [`Temperature ${temp.toFixed(1)} °C (watch ≥ ${THRESHOLDS.tempC.watch} °C)`];
    if (tempSigma >= 2) because.push(`${tempSigma.toFixed(1)}σ above your pre-flight baseline`);
    add("temperature", "WATCH", because);
  }

  if (reading.spo2 < THRESHOLDS.spo2.urgent) {
    add("spo2", "URGENT", [`SpO₂ ${reading.spo2}% (urgent < ${THRESHOLDS.spo2.urgent}%)`]);
  } else if (reading.spo2 < THRESHOLDS.spo2.concern) {
    add("spo2", "CONCERN", [`SpO₂ ${reading.spo2}% (concern < ${THRESHOLDS.spo2.concern}%)`]);
  } else if (reading.spo2 < THRESHOLDS.spo2.watch) {
    add("spo2", "WATCH", [`SpO₂ ${reading.spo2}% (watch < ${THRESHOLDS.spo2.watch}%)`]);
  }

  const hr = reading.restingHr;
  const hrAvg2 = windowAvg(scenario.readings, day, 2, (r) => r.restingHr);
  if (hr > THRESHOLDS.restingHr.urgent) {
    add("restingHr", "URGENT", [
      `Resting HR ${hr} bpm (urgent > ${THRESHOLDS.restingHr.urgent} bpm)`,
    ]);
  } else if (hr > THRESHOLDS.restingHr.concern || (hrAvg2 ?? 0) > THRESHOLDS.restingHr.concern) {
    add("restingHr", "CONCERN", [
      `Resting HR ${hr} bpm (concern > ${THRESHOLDS.restingHr.concern} bpm)`,
    ]);
  } else if ((hrAvg2 ?? 0) > baseline.restingHr.mean + THRESHOLDS.restingHr.baselineDelta) {
    add("restingHr", "WATCH", [
      `Resting HR ${Math.round(hrAvg2 ?? hr)} bpm over 2 days`,
      `+${Math.round((hrAvg2 ?? hr) - baseline.restingHr.mean)} bpm vs. your baseline (${Math.round(baseline.restingHr.mean)} bpm)`,
    ]);
  }

  const glucose = reading.glucoseMgDl;
  if (glucose < THRESHOLDS.glucoseMgDl.urgentLow) {
    add("glucose", "URGENT", [
      `Glucose ${glucose} mg/dL (urgent < ${THRESHOLDS.glucoseMgDl.urgentLow} mg/dL)`,
    ]);
  } else if (
    glucose > THRESHOLDS.glucoseMgDl.concernHigh ||
    glucose < THRESHOLDS.glucoseMgDl.concernLow
  ) {
    add("glucose", "CONCERN", [
      `Glucose ${glucose} mg/dL (concern > ${THRESHOLDS.glucoseMgDl.concernHigh} or < ${THRESHOLDS.glucoseMgDl.concernLow} mg/dL)`,
    ]);
  } else if (
    glucose > THRESHOLDS.glucoseMgDl.watchHigh ||
    glucose < THRESHOLDS.glucoseMgDl.watchLow
  ) {
    add("glucose", "WATCH", [
      `Glucose ${glucose} mg/dL (watch > ${THRESHOLDS.glucoseMgDl.watchHigh} or < ${THRESHOLDS.glucoseMgDl.watchLow} mg/dL)`,
    ]);
  }

  const shortNights = consecutive(
    scenario.readings,
    day,
    (r) => r.sleepHours < THRESHOLDS.sleepHours.low,
  );
  if (shortNights >= THRESHOLDS.sleepHours.concernNights) {
    add("sleep", "CONCERN", [
      `Sleep below ${THRESHOLDS.sleepHours.low} h for ${shortNights} nights`,
      `Last night: ${reading.sleepHours.toFixed(1)} h`,
    ]);
  } else if (shortNights >= THRESHOLDS.sleepHours.watchNights) {
    add("sleep", "WATCH", [`Sleep below ${THRESHOLDS.sleepHours.low} h for ${shortNights} nights`]);
  }

  const lowMoodDays = consecutive(scenario.readings, day, (r) => r.mood <= THRESHOLDS.mood.low);
  if (lowMoodDays >= THRESHOLDS.mood.concernDays) {
    add("mood", "CONCERN", [`Mood at or below ${THRESHOLDS.mood.low}/5 for ${lowMoodDays} days`]);
  } else if (lowMoodDays >= THRESHOLDS.mood.watchDays) {
    add("mood", "WATCH", [`Mood at or below ${THRESHOLDS.mood.low}/5 for ${lowMoodDays} days`]);
  }

  // 2. Environment and radiation.
  const co2 = env?.cabinCo2MmHg;
  if (typeof co2 === "number" && co2 > THRESHOLDS.cabinCo2MmHg.watch) {
    if (reading.spo2 < THRESHOLDS.spo2.watch) {
      add("cabin-air", "WATCH", [
        `Cabin CO₂ ${co2.toFixed(1)} mmHg (limit ${THRESHOLDS.cabinCo2MmHg.watch})`,
        `SpO₂ ${reading.spo2}% in the same period`,
        "This is the environment, not the astronaut",
      ]);
    } else {
      add("cabinCo2", "WATCH", [
        `Cabin CO₂ ${co2.toFixed(1)} mmHg (limit ${THRESHOLDS.cabinCo2MmHg.watch})`,
      ]);
    }
  }

  const dose =
    scenario.priorDoseMSv +
    scenario.env.filter((e) => e.day <= day).reduce((sum, e) => sum + e.doseMSv, 0);
  const radiationPct = (dose / scenario.exposureBudgetMSv) * 100;
  if (env?.spe) {
    add("solar-event", "URGENT", [
      `Solar particle event active on day ${env.day}`,
      `Dose ${round(dose, 1)} mSv (${Math.round(radiationPct)}% of the ${scenario.exposureBudgetMSv} mSv budget)`,
    ]);
  } else if (radiationPct >= THRESHOLDS.radiationPct.concern) {
    add("radiation", "CONCERN", [
      `Dose ${round(dose, 1)} mSv = ${Math.round(radiationPct)}% of the ${scenario.exposureBudgetMSv} mSv budget`,
    ]);
  } else if (radiationPct >= THRESHOLDS.radiationPct.watch) {
    add("radiation", "WATCH", [
      `Dose ${round(dose, 1)} mSv = ${Math.round(radiationPct)}% of the ${scenario.exposureBudgetMSv} mSv budget`,
    ]);
  }

  // 3. Bone: the countermeasure we can measure in flight.
  const exerciseAvg = windowAvg(
    scenario.readings,
    day,
    THRESHOLDS.bone.adherenceWindowDays,
    (r) => r.resistiveExerciseMin,
  );
  const exerciseAdherencePct =
    exerciseAvg === undefined
      ? 0
      : Math.min(200, (exerciseAvg / scenario.exerciseTargetMinPerDay) * 100);
  if (day > THRESHOLDS.bone.missionDaysWatch) {
    if (day > THRESHOLDS.bone.missionDaysConcern) {
      add("bone", "CONCERN", [
        `Mission day ${day} (${(day / 30.44).toFixed(1)} months in microgravity)`,
        `Resistive exercise ${Math.round(exerciseAdherencePct)}% of target over the last 14 days`,
      ]);
    } else if ((exerciseAvg ?? 0) < scenario.exerciseTargetMinPerDay * 0.9) {
      add("bone", "WATCH", [
        `Resistive exercise ${Math.round(exerciseAdherencePct)}% of target over the last 14 days`,
        `Target: ${scenario.exerciseTargetMinPerDay} min/day`,
      ]);
    }
  }

  // 4. Correlations: the pattern matters more than any single number.
  const hrAboveBaseline =
    (hrAvg2 ?? hr) > baseline.restingHr.mean + THRESHOLDS.restingHr.baselineDelta;
  if (
    shortNights >= THRESHOLDS.sleepHours.concernNights &&
    temp >= THRESHOLDS.tempC.watch &&
    hrAboveBaseline
  ) {
    add("early-infection", "CONCERN", [
      `Sleep below ${THRESHOLDS.sleepHours.low} h for ${shortNights} nights`,
      `Temperature ${temp.toFixed(1)} °C`,
      `Resting HR +${Math.round((hrAvg2 ?? hr) - baseline.restingHr.mean)} bpm vs. baseline`,
    ]);
  }

  const estimates: Estimates = {
    boneLossPct: {
      min: round((day / 30.44) * 1, 1),
      max: round((day / 30.44) * 1.5, 1),
      months: round(day / 30.44, 1),
    },
    radiationPct: round(radiationPct, 0),
    radiationDoseMSv: round(dose, 1),
    radiationBudgetMSv: scenario.exposureBudgetMSv,
    exerciseAdherencePct: round(exerciseAdherencePct, 0),
  };

  assessments.sort((a, b) => LEVEL_ORDER[b.level] - LEVEL_ORDER[a.level]);

  const facts: CoachFact[] = assessments.map((a) => ({
    id: a.ruleId,
    label: a.title,
    value: a.because.join(" · "),
    source: a.source[0]?.label,
  }));
  facts.push({
    id: "mission",
    label: "Mission and latency",
    value: `${mission} · ${formatLatency(MISSION_LATENCY_SECONDS[mission])} one-way`,
  });
  facts.push({
    id: "bone-estimate",
    label: "Estimated bone loss",
    value: `${estimates.boneLossPct.min}–${estimates.boneLossPct.max}% over ${estimates.boneLossPct.months} months (NASA HRP estimate)`,
    source: "NASA HRP — Bone Fracture Evidence Report",
  });
  facts.push({
    id: "radiation-budget",
    label: "Radiation budget",
    value: `${estimates.radiationDoseMSv} mSv = ${estimates.radiationPct}% of the ${estimates.radiationBudgetMSv} mSv mission budget`,
    source: "NASA-STD-3001 Vol. 1 career limit · deep-space limits still open",
  });
  facts.push({
    id: "exercise",
    label: "Exercise adherence",
    value: `${estimates.exerciseAdherencePct}% of the resistive-exercise target (last 14 days)`,
    source: "NASA HRP — Bone Fracture Evidence Report",
  });
  if (assessments.length === 0) {
    facts.push({
      id: "all-nominal",
      label: "Overall status",
      value: "All six systems and the radiation halo are nominal today.",
    });
  }

  return {
    scenarioId: scenario.id,
    day,
    mission,
    bySystem,
    assessments,
    estimates,
    facts,
    latencySeconds: MISSION_LATENCY_SECONDS[mission],
  };
}
