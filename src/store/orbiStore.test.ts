import { beforeEach, describe, expect, it } from "vitest";
import { getScenario, scenarios } from "../data/scenarios";
import { DEMO_DAY, type ManualEntry, useOrbiStore, withCheckIn } from "./orbiStore";

const store = useOrbiStore;

describe("orbiStore", () => {
  beforeEach(() => store.getState().reset());

  it("opens the demo on day 148, Mars, with the cycle-aware baseline on", () => {
    const state = store.getState();
    expect(state.day).toBe(DEMO_DAY);
    expect(state.mission).toBe("MARS");
    expect(state.cycleAware).toBe(true);
    expect(state.scenarioId).toBe("early-infection");
  });

  it("goes back to day 148 when the scenario changes", () => {
    store.getState().setDay(130);
    store.getState().setScenario("cabin-co2");
    expect(store.getState().scenarioId).toBe("cabin-co2");
    expect(store.getState().day).toBe(DEMO_DAY);
  });

  it("falls back to a known scenario for an unknown id", () => {
    store.getState().setScenario("does-not-exist");
    expect(store.getState().scenarioId).toBe(scenarios[0]!.id);
  });

  it("keeps the day inside the mission data", () => {
    store.getState().nextDay();
    expect(store.getState().day).toBe(DEMO_DAY);
    store.getState().setDay(-40);
    expect(store.getState().day).toBe(119);
    store.getState().nextDay();
    expect(store.getState().day).toBe(120);
  });

  it("toggles the cycle-aware switch and resets everything", () => {
    store.getState().setCycleAware(false);
    store.getState().setMission("ISS");
    expect(store.getState().cycleAware).toBe(false);
    store.getState().reset();
    expect(store.getState().cycleAware).toBe(true);
    expect(store.getState().mission).toBe("MARS");
  });

  it("confirms a valid check-in and starts the streak", () => {
    const manual: ManualEntry = { mood: 4, fatigue: 2, glucoseMgDl: 95 };
    expect(store.getState().confirmCheckIn(manual)).toBe(true);
    const state = store.getState();
    expect(state.checkInStatus).toBe("confirmed");
    expect(state.checkIn).toEqual({ scenarioId: "early-infection", day: DEMO_DAY, manual });
    expect(state.streak).toBe(1);
  });

  it("does not count the same day twice and grows the streak on consecutive days", () => {
    store.getState().setDay(140);
    store.getState().confirmCheckIn({ mood: 3, fatigue: 3, glucoseMgDl: 90 });
    store.getState().confirmCheckIn({ mood: 3, fatigue: 3, glucoseMgDl: 92 });
    expect(store.getState().streak).toBe(1);
    store.getState().nextDay();
    expect(store.getState().checkInStatus).toBe("empty");
    store.getState().confirmCheckIn({ mood: 3, fatigue: 3, glucoseMgDl: 90 });
    expect(store.getState().streak).toBe(2);
    store.getState().setDay(145);
    store.getState().confirmCheckIn({ mood: 3, fatigue: 3, glucoseMgDl: 90 });
    expect(store.getState().streak).toBe(1);
  });

  it("rejects invalid manual values with the error state", () => {
    expect(store.getState().confirmCheckIn({ mood: 3, fatigue: 3, glucoseMgDl: 5 })).toBe(false);
    expect(store.getState().checkInStatus).toBe("error");
    expect(store.getState().checkIn).toBeNull();
    expect(store.getState().streak).toBe(0);
  });

  it("applies the confirmed values only to the checked-in day", () => {
    store.getState().confirmCheckIn({ mood: 5, fatigue: 1, glucoseMgDl: 120 });
    const scenario = getScenario("early-infection");
    const applied = withCheckIn(scenario, store.getState().checkIn);
    const day = applied.readings.find((reading) => reading.day === DEMO_DAY);
    expect(day).toMatchObject({ mood: 5, fatigue: 1, glucoseMgDl: 120 });
    expect(applied.readings.find((reading) => reading.day === DEMO_DAY - 1)).toEqual(
      scenario.readings.find((reading) => reading.day === DEMO_DAY - 1),
    );
    expect(withCheckIn(getScenario("nominal"), store.getState().checkIn)).toBe(
      getScenario("nominal"),
    );
  });
});
