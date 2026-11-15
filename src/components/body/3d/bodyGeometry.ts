import {
  BufferGeometry,
  CatmullRomCurve3,
  ExtrudeGeometry,
  Float32BufferAttribute,
  SphereGeometry,
  TubeGeometry,
  type Vector2,
  Vector3,
} from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { BODY_OUTLINE, BONES, BRAIN_WAVES, BUST, CX, GUT, HEAD, HEART, LUNGS } from "../geometry";
import {
  ARM_DEPTH_RATIO,
  BRAIN,
  HEAD_DEPTH_RATIO,
  interpolate,
  LEG_DEPTH_RATIO,
  ORGAN_DEPTH,
  TORSO_DEPTH_RATIO,
  TORSO_Z_OFFSET,
  toWorld,
  UNIT,
  type Vec3,
  Y_MID,
} from "./space";

/**
 * 3D volumes derived from the 2D path data in geometry.ts.
 *
 * The body is rebuilt as stacks of elliptical cross-sections: at every scene
 * height the 2D contour gives the half-width of the torso, each arm and each
 * leg; the depth comes from the profile tables in space.ts. Organs are the
 * same SVG glyphs extruded and placed at an anatomical depth.
 */

// ---------------------------------------------------------------------------
// SVG sampling

function parseSvg(markup: string) {
  return new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg">${markup}</svg>`);
}

/** All sub-paths of a path string as point lists (scene coordinates). */
function samplePath(d: string, divisions = 24, transform = ""): Vector2[][] {
  const t = transform ? ` transform="${transform}"` : "";
  return parseSvg(`<path d="${d}"${t}/>`).paths.flatMap((path) =>
    path.subPaths.map((sub) => sub.getPoints(divisions)),
  );
}

/** Sorted x positions where a closed polygon crosses the horizontal line y. */
function crossings(polygon: Vector2[], y: number): number[] {
  const xs: number[] = [];
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i]!;
    const b = polygon[(i + 1) % polygon.length]!;
    if (a.y === b.y) continue;
    if ((y >= a.y && y < b.y) || (y >= b.y && y < a.y)) {
      xs.push(a.x + ((y - a.y) * (b.x - a.x)) / (b.y - a.y));
    }
  }
  return xs.sort((p, q) => p - q);
}

// ---------------------------------------------------------------------------
// Elliptical ring stacks

interface Ring {
  /** Scene y. */
  y: number;
  /** Section centre x / z and half extents, scene units. */
  cx: number;
  cz: number;
  w: number;
  d: number;
}

const RADIAL = 56;

