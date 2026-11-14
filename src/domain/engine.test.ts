import { describe, expect, it } from "vitest";
import { scenarios } from "../data/scenarios";
import { computeBaseline } from "./baseline";
import { evaluate } from "./evaluate";
import { SOURCES } from "./rules";
import type { DailyReading, Scenario } from "./types";

function scenario(id: string): Scenario {
  const found = scenarios.find((s) => s.id === id);
  if (!found) throw new Error(`missing scenario ${id}`);
  return found;
}

function lastDay(s: Scenario): number {
  return s.readings[s.readings.length - 1]!.day;
}

function withReadingPatches(
  id: string,
  patches: Array<[day: number, patch: Partial<DailyReading>]>,
): Scenario {
  const base = scenario(id);
  const byDay = new Map(patches);
  return {
    ...base,
    readings: base.readings.map((reading) => {
      const patch = byDay.get(reading.day);
      return patch ? { ...reading, ...patch } : reading;
    }),
  };
}

describe("scenario data", () => {
  it("keeps 14 pre-flight days and 30 mission days", () => {
    for (const s of scenarios) {
      expect(s.readings.filter((r) => r.day < 0)).toHaveLength(14);
      expect(s.readings.filter((r) => r.day >= s.firstMissionDay)).toHaveLength(30);
      expect(s.env).toHaveLength(30);
    }
  });

  it("has a deterministic target day for the demo", () => {
    for (const s of scenarios) expect(lastDay(s)).toBe(148);
  });

  it("generates a rising resting heart rate for early infection", () => {
    const s = scenario("early-infection");
    const affected = s.readings.filter((r) => r.day >= 144);
    expect(affected.at(-1)!.restingHr).toBeGreaterThan(affected[0]!.restingHr);
  });
});

describe("baseline", () => {
  it("uses the pre-flight days", () => {
    const s = scenario("nominal");
    const baseline = computeBaseline(s.readings);
    expect(baseline.n).toBe(14);
    expect(baseline.sleepHours.mean).toBeGreaterThan(7);
    expect(baseline.restingHr.mean).toBeLessThan(70);
  });
});

