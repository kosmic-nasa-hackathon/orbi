import clsx from "clsx";
import {
  Activity,
  Battery,
  HeartPulse,
  Orbit,
  Pause,
  Play,
  Radio,
  RefreshCw,
  RotateCcw,
  Thermometer,
  Timer,
  WifiOff,
  Wind,
} from "lucide-react";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { AuditLog } from "../components/eva/AuditLog";
import { EvaMap } from "../components/eva/EvaMap";
import { ReturnPanel } from "../components/eva/ReturnPanel";
import { SyncBadge } from "../components/eva/SyncBadge";
import { LEVEL_BG, LEVEL_COLOR } from "../content/systems";
import { scenarios } from "../data/scenarios";
import { evaluate } from "../domain/evaluate";
import { LEVEL_LABEL } from "../domain/levels";
import type { Level } from "../domain/types";
import {
  createEvaState,
  type EvaConfig,
  type LinkControl,
  returnGuidance,
  stepEva,
} from "../simulation/eva";

const scenario = scenarios.find((item) => item.id === "early-infection") ?? scenarios[0]!;
const day = scenario.readings.at(-1)!.day;
const reading = scenario.readings.find((item) => item.day === day)!;
const evaluation = evaluate(scenario, day, "MARS");
const topAssessment = evaluation.assessments[0];
const topLevel: Level = topAssessment?.level ?? "NOMINAL";

const evaConfig: EvaConfig = {
  telemetry: {
    heartRate: Math.round(reading.restingHr + 45),
    spo2: Math.max(90, reading.spo2 - 2),
    tempC: reading.tempC,
    o2Pct: 62,
  },
  clinicalLevel: topLevel,
  clinicalLabel: topAssessment?.title ?? "All systems nominal",
};

/** Seconds requested by a `?t=` deep link, or null without one. */
function deepLinkSeconds(): number | null {
  if (typeof window === "undefined") return null;
  const requested = Number(new URLSearchParams(window.location.search).get("t"));
  return Number.isFinite(requested) && requested > 0 ? requested : null;
}

/** A deep link pre-advances the demo with auto-return on, so the controls must start the same way. */
const DEEP_LINK_AUTO_RETURN = true;

function initialEvaState(): ReturnType<typeof createEvaState> {
  const base = createEvaState(evaConfig);
  const requested = deepLinkSeconds();
  if (requested === null) return base;

  let state = base;
  const controls = {
    link: "auto" as LinkControl,
    returnRequested: false,
    autoReturn: DEEP_LINK_AUTO_RETURN,
  };
  for (let elapsed = 0; elapsed < Math.min(requested, 47); elapsed += 0.1) {
    state = stepEva(state, 0.1, controls);
  }
  return state;
}