/** Skin over a list of rings (top → bottom), closed with collapsed end rings. */
function ringStack(rings: Ring[]): BufferGeometry {
  const first = rings[0];
  const last = rings[rings.length - 1];
  if (!first || !last) return new BufferGeometry();
  const all: Ring[] = [
    { ...first, y: first.y - 0.01, w: 0, d: 0 },
    ...rings,
    { ...last, y: last.y + 0.01, w: 0, d: 0 },
  ];

  const positions: number[] = [];
  for (const ring of all) {
    for (let j = 0; j < RADIAL; j++) {
      const theta = (j / RADIAL) * Math.PI * 2;
      positions.push(
        ...toWorld(ring.cx + ring.w * Math.cos(theta), ring.y, ring.cz + ring.d * Math.sin(theta)),
      );
    }
  }

  const indices: number[] = [];
  for (let i = 0; i < all.length - 1; i++) {
    for (let j = 0; j < RADIAL; j++) {
      const a = i * RADIAL + j;
      const b = (i + 1) * RADIAL + j;
      const c = i * RADIAL + ((j + 1) % RADIAL);
      const d = (i + 1) * RADIAL + ((j + 1) % RADIAL);
      // Counter-clockwise seen from outside → normals point out.
      indices.push(a, c, b, c, d, b);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function range(from: number, to: number, step: number): number[] {
  const out: number[] = [];
  for (let y = from; y <= to + 1e-6; y += step) out.push(y);
  return out;
}

// ---------------------------------------------------------------------------
// Body

/** Trapezius ends / armpit starts: between them the torso edge is interpolated. */
const SHOULDER_Y = 144;
const ARMPIT_Y = 179;

export interface BodyGeometry {
  parts: BufferGeometry[];
  torsoHalfDepth: (y: number) => number;
}

export function buildBody(): BodyGeometry {
  const outline = samplePath(BODY_OUTLINE, 40)[0] ?? [];
  // Left half only: the figure is symmetric, so we mirror the sections.
  const left = (y: number) => crossings(outline, y).filter((x) => x <= CX + 0.01);
  /**
   * Which crossings belong to the arm and which to the torso/leg. Where the
   * arm hangs free (armpit → fingertips) a horizontal line meets the left
   * half 3–4 times: arm outer, arm inner, then torso (or leg outer, leg inner).
   * Between shoulder and armpit only the deltoid is crossed.
   */
  const split = (y: number): { arm: number[]; body: number[] } => {
    const xs = left(y);
    if (xs.length >= 3) return { arm: xs.slice(0, 2), body: xs.slice(2) };
    if (y > SHOULDER_Y && y < ARMPIT_Y) return { arm: xs.slice(0, 1), body: [] };
    return { arm: [], body: xs };
  };
  const armXs = (y: number) => split(y).arm;
  const bodyXs = (y: number) => split(y).body;

  const shoulderEdge = bodyXs(SHOULDER_Y - 0.5)[0] ?? 234;
  const armpitEdge = bodyXs(ARMPIT_Y)[0] ?? 242;
  const torsoEdge = (y: number): number => {
    if (y > SHOULDER_Y && y < ARMPIT_Y) {
      const t = (y - SHOULDER_Y) / (ARMPIT_Y - SHOULDER_Y);
      return shoulderEdge + (armpitEdge - shoulderEdge) * t;
    }
    return bodyXs(y)[0] ?? CX;
  };
  const torsoHalfDepth = (y: number) => (CX - torsoEdge(y)) * interpolate(TORSO_DEPTH_RATIO, y);

  // Torso: neck → hips, then it tapers away inside the tops of the thighs
  // (the legs carry the silhouette below the hip line).
  const torso: Ring[] = range(117, 302, 1.5).map((y) => {
    const w = CX - torsoEdge(y);
    return {
      y,
      cx: CX,
      cz: interpolate(TORSO_Z_OFFSET, y),
      w,
      d: w * interpolate(TORSO_DEPTH_RATIO, y),
    };
  });
  const seat = torso[torso.length - 1]!;
  for (const [dy, k] of [
    [4, 0.95],
    [8, 0.82],
    [12, 0.6],
    [15, 0.3],
  ] as const) {
    torso.push({ ...seat, y: seat.y + dy, w: seat.w * k, d: seat.d * k });
  }

  // Arm (left): grows out of the shoulder as the deltoid, down to the fingertips.
  const arm: Ring[] = [];
  for (const y of range(146, 344, 1.5)) {
    const xs = armXs(y);
    const outer = xs[0];
    if (outer === undefined) continue;
    const inner = xs[1] ?? torsoEdge(y);
    const w = Math.max(0.5, (inner - outer) / 2);
    arm.push({ y, cx: (outer + inner) / 2, cz: 0, w, d: w * ARM_DEPTH_RATIO });
  }

  // Leg (left): from inside the hip down to the ankle; the foot is separate.
  // The top tapers in from a small cap hidden inside the pelvis, so no hard
  // edge shows where the leg meets the torso.
  const LEG_TOP = 292;
  const LEG_FULL = 312;
  const leg: Ring[] = [];
  for (const y of range(LEG_TOP, 491, 1.5)) {
    const xs = bodyXs(Math.min(Math.max(y, 304), 484));
    const outer = xs[0];
    if (outer === undefined) continue;
    const inner = Math.min(xs[1] ?? CX - 1, CX - 1);
    const taper =
      y >= LEG_FULL
        ? 1
        : 0.45 + 0.55 * Math.sin(((y - LEG_TOP) / (LEG_FULL - LEG_TOP)) * (Math.PI / 2));
    const w = ((inner - outer) / 2) * taper;
    leg.push({ y, cx: (outer + inner) / 2, cz: 0, w, d: w * LEG_DEPTH_RATIO });
  }

  // Head: sections of the head path, deeper than wide.
  const headOutline = samplePath(HEAD, 32)[0] ?? [];
  const head: Ring[] = range(69.5, 119.5, 1).flatMap((y) => {
    const x = crossings(headOutline, y)[0];
    if (x === undefined) return [];
    const w = CX - x;
    return [{ y, cx: CX, cz: 1, w, d: w * HEAD_DEPTH_RATIO }];
  });

  const mirrorRings = (rings: Ring[]) => rings.map((r) => ({ ...r, cx: 2 * CX - r.cx }));

  const parts = [
    withBust(ringStack(torso)),
    ringStack(head),
    ringStack(arm),
    ringStack(mirrorRings(arm)),
    ringStack(leg),
    ringStack(mirrorRings(leg)),
    // Feet point forward so front and back read at a glance.
    ellipsoid([248, 495, 8], [8, 6.5, 15]),
    ellipsoid([312, 495, 8], [8, 6.5, 15]),
    // Nose and ears for the same reason.
    ellipsoid([280, 99, 22], [3, 6, 4]),
    ellipsoid([259.5, 95, -1], [2.5, 6, 4]),
    ellipsoid([300.5, 95, -1], [2.5, 6, 4]),
    // Ponytail from the back of the head: reads in the side and back views.
    ponytail(),
  ];
  return { parts, torsoHalfDepth };
}

/**
 * Bust as a soft forward swell of the torso skin itself (not separate
 * volumes, whose full outline would show through the translucent body).
 * The 2D view shows only the under-bust line.
 */
const BUST_DEPTH = 11; // scene units of forward swell at the centre

function withBust(geometry: BufferGeometry): BufferGeometry {
  const positions = geometry.attributes.position!;
  const centres = [BUST.cx, 2 * CX - BUST.cx].map((x) => toWorld(x, BUST.cy + 3));
  const sx = BUST.rx * UNIT;
  const sy = BUST.ry * UNIT;
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    const z = positions.getZ(i);
    if (z <= 0) continue;
    let swell = 0;
    for (const [cx, cy] of centres) {
      const u = (x - cx) / sx;
      // Fuller below the centre than above (gravity), like a teardrop.
      const v = (y - cy) / (y > cy ? sy * 1.1 : sy * 0.85);
      swell = Math.max(swell, Math.exp(-(u * u + v * v) * 1.4));
    }
    // Only the front of the chest moves.
    const front = Math.min(1, z / (18 * UNIT));
    positions.setZ(i, z + swell * front * BUST_DEPTH * UNIT);
  }
  positions.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

/**
 * Ponytail: gathered high at the back of the head, swinging out and down to
 * rest between the shoulder blades. Profile as [scene y, depth z, radius].
 */
const PONYTAIL = [
  [76, -18, 4.5],
  [80, -23, 6],
  [86, -28, 6.5],
  [96, -31, 6.5],
  [110, -31, 5.5],
  [124, -29, 4.5],
  [138, -26, 3],
  [150, -23, 1.5],
] as const;

function ponytail(): BufferGeometry {
  const rows = (index: 1 | 2) => PONYTAIL.map((row) => [row[0], row[index]] as const);
  const depth = rows(1);
  const radius = rows(2);
  const first = PONYTAIL[0][0];
  const last = PONYTAIL[PONYTAIL.length - 1]![0];
  return ringStack(
    range(first, last, 1.5).map((y) => {
      const r = interpolate(radius, y);
      return { y, cx: CX, cz: interpolate(depth, y), w: r, d: r };
    }),
  );
}

/** Ellipsoid at a scene point with scene-unit radii. */
export function ellipsoid(
  [x, y, z]: readonly [number, number, number],
  [rx, ry, rz]: readonly [number, number, number],
): BufferGeometry {
  const geometry = new SphereGeometry(1, 32, 20);
  geometry.scale(rx * UNIT, ry * UNIT, rz * UNIT);
  geometry.translate(...toWorld(x, y, z));
  geometry.computeVertexNormals();
  return geometry;
}

// ---------------------------------------------------------------------------
// Organs

/** Extrude 2D organ glyphs and place them at an anatomical depth. */
function extrude(markup: string, z: number, thickness: number): BufferGeometry {
  const shapes = parseSvg(markup).paths.flatMap((path) => path.toShapes());
  // Deep, inset bevels turn the flat glyph into a rounded "pillow" that keeps
  // the 2D outline (bevelOffset pulls the bevel back inside the shape).
  const bevel = thickness * 0.4;
  const inset = Math.min(5, bevel);
  const geometry = new ExtrudeGeometry(shapes, {
    depth: thickness - bevel * 2,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: inset,
    bevelOffset: -inset,
    bevelSegments: 6,
    curveSegments: 24,
  });
  // Scene → world: centre on the requested depth, flip y (SVG is y-down).
  geometry.translate(-CX, -Y_MID, z - thickness / 2 + bevel);
  geometry.scale(UNIT, -UNIT, UNIT);
  geometry.computeVertexNormals();
  return geometry;
}

export function buildLungs(): BufferGeometry[] {
  const { z, thickness } = ORGAN_DEPTH.lungs;
  return LUNGS.map((d) => extrude(`<path d="${d}"/>`, z, thickness));
}

export function buildHeart(): BufferGeometry {
  const { z, thickness } = ORGAN_DEPTH.heart;
  return extrude(`<path d="${HEART.d}" transform="${HEART.transform}"/>`, z, thickness);
}

export function buildGut(): BufferGeometry[] {
  const { cx, cy, rx, ry } = GUT.ellipse;
  const { z, thickness } = ORGAN_DEPTH.gut;
  return [ellipsoid([cx, cy, z], [rx, ry, thickness])];
}

export function buildBrain(): BufferGeometry {
  return ellipsoid([BRAIN.cx, BRAIN.cy, 0], [BRAIN.rx, BRAIN.ry, BRAIN.rz]);
}

/** Point lists (world) for lines drawn on the front of an ellipsoid. */
function projectOntoEllipsoid(
  d: string,
  centre: { cx: number; cy: number; z: number },
  radii: { rx: number; ry: number; rz: number },
  lift = 1,
): Vec3[][] {
  return samplePath(d, 16).map((points) =>
    points.map((p) => {
      const u = (p.x - centre.cx) / radii.rx;
      const v = (p.y - centre.cy) / radii.ry;
      const front = radii.rz * Math.sqrt(Math.max(0, 1 - u * u - v * v));
      return toWorld(p.x, p.y, centre.z + front + lift);
    }),
  );
}

/** EEG waves on the front of the brain. */
export function brainWaveLines(): Vec3[][] {
  return projectOntoEllipsoid(BRAIN_WAVES, { cx: BRAIN.cx, cy: BRAIN.cy, z: 0 }, BRAIN);
}

/** Gut folds on the front of the gut volume. */
export function gutFoldLines(): Vec3[][] {
  const { cx, cy, rx, ry } = GUT.ellipse;
  const { z, thickness } = ORGAN_DEPTH.gut;
  return projectOntoEllipsoid(GUT.folds, { cx, cy, z }, { rx, ry, rz: thickness }, 0.5);
}

/**
 * Bones as tubes. The spine runs along the back (it follows the torso depth);
 * pelvis and leg bones stay near the body's mid-plane.
 */
export function buildBones(torsoHalfDepth: (y: number) => number): BufferGeometry[] {
  return BONES.map((d, index) => {
    const points = samplePath(d, 12)[0] ?? [];
    const isSpine = index === 0;
    const curvePoints = (isSpine ? densify(points) : points).map((p) => {
      const z = isSpine ? -0.62 * torsoHalfDepth(p.y) : index === 1 ? -6 : 0;
      return new Vector3(...toWorld(p.x, p.y, z));
    });
    const curve = new CatmullRomCurve3(curvePoints);
    return new TubeGeometry(curve, 64, 1.4 * UNIT, 8, false);
  });
}

/** The spine is a single straight segment in 2D: add points so it can bend in depth. */
function densify(points: Vector2[]): Vector2[] {
  const a = points[0];
  const b = points[points.length - 1];
  if (!a || !b) return points;
  const steps = 24;
  return Array.from({ length: steps + 1 }, (_, i) => {
    const t = i / steps;
    return a.clone().lerp(b, t);
  });
}
