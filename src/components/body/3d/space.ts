import type { SystemId } from "../../../domain/types";
import { CX } from "../geometry";
import { ZONE_ANCHOR } from "../scene";

/**
 * Mapping from the 2D scene (x right, y down, 100 units ≈ 1 world unit) to
 * the 3D world (x right, y up, z toward the viewer in the front view).
 *
 * The 2D drawing only defines the front view. Everything here that mentions
 * depth (z) is the invented "side profile" of the figure: tune it here.
 */
export const UNIT = 1 / 100;

/** Scene y that sits at world y = 0 (body mid-height: head top 69, soles 507). */
export const Y_MID = 288;

export type Vec3 = [number, number, number];

/** Scene (x, y) plus depth z (scene units, + = front) → world coordinates. */
export function toWorld(x: number, y: number, z = 0): Vec3 {
  return [(x - CX) * UNIT, (Y_MID - y) * UNIT, z * UNIT];
}

/** Piecewise-linear lookup over [key, value] stops sorted by key. */
export function interpolate(stops: readonly (readonly [number, number])[], key: number): number {
  const first = stops[0];
  const last = stops[stops.length - 1];
  if (!first || !last) return 0;
  if (key <= first[0]) return first[1];
  if (key >= last[0]) return last[1];
  for (let i = 1; i < stops.length; i++) {
    const a = stops[i - 1]!;
    const b = stops[i]!;
    if (key <= b[0]) return a[1] + ((b[1] - a[1]) * (key - a[0])) / (b[0] - a[0]);
  }
  return last[1];
}

/**
 * Torso depth as a ratio of its half-width, by scene y: round neck, flat
 * shoulder girdle, deep chest and belly, slightly flatter pelvis.
 */
export const TORSO_DEPTH_RATIO = [
  [117, 0.95],
  [132, 0.9],
  [143, 0.42],
  [160, 0.5],
  [182, 0.68],
  [230, 0.74],
  [266, 0.8],
  [306, 0.68],
  [326, 0.6],
] as const;

/** Torso forward offset (scene units) by y: chest forward, seat back. */
export const TORSO_Z_OFFSET = [
  [117, -2],
  [150, 0],
  [205, 3],
  [266, 1],
  [306, -2],
  [326, -1],
] as const;

/** Limbs are close to round in section. */
export const ARM_DEPTH_RATIO = 0.92;
export const LEG_DEPTH_RATIO = 0.92;
/** Head is deeper (front-to-back) than it is wide. */
export const HEAD_DEPTH_RATIO = 1.18;

/** Organ placement inside the body: centre depth and thickness (scene units). */
export const ORGAN_DEPTH = {
  lungs: { z: -2, thickness: 22 },
  heart: { z: 7, thickness: 10 },
  gut: { z: 4, thickness: 12 },
} as const;

/** Brain volume inside the cranium. */
export const BRAIN = { cx: 280, cy: 85, rx: 16, ry: 12.5, rz: 19 } as const;

/** Depth of each zone anchor (connector target, selection ring). */
const ANCHOR_Z: Record<SystemId, number> = {
  behavioral: 18,
  respiratory: 4,
  cardio: 14,
  metabolic: 16,
  immune: 0,
  msk: 0,
  radiation: 0,
};

export function anchorWorld(system: SystemId): Vec3 {
  const anchor = ZONE_ANCHOR[system];
  return toWorld(anchor.x, anchor.y, ANCHOR_Z[system]);
}
