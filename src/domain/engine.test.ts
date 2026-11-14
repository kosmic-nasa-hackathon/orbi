import { describe, expect, it } from "vitest";
import { scenarios } from "../data/scenarios";
import { computeBaseline } from "./baseline";
import { evaluate } from "./evaluate";
import type { Scenario } from "./types";

function scenario(id: string): Scenario {
  const found = scenarios.find((s) => s.id === id);
  if (!found) throw new Error(`missing scenario ${id}`);
  return found;
}

function lastDay(s: Scenario): number {
  return s.readings[s.readings.length - 1]!.day;
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

  it("raises the bone rule only when adherence is below target", () => {
    const infection = evaluate(scenario("early-infection"), 148, "MARS");
    expect(infection.assessments.find((a) => a.ruleId === "bone")?.level).toBe("WATCH");

    const nominalLong = evaluate(scenario("nominal"), 190, "MARS");
    expect(nominalLong.assessments.some((a) => a.ruleId === "bone")).toBe(false);

    const infectionLong = evaluate(scenario("early-infection"), 190, "MARS");
    expect(infectionLong.assessments.find((a) => a.ruleId === "bone")?.level).toBe("CONCERN");
  });
});