export default function Eva() {
  const [state, setState] = useState(initialEvaState);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [linkControl, setLinkControl] = useState<LinkControl>("auto");
  const [autoReturn, setAutoReturn] = useState(() =>
    deepLinkSeconds() === null ? false : DEEP_LINK_AUTO_RETURN,
  );
  const [returnRequested, setReturnRequested] = useState(false);

  const controlsRef = useRef({ link: linkControl, returnRequested, autoReturn });
  const pausedRef = useRef(paused);
  const speedRef = useRef(speed);

  useEffect(() => {
    controlsRef.current = { link: linkControl, returnRequested, autoReturn };
  }, [linkControl, returnRequested, autoReturn]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const delta = Math.min(0.25, ((now - last) / 1000) * speedRef.current);
      last = now;
      if (!pausedRef.current) {
        setState((current) => stepEva(current, delta, controlsRef.current));
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (state.returnMode === "ACTIVE" || state.returnMode === "COMPLETE") {
      setReturnRequested(false);
    }
  }, [state.returnMode]);

  const guidance = returnGuidance(state);
  const linkAge = state.elapsed - state.linkSince;
  const lost = state.link === "LOST";

  function reset() {
    const controls = { link: "auto" as LinkControl, returnRequested: false, autoReturn: false };
    controlsRef.current = controls;
    pausedRef.current = false;
    speedRef.current = 1;
    setState(createEvaState(evaConfig));
    setPaused(false);
    setSpeed(1);
    setLinkControl(controls.link);
    setAutoReturn(controls.autoReturn);
    setReturnRequested(false);
  }

  return (
    <div className="mx-auto flex min-h-full max-w-[1500px] flex-col gap-4 px-4 pt-6 pb-10 sm:px-6">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-white/[0.07] pb-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-200">
            <Orbit className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="font-mono text-[9px] tracking-[0.22em] text-cyan-300/60 uppercase">
              NASA Space Apps 2026 · Kosmic
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-[-0.035em]">
              EVA autonomy <span className="text-white/35">· suit demo</span>
            </h1>
            <p className="mt-1 text-sm text-white/45">
              When the link disappears, the suit keeps deciding.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 font-mono text-[9px] tracking-[0.12em] text-white/50 uppercase">
            Simulation · day {day} · Mars
          </span>
          <SyncBadge link={state.link} age={linkAge} />
        </div>
      </header>

      {lost && (
        <div className="orbi-pulse flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-sm text-red-50">
          <span className="inline-flex items-center gap-2 font-medium">
            <WifiOff className="h-4 w-4" aria-hidden="true" />
            NO SYNC — suit is on local autonomy
          </span>
          <span className="text-[11px] text-red-100/70">
            {state.outbox} events queued · inertial drift ±{state.drift.toFixed(1)} m
          </span>
        </div>
      )}

      {guidance.active && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-cyan-400/35 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-50">
          <span className="inline-flex items-center gap-2 font-medium">
            <Timer className="h-4 w-4" aria-hidden="true" />
            Inertial return active — follow the dashed line to the airlock
          </span>
          <span className="text-[11px] text-cyan-100/70">
            {Math.round(guidance.distanceM)} m · ETA {Math.round(guidance.etaSeconds)} s
          </span>
        </div>
      )}

      <section className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <Metric
          label="Link age"
          value={lost ? `${Math.round(linkAge)} s` : "live"}
          detail={lost ? "since sync lost" : "central handshake"}
          tone={lost ? "danger" : "ok"}
        />
        <Metric
          label="Inertial drift"
          value={`±${state.drift.toFixed(1)} m`}
          detail={state.drift > 6 ? "growing without fix" : "within guidance"}
          tone={state.drift > 6 ? "warn" : "ok"}
        />
        <Metric
          label="Outbox"
          value={String(state.outbox)}
          detail={state.outbox > 0 ? "store-and-forward" : "queue empty"}
          tone={state.outbox > 0 ? "warn" : "ok"}
        />
        <Metric
          label="O₂ reserve"
          value={`${Math.round(state.telemetry.o2Pct)}%`}
          detail={`return uses ${Math.round(guidance.etaSeconds / 8)}%`}
          tone={state.telemetry.o2Pct < 55 ? "danger" : state.telemetry.o2Pct < 70 ? "warn" : "ok"}
        />
        <Metric
          label="Clinical"
          value={LEVEL_LABEL[topLevel]}
          detail={topAssessment?.title ?? "All systems nominal"}
          tone={topLevel === "NOMINAL" ? "ok" : topLevel === "WATCH" ? "warn" : "danger"}
        />
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr_0.9fr]">
        <Panel
          title="Suit HUD"
          subtitle="Local estimate · inertial navigation"
          legend={
            <Legend
              items={[
                { color: "bg-amber-300", label: "estimate" },
                { color: "bg-cyan-300", label: "actual" },
                { color: "bg-cyan-400", label: "return" },
              ]}
            />
          }
        >
          <div className="aspect-square w-full">
            <EvaMap state={state} view="suit" />
          </div>
        </Panel>

        <Panel
          title="Central"
          subtitle="Last known · delayed telemetry"
          legend={
            <Legend
              items={[
                { color: "bg-emerald-300", label: "received" },
                { color: "bg-red-300", label: "last known" },
              ]}
            />
          }
        >
          <div className="aspect-square w-full">
            <EvaMap state={state} view="central" />
          </div>
        </Panel>

        <div className="flex flex-col gap-4">
          <ReturnPanel
            guidance={guidance}
            onReturn={() => setReturnRequested(true)}
            disabled={paused}
          />

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-medium uppercase tracking-[0.18em] text-white/45">
                Suit telemetry
              </h2>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide"
                style={{ color: LEVEL_COLOR[topLevel], background: LEVEL_BG[topLevel] }}
              >
                {LEVEL_LABEL[topLevel]}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Telemetry
                icon={HeartPulse}
                label="Heart rate"
                value={`${state.telemetry.heartRate} bpm`}
              />
              <Telemetry icon={Wind} label="SpO₂" value={`${state.telemetry.spo2}%`} />
              <Telemetry
                icon={Thermometer}
                label="Temperature"
                value={`${state.telemetry.tempC.toFixed(1)} °C`}
              />
              <Telemetry
                icon={Battery}
                label="O₂"
                value={`${Math.round(state.telemetry.o2Pct)}%`}
              />
            </div>
            <p className="mt-3 rounded-lg border border-white/10 bg-black/20 px-2.5 py-2 text-[10px] leading-relaxed text-white/40">
              EVA exertion is simulated. Clinical level still comes from the deterministic engine.
            </p>
          </section>

          <section className="min-h-[220px] flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <AuditLog entries={state.audit} />
          </section>
        </div>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/20 p-1">
            {(
              [
                { id: "auto", label: "Auto timeline", icon: Radio },
                { id: "lost", label: "Lose sync", icon: WifiOff },
                { id: "synced", label: "Reconnect", icon: RefreshCw },
              ] as const
            ).map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setLinkControl(item.id)}
                  className={clsx(
                    "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] transition",
                    linkControl === item.id
                      ? "bg-cyan-400/15 text-cyan-100"
                      : "text-white/45 hover:text-white/75",
                  )}
                >
                  <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <label className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-[11px] text-white/55">
            <input
              type="checkbox"
              checked={autoReturn}
              onChange={(event) => setAutoReturn(event.target.checked)}
              className="accent-cyan-400"
            />
            Auto-return after 10 s lost
          </label>

          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/20 p-1">
            {[1, 2, 4].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setSpeed(value)}
                className={clsx(
                  "rounded-lg px-2.5 py-1.5 text-[11px] tabular-nums transition",
                  speed === value ? "bg-cyan-400/15 text-cyan-100" : "text-white/45",
                )}
              >
                {value}×
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-[11px] text-white/65 hover:text-white/90"
            >
              {paused ? (
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <Pause className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-[11px] text-white/65 hover:text-white/90"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] text-white/30">
          <span>
            Deterministic EVA simulation · synthetic data · no real suit, no diagnosis, no
            treatment.
          </span>
          <span className="inline-flex items-center gap-1">
            <Activity className="h-3 w-3" aria-hidden="true" />
            T+{state.elapsed.toFixed(1)} s · {state.link.toLowerCase()}
          </span>
        </div>
      </section>
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: "ok" | "warn" | "danger";
}) {
  const style = {
    ok: "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-50",
    warn: "border-amber-400/25 bg-amber-400/[0.08] text-amber-50",
    danger: "border-red-400/30 bg-red-400/[0.1] text-red-50",
  }[tone];

  return (
    <div className={clsx("rounded-2xl border p-3", style)}>
      <p className="text-[10px] uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-0.5 text-lg font-semibold tabular-nums">{value}</p>
      <p className="text-[10px] text-white/40">{detail}</p>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  legend,
  children,
}: {
  title: string;
  subtitle: string;
  legend: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-sm font-medium text-white/80">{title}</h2>
          <p className="text-[10px] text-white/35">{subtitle}</p>
        </div>
        {legend}
      </div>
      {children}
    </section>
  );
}

function Legend({ items }: { items: { color: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-wide text-white/35">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1">
          <span className={clsx("h-1.5 w-1.5 rounded-full", item.color)} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function Telemetry({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof HeartPulse;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-2.5">
      <p className="flex items-center gap-1 text-[9px] uppercase tracking-wide text-white/35">
        <Icon className="h-3 w-3" aria-hidden="true" />
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium tabular-nums text-white/85">{value}</p>
    </div>
  );
}
