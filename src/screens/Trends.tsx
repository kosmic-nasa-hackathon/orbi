import { useMemo, useState } from "react";
import { TrendChart } from "../components/charts/TrendChart";
import { DemoBar } from "../components/DemoBar";
import { Reveal } from "../components/motion/Reveal";
import { LevelBadge } from "../components/ui/Badge";
import { Card } from "../components/ui/Card";
import { Metric } from "../components/ui/Metric";
import { Panel } from "../components/ui/Panel";
import { type TabItem, Tabs, tabPanelProps } from "../components/ui/Tabs";
import { REPRODUCTIVE_PREVIEW } from "../content/reproductive";
import { SYSTEM_INFO } from "../content/systems";
import { LEVEL_HINT } from "../domain/levels";
import { buildSeries, SYSTEM_VITAL, type VitalField } from "../domain/series";
import { type Evaluation, SYSTEM_IDS, type SystemId } from "../domain/types";
import { useEvaluation, useOrbiStore, useScenario } from "../store/orbiStore";

/** Every body system plus the designed reproductive system (demo values, not in the engine). */
type TrendTab = SystemId | "reproductive";

const VITAL: Record<VitalField, { label: string; unit: string; decimals: number }> = {
  tempC: { label: "Temperature", unit: "°C", decimals: 1 },
  restingHr: { label: "Resting heart rate", unit: "bpm", decimals: 0 },
  spo2: { label: "SpO₂", unit: "%", decimals: 0 },
  glucoseMgDl: { label: "Glucose", unit: "mg/dL", decimals: 0 },
  sleepHours: { label: "Sleep", unit: "h", decimals: 1 },
  resistiveExerciseMin: { label: "Resistive exercise", unit: "min", decimals: 0 },
};

const TABS: TabItem<TrendTab>[] = [
  ...SYSTEM_IDS.map((id) => ({ id, label: SYSTEM_INFO[id].label })),
  { id: "reproductive", label: "Reproductive" },
];
const TABS_ID = "trends";

export default function Trends() {
  const scenario = useScenario();
  const evaluation = useEvaluation();
  const day = useOrbiStore((state) => state.day);
  const [tab, setTab] = useState<TrendTab>("immune");
  const missionDays = Math.min(
    30,
    scenario.readings.filter((r) => r.day > 0 && r.day <= day).length,
  );

  return (
    <div className="mx-auto flex max-w-[1180px] flex-col gap-6 px-4 py-8 sm:px-6">
      <DemoBar />

      <header>
        <p className="font-mono text-label font-medium text-faint uppercase">
          Last {missionDays} mission days · up to day {day}
        </p>
        <h1 className="mt-1 font-display text-headline font-semibold">Trends</h1>
        <p className="mt-1 text-lead text-muted">How has my body drifted from my normal?</p>
      </header>

      <Tabs
        label="Body system"
        idBase={TABS_ID}
        items={TABS}
        value={tab}
        onChange={setTab}
        className="flex-wrap"
      />

      <Reveal key={`${tab}:${scenario.id}`}>
        {tab === "reproductive" ? (
          <ReproductiveTrend />
        ) : tab === "radiation" ? (
          <RadiationTrend evaluation={evaluation} />
        ) : (
          <VitalTrend system={tab} field={SYSTEM_VITAL[tab] ?? "tempC"} evaluation={evaluation} />
        )}
      </Reveal>
    </div>
  );
}

