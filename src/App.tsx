import { useMemo, useState } from "react";
import { askCoach } from "./ai/coach";
import { createTemplateCoach } from "./ai/providers/template";
import { buildCoachRequest } from "./ai/types";
import { LEVEL_BG, LEVEL_COLOR, SYSTEM_INFO } from "./content/systems";
import { scenarios } from "./data/scenarios";
import { evaluate } from "./domain/evaluate";
import { LEVEL_LABEL } from "./domain/levels";
import { type Mission, SYSTEM_IDS } from "./domain/types";
import Eva from "./screens/Eva";

const MISSIONS: Mission[] = ["ISS", "MOON", "MARS"];
type View = "console" | "eva";

function latencyLabel(seconds: number): string {
  if (seconds < 1) return "0 s";
  if (seconds < 60) return `${seconds.toFixed(1)} s`;
  return `${Math.round(seconds / 60)} min`;
}

function EngineConsole({ onNavigate }: { onNavigate: (view: View) => void }) {
  const [scenarioId, setScenarioId] = useState(scenarios[1]?.id ?? scenarios[0]!.id);
  const scenario = scenarios.find((s) => s.id === scenarioId) ?? scenarios[0]!;
  const lastDay = scenario.readings[scenario.readings.length - 1]!.day;
  const [day, setDay] = useState(lastDay);
  const [mission, setMission] = useState<Mission>("MARS");
  const [coachText, setCoachText] = useState<string | null>(null);
  const [coachBusy, setCoachBusy] = useState(false);

  const evaluation = useMemo(() => evaluate(scenario, day, mission), [scenario, day, mission]);
  const reading = scenario.readings.filter((r) => r.day <= day).at(-1);

  function selectScenario(id: string) {
    setScenarioId(id);
    const next = scenarios.find((s) => s.id === id);
    if (next) setDay(next.readings[next.readings.length - 1]!.day);
    setCoachText(null);
  }

  async function runCoach() {
    setCoachBusy(true);
    try {
      const suggestion = await askCoach(buildCoachRequest(evaluation), createTemplateCoach());
      setCoachText(
        `${suggestion.summary}${suggestion.fallbackFrom ? ` [fallback: ${suggestion.fallbackFrom}]` : ""}`,
      );
    } finally {
      setCoachBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-5 p-4 pb-10 sm:p-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/70">
            NASA Space Apps 2026 · Kosmic
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            ORBI <span className="text-white/40">· engine console</span>
          </h1>
          <p className="mt-1 text-sm text-white/50">From drift to decision.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/70">
            Day {day} · {reading?.day === day ? "check-in loaded" : "no reading"}
          </span>
          <span className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-cyan-200">
            {mission} · {latencyLabel(evaluation.latencySeconds)} one-way
          </span>
          <button
            type="button"
            onClick={() => onNavigate("eva")}
            className="rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1.5 text-amber-100 hover:bg-amber-400/15"
          >
            EVA demo →
          </button>
        </div>
      </header>

      <section className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 lg:grid-cols-[1.2fr_0.9fr_1fr]">
        <label className="flex flex-col gap-1 text-xs text-white/50">
          Scenario
          <select
            className="rounded-lg border border-white/10 bg-[#0b111c] px-3 py-2 text-sm text-white"
            value={scenario.id}
            onChange={(event) => selectScenario(event.target.value)}
          >
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
        <div className="flex flex-col gap-1 text-xs text-white/50">
          Mission
          <div className="flex gap-1">
            {MISSIONS.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMission(m)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
                  mission === m
                    ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-100"
                    : "border-white/10 bg-white/[0.03] text-white/60"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <label className="flex flex-col gap-1 text-xs text-white/50">
          Mission day <span className="text-white/80">{day}</span>
          <input
            type="range"
            min={scenario.firstMissionDay}
            max={lastDay}
            value={day}
            onChange={(event) => setDay(Number(event.target.value))}
            className="accent-cyan-400"
          />
        </label>
      </section>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <h2 className="text-sm font-medium text-white/70">Body map</h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {SYSTEM_IDS.map((id) => {
              const level = evaluation.bySystem[id];
              return (
                <div
                  key={id}
                  className="rounded-xl border border-white/10 p-3"
                  style={{ background: LEVEL_BG[level] }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: LEVEL_COLOR[level] }}
                    />
                    <span className="text-xs uppercase tracking-wide text-white/60">
                      {LEVEL_LABEL[level]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium">{SYSTEM_INFO[id].label}</p>
                  <p className="text-[11px] text-white/45">{SYSTEM_INFO[id].short}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            <Stat
              label="Bone loss est."
              value={`${evaluation.estimates.boneLossPct.min}–${evaluation.estimates.boneLossPct.max}%`}
            />
            <Stat label="Radiation" value={`${evaluation.estimates.radiationPct}%`} />
            <Stat label="Dose" value={`${evaluation.estimates.radiationDoseMSv} mSv`} />
            <Stat label="Exercise" value={`${evaluation.estimates.exerciseAdherencePct}%`} />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-medium text-white/70">Assessments</h2>
            <button
              type="button"
              onClick={runCoach}
              disabled={coachBusy}
              className="rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-3 py-1.5 text-xs text-cyan-100 disabled:opacity-50"
            >
              {coachBusy ? "Thinking…" : "Ask ORBI (on-device)"}
            </button>
          </div>

          {coachText && (
            <div className="mt-3 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.07] p-3 text-sm leading-relaxed text-cyan-50/90">
              {coachText}
            </div>
          )}

          <div className="mt-3 space-y-2">
            {evaluation.assessments.length === 0 && (
              <p className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] p-3 text-sm text-emerald-100/80">
                All systems and the radiation halo are nominal today.
              </p>
            )}
            {evaluation.assessments.map((assessment) => (
              <article
                key={assessment.ruleId}
                className="rounded-xl border border-white/10 p-3"
                style={{ background: LEVEL_BG[assessment.level] }}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium">{assessment.title}</p>
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide"
                    style={{ color: LEVEL_COLOR[assessment.level] }}
                  >
                    {LEVEL_LABEL[assessment.level]}
                  </span>
                </div>
                <ul className="mt-2 space-y-1 text-xs text-white/60">
                  {assessment.because.map((line) => (
                    <li key={line}>· {line}</li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-white/80">
                  {assessment.escalation.now}
                  {assessment.escalation.next ? ` → ${assessment.escalation.next}` : ""}
                </p>
                <p className="mt-1 text-[11px] text-white/40">{assessment.source[0]?.label}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
        <h2 className="text-sm font-medium text-white/70">Facts consumed by the coach</h2>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {evaluation.facts.map((fact) => (
            <div key={fact.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
              <p className="text-xs font-medium text-white/80">{fact.label}</p>
              <p className="mt-1 text-xs text-white/55">{fact.value}</p>
              {fact.source && <p className="mt-1 text-[10px] text-white/35">{fact.source}</p>}
            </div>
          ))}
        </div>
      </section>

      <footer className="text-[11px] text-white/35">
        Deterministic engine · no diagnosis, no treatment · demo data is synthetic. Open the EVA
        demo to see the suit survive a loss of sync.
      </footer>
    </div>
  );
}

function initialView(): View {
  if (typeof window === "undefined") return "eva";
  return new URLSearchParams(window.location.search).get("view") === "console" ? "console" : "eva";
}

export default function App() {
  const [view, setView] = useState<View>(initialView);

  function navigate(next: View) {
    setView(next);
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    if (next === "console") url.searchParams.set("view", "console");
    else url.searchParams.delete("view");
    window.history.replaceState(null, "", url);
  }

  return view === "eva" ? <Eva onNavigate={navigate} /> : <EngineConsole onNavigate={navigate} />;
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-2.5">
      <p className="text-[10px] uppercase tracking-wide text-white/40">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-white/85">{value}</p>
    </div>
  );
}
