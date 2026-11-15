import type { Level } from "../domain/types";

export type LinkState = "SYNCED" | "DEGRADED" | "LOST" | "REACQUIRING";
export type ReturnMode = "IDLE" | "RECOMMENDED" | "ACTIVE" | "COMPLETE";
export type LinkControl = "auto" | "lost" | "synced";
export type AuditPriority = "P0" | "P1" | "P2" | "P3";

export interface Vec2 {
  x: number;
  y: number;
}

export interface EvaTelemetry {
  heartRate: number;
  spo2: number;
  tempC: number;
  o2Pct: number;
}

export interface EvaAuditEntry {
  id: string;
  at: number;
  kind: "link" | "navigation" | "clinical";
  text: string;
  priority: AuditPriority;
}

export interface EvaConfig {
  telemetry: EvaTelemetry;
  clinicalLevel: Level;
  clinicalLabel: string;
}

export interface EvaControls {
  link: LinkControl;
  returnRequested: boolean;
  autoReturn: boolean;
}

export interface EvaState {
  elapsed: number;
  truePos: Vec2;
  trueVel: Vec2;
  estPos: Vec2;
  estVel: Vec2;
  heading: number;
  bias: Vec2;
  link: LinkState;
  linkSince: number;
  lastSyncAt: number;
  centralPos: Vec2;
  centralAt: number;
  drift: number;
  outbox: number;
  outboxCarry: number;
  returnMode: ReturnMode;
  returnSince: number | null;
  telemetry: EvaTelemetry;
  clinicalLevel: Level;
  clinicalLabel: string;
  trueTrail: Vec2[];
  estTrail: Vec2[];
  centralTrail: Vec2[];
  audit: EvaAuditEntry[];
  lastTrailAt: number;
}

export const AIRLOCK: Vec2 = { x: 0, y: -12 };
export const SHIP_RADIUS = 9;
export const RETURN_SPEED = 2.2;
export const EVA_DURATION = 48;

const TRAIL_INTERVAL = 0.4;
const TRAIL_LIMIT = 140;
const OUTBOX_INTERVAL = 2.5;

function vec(x: number, y: number): Vec2 {
  return { x, y };
}

function add(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x + b.x, y: a.y + b.y };
}

function sub(a: Vec2, b: Vec2): Vec2 {
  return { x: a.x - b.x, y: a.y - b.y };
}

function scale(a: Vec2, factor: number): Vec2 {
  return { x: a.x * factor, y: a.y * factor };
}

export function length(a: Vec2): number {
  return Math.hypot(a.x, a.y);
}

export function distance(a: Vec2, b: Vec2): number {
  return length(sub(a, b));
}

export function normalize(a: Vec2): Vec2 {
  const size = length(a);
  if (size < 0.0001) return vec(0, 0);
  return scale(a, 1 / size);
}

function round(value: number, digits = 1): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function appendTrail(trail: Vec2[], point: Vec2): Vec2[] {
  const next = [...trail, point];
  return next.slice(-TRAIL_LIMIT);
}

function audit(
  state: EvaState,
  kind: EvaAuditEntry["kind"],
  text: string,
  priority: AuditPriority,
): EvaAuditEntry[] {
  const entry: EvaAuditEntry = {
    id: `eva-${state.audit.length}-${Math.round(state.elapsed * 1000)}`,
    at: state.elapsed,
    kind,
    text,
    priority,
  };
  return [...state.audit, entry].slice(-30);
}

function autoLink(elapsed: number): LinkState {
  if (elapsed < 6) return "SYNCED";
  if (elapsed < 10) return "DEGRADED";
  if (elapsed < 38) return "LOST";
  if (elapsed < 42) return "REACQUIRING";
  return "SYNCED";
}

function desiredLink(state: EvaState, controls: EvaControls): LinkState {
  if (controls.link === "lost") return "LOST";
  if (controls.link === "synced") return "SYNCED";
  return autoLink(state.elapsed);
}

function enterLink(state: EvaState, next: LinkState): EvaState {
  if (next === state.link) return state;

  let auditLog = state.audit;
  if (next === "DEGRADED") {
    auditLog = audit(state, "link", "Link degraded — packet loss rising", "P2");
  } else if (next === "LOST") {
    auditLog = audit(state, "link", "Sync lost — local autonomy active, events queued", "P1");
  } else if (next === "REACQUIRING") {
    auditLog = audit(state, "link", "Link reacquiring — waiting for handshake", "P2");
  } else if (next === "SYNCED") {
    const flushed = state.outbox;
    auditLog = audit(
      state,
      "link",
      flushed > 0
        ? `Sync restored — ${flushed} event${flushed === 1 ? "" : "s"} reconciled`
        : "Sync restored — position reconciled",
      "P1",
    );
  }

  return {
    ...state,
    link: next,
    linkSince: state.elapsed,
    audit: auditLog,
  };
}

