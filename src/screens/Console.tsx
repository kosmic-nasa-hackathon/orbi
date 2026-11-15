import { SquareTerminal, TriangleAlert } from "lucide-react";
import { useMemo, useState } from "react";
import { askCoach } from "../ai/coach";
import { createTemplateCoach } from "../ai/providers/template";
import { buildCoachRequest } from "../ai/types";
import { RuleFlow } from "../components/engine-flow/RuleFlow";
import { Tabs, tabPanelProps } from "../components/ui";
import { LEVEL_BG, LEVEL_COLOR, SYSTEM_INFO } from "../content/systems";
import { scenarios } from "../data/scenarios";
import { evaluate } from "../domain/evaluate";
import { LEVEL_LABEL } from "../domain/levels";
import { SOURCES } from "../domain/rules";
import { type Mission, SYSTEM_IDS } from "../domain/types";

const MISSIONS: Mission[] = ["ISS", "MOON", "MARS"];

type ConsoleTab = "overview" | "facts" | "rule-flow";

const CONSOLE_TABS: { id: ConsoleTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "facts", label: "Facts" },
  { id: "rule-flow", label: "Rule flow" },
];

const TOTAL_SOURCES = Object.keys(SOURCES).length;
const PENDING_SOURCES = Object.values(SOURCES).filter((source) => !source.verified).length;

function latencyLabel(seconds: number): string {
  if (seconds < 1) return "0 s";
  if (seconds < 60) return `${seconds.toFixed(1)} s`;
  return `${Math.round(seconds / 60)} min`;
}

export default function Console() {
  const [scenarioId, setScenarioId] = useState(scenarios[1]?.id ?? scenarios[0]!.id);
  const scenario = scenarios.find((s) => s.id === scenarioId) ?? scenarios[0]!;
  const lastDay = scenario.readings[scenario.readings.length - 1]!.day;
  const [day, setDay] = useState(lastDay);
  const [mission, setMission] = useState<Mission>("MARS");
  const [coachText, setCoachText] = useState<string | null>(null);
  const [coachBusy, setCoachBusy] = useState(false);
  const [tab, setTab] = useState<ConsoleTab>("overview");

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
    <div className="mx-auto flex min-h-full max-w-[1500px] flex-col gap-5 px-4 pb-10 pt-6 sm:px-6">
      <header className="flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.07] pb-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-200">
            <SquareTerminal className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-cyan-300/60 uppercase">
              NASA Space Apps 2026 · Kosmic
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-[-0.035em]">
              Engine console
            </h1>
            <p className="mt-1 text-sm text-muted">
              Deterministic rules, scenarios and the facts the coach can use.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 font-mono text-[11px] tracking-[0.12em] uppercase">
          <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5 text-white/60">
            Day {day} · {reading?.day === day ? "check-in loaded" : "no reading"}
          </span>
          <span className="rounded-full border border-cyan-400/25 bg-cyan-400/[0.08] px-3 py-1.5 text-cyan-200/85">
            {mission} · {latencyLabel(evaluation.latencySeconds)} one-way
          </span>
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs
          idBase="console"
          label="Engine console views"
          items={CONSOLE_TABS}
          value={tab}
          onChange={setTab}
        />
        <div className="flex flex-wrap items-center gap-3">
          <p
            className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-300/[0.08] px-2.5 py-1 font-mono text-[11px] tracking-[0.08em] text-amber-100/90 uppercase"
            title="Thresholds whose primary source is still being checked (src/domain/rules.ts)"
          >
            <TriangleAlert className="h-3 w-3" aria-hidden="true" />
            {PENDING_SOURCES} of {TOTAL_SOURCES} sources pending verification
          </p>
          <p className="font-mono text-label text-faint uppercase">
            Signal → rule → level → action
          </p>
        </div>
      </div>

      <div
        {...tabPanelProps("console", "overview")}
        hidden={tab !== "overview"}
        className="flex flex-col gap-5"
      >
        <section className="grid gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.022] p-4 lg:grid-cols-[1.2fr_0.9fr_1fr]">
          <label className="flex flex-col gap-1.5 font-mono text-[11px] tracking-[0.14em] text-faint uppercase">
            Scenario
            <select
              className="rounded-lg border border-white/10 bg-[#0b111c] px-3 py-2 font-sans text-sm tracking-normal text-white normal-case"
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
          <div className="flex flex-col gap-1.5 font-mono text-[11px] tracking-[0.14em] text-faint uppercase">
            Mission
            <div className="flex gap-1">
              {MISSIONS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMission(m)}
                  className={`flex-1 rounded-lg border px-3 py-2 font-sans text-sm tracking-normal normal-case ${
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
          <label className="flex flex-col gap-1.5 font-mono text-[11px] tracking-[0.14em] text-faint uppercase">
            Mission day <span className="text-white/80">{day}</span>
            <input
              type="range"
              min={scenario.firstMissionDay}
              max={lastDay}
              value={day}
              onChange={(event) => setDay(Number(event.target.value))}
              className="mt-2 accent-cyan-400"
            />
          </label>
        </section>

        <div className="grid gap-4 lg:grid-cols-[1.05fr_1fr]">
          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.022] p-4">
            <h2 className="font-display text-sm font-medium text-white/75">Body map</h2>
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
                      <span className="font-mono text-[11px] tracking-[0.1em] text-white/55 uppercase">
                        {LEVEL_LABEL[level]}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium">{SYSTEM_INFO[id].label}</p>
                    <p className="text-[11px] text-muted">{SYSTEM_INFO[id].short}</p>
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

          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.022] p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-display text-sm font-medium text-white/75">Assessments</h2>
              <button
                type="button"
                onClick={runCoach}
                disabled={coachBusy}
                className="rounded-lg border border-cyan-400/35 bg-cyan-400/[0.08] px-3 py-1.5 font-mono text-[11px] tracking-[0.08em] text-cyan-100 uppercase transition hover:bg-cyan-400/[0.14] disabled:opacity-50"
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
                      className="font-mono text-[11px] tracking-[0.1em] uppercase"
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
                  <p className="mt-1 text-[11px] text-faint">{assessment.source[0]?.label}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div {...tabPanelProps("console", "facts")} hidden={tab !== "facts"}>
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.022] p-4">
          <h2 className="font-display text-sm font-medium text-white/75">
            Facts consumed by the coach
          </h2>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {evaluation.facts.map((fact) => (
              <div key={fact.id} className="rounded-xl border border-white/[0.08] bg-black/20 p-3">
                <p className="font-mono text-[11px] tracking-[0.12em] text-faint uppercase">
                  {fact.label}
                </p>
                <p className="mt-1 text-xs text-white/65">{fact.value}</p>
                {fact.source && <p className="mt-1 text-[11px] text-faint">{fact.source}</p>}
              </div>
            ))}
          </div>
        </section>
      </div>

      <div {...tabPanelProps("console", "rule-flow")} hidden={tab !== "rule-flow"}>
        <RuleFlow evaluation={evaluation} scenario={scenario} onScenarioChange={selectScenario} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-black/20 p-2.5">
      <p className="font-mono text-[11px] tracking-[0.12em] text-faint uppercase">{label}</p>
      <p className="mt-0.5 font-mono text-sm font-medium text-white/85 tabular-nums">{value}</p>
    </div>
  );
}
