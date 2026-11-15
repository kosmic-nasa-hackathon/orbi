/**
 * Body figure geometry, ported from the orbiui sandbox (2D view only).
 *
 * Everything here is plain data in scene.ts coordinates (x right, y down,
 * cx = 280, head top ≈ 69, soles ≈ 507). Tuning a curve here changes the figure.
 */

export type Pt = readonly [number, number];
export type Seg = { c?: readonly [Pt, Pt]; to: Pt };

/** Body midline. */
export const CX = 280;

/** Left side of the neck, just under the jaw. */
const BODY_START: Pt = [273, 117];

/**
 * Left half of the body contour, from the neck down to the crotch. The right
 * half is its mirror around CX, so the figure stays symmetric.
 *
 * Female proportions: shoulders and hips of similar width (half-widths ≈ 54
 * and 41 vs. a 24 waist), a defined waist, fuller thighs, slimmer neck,
 * arms and hands.
 */
const BODY_LEFT_HALF: Seg[] = [
  // Neck and trapezius slope into the shoulder
  {
    c: [
      [273, 124],
      [272, 129],
    ],
    to: [270, 133],
  },
  {
    c: [
      [261, 137],
      [248, 139],
    ],
    to: [240, 144],
  },
  // Deltoid, outer arm to elbow, forearm to wrist
  {
    c: [
      [231, 148],
      [226, 159],
    ],
    to: [226, 172],
  },
  {
    c: [
      [225, 194],
      [221, 214],
    ],
    to: [218, 234],
  },
  {
    c: [
      [215, 256],
      [211, 278],
    ],
    to: [209, 298],
  },
  // Hand (relaxed, palm toward the thigh)
  {
    c: [
      [206, 311],
      [205, 323],
    ],
    to: [207, 334],
  },
  {
    c: [
      [210, 341],
      [218, 341],
    ],
    to: [219, 333],
  },
  {
    c: [
      [220, 323],
      [219, 311],
    ],
    to: [220, 300],
  },
  // Inner forearm and inner upper arm back up to the armpit
  {
    c: [
      [223, 280],
      [228, 258],
    ],
    to: [231, 238],
  },
  {
    c: [
      [233, 214],
      [238, 192],
    ],
    to: [245, 178],
  },
  // Side of the bust, ribcage, waist, hip
  {
    c: [
      [242, 192],
      [242, 216],
    ],
    to: [249, 230],
  },
  {
    c: [
      [252, 244],
      [256, 254],
    ],
    to: [256, 264],
  },
  {
    c: [
      [256, 280],
      [241, 290],
    ],
    to: [239, 308],
  },
  // Outer thigh, knee, calf, ankle
  {
    c: [
      [237, 334],
      [241, 370],
    ],
    to: [244, 398],
  },
  {
    c: [
      [245, 410],
      [239, 425],
    ],
    to: [240, 440],
  },
  {
    c: [
      [241, 460],
      [245, 474],
    ],
    to: [245, 484],
  },
  // Foot, turned slightly out
  {
    c: [
      [243, 491],
      [238, 497],
    ],
    to: [238, 501],
  },
  {
    c: [
      [238, 506],
      [255, 506],
    ],
    to: [257, 502],
  },
  {
    c: [
      [258, 497],
      [256, 491],
    ],
    to: [255, 484],
  },
  // Inner calf, inner knee, inner thigh up to the crotch (on the centre line)
  {
    c: [
      [256, 468],
      [262, 450],
    ],
    to: [262, 428],
  },
  {
    c: [
      [262, 414],
      [260, 405],
    ],
    to: [261, 396],
  },
  {
    c: [
      [263, 364],
      [270, 338],
    ],
    to: [280, 326],
  },
];

const fmt = ([x, y]: Pt) => `${x} ${y}`;
const mirror = ([x, y]: Pt): Pt => [2 * CX - x, y];