function VitalTrend({
  system,
  field,
  evaluation,
}: {
  system: SystemId;
  field: VitalField;
  evaluation: Evaluation;
}) {
  const scenario = useScenario();
  const day = useOrbiStore((state) => state.day);
  const vital = VITAL[field];
  const series = useMemo(
    () => buildSeries(scenario, field, day, { sigmas: 2 }),
    [scenario, field, day],
  );
  const level = evaluation.bySystem[system];
  const latest = series.points.at(-1);
  const mission = series.points.filter((point) => point.phase === "mission");
  const outside = mission.filter((point) => point.outsideNormal).length;
  const format = (value: number) => value.toFixed(vital.decimals);

  return (
    <Panel
      {...tabPanelProps(TABS_ID, system)}
      kicker={SYSTEM_INFO[system].label}
      title={vital.label}
      actions={
        <div className="flex items-center gap-2">
          <LevelBadge level={level} />
          <span className="hidden text-caption text-muted sm:inline">{LEVEL_HINT[level]}</span>
        </div>
      }
    >
      <TrendChart series={series} unit={vital.unit} decimals={vital.decimals} label={vital.label} />

      <ul
        aria-label="Legend"
        className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-caption text-muted"
      >
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-0.5 w-5 rounded bg-accent" />
          Mission
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-0 w-5 border-t-2 border-dashed border-muted" />
          Ground training
        </li>
        <li className="flex items-center gap-2">
          <span aria-hidden="true" className="h-3 w-5 rounded-sm bg-accent-soft" />
          Your normal (±{series.normal.sigmas} SD of {series.normal.n} training days)
        </li>
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-2.5 w-2.5 rounded-full border-2 border-accent bg-surface"
          />
          Outside your normal
        </li>
      </ul>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Card>
          <Metric
            label={`Day ${latest?.day ?? day}`}
            value={latest ? format(latest.value) : "—"}
            unit={vital.unit}
          />
        </Card>
        <Card>
          <Metric
            label="Your normal"
            value={`${format(series.normal.low)}–${format(series.normal.high)}`}
            unit={vital.unit}
          />
        </Card>
        <Card>
          <Metric label="Days outside normal" value={outside} unit={`of ${mission.length}`} />
        </Card>
      </div>
      <p className="mt-4 text-caption text-muted">
        {system === "msk"
          ? `Bone loss cannot be measured in flight, so this tab charts its countermeasure. Estimated loss so far: ${evaluation.estimates.boneLossPct.min}–${evaluation.estimates.boneLossPct.max}% (NASA HRP evidence). `
          : ""}
        The level comes from the rules engine. The band only shows where your ground-training
        readings sat.
      </p>
    </Panel>
  );
}

function RadiationTrend({ evaluation }: { evaluation: Evaluation }) {
  const level = evaluation.bySystem.radiation;
  const { radiationDoseMSv, radiationBudgetMSv, radiationPct } = evaluation.estimates;
  return (
    <Panel
      {...tabPanelProps(TABS_ID, "radiation")}
      kicker={SYSTEM_INFO.radiation.label}
      title="Mission dose against the budget"
      actions={
        <div className="flex items-center gap-2">
          <LevelBadge level={level} />
          <span className="hidden text-caption text-muted sm:inline">{LEVEL_HINT[level]}</span>
        </div>
      }
    >
      {/* Decorative bar; the "Budget used" metric below carries the value as text. */}
      <div aria-hidden="true" className="h-3 overflow-hidden rounded-full bg-surface-strong">
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${Math.min(100, radiationPct)}%` }}
        />
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Card>
          <Metric label="Dose so far" value={radiationDoseMSv} unit="mSv" />
        </Card>
        <Card>
          <Metric label="Budget used" value={radiationPct} unit="%" />
        </Card>
        <Card>
          <Metric label="Mission budget" value={radiationBudgetMSv} unit="mSv" />
        </Card>
      </div>
      <p className="mt-4 text-caption text-muted">{SYSTEM_INFO.radiation.why}</p>
    </Panel>
  );
}

function ReproductiveTrend() {
  return (
    <Panel
      {...tabPanelProps(TABS_ID, "reproductive")}
      kicker={REPRODUCTIVE_PREVIEW.title}
      title={REPRODUCTIVE_PREVIEW.finding}
      actions={
        <div className="flex items-center gap-2">
          <LevelBadge level={REPRODUCTIVE_PREVIEW.level} />
          <span className="rounded-full border border-line-strong px-2 py-0.5 font-mono text-label text-muted uppercase">
            {REPRODUCTIVE_PREVIEW.demoTag}
          </span>
        </div>
      }
    >
      <p className="text-body">{REPRODUCTIVE_PREVIEW.trend}</p>
      <p className="mt-4 text-caption text-muted">{REPRODUCTIVE_PREVIEW.pending}</p>
    </Panel>
  );
}
