import type { LucideIcon } from "lucide-react";
import { BatteryLow, Droplet, HeartPulse, Moon, Smile, Thermometer, Waves } from "lucide-react";
import type { DailyReading, Evaluation, Level, ReadingField, SystemId } from "../../domain/types";
import { TONE_CLASS, TRAFFIC } from "../flow/traffic";

/**
 * SVG scene geometry. This file is the single place to tune the composition:
 * move an anchor here and the satellites, connectors and legend follow.
 */
export const VIEW = { w: 560, h: 700, cx: 280, cy: 350 };

/** Radiation halo (dashed ellipse) proportions. */
export const HALO = { rx: 274, ry: 330 };

/** Radius of the satellite orbit ring. */
export const ORBIT_R = 228;

/** Satellite node radius: room for the icon, the value and its unit on separate lines. */
export const NODE_R = 38;

/** Anchor on the body for each system: connector target and panel selection. */
export const ZONE_ANCHOR: Record<SystemId, { x: number; y: number }> = {
  behavioral: { x: 280, y: 86 },
  respiratory: { x: 280, y: 188 },
  cardio: { x: 287, y: 209 },
  metabolic: { x: 280, y: 262 },
  immune: { x: 240, y: 150 },
  msk: { x: 280, y: 440 },
  radiation: { x: 280, y: 58 },
};

/** Traffic-light colour as a text utility, reused with `currentColor` inside the SVG. */
export const LEVEL_TEXT: Record<Level, string> = {
  NOMINAL: TONE_CLASS[TRAFFIC.NOMINAL.tone].text,
  WATCH: TONE_CLASS[TRAFFIC.WATCH.tone].text,
  CONCERN: TONE_CLASS[TRAFFIC.CONCERN.tone].text,
  URGENT: TONE_CLASS[TRAFFIC.URGENT.tone].text,
};

/** Soft fill intensity per level: nominal stays quiet, urgent fills more. */
export const LEVEL_FILL_OPACITY: Record<Level, number> = {
  NOMINAL: 0.1,
  WATCH: 0.16,
  CONCERN: 0.18,
  URGENT: 0.22,
};

export interface SatelliteDef {
  field: ReadingField;
  /** Body zone the reading feeds. */
  zone: SystemId;
  icon: LucideIcon;
  label: string;
  pick: (reading: DailyReading) => number;
  format: (value: number) => string;
}

/** The 7 check-in readings as orbiting satellites. */
export const SATELLITES: SatelliteDef[] = [
  {
    field: "sleepHours",
    zone: "behavioral",
    icon: Moon,
    label: "Sleep",
    pick: (r) => r.sleepHours,
    format: (v) => `${v.toFixed(1)} h`,
  },
  {
    field: "mood",
    zone: "behavioral",
    icon: Smile,
    label: "Mood",
    pick: (r) => r.mood,
    format: (v) => `${v}/5`,
  },
  {
    field: "fatigue",
    zone: "behavioral",
    icon: BatteryLow,
    label: "Fatigue",
    pick: (r) => r.fatigue,
    format: (v) => `${v}/5`,
  },
  {
    field: "restingHr",
    zone: "cardio",
    icon: HeartPulse,
    label: "Resting HR",
    pick: (r) => r.restingHr,
    format: (v) => `${Math.round(v)} bpm`,
  },
  {
    field: "tempC",
    zone: "immune",
    icon: Thermometer,
    label: "Temp",
    pick: (r) => r.tempC,
    format: (v) => `${v.toFixed(1)} °C`,
  },
  {
    field: "spo2",
    zone: "respiratory",
    icon: Waves,
    label: "SpO₂",
    pick: (r) => r.spo2,
    format: (v) => `${Math.round(v)} %`,
  },
  {
    field: "glucoseMgDl",
    zone: "metabolic",
    icon: Droplet,
    label: "Glucose",
    pick: (r) => r.glucoseMgDl,
    format: (v) => `${Math.round(v)} mg/dL`,
  },
];

/**
 * Position on the orbit ring for a satellite at `deg` (0 = top, clockwise).
 * Slots are offset half a step so no satellite sits exactly at 12 o'clock,
 * where it would collide with the head.
 */
export function slotAngle(index: number): number {
  return ((index + 0.5) / SATELLITES.length) * 360;
}

export function orbitPoint(deg: number, radius = ORBIT_R): { x: number; y: number } {
  const rad = (deg * Math.PI) / 180;
  return {
    x: VIEW.cx + radius * Math.sin(rad),
    y: VIEW.cy - radius * Math.cos(rad),
  };
}

/** "87 mg/dL" → { value: "87", unit: "mg/dL" }, so the number can lead and the unit sit below. */
export function splitReading(text: string): { value: string; unit: string } {
  const space = text.indexOf(" ");
  return space === -1
    ? { value: text, unit: "" }
    : { value: text.slice(0, space), unit: text.slice(space + 1) };
}

/** Unit vector from a satellite toward its zone anchor (for the connector stub). */
export function towardZone(
  from: { x: number; y: number },
  zone: SystemId,
): { x: number; y: number } {
  const anchor = ZONE_ANCHOR[zone];
  const dx = anchor.x - from.x;
  const dy = anchor.y - from.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: dx / len, y: dy / len };
}

/** Everything the body scene needs. Selection state lives in the screen. */
export interface BodySceneProps {
  evaluation: Evaluation;
  reading: DailyReading | undefined;
  selected: SystemId | null;
  onSelect: (system: SystemId) => void;
}
