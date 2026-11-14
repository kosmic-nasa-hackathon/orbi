import { clsx } from "clsx";
import { ChevronDown } from "lucide-react";
import { DemoBar } from "../components/DemoBar";
import { FlowSteps } from "../components/flow/FlowSteps";
import { NextStep } from "../components/flow/NextStep";
import { TrafficBadge } from "../components/flow/TrafficBadge";
import { TONE_CLASS, TRAFFIC } from "../components/flow/traffic";
import { Reveal } from "../components/motion/Reveal";
import { SYSTEM_INFO } from "../content/systems";
import { LEVEL_ORDER, type Level, SYSTEM_IDS, type SystemId } from "../domain/types";
import { useEvaluation } from "../store/orbiStore";

interface SystemRow {
  id: SystemId;
  level: Level;
  reason?: string;
}

/** Step 2 of the daily flow: one line per system, coloured by the engine level. */
export default function Body() {
  const evaluation = useEvaluation();
  const rows: SystemRow[] = SYSTEM_IDS.map((id) => ({
    id,
    level: evaluation.bySystem[id],
    reason: evaluation.assessments.find((assessment) => assessment.system === id)?.title,
  })).sort((a, b) => LEVEL_ORDER[b.level] - LEVEL_ORDER[a.level]);
  const flagged = rows.filter((row) => row.level !== "NOMINAL");
  const allGood = rows.filter((row) => row.level === "NOMINAL");

  return (
    <div className="mx-auto flex max-w-[960px] flex-col gap-6 px-4 py-6 sm:px-6">
      <DemoBar />
      <FlowSteps current="body" />

      <header>
        <p className="font-mono text-label font-medium text-faint uppercase">
          Day {evaluation.day}
        </p>
        <h1 className="mt-1 font-display text-headline font-semibold">How your body is today</h1>
        <p className="mt-1 text-lead text-muted">
          {flagged.length === 0
            ? "Every system is inside your normal."
            : `${flagged.length} of ${rows.length} need your attention.`}
        </p>
      </header>

      {flagged.length > 0 && (
        <ul aria-label="Need attention" className="flex flex-col gap-3">
          {flagged.map((row, index) => (
            <li key={row.id}>
              <Reveal delay={index * 0.05}>
                <SystemLine row={row} />
              </Reveal>
            </li>
          ))}
        </ul>
      )}

      {allGood.length > 0 && (
        <details
          className="group rounded-2xl border border-line bg-surface"
          open={flagged.length === 0}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-body">
            <span className="flex items-center gap-3">
              <TrafficBadge level="NOMINAL" />
              {allGood.length} {allGood.length === 1 ? "system" : "systems"} all good
            </span>
            <ChevronDown
              className="h-4 w-4 text-muted transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <ul aria-label="All good" className="flex flex-col gap-2 px-4 pb-4">
            {allGood.map((row) => (
              <li key={row.id}>
                <SystemLine row={row} compact />
              </li>
            ))}
          </ul>
        </details>
      )}

      <NextStep to="decision" label="See what to do" />
    </div>
  );
}

function SystemLine({ row, compact = false }: { row: SystemRow; compact?: boolean }) {
  const info = SYSTEM_INFO[row.id];
  const tone = TONE_CLASS[TRAFFIC[row.level].tone];
  return (
    <div
      className={clsx(
        "flex items-center gap-4 rounded-2xl border bg-surface",
        compact ? "border-line px-3 py-2" : clsx("border-l-4 px-4 py-4", tone.border),
      )}
    >
      <span aria-hidden="true" className={clsx("h-3 w-3 shrink-0 rounded-full", tone.solid)} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={clsx("font-semibold", compact ? "text-body" : "text-lead")}>
          {info.label}
        </span>
        <span className="truncate text-caption text-muted">{row.reason ?? info.short}</span>
      </span>
      {!compact && <TrafficBadge level={row.level} />}
    </div>
  );
}
