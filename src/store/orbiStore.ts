import { useMemo } from "react";
import { create } from "zustand";
import { DEFAULT_SCENARIO_ID, getScenario } from "../data/scenarios";
import { evaluate } from "../domain/evaluate";
import type { DailyReading, Evaluation, Level, Mission, Scenario } from "../domain/types";

/** The demo always opens on mission day 148 (last generated day). */
export const DEMO_DAY = 148;

/** Display range of a typical glucometer (mg/dL). Input validation only, not a clinical threshold. */
export const GLUCOSE_INPUT_RANGE = { min: 20, max: 600 };

export type Score = DailyReading["mood"];

/** The three values the astronaut types in during the check-in. */
export interface ManualEntry {
  mood: Score;
  fatigue: Score;
  glucoseMgDl: number;
  /** Opt-in answer, only asked when the cycle is tracked. Not one of the 7 fields. */
  periodToday?: boolean;
}

export interface CheckIn {
  scenarioId: string;
  day: number;
  manual: ManualEntry;
}

export type CheckInStatus = "empty" | "confirmed" | "error";

/** What the flight surgeon receives: the conclusion, never the raw readings. */
export interface FlightSurgeonPacket {
  scenarioId: string;
  day: number;
  mission: Mission;
  level: Level;
  ruleIds: string[];
  findings: { title: string; because: string[] }[];
  actions: string[];
  /** Mars has no live link: the packet waits for the next comms window. */
  delivery: "live" | "next-window";
  latencySeconds: number;
  reproductiveDetail: "shared" | "private";
}

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
  checkIn: CheckIn | null;
  checkInStatus: CheckInStatus;
  lastCheckInDay: number | null;
  packet: FlightSurgeonPacket | null;
  setScenario: (id: string) => void;
  setDay: (day: number) => void;
  nextDay: () => void;
  setMission: (mission: Mission) => void;
  setCycleAware: (on: boolean) => void;
  /** Returns false and sets the error state when the manual values are invalid. */
  confirmCheckIn: (manual: ManualEntry) => boolean;
  /** Marks the packet for Mission Control. */
  sendPacket: (evaluation: Evaluation) => void;
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

export function isValidGlucose(value: number): boolean {
  return (
    Number.isInteger(value) && value >= GLUCOSE_INPUT_RANGE.min && value <= GLUCOSE_INPUT_RANGE.max
  );
}

function isScore(value: number): value is Score {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

const NO_CHECK_IN = { checkIn: null, checkInStatus: "empty" as CheckInStatus };

const INITIAL = {
  scenarioId: DEFAULT_SCENARIO_ID,
  day: DEMO_DAY,
  mission: "MARS" as Mission,
  streak: 0,
  cycleAware: true,
  ...NO_CHECK_IN,
  lastCheckInDay: null as number | null,
  packet: null as FlightSurgeonPacket | null,
};

/**
 * Builds the packet from the evaluation as is. With reproductive sharing off (the default),
 * cycle detail stays on board.
 * TODO(#12): drop cycle day and period days from `because` once P3 adds them to the contract.
 */
export function buildPacket(
  evaluation: Evaluation,
  { shareReproductiveWithGround = false }: { shareReproductiveWithGround?: boolean } = {},
): FlightSurgeonPacket {
  const top = evaluation.assessments[0];
  return {
    scenarioId: evaluation.scenarioId,
    day: evaluation.day,
    mission: evaluation.mission,
    level: top?.level ?? "NOMINAL",
    ruleIds: evaluation.assessments.map((assessment) => assessment.ruleId),
    findings: evaluation.assessments.map(({ title, because }) => ({ title, because })),
    actions: top?.actions ?? [],
    delivery: evaluation.mission === "MARS" ? "next-window" : "live",
    latencySeconds: evaluation.latencySeconds,
    reproductiveDetail: shareReproductiveWithGround ? "shared" : "private",
  };
}

export function isPacketFor(packet: FlightSurgeonPacket | null, evaluation: Evaluation): boolean {
  return (
    packet !== null &&
    packet.scenarioId === evaluation.scenarioId &&
    packet.day === evaluation.day &&
    packet.mission === evaluation.mission
  );
}

export const useOrbiStore = create<OrbiState>()((set) => ({
  ...INITIAL,
  setScenario: (id) => {
    const scenario = getScenario(id);
    set({ scenarioId: scenario.id, day: clampDay(scenario, DEMO_DAY), ...NO_CHECK_IN });
  },
  setDay: (day) =>
    set((state) => ({ day: clampDay(getScenario(state.scenarioId), day), ...NO_CHECK_IN })),
  nextDay: () =>
    set((state) => ({
      day: clampDay(getScenario(state.scenarioId), state.day + 1),
      ...NO_CHECK_IN,
    })),
  setMission: (mission) => set({ mission }),
  setCycleAware: (cycleAware) => set({ cycleAware }),
  confirmCheckIn: (manual) => {
    if (!isScore(manual.mood) || !isScore(manual.fatigue) || !isValidGlucose(manual.glucoseMgDl)) {
      set({ checkInStatus: "error" });
      return false;
    }
    set((state) => {
      const streak =
        state.lastCheckInDay === state.day
          ? state.streak
          : state.lastCheckInDay === state.day - 1
            ? state.streak + 1
            : 1;
      return {
        checkIn: { scenarioId: state.scenarioId, day: state.day, manual },
        checkInStatus: "confirmed",
        lastCheckInDay: state.day,
        streak,
      };
    });
    return true;
  },
  sendPacket: (evaluation) => set({ packet: buildPacket(evaluation) }),
  reset: () => set(INITIAL),
}));

/** The scenario with the confirmed manual values of the day applied to its reading. */
export function withCheckIn(scenario: Scenario, checkIn: CheckIn | null): Scenario {
  if (!checkIn || checkIn.scenarioId !== scenario.id) return scenario;
  const { mood, fatigue, glucoseMgDl } = checkIn.manual;
  return {
    ...scenario,
    readings: scenario.readings.map((reading) =>
      reading.day === checkIn.day ? { ...reading, mood, fatigue, glucoseMgDl } : reading,
    ),
  };
}

export function useScenario(): Scenario {
  const scenarioId = useOrbiStore((state) => state.scenarioId);
  const checkIn = useOrbiStore((state) => state.checkIn);
  return useMemo(() => withCheckIn(getScenario(scenarioId), checkIn), [scenarioId, checkIn]);
}

export function useReading(): DailyReading | undefined {
  const scenario = useScenario();
  const day = useOrbiStore((state) => state.day);
  return useMemo(() => scenario.readings.find((reading) => reading.day === day), [scenario, day]);
}

/** The single way screens get an evaluation: never recompute rules in components. */
export function useEvaluation(): Evaluation {
  const scenario = useScenario();
  const day = useOrbiStore((state) => state.day);
  const mission = useOrbiStore((state) => state.mission);
  return useMemo(() => evaluate(scenario, day, mission), [scenario, day, mission]);
}
