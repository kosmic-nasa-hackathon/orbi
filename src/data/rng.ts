export type Rng = () => number;

/** Small deterministic PRNG: the demo always shows the same day 148. */
export function mulberry32(seed: number): Rng {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function gaussian(rng: Rng, mean: number, sd: number): number {
  const u = Math.max(rng(), Number.EPSILON);
  const v = Math.max(rng(), Number.EPSILON);
  return mean + sd * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function round(value: number, decimals = 0): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function pick<T>(rng: Rng, values: T[]): T {
  const index = Math.floor(rng() * values.length);
  return values[index] ?? values[0]!;
}