function moveTowardAirlock(
  state: EvaState,
  step: number,
): { pos: Vec2; vel: Vec2; complete: boolean } {
  const toAirlock = sub(AIRLOCK, state.truePos);
  const remaining = length(toAirlock);
  if (remaining <= 1.4) {
    return { pos: AIRLOCK, vel: vec(0, 0), complete: true };
  }
  const direction = normalize(toAirlock);
  return {
    pos: add(state.truePos, scale(direction, RETURN_SPEED * step)),
    vel: scale(direction, RETURN_SPEED),
    complete: false,
  };
}

function driftPath(elapsed: number): Vec2 {
  return vec(0.55 * Math.cos(elapsed * 0.22) + 0.08, 0.38 * Math.sin(elapsed * 0.17) + 0.1);
}

function setReturnMode(
  state: EvaState,
  next: ReturnMode,
  text: string,
  priority: AuditPriority,
): EvaState {
  if (state.returnMode === next) return state;
  return {
    ...state,
    returnMode: next,
    returnSince: next === "ACTIVE" ? state.elapsed : state.returnSince,
    audit: audit(state, "navigation", text, priority),
  };
}

export function createEvaState(config: EvaConfig, seed = 7): EvaState {
  const start = vec(31, 18);
  const velocity = driftPath(0);
  const bias = vec(0.032 + (seed % 5) * 0.003, -0.024 - (seed % 3) * 0.004);

  const state: EvaState = {
    elapsed: 0,
    truePos: start,
    trueVel: velocity,
    estPos: start,
    estVel: velocity,
    heading: Math.atan2(velocity.y, velocity.x),
    bias,
    link: "SYNCED",
    linkSince: 0,
    lastSyncAt: 0,
    centralPos: start,
    centralAt: 0,
    drift: 0,
    outbox: 0,
    outboxCarry: 0,
    returnMode: "IDLE",
    returnSince: null,
    telemetry: config.telemetry,
    clinicalLevel: config.clinicalLevel,
    clinicalLabel: config.clinicalLabel,
    trueTrail: [start],
    estTrail: [start],
    centralTrail: [start],
    audit: [],
    lastTrailAt: 0,
  };

  return {
    ...state,
    audit: audit(state, "clinical", `EVA started — ${config.clinicalLabel}`, "P2"),
  };
}

