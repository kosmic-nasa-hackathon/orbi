import { LEVEL_ORDER, type Level } from "./types";

export function maxLevel(a: Level, b: Level): Level {
  return LEVEL_ORDER[a] >= LEVEL_ORDER[b] ? a : b;
}

export function atLeast(level: Level, threshold: Level): boolean {
  return LEVEL_ORDER[level] >= LEVEL_ORDER[threshold];
}

export const LEVEL_LABEL: Record<Level, string> = {
  NOMINAL: "Nominal",
  WATCH: "Watch",
  CONCERN: "Concern",
  URGENT: "Urgent",
};

export const LEVEL_HINT: Record<Level, string> = {
  NOMINAL: "Inside your personal range",
  WATCH: "Early drift — repeat the measurement",
  CONCERN: "Pattern that needs attention",
  URGENT: "Acute risk — act now",
};
