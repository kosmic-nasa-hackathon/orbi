import { clsx } from "clsx";
import { ChevronDown, Dna, Lock, ShieldCheck, Venus } from "lucide-react";
import { useState } from "react";
import { BodySceneView } from "../components/body/BodySceneView";
import { DemoBar } from "../components/DemoBar";
import { FlowSteps } from "../components/flow/FlowSteps";
import { NextStep } from "../components/flow/NextStep";
import { TrafficBadge } from "../components/flow/TrafficBadge";
import { TONE_CLASS, TRAFFIC } from "../components/flow/traffic";
import { Card } from "../components/ui/Card";
import { CYCLE_CARD, CYCLE_NOTE } from "../content/cycle";
import { REPRODUCTIVE_PREVIEW } from "../content/reproductive";
import { SYSTEM_INFO } from "../content/systems";
import {
  type Assessment,
  type DailyReading,
  type Evaluation,
  LEVEL_ORDER,
  type Level,
  SYSTEM_IDS,
  type SystemId,
} from "../domain/types";
import { useEvaluation, useOrbiStore, useReading } from "../store/orbiStore";

const MAX_REASONS = 3;

interface SystemRow {
  id: SystemId;
  level: Level;
  assessment?: Assessment;
}

/**
 * Step 2 of the daily flow: the body in orbit next to one line per system. Tapping a zone,
 * a satellite or a line opens that system's reason. Levels come from evaluate().
 */
export default function Body() {
  const evaluation = useEvaluation();
  const reading = useReading();
  const scenarioId = useOrbiStore((state) => state.scenarioId);
  const rows: SystemRow[] = SYSTEM_IDS.map((id) => ({
    id,
    level: evaluation.bySystem[id],
    assessment: evaluation.assessments.find((assessment) => assessment.system === id),
  })).sort((a, b) => LEVEL_ORDER[b.level] - LEVEL_ORDER[a.level]);
  const flagged = rows.filter((row) => row.level !== "NOMINAL");

  return (
    <div className="mx-auto flex max-w-[1180px] flex-col gap-6 px-4 py-6 sm:px-6">
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

      <BodyMap
        key={`${scenarioId}:${evaluation.day}`}
        rows={rows}
        evaluation={evaluation}
        reading={reading}
      />

      <NextStep to="decision" label="See what to do" />
    </div>
  );
}

function BodyMap({
  rows,
  evaluation,
  reading,
}: {
  rows: SystemRow[];
  evaluation: Evaluation;
  reading: DailyReading | undefined;
}) {
  const flagged = rows.filter((row) => row.level !== "NOMINAL");
  const allGood = rows.filter((row) => row.level === "NOMINAL");
  const [selected, setSelected] = useState<SystemId>(rows[0]?.id ?? "immune");
  const [allGoodOpen, setAllGoodOpen] = useState(flagged.length === 0);
  const [cycleOpen, setCycleOpen] = useState(false);

  function select(system: SystemId) {
    setSelected(system);
    if (allGood.some((row) => row.id === system)) setAllGoodOpen(true);
  }

  function openCycle() {
    setCycleOpen(true);
    document
      .getElementById(CYCLE_CARD_ID)
      ?.scrollIntoView?.({ block: "nearest", behavior: "smooth" });
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <Card className="p-2 sm:p-3 lg:self-center">
        <BodySceneView
          evaluation={evaluation}
          reading={reading}
          selected={selected}
          onSelect={select}
        />
      </Card>

      <div className="flex flex-col gap-3">
        {flagged.length > 0 && (
          <ul aria-label="Need attention" className="flex flex-col gap-3">
            {flagged.map((row) => (
              <li key={row.id}>
                <SystemLine
                  row={row}
                  selected={selected === row.id}
                  onSelect={select}
                  onOpenCycle={openCycle}
                />
              </li>
            ))}
          </ul>
        )}

        {allGood.length > 0 && (
          <details
            className="group rounded-2xl border border-line bg-surface"
            open={allGoodOpen}
            onToggle={(event) => setAllGoodOpen(event.currentTarget.open)}
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
            <ul aria-label="All good" className="flex flex-col gap-2 px-3 pb-3">
              {allGood.map((row) => (
                <li key={row.id}>
                  <SystemLine
                    row={row}
                    selected={selected === row.id}
                    onSelect={select}
                    onOpenCycle={openCycle}
                    compact
                  />
                </li>
              ))}
            </ul>
          </details>
        )}

        <CycleCard open={cycleOpen} onToggle={setCycleOpen} />
        <ReproductivePreview />
      </div>
    </div>
  );
}

const CYCLE_CARD_ID = "cycle-card";

/**
 * Women's-health context: how the cycle moves the signals ORBI watches. Folded to one line with
 * the two ranges; the rest opens on demand. Copy only, no levels.
 */
function CycleCard({ open, onToggle }: { open: boolean; onToggle: (open: boolean) => void }) {
  const cycleAware = useOrbiStore((state) => state.cycleAware);
  return (
    <section aria-labelledby={`${CYCLE_CARD_ID}-title`}>
      <details
        id={CYCLE_CARD_ID}
        open={open}
        onToggle={(event) => onToggle(event.currentTarget.open)}
        className="group rounded-2xl border border-accent/30 bg-accent-soft"
      >
        <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
          <Venus className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
          <span className="flex min-w-0 flex-1 flex-col">
            <span id={`${CYCLE_CARD_ID}-title`} className="text-body font-semibold">
              {CYCLE_CARD.title}
            </span>
            <span className="text-caption text-muted tabular-nums">
              {CYCLE_CARD.ranges.map((range) => range.value).join(" · ")}
            </span>
          </span>
          <ChevronDown
            className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="flex flex-col gap-3 px-4 pb-4 text-caption">
          <p className="flex items-start gap-2 text-muted">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {CYCLE_CARD.privacy}
          </p>
          <dl className="grid grid-cols-2 gap-2">
            {CYCLE_CARD.ranges.map((range) => (
              <div key={range.label} className="rounded-xl bg-surface px-3 py-2">
                <dt className="text-muted">{range.label}</dt>
                <dd className="font-semibold tabular-nums">{range.value}</dd>
              </div>
            ))}
          </dl>
          <p>{CYCLE_CARD.why}</p>
          <p className="text-muted">Cycle-aware baseline: {cycleAware ? "on" : "off"}</p>
        </div>
      </details>
    </section>
  );
}