/** Left half forward, then the mirrored half walked backwards. */
function buildOutline(start: Pt, half: Seg[]): string {
  const parts = [`M${fmt(start)}`];
  for (const seg of half) {
    parts.push(seg.c ? `C${fmt(seg.c[0])} ${fmt(seg.c[1])} ${fmt(seg.to)}` : `L${fmt(seg.to)}`);
  }
  // Each segment's start point is the previous segment's end.
  const froms: Pt[] = [start, ...half.map((seg) => seg.to)];
  [...half].reverse().forEach((seg, k) => {
    const target = mirror(froms[half.length - 1 - k] ?? start);
    parts.push(
      seg.c
        ? `C${fmt(mirror(seg.c[1]))} ${fmt(mirror(seg.c[0]))} ${fmt(target)}`
        : `L${fmt(target)}`,
    );
  });
  return parts.join(" ");
}

/** Whole-body contour (open at the neck, under the head). */
export const BODY_OUTLINE = buildOutline(BODY_START, BODY_LEFT_HALF);

/** Egg-shaped head with a soft, narrow jaw; open at the neck. */
export const HEAD =
  "M280 70 C 292 70 300 79 300 92 C 300 104 296 112 289 117 C 285 120 275 120 271 117 C 264 112 260 104 260 92 C 260 79 268 70 280 70 Z";

/**
 * Bust (left side; the right one is its mirror). Only the under-bust line is drawn.
 */
export const BUST = { cx: 265, cy: 201, rx: 13, ry: 12 };

/** Faint anatomical landmarks: ears, clavicles, under-bust lines, kneecaps. */
export const DETAILS = [
  "M260 89 c -5 0 -5 11 1 12",
  "M300 89 c 5 0 5 11 -1 12",
  "M272 140 C 263 144 253 143 245 147",
  "M288 140 C 297 144 307 143 315 147",
  "M252 205 q 12 13 25 3",
  "M308 205 q -12 13 -25 3",
  "M247 392 q 6 6 12 0",
  "M313 392 q -6 6 -12 0",
];

/** Musculoskeletal zone: spine (midline, neck to sacrum), pelvis bridge, leg bones. */
export const BONES = [
  "M280 120 L 280 300",
  "M252 302 Q 280 314 308 302",
  "M258 298 L 252 392 L 248 470",
  "M302 298 L 308 392 L 312 470",
];

/** Behavioural zone: three EEG waves in the cranium, above the eye line. */
export const BRAIN_WAVES = "M273 79 c3 -3 6 -3 9 0 M270 86 c5 -4 12 -4 17 0 M273 93 c3 3 7 3 10 0";

/**
 * Respiratory zone. Front view: the subject's right lung is on the viewer's
 * left. Apices just above the clavicles, domed bases on the diaphragm
 * (y ≈ 228); the left lung is narrower and has the cardiac notch.
 */
export const LUNGS = [
  "M275 156 C 273 149 263 151 258 164 C 253 180 251 204 251 227 C 257 223 266 220 276 221 L 276 162 Z",
  "M285 156 C 287 149 297 151 302 164 C 307 180 309 204 309 227 C 305 224 301 223 298 223 C 300 214 297 201 286 196 Z",
];

/**
 * Cardio zone. Between the lungs, behind the lower sternum, offset to the
 * subject's left (viewer's right) with the apex tilted down and outward.
 */
export const HEART = {
  d: "M287 203 C 283 196 274 198 274 205 C 274 212 287 220 287 220 C 287 220 300 212 300 205 C 300 198 291 196 287 203 Z",
  transform: "rotate(-22 287 209)",
};

/** Metabolic zone: gut centred on the navel, below the diaphragm, clear of the pelvis. */
export const GUT = {
  ellipse: { cx: 280, cy: 262, rx: 19, ry: 14 },
  folds: "M267 258 q 13 7 26 0 M269 266 q 11 6 22 0",
};
