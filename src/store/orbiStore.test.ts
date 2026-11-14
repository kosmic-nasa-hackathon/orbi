import { beforeEach, describe, expect, it } from "vitest";
import { scenarios } from "../data/scenarios";
import { DEMO_DAY, useOrbiStore } from "./orbiStore";

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
});