export function stepEva(state: EvaState, dt: number, controls: EvaControls): EvaState {
  if (dt <= 0) return state;
  const step = Math.min(dt, 0.25);
  const elapsed = state.elapsed + step;

  let next: EvaState = { ...state, elapsed };
  next = enterLink(next, desiredLink(next, controls));

  const wasReturning = next.returnMode === "ACTIVE";
  const holding = next.returnMode === "COMPLETE";
  const motion = holding
    ? { pos: AIRLOCK, vel: vec(0, 0), complete: true }
    : wasReturning
      ? moveTowardAirlock(next, step)
      : {
          pos: add(next.truePos, scale(next.trueVel, step)),
          vel: driftPath(next.elapsed),
          complete: false,
        };

  const trueAccel = scale(sub(motion.vel, next.trueVel), 1 / step);
  const estVel = add(next.estVel, scale(add(trueAccel, next.bias), step));
  const estPos = add(next.estPos, scale(estVel, step));

  let returnMode = next.returnMode;
  if (wasReturning && motion.complete) {
    returnMode = "COMPLETE";
    next = setReturnMode(next, "COMPLETE", "Airlock reached — return complete", "P2");
  }

  const lostFor = next.link === "LOST" ? elapsed - next.linkSince : 0;
  const toAirlock = distance(estPos, AIRLOCK);
  const clinicalConcern = next.clinicalLevel === "CONCERN" || next.clinicalLevel === "URGENT";
  const lowOxygen = next.telemetry.o2Pct < 55;
  const returnWarranted = lostFor > 6 || lowOxygen || (clinicalConcern && lostFor > 2);

  if (returnMode === "IDLE" && returnWarranted) {
    returnMode = "RECOMMENDED";
    next = setReturnMode(
      next,
      "RECOMMENDED",
      `Return recommended — no sync for ${Math.round(lostFor)} s, drift ${round(distance(estPos, motion.pos))} m`,
      "P1",
    );
  }

  if (
    (returnMode === "IDLE" || returnMode === "RECOMMENDED") &&
    (controls.returnRequested ||
      (controls.autoReturn && returnMode === "RECOMMENDED" && lostFor > 10))
  ) {
    returnMode = "ACTIVE";
    next = setReturnMode(
      next,
      "ACTIVE",
      `Inertial return active — ${Math.round(toAirlock)} m to airlock`,
      "P1",
    );
  }

  const velocityForHeading =
    returnMode === "COMPLETE" ? vec(0, 0) : wasReturning ? sub(AIRLOCK, estPos) : estVel;
  const heading =
    length(velocityForHeading) < 0.001
      ? next.heading
      : Math.atan2(velocityForHeading.y, velocityForHeading.x);

  let outbox = next.outbox;
  let outboxCarry = next.outboxCarry;
  if (next.link === "LOST") {
    outboxCarry += step / OUTBOX_INTERVAL;
    while (outboxCarry >= 1) {
      outbox = Math.min(99, outbox + 1);
      outboxCarry -= 1;
    }
  } else if (next.link === "SYNCED") {
    outbox = 0;
    outboxCarry = 0;
  }

  const synced = next.link === "SYNCED";
  const suitEstPos = returnMode === "COMPLETE" ? AIRLOCK : synced ? motion.pos : estPos;
  const suitEstVel = returnMode === "COMPLETE" ? vec(0, 0) : synced ? motion.vel : estVel;
  const drift = returnMode === "COMPLETE" ? 0 : synced ? 0 : distance(suitEstPos, motion.pos);
  const o2Pct = Math.max(
    12,
    next.telemetry.o2Pct - step * (0.035 + next.telemetry.heartRate / 4200),
  );

  let trueTrail = next.trueTrail;
  let estTrail = next.estTrail;
  let centralTrail = next.centralTrail;
  let lastTrailAt = next.lastTrailAt;

  if (elapsed - next.lastTrailAt >= TRAIL_INTERVAL) {
    trueTrail = appendTrail(trueTrail, motion.pos);
    estTrail = appendTrail(estTrail, suitEstPos);
    lastTrailAt = elapsed;
  }
  if (synced) {
    centralTrail = appendTrail(centralTrail, motion.pos);
  }

  const centralPos = synced ? motion.pos : next.centralPos;
  const centralAt = synced ? elapsed : next.centralAt;
  const lastSyncAt = synced ? elapsed : next.lastSyncAt;

  return {
    ...next,
    truePos: motion.pos,
    trueVel: motion.vel,
    estPos: suitEstPos,
    estVel: suitEstVel,
    heading,
    drift,
    outbox,
    outboxCarry,
    returnMode,
    telemetry: { ...next.telemetry, o2Pct },
    trueTrail,
    estTrail,
    centralTrail,
    centralPos,
    centralAt,
    lastSyncAt,
    lastTrailAt,
  };
}

export interface ReturnGuidance {
  active: boolean;
  distanceM: number;
  etaSeconds: number;
  heading: number;
  why: string[];
  urgency: "routine" | "recommended" | "mandatory";
}

export function returnGuidance(state: EvaState): ReturnGuidance {
  const distanceM = distance(state.estPos, AIRLOCK);
  const etaSeconds = state.returnMode === "COMPLETE" ? 0 : distanceM / RETURN_SPEED;
  const lostFor = state.link === "LOST" ? state.elapsed - state.linkSince : 0;
  const why: string[] = [];

  if (lostFor > 0) why.push(`No sync for ${Math.round(lostFor)} s`);
  if (state.drift > 0.5) why.push(`Inertial drift ${round(state.drift)} m`);
  if (state.telemetry.o2Pct < 70) why.push(`O₂ reserve ${Math.round(state.telemetry.o2Pct)}%`);
  if (state.clinicalLevel === "CONCERN" || state.clinicalLevel === "URGENT") {
    why.push(`${state.clinicalLabel} on the last check-in`);
  }
  if (why.length === 0) why.push("All systems synced");

  const urgency =
    state.clinicalLevel === "URGENT" || state.telemetry.o2Pct < 55
      ? "mandatory"
      : state.returnMode === "RECOMMENDED" || state.returnMode === "ACTIVE"
        ? "recommended"
        : "routine";

  return {
    active: state.returnMode === "ACTIVE" || state.returnMode === "COMPLETE",
    distanceM,
    etaSeconds,
    heading: Math.atan2(AIRLOCK.y - state.estPos.y, AIRLOCK.x - state.estPos.x),
    why,
    urgency,
  };
}

export function formatEta(seconds: number): string {
  // Round first: splitting 119.7 s before rounding gives "1:60".
  const total = Math.round(seconds);
  if (total <= 0) return "0 s";
  if (total < 60) return `${total} s`;
  const minutes = Math.floor(total / 60);
  const rest = total % 60;
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}
