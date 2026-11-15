import { describe, expect, it } from "vitest";
import { BLEEDING_DAYS, REPRODUCTIVE_PREVIEW, reproductiveSeries } from "./reproductive";

describe("reproductiveSeries", () => {
  it("is deterministic and ends on the selected day", () => {
    const points = reproductiveSeries(148);
    expect(points).toEqual(reproductiveSeries(148));
    expect(points).toHaveLength(30);
    expect(points.at(-1)?.day).toBe(148);
  });

  it("starts at her ground level and reaches the day-148 demo values", () => {
    const first = reproductiveSeries(148)[0];
    const last = reproductiveSeries(148).at(-1);
    expect(first).toMatchObject({ day: 119, drug: 100, e2: 100, lh: 100 });
    expect(last).toMatchObject({ drug: 82, stability: 88, e2: 130, lh: 120 });
  });

  it("marks only the demo bleeding days", () => {
    const bleeding = reproductiveSeries(148).filter((point) => point.bleeding);
    expect(bleeding.map((point) => point.day)).toEqual(BLEEDING_DAYS);
  });
});

describe("REPRODUCTIVE_PREVIEW", () => {
  it("lists the twelve agreed parameters", () => {
    const labels = REPRODUCTIVE_PREVIEW.groups.flatMap((group) => group.items);
    expect(labels).toHaveLength(12);
    expect(labels.every((item) => item.priority)).toBe(true);
  });
});