describe("evaluate", () => {
  it("keeps a nominal day green", () => {
    const s = scenario("nominal");
    const result = evaluate(s, lastDay(s), "MARS");
    expect(result.assessments).toEqual([]);
    expect(Object.values(result.bySystem).every((level) => level === "NOMINAL")).toBe(true);
    expect(result.estimates.radiationPct).toBeLessThan(50);
  });

  it("correlates sleep debt, fever and heart rate into early infection", () => {
    const s = scenario("early-infection");
    const result = evaluate(s, lastDay(s), "MARS");
    const infection = result.assessments.find((a) => a.ruleId === "early-infection");
    expect(infection?.level).toBe("CONCERN");
    expect(result.bySystem.immune).toBe("CONCERN");
    expect(result.bySystem.behavioral).toBe("CONCERN");
    expect(infection?.because.join(" ")).toContain("Temperature 37.9");
    expect(infection?.escalation.now).toBe("Start the local protocol now");
  });

  it("ranks a correlation above single-signal rules at the same level", () => {
    const s = scenario("early-infection");
    const result = evaluate(s, lastDay(s), "MARS");
    expect(result.assessments[0]?.ruleId).toBe("early-infection");
  });

  it("explains a sigma-only temperature WATCH without the absolute cutoff", () => {
    const base = scenario("nominal");
    const s = withReadingPatches("nominal", [[lastDay(base), { tempC: 37.0 }]]);
    const result = evaluate(s, lastDay(s), "MARS");
    const temperature = result.assessments.find((a) => a.ruleId === "temperature");
    const because = temperature?.because.join(" ") ?? "";

    expect(temperature?.level).toBe("WATCH");
    expect(because).toContain("σ above your pre-flight baseline");
    expect(because).not.toContain("watch ≥");
  });

  it("explains a two-day average heart-rate CONCERN with the average", () => {
    const base = scenario("nominal");
    const last = lastDay(base);
    const s = withReadingPatches("nominal", [
      [last - 1, { restingHr: 110 }],
      [last, { restingHr: 100 }],
    ]);
    const result = evaluate(s, last, "MARS");
    const heartRate = result.assessments.find((a) => a.ruleId === "restingHr");
    const because = heartRate?.because.join(" ") ?? "";

    expect(heartRate?.level).toBe("CONCERN");
    expect(because).toContain("105 bpm over 2 days");
    expect(because).not.toContain("Resting HR 100 bpm");
  });

  it("escalates the same finding differently on the ISS", () => {
    const s = scenario("early-infection");
    const result = evaluate(s, lastDay(s), "ISS");
    const infection = result.assessments.find((a) => a.ruleId === "early-infection");
    expect(infection?.escalation.now).toBe("Flight surgeon now");
  });

  it("separates cabin air from the astronaut", () => {
    const s = scenario("cabin-co2");
    const result = evaluate(s, lastDay(s), "MARS");
    const cabin = result.assessments.find((a) => a.ruleId === "cabin-air");
    expect(cabin?.level).toBe("WATCH");
    expect(result.bySystem.respiratory).toBe("WATCH");
    expect(cabin?.because.join(" ")).toContain("environment");
  });

  it("turns the halo urgent during a solar particle event", () => {
    const s = scenario("solar-event");
    const result = evaluate(s, lastDay(s), "MARS");
    const event = result.assessments.find((a) => a.ruleId === "solar-event");
    expect(event?.level).toBe("URGENT");
    expect(result.bySystem.radiation).toBe("URGENT");
    expect(event?.because.join(" ")).toContain("Solar particle event");
  });

  it("never emits duplicate rule ids", () => {
    for (const s of scenarios) {
      const result = evaluate(s, lastDay(s), "MARS");
      const ids = result.assessments.map((a) => a.ruleId);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("estimates bone loss from HRP evidence instead of pretending to measure it", () => {
    const s = scenario("nominal");
    const result = evaluate(s, lastDay(s), "MARS");
    expect(result.estimates.boneLossPct.min).toBeCloseTo(4.9, 1);
    expect(result.estimates.boneLossPct.max).toBeCloseTo(7.3, 1);
    expect(result.estimates.boneLossPct.months).toBeCloseTo(4.9, 1);
  });

  it("exposes machine-readable facts for the coach", () => {
    const s = scenario("early-infection");
    const result = evaluate(s, lastDay(s), "MARS");
    const ids = result.facts.map((f) => f.id);
    expect(ids).toContain("early-infection");
    expect(ids).toContain("mission");
    expect(ids).toContain("bone-estimate");
    expect(result.facts.find((f) => f.id === "mission")?.value).toContain("14 min");
  });

  it("keeps bone quiet with good adherence beyond 180 days", () => {
    const result = evaluate(scenario("nominal"), 190, "MARS");
    expect(result.assessments.some((a) => a.ruleId === "bone")).toBe(false);
  });

  it("raises the bone rule only when adherence is below target", () => {
    const infection = evaluate(scenario("early-infection"), 148, "MARS");
    expect(infection.assessments.find((a) => a.ruleId === "bone")?.level).toBe("WATCH");

    const nominalLong = evaluate(scenario("nominal"), 190, "MARS");
    expect(nominalLong.assessments.some((a) => a.ruleId === "bone")).toBe(false);

    const infectionLong = evaluate(scenario("early-infection"), 190, "MARS");
    expect(infectionLong.assessments.find((a) => a.ruleId === "bone")?.level).toBe("CONCERN");
  });

  it("treats the temperature boundaries as WATCH, CONCERN and URGENT", () => {
    const base = scenario("nominal");
    const day = lastDay(base);

    const watch = evaluate(withReadingPatches("nominal", [[day, { tempC: 37.5 }]]), day, "MARS");
    const watchRule = watch.assessments.find((a) => a.ruleId === "temperature");
    expect(watchRule?.level).toBe("WATCH");
    expect(watchRule?.because.join(" ")).toContain("watch ≥ 37.5");

    const concern = evaluate(withReadingPatches("nominal", [[day, { tempC: 38 }]]), day, "MARS");
    expect(concern.assessments.find((a) => a.ruleId === "temperature")?.level).toBe("CONCERN");

    const urgent = evaluate(withReadingPatches("nominal", [[day, { tempC: 39.5 }]]), day, "MARS");
    expect(urgent.assessments.find((a) => a.ruleId === "temperature")?.level).toBe("URGENT");
  });

  it("keeps SpO₂ 95 nominal and 94 as WATCH", () => {
    const base = scenario("nominal");
    const day = lastDay(base);

    const nominal = evaluate(withReadingPatches("nominal", [[day, { spo2: 95 }]]), day, "MARS");
    expect(nominal.assessments.some((a) => a.ruleId === "spo2")).toBe(false);

    const watch = evaluate(withReadingPatches("nominal", [[day, { spo2: 94 }]]), day, "MARS");
    expect(watch.assessments.find((a) => a.ruleId === "spo2")?.level).toBe("WATCH");
  });

  it("keeps glucose 70 and 54 as the exact lower boundaries", () => {
    const base = scenario("nominal");
    const day = lastDay(base);

    const normal = evaluate(
      withReadingPatches("nominal", [[day, { glucoseMgDl: 70 }]]),
      day,
      "MARS",
    );
    expect(normal.assessments.some((a) => a.ruleId === "glucose")).toBe(false);

    const highNormal = evaluate(
      withReadingPatches("nominal", [[day, { glucoseMgDl: 140 }]]),
      day,
      "MARS",
    );
    expect(highNormal.assessments.some((a) => a.ruleId === "glucose")).toBe(false);

    const highWatch = evaluate(
      withReadingPatches("nominal", [[day, { glucoseMgDl: 141 }]]),
      day,
      "MARS",
    );
    expect(highWatch.assessments.find((a) => a.ruleId === "glucose")?.level).toBe("WATCH");

    const watch = evaluate(
      withReadingPatches("nominal", [[day, { glucoseMgDl: 54 }]]),
      day,
      "MARS",
    );
    expect(watch.assessments.find((a) => a.ruleId === "glucose")?.level).toBe("WATCH");

    const concern = evaluate(
      withReadingPatches("nominal", [[day, { glucoseMgDl: 53 }]]),
      day,
      "MARS",
    );
    expect(concern.assessments.find((a) => a.ruleId === "glucose")?.level).toBe("CONCERN");

    const urgent = evaluate(
      withReadingPatches("nominal", [[day, { glucoseMgDl: 39 }]]),
      day,
      "MARS",
    );
    expect(urgent.assessments.find((a) => a.ruleId === "glucose")?.level).toBe("URGENT");
  });

  it("reports the radiation source as verified and glucose as still pending", () => {
    expect(SOURCES.radiation.verified).toBe(true);
    expect(SOURCES.radiation.label).not.toContain("TODO");
    expect(SOURCES.ada.verified).toBe(false);
    expect(Object.values(SOURCES).filter((source) => !source.verified)).toHaveLength(6);
  });
});
