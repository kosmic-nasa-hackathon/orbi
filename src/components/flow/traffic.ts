import { CircleCheck, Eye, type LucideIcon, OctagonAlert, TriangleAlert } from "lucide-react";
import type { Level } from "../../domain/types";

export type TrafficTone = "green" | "yellow" | "red";

export interface Traffic {
  tone: TrafficTone;
  label: string;
  icon: LucideIcon;
}

/** Presentation of the engine level as a three-colour traffic light. CONCERN and URGENT share red. */
export const TRAFFIC: Record<Level, Traffic> = {
  NOMINAL: { tone: "green", label: "All good", icon: CircleCheck },
  WATCH: { tone: "yellow", label: "Keep an eye on it", icon: Eye },
  CONCERN: { tone: "red", label: "Act now", icon: TriangleAlert },
  URGENT: { tone: "red", label: "Urgent", icon: OctagonAlert },
};

export const TONE_CLASS: Record<
  TrafficTone,
  { text: string; soft: string; solid: string; border: string }
> = {
  green: {
    text: "text-nominal",
    soft: "bg-nominal-soft",
    solid: "bg-nominal",
    border: "border-nominal/40",
  },
  yellow: {
    text: "text-watch",
    soft: "bg-watch-soft",
    solid: "bg-watch",
    border: "border-watch/40",
  },
  red: {
    text: "text-urgent",
    soft: "bg-urgent-soft",
    solid: "bg-urgent",
    border: "border-urgent/40",
  },
};
