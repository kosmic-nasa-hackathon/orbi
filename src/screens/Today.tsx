import {
  CircleCheck,
  CircleDashed,
  Flame,
  Lock,
  type LucideIcon,
  TriangleAlert,
  Watch,
} from "lucide-react";
import { type FormEvent, type ReactNode, useId, useState } from "react";
import { DemoBar } from "../components/DemoBar";
import { Reveal } from "../components/motion/Reveal";
import { Badge, LevelBadge, type Tone } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { cn } from "../components/ui/cn";
import { Metric } from "../components/ui/Metric";
import { Panel } from "../components/ui/Panel";
import { LEVEL_HINT, maxLevel } from "../domain/levels";
import type { DailyReading, Level } from "../domain/types";
import {
  type CheckInStatus,
  GLUCOSE_INPUT_RANGE,
  type ManualEntry,
  type Score,
  useEvaluation,
  useOrbiStore,
  useReading,
} from "../store/orbiStore";

/** Mirrors the proposed `CrewProfile.cycle` (docs/CONCEPT.md §8) until P3 (#12) adds it. */
export type CycleStatus = "tracked" | "suppressed" | "n/a";

const MISSION_LABEL = { ISS: "ISS", MOON: "Moon", MARS: "Mars" } as const;
const SCORES: Score[] = [1, 2, 3, 4, 5];
const MOOD_LABEL: Record<Score, string> = {
  1: "Very low",
  2: "Low",
  3: "Okay",
  4: "Good",
  5: "Very good",
};
const FATIGUE_LABEL: Record<Score, string> = {
  1: "Rested",
  2: "Fresh",
  3: "Tired",
  4: "Very tired",
  5: "Exhausted",
};

const STATUS: Record<
  CheckInStatus,
  { icon: LucideIcon; tone: Tone; badge: string; text: (day: number) => string }
> = {
  empty: {
    icon: CircleDashed,
    tone: "neutral",
    badge: "Pending",
    text: () => "Not confirmed yet",
  },
  confirmed: {
    icon: CircleCheck,
    tone: "nominal",
    badge: "Confirmed",
    text: (day) => `Check-in confirmed for day ${day}`,
  },
  error: {
    icon: TriangleAlert,
    tone: "concern",
    badge: "Check input",
    text: () =>
      `Glucose must be a whole number from ${GLUCOSE_INPUT_RANGE.min} to ${GLUCOSE_INPUT_RANGE.max} mg/dL`,
  },
};

// TODO(#12): read the crew profile once P3 adds it; until then the cycle field stays hidden.
const CREW_CYCLE: CycleStatus = "n/a";

export default function Today() {
  return <TodayScreen cycle={CREW_CYCLE} />;
}

export function TodayScreen({ cycle }: { cycle: CycleStatus }) {
  const reading = useReading();
  const evaluation = useEvaluation();
  const scenarioId = useOrbiStore((state) => state.scenarioId);
  const day = useOrbiStore((state) => state.day);
  const mission = useOrbiStore((state) => state.mission);
  const streak = useOrbiStore((state) => state.streak);
  const status = useOrbiStore((state) => state.checkInStatus);
  const dayLevel = Object.values(evaluation.bySystem).reduce<Level>(maxLevel, "NOMINAL");

  return (
    <div className="mx-auto flex max-w-[1180px] flex-col gap-6 px-4 py-8 sm:px-6">
      <DemoBar />

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-label font-medium text-faint uppercase">
            Mission day {day} · {MISSION_LABEL[mission]}
          </p>
          <h1 className="mt-1 font-display text-headline font-semibold">Today's check-in</h1>
          <p className="mt-1 text-lead text-muted">
            About 90 seconds. Confirm what your wearable synced and add three quick answers.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="accent">
            <Flame className="h-3 w-3" aria-hidden="true" />
            {streak === 0 ? "No streak yet" : `${streak}-day streak`}
          </Badge>
          <div className="flex items-center gap-2">
            <span className="font-mono text-label text-faint uppercase">Today</span>
            <LevelBadge level={dayLevel} />
            <span className="text-caption text-muted">{LEVEL_HINT[dayLevel]}</span>
          </div>
        </div>
      </header>

      {reading ? (
        <CheckInForm
          key={`${scenarioId}:${day}`}
          reading={reading}
          day={day}
          status={status}
          cycle={cycle}
        />
      ) : (
        <Panel>
          <p className="flex items-center gap-2 text-body text-muted">
            <CircleDashed className="h-4 w-4" aria-hidden="true" />
            No wearable data for day {day}.
          </p>
        </Panel>
      )}
    </div>
  );
}