const REPRODUCTIVE_ID = "reproductive-preview";

/**
 * The designed seventh system, shown as a folded preview. It has no traffic light because the
 * engine does not evaluate it yet; it lists what ORBI would track and how privacy works.
 */
function ReproductivePreview() {
  return (
    <section aria-labelledby={`${REPRODUCTIVE_ID}-title`}>
      <details id={REPRODUCTIVE_ID} className="group rounded-2xl border border-line bg-surface">
        <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3">
          <Dna className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
          <span className="flex min-w-0 flex-1 flex-col">
            <span id={`${REPRODUCTIVE_ID}-title`} className="text-body font-semibold">
              {REPRODUCTIVE_PREVIEW.title}
            </span>
            <span className="text-caption text-muted">{REPRODUCTIVE_PREVIEW.summary}</span>
          </span>
          <ChevronDown
            className="h-4 w-4 shrink-0 text-muted transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        <div className="flex flex-col gap-3 px-4 pb-4 text-caption">
          <span className="self-start rounded-full border border-line-strong px-2 py-0.5 font-mono text-label text-muted uppercase">
            {REPRODUCTIVE_PREVIEW.badge}
          </span>
          <p>{REPRODUCTIVE_PREVIEW.why}</p>
          <dl className="flex flex-col gap-2">
            {REPRODUCTIVE_PREVIEW.groups.map((group) => (
              <div key={group.label} className="rounded-xl bg-surface-strong px-3 py-2">
                <dt className="text-muted">{group.label}</dt>
                {group.items.map((item) => (
                  <dd key={item} className="font-medium">
                    {item}
                  </dd>
                ))}
              </div>
            ))}
          </dl>
          <p className="flex items-start gap-2">
            <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
            {REPRODUCTIVE_PREVIEW.safety}
          </p>
          <p className="flex items-start gap-2 text-muted">
            <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {REPRODUCTIVE_PREVIEW.privacy}
          </p>
          <p className="text-muted">{REPRODUCTIVE_PREVIEW.pending}</p>
        </div>
      </details>
    </section>
  );
}

function SystemLine({
  row,
  selected,
  onSelect,
  onOpenCycle,
  compact = false,
}: {
  row: SystemRow;
  selected: boolean;
  onSelect: (system: SystemId) => void;
  onOpenCycle: () => void;
  compact?: boolean;
}) {
  const info = SYSTEM_INFO[row.id];
  const tone = TONE_CLASS[TRAFFIC[row.level].tone];
  const detailId = `system-${row.id}-detail`;

  return (
    <div
      className={clsx(
        "rounded-2xl border bg-surface transition-colors",
        compact ? "border-line" : clsx("border-l-4", tone.border),
        selected && "ring-2 ring-accent/40",
      )}
    >
      <button
        type="button"
        aria-expanded={selected}
        aria-controls={detailId}
        onClick={() => onSelect(row.id)}
        className={clsx(
          "flex w-full items-center gap-4 text-left",
          compact ? "px-3 py-2" : "px-4 py-3",
        )}
      >
        <span
          aria-hidden="true"
          className={clsx("mt-2 h-3 w-3 shrink-0 self-start rounded-full", tone.solid)}
        />
        <span className="flex min-w-0 flex-1 flex-col gap-1">
          <span className={clsx("font-semibold", compact ? "text-body" : "text-lead")}>
            {info.label}
          </span>
          {!compact && <TrafficBadge level={row.level} className="self-start" />}
          <span className="truncate text-caption text-muted">
            {row.assessment?.title ?? info.short}
          </span>
        </span>
      </button>

      {selected && (
        <div id={detailId} className="flex flex-col gap-3 px-4 pb-4">
          {compact && <TrafficBadge level={row.level} className="self-start" />}
          {row.assessment && (
            <ul className="flex flex-col gap-1.5">
              {row.assessment.because.slice(0, MAX_REASONS).map((line) => (
                <li key={line} className="flex items-start gap-2 text-caption">
                  <span
                    aria-hidden="true"
                    className={clsx("mt-2 h-1.5 w-1.5 shrink-0 rounded-full", tone.solid)}
                  />
                  {line}
                </li>
              ))}
            </ul>
          )}
          {CYCLE_NOTE[row.id] && <CycleNote system={row.id} onOpen={onOpenCycle} />}
          <details className="rounded-xl bg-surface-strong px-3 py-2">
            <summary className="cursor-pointer text-caption text-muted">Why this matters</summary>
            <p className="mt-2 text-caption">{info.why}</p>
          </details>
        </div>
      )}
    </div>
  );
}

function CycleNote({ system, onOpen }: { system: SystemId; onOpen: () => void }) {
  const note = CYCLE_NOTE[system];
  if (!note) return null;
  return (
    <button
      type="button"
      onClick={onOpen}
      title={note.text}
      className="flex items-center gap-2 rounded-xl border border-accent/30 bg-accent-soft px-3 py-2 text-left text-caption"
    >
      <Venus className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
      {note.short}
    </button>
  );
}
