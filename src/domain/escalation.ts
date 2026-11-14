import type { Escalation, Level, Mission } from "./types";

const MISSION_NOTE: Record<Mission, string> = {
  ISS: "Low-Earth orbit: the flight surgeon is effectively next door.",
  MOON: "Moon: 1.3 s one-way. Ground support can still guide in real time.",
  MARS: "Mars: 14 min one-way in this demo (up to 20 min). Act on board first; the packet travels with the next window.",
};

export function escalate(level: Level, mission: Mission): Escalation {
  const note = MISSION_NOTE[mission];

  if (level === "URGENT") {
    return {
      now: mission === "MARS" ? "Act on board now" : "Flight surgeon + ground team live",
      next:
        mission === "MARS" ? "Queue the packet; notify when the window opens" : "Wardroom and CMO",
      note,
    };
  }

  if (level === "CONCERN") {
    return {
      now: mission === "MARS" ? "Start the local protocol now" : "Flight surgeon now",
      next: mission === "MARS" ? "Queue the packet for the next window" : "CMO",
      note,
    };
  }

  if (level === "WATCH") {
    return {
      now: "Self-care and repeat the measurement in 24 h",
      next: "CMO if it persists",
      note,
    };
  }

  return {
    now: "No escalation",
    note,
  };
}
