import { describe, expect, it } from "vitest";
import { PILL_DEMO, pillReserveSeries } from "./reproductive";

describe("pillReserveSeries", () => {
  it("is deterministic and ends on the selected day", () => {
    const points = pillReserveSeries(148);
    expect(points).toEqual(pillReserveSeries(148));
    expect(points).toHaveLength(30);
    expect(points.at(-1)?.day).toBe(148);
  });

  it("falls short of the mission only after the stability check", () => {
    const before = pillReserveSeries(PILL_DEMO.setAside.day - 1).at(-1);
    const after = pillReserveSeries(148).at(-1);
    expect(before && before.reserve - before.daysLeft).toBe(0);
    expect(after && after.reserve - after.daysLeft).toBe(-PILL_DEMO.setAside.pills);
  });
});
