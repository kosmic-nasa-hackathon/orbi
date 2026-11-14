import type { Scenario } from "../../domain/types";
import cabinCo2 from "./cabin-co2.json";
import earlyInfection from "./early-infection.json";
import nominal from "./nominal.json";
import solarEvent from "./solar-event.json";

export const scenarios: Scenario[] = [
  nominal as unknown as Scenario,
  earlyInfection as unknown as Scenario,
  cabinCo2 as unknown as Scenario,
  solarEvent as unknown as Scenario,
];

export const DEFAULT_SCENARIO_ID = "early-infection";

export function getScenario(id: string): Scenario {
  return scenarios.find((s) => s.id === id) ?? scenarios[0]!;
}
