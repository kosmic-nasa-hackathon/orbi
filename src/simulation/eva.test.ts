import { describe, expect, it } from "vitest";
import {
  AIRLOCK,
  createEvaState,
  distance,
  type EvaConfig,
  type EvaControls,
  type EvaState,
  formatEta,
  returnGuidance,
  stepEva,
} from "./eva";

const config: EvaConfig = {
  telemetry: { heartRate: 118, spo2: 96, tempC: 37.9, o2Pct: 62 },
  clinicalLevel: "CONCERN",
  clinicalLabel: "Possible early infection",
};

const synced: EvaControls = { link: "synced", returnRequested: false, autoReturn: false };
const lost: EvaControls = { link: "lost", returnRequested: false, autoReturn: false };

function run(state: EvaState, steps: number, controls: EvaControls): EvaState {
  let next = state;
  for (let i = 0; i < steps; i++) next = stepEva(next, 0.1, controls);
  return next;
}

describe("EVA inertial simulation", () => {
  it("starts synced with the central", () => {
    const state = createEvaState(config);
    expect(state.link).toBe("SYNCED");
    expect(state.drift).toBe(0);
    expect(state.centralPos).toEqual(state.truePos);
    expect(state.audit[0]?.text).toContain("EVA started");
  });

  it("keeps the inertial estimate aligned while sync is healthy", () => {
    const state = run(createEvaState(config), 40, synced);
    expect(state.link).toBe("SYNCED");
    expect(state.drift).toBe(0);
    expect(state.estPos).toEqual(state.truePos);
    expect(state.outbox).toBe(0);
  });

  it("drifts when sync is lost and freezes the central position", () => {
    const initial = createEvaState(config);
    const state = run(initial, 40, lost);
    expect(state.link).toBe("LOST");
    expect(state.drift).toBeGreaterThan(0);
    expect(state.centralPos).toEqual(initial.centralPos);
    expect(state.centralAt).toBe(0);
    expect(state.outbox).toBeGreaterThan(0);
    expect(state.audit.some((entry) => entry.text.includes("Sync lost"))).toBe(true);
  });

  it("recommends and then activates a return to the airlock", () => {
    const initial = createEvaState(config);
    const recommended = run(initial, 100, lost);
    expect(["RECOMMENDED", "ACTIVE"]).toContain(recommended.returnMode);

    const returning = run(initial, 10, { ...lost, returnRequested: true });
    expect(returning.returnMode).toBe("ACTIVE");

    const startDistance = distance(returning.estPos, AIRLOCK);
    const later = run(returning, 80, lost);
    expect(distance(later.estPos, AIRLOCK)).toBeLessThan(startDistance);
  });

  it("completes the return at the airlock", () => {
    const initial = createEvaState(config);
    const returning = run(initial, 10, { ...lost, returnRequested: true });
    const finished = run(returning, 400, lost);
    expect(finished.returnMode).toBe("COMPLETE");
    expect(finished.estPos).toEqual(AIRLOCK);
    expect(distance(finished.truePos, AIRLOCK)).toBeLessThan(0.001);
    expect(finished.audit.some((entry) => entry.text.includes("Airlock reached"))).toBe(true);
  });

  it("reconciles the position and flushes the outbox on reconnect", () => {
    const offline = run(createEvaState(config), 60, lost);
    expect(offline.outbox).toBeGreaterThan(0);

    const restored = stepEva(offline, 0.1, synced);
    expect(restored.link).toBe("SYNCED");
    expect(restored.drift).toBe(0);
    expect(restored.outbox).toBe(0);
    expect(restored.estPos).toEqual(restored.truePos);
    expect(restored.audit.some((entry) => entry.text.includes("Sync restored"))).toBe(true);
  });

  it("auto-returns after the link stays lost", () => {
    const state = run(createEvaState(config), 260, { ...lost, autoReturn: true });
    expect(state.returnMode === "ACTIVE" || state.returnMode === "COMPLETE").toBe(true);
  });

  it("exposes a grounded return rationale", () => {
    const state = run(createEvaState(config), 80, lost);
    const guidance = returnGuidance(state);
    expect(guidance.why.join(" ")).toContain("No sync");
    expect(guidance.why.join(" ")).toContain("Inertial drift");
    expect(guidance.etaSeconds).toBeGreaterThan(0);
    expect(guidance.urgency).toBe("recommended");
  });

  it("is deterministic", () => {
    const a = run(createEvaState(config), 120, lost);
    const b = run(createEvaState(config), 120, lost);
    expect(a).toEqual(b);
  });
});

describe("formatEta", () => {
  it("rounds before splitting minutes and seconds", () => {
    expect(formatEta(119.7)).toBe("2:00");
    expect(formatEta(59.5)).toBe("1:00");
    expect(formatEta(59.4)).toBe("59 s");
    expect(formatEta(61)).toBe("1:01");
  });

  it("never shows a negative or empty time", () => {
    expect(formatEta(0)).toBe("0 s");
    expect(formatEta(0.4)).toBe("0 s");
    expect(formatEta(-3)).toBe("0 s");
  });
});
