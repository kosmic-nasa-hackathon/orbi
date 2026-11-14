import { describe, expect, it } from "vitest";
import { getScenario } from "../data/scenarios";
import { computeBaseline } from "./baseline";
import { THRESHOLDS } from "./rules";
import { buildSeries, SYSTEM_VITAL } from "./series";

const scenario = getScenario("early-infection");

describe("buildSeries", () => {
  it("keeps every training day and the last 30 mission days up to the selected day", () => {
    const series = buildSeries(scenario, "tempC", 148);
    const training = series.points.filter((point) => point.phase === "training");
    const mission = series.points.filter((point) => point.phase === "mission");
    expect(training.length).toBe(scenario.readings.filter((r) => r.day < 0).length);
    expect(training.every((point) => point.day < 0)).toBe(true);
    expect(mission).toHaveLength(30);
    expect(mission.at(-1)?.day).toBe(148);
    expect(mission[0]?.day).toBe(119);
  });

  it("stops at the selected day", () => {
    const mission = buildSeries(scenario, "tempC", 130).points.filter((p) => p.phase === "mission");
    expect(mission.at(-1)?.day).toBe(130);
    expect(mission.every((point) => point.day <= 130)).toBe(true);
  });

  it("uses the ground baseline from computeBaseline() for the band", () => {
    const { mean, sd } = computeBaseline(scenario.readings).restingHr;
    const series = buildSeries(scenario, "restingHr", 148, { sigmas: 2 });
    expect(series.normal.mean).toBe(mean);
    expect(series.normal.low).toBeCloseTo(mean - 2 * sd);
    expect(series.normal.high).toBeCloseTo(mean + 2 * sd);
  });

  it("flags readings outside the band without assigning a level", () => {
    const series = buildSeries(scenario, "tempC", 148);
    for (const point of series.points) {
      expect(point.outsideNormal).toBe(
        point.value < series.normal.low || point.value > series.normal.high,
      );
    }
    expect(series.points.at(-1)?.outsideNormal).toBe(true);
  });

  it("draws absolute thresholds straight from rules.ts", () => {
    expect(buildSeries(scenario, "tempC", 148).references.map((r) => r.value)).toEqual([
      THRESHOLDS.tempC.watch,
      THRESHOLDS.tempC.concern,
    ]);
    expect(buildSeries(scenario, "sleepHours", 148).references[0]?.value).toBe(
      THRESHOLDS.sleepHours.low,
    );
  });

  it("maps the five charted systems to a vital", () => {
    expect(Object.keys(SYSTEM_VITAL).sort()).toEqual(
      ["behavioral", "cardio", "immune", "metabolic", "respiratory"].sort(),
    );
  });
});