function CheckInForm({
  reading,
  day,
  status,
  cycle,
}: {
  reading: DailyReading;
  day: number;
  status: CheckInStatus;
  cycle: CycleStatus;
}) {
  const confirmCheckIn = useOrbiStore((state) => state.confirmCheckIn);
  const [mood, setMood] = useState<Score>(reading.mood);
  const [fatigue, setFatigue] = useState<Score>(reading.fatigue);
  const [glucose, setGlucose] = useState(String(reading.glucoseMgDl));
  const [periodToday, setPeriodToday] = useState<boolean | undefined>(undefined);
  const glucoseId = useId();
  const statusView = STATUS[status];
  const StatusIcon = statusView.icon;

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = glucose.trim();
    const manual: ManualEntry = {
      mood,
      fatigue,
      glucoseMgDl: trimmed === "" ? Number.NaN : Number(trimmed),
    };
    if (cycle === "tracked" && periodToday !== undefined) manual.periodToday = periodToday;
    confirmCheckIn(manual);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal>
          <Panel
            kicker="Automatic · 4 fields"
            title="Synced from wearable"
            actions={
              <Badge tone="neutral">
                <Watch className="h-3 w-3" aria-hidden="true" />
                Read-only
              </Badge>
            }
            className="h-full"
          >
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <Metric label="Sleep" value={reading.sleepHours.toFixed(1)} unit="h" />
              </Card>
              <Card>
                <Metric label="Resting HR" value={reading.restingHr} unit="bpm" />
              </Card>
              <Card>
                <Metric label="Temperature" value={reading.tempC.toFixed(1)} unit="°C" />
              </Card>
              <Card>
                <Metric label="SpO₂" value={reading.spo2} unit="%" />
              </Card>
            </div>
            <p className="mt-4 text-caption text-muted">
              Synced overnight. If a value looks wrong, flag it to your flight surgeon.
            </p>
          </Panel>
        </Reveal>

        <Reveal delay={0.05}>
          <Panel kicker="Your input · 3 fields" title="How are you today?" className="h-full">
            <div className="flex flex-col gap-5">
              <ScoreField label="Mood" value={mood} onChange={setMood} labels={MOOD_LABEL} />
              <ScoreField
                label="Fatigue"
                value={fatigue}
                onChange={setFatigue}
                labels={FATIGUE_LABEL}
              />
              <div className="flex flex-col gap-2">
                <label
                  htmlFor={glucoseId}
                  className="font-mono text-label font-medium text-faint uppercase"
                >
                  Glucose (mg/dL)
                </label>
                <input
                  id={glucoseId}
                  type="text"
                  inputMode="numeric"
                  value={glucose}
                  onChange={(event) => setGlucose(event.target.value)}
                  aria-invalid={status === "error"}
                  className={cn(
                    "h-11 w-40 rounded-xl border bg-surface-strong px-3 font-mono text-body text-ink tabular-nums",
                    status === "error" ? "border-concern" : "border-line",
                  )}
                />
              </div>
              {cycle === "tracked" && <PeriodField value={periodToday} onChange={setPeriodToday} />}
            </div>
          </Panel>
        </Reveal>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-4">
        <p
          role={status === "error" ? "alert" : "status"}
          className="flex items-center gap-3 text-body"
        >
          <Badge tone={statusView.tone}>
            <StatusIcon className="h-3 w-3" aria-hidden="true" />
            {statusView.badge}
          </Badge>
          {statusView.text(day)}
        </p>
        <Button type="submit" variant="primary" size="lg">
          <CircleCheck className="h-5 w-5" aria-hidden="true" />
          {status === "confirmed" ? "Update check-in" : "Confirm"}
        </Button>
      </div>
    </form>
  );
}

function ScoreField({
  label,
  value,
  onChange,
  labels,
}: {
  label: string;
  value: Score;
  onChange: (value: Score) => void;
  labels: Record<Score, string>;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="font-mono text-label font-medium text-faint uppercase">{label}</span>
        <span className="text-caption text-muted">{labels[value]}</span>
      </div>
      <div role="radiogroup" aria-label={label} className="grid grid-cols-5 gap-2">
        {SCORES.map((score) => (
          <SegmentButton
            key={score}
            selected={value === score}
            label={`${score} · ${labels[score]}`}
            onClick={() => onChange(score)}
            className="font-mono tabular-nums"
          >
            {score}
          </SegmentButton>
        ))}
      </div>
    </div>
  );
}

function PeriodField({
  value,
  onChange,
}: {
  value: boolean | undefined;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-dashed border-line-strong p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="font-mono text-label font-medium text-faint uppercase">
            Optional · cycle
          </span>
          <p className="text-body">Period today?</p>
        </div>
        <div role="radiogroup" aria-label="Period today?" className="flex gap-2">
          <SegmentButton selected={value === true} onClick={() => onChange(true)} className="px-4">
            Yes
          </SegmentButton>
          <SegmentButton
            selected={value === false}
            onClick={() => onChange(false)}
            className="px-4"
          >
            No
          </SegmentButton>
        </div>
      </div>
      <p className="flex items-start gap-2 text-caption text-muted">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        Opt-in. Cycle data stays on board and is not shared with the ground without your permission.
      </p>
    </div>
  );
}

function SegmentButton({
  selected,
  label,
  onClick,
  className,
  children,
}: {
  selected: boolean;
  label?: string;
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: a segmented control gives a 44 px touch target on the tablet.
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "h-11 min-w-11 rounded-xl border text-body transition-colors",
        selected
          ? "border-accent bg-accent-soft text-accent"
          : "border-line bg-surface-strong text-muted hover:text-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}
