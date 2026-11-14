import { useMemo } from "react";
import { create } from "zustand";
import { DEFAULT_SCENARIO_ID, getScenario } from "../data/scenarios";
import { evaluate } from "../domain/evaluate";
import type { Evaluation, Mission, Scenario } from "../domain/types";

/** The demo always opens on mission day 148 (last generated day). */
export const DEMO_DAY = 148;

export interface OrbiState {
  scenarioId: string;
  day: number;
  mission: Mission;
  streak: number;
  /**
   * DemoBar switch "Cycle-aware baseline". On by default, matching the default crew
   * profile (cycle: "tracked"). It reaches evaluate() once P3 (#12) adds the option.
   */
  cycleAware: boolean;
  setScenario: (id: string) => void;
  setDay: (day: number) => void;
  nextDay: () => void;
  setMission: (mission: Mission) => void;
  setCycleAware: (on: boolean) => void;
  reset: () => void;
}

export function dayRange(scenario: Scenario): { first: number; last: number } {
  const last = scenario.readings.at(-1)?.day ?? DEMO_DAY;
  return { first: scenario.firstMissionDay, last };
}

function clampDay(scenario: Scenario, day: number): number {
  const { first, last } = dayRange(scenario);
  return Math.min(last, Math.max(first, Math.round(day)));
}

const INITIAL = {
  scenarioId: DEFAULT_SCENARIO_ID,
  day: DEMO_DAY,
  mission: "MARS" as Mission,
  streak: 0,
  cycleAware: true,
};

export const useOrbiStore = create<OrbiState>()((set) => ({
  ...INITIAL,
  setScenario: (id) => {
    const scenario = getScenario(id);
    set({ scenarioId: scenario.id, day: clampDay(scenario, DEMO_DAY) });
  },
  setDay: (day) => set((state) => ({ day: clampDay(getScenario(state.scenarioId), day) })),
  nextDay: () => set((state) => ({ day: clampDay(getScenario(state.scenarioId), state.day + 1) })),
  setMission: (mission) => set({ mission }),
  setCycleAware: (cycleAware) => set({ cycleAware }),
  reset: () => set(INITIAL),
}));

export function useScenario(): Scenario {
  const scenarioId = useOrbiStore((state) => state.scenarioId);
  return useMemo(() => getScenario(scenarioId), [scenarioId]);
}

/** The single way screens get an evaluation: never recompute rules in components. */
export function useEvaluation(): Evaluation {
  const scenario = useScenario();
  const day = useOrbiStore((state) => state.day);
  const mission = useOrbiStore((state) => state.mission);
  return useMemo(() => evaluate(scenario, day, mission), [scenario, day, mission]);
}
