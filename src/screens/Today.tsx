import {
  Annoyed,
  Battery,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  BatteryWarning,
  CircleCheck,
  CircleDashed,
  Flame,
  Frown,
  HeartPulse,
  Laugh,
  Lock,
  type LucideIcon,
  Meh,
  Minus,
  Moon,
  Plus,
  Smile,
  Thermometer,
  TriangleAlert,
  Wind,
} from "lucide-react";
import { useReducedMotion } from "motion/react";
import { type FormEvent, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { DemoBar } from "../components/DemoBar";
import { FlowSteps } from "../components/flow/FlowSteps";
import { NextStep } from "../components/flow/NextStep";
import { Reveal } from "../components/motion/Reveal";
import { Button } from "../components/ui/Button";
import { cn } from "../components/ui/cn";
import { Panel } from "../components/ui/Panel";
import type { DailyReading } from "../domain/types";
import { goTo } from "../navigation";
import {
  type CheckInStatus,
  GLUCOSE_INPUT_RANGE,
  type ManualEntry,
  type Score,
  useOrbiStore,
  useReading,
} from "../store/orbiStore";

/** Mirrors the proposed `CrewProfile.cycle` (docs/CONCEPT.md §8) until P3 (#12) adds it. */
export type CycleStatus = "tracked" | "suppressed" | "n/a";

const MISSION_LABEL = { ISS: "ISS", MOON: "Moon", MARS: "Mars" } as const;
const SCORES: Score[] = [1, 2, 3, 4, 5];
const GLUCOSE_STEP = 5;
/** Time the "Confirmed" tick stays on screen before moving to the Body step. */
const ADVANCE_MS = 700;

const MOOD: Record<Score, { label: string; icon: LucideIcon }> = {
  1: { label: "Very low", icon: Frown },
  2: { label: "Low", icon: Annoyed },
  3: { label: "Okay", icon: Meh },
  4: { label: "Good", icon: Smile },
  5: { label: "Very good", icon: Laugh },
};

const FATIGUE: Record<Score, { label: string; icon: LucideIcon }> = {
  1: { label: "Rested", icon: BatteryFull },
  2: { label: "Fresh", icon: BatteryMedium },
  3: { label: "Tired", icon: BatteryLow },
  4: { label: "Very tired", icon: Battery },
  5: { label: "Exhausted", icon: BatteryWarning },
};

// TODO(#12): read the crew profile once P3 adds it; until then the cycle field stays hidden.
const CREW_CYCLE: CycleStatus = "n/a";

export default function Today() {
  return <TodayScreen cycle={CREW_CYCLE} />;
}

export function TodayScreen({ cycle }: { cycle: CycleStatus }) {
  const reading = useReading();
  const scenarioId = useOrbiStore((state) => state.scenarioId);
  const day = useOrbiStore((state) => state.day);
  const mission = useOrbiStore((state) => state.mission);
  const streak = useOrbiStore((state) => state.streak);
  const status = useOrbiStore((state) => state.checkInStatus);

  return (
    <div className="mx-auto flex max-w-[960px] flex-col gap-6 px-4 py-6 sm:px-6">
      <DemoBar />
      <FlowSteps current="today" />

      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-label font-medium text-faint uppercase">
            Day {day} · {MISSION_LABEL[mission]}
          </p>
          <h1 className="mt-1 font-display text-headline font-semibold">Good morning</h1>
          <p className="mt-1 text-lead text-muted">Your daily check. About 90 seconds.</p>
        </div>
        {streak > 0 && (
          <p className="flex items-center gap-1.5 text-caption text-muted">
            <Flame className="h-4 w-4 text-accent" aria-hidden="true" />
            {streak}-day streak
          </p>
        )}
      </header>

      {reading ? (
        <CheckInForm key={`${scenarioId}:${day}`} reading={reading} status={status} cycle={cycle} />
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
  status,
  cycle,
}: {
  reading: DailyReading;
  status: CheckInStatus;
  cycle: CycleStatus;
}) {
  const confirmCheckIn = useOrbiStore((state) => state.confirmCheckIn);
  const reduce = useReducedMotion() ?? false;
  const [mood, setMood] = useState<Score>(reading.mood);
  const [fatigue, setFatigue] = useState<Score>(reading.fatigue);
  const [glucose, setGlucose] = useState(String(reading.glucoseMgDl));
  const [periodToday, setPeriodToday] = useState<boolean | undefined>(undefined);
  const [advancing, setAdvancing] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const glucoseId = useId();

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  function stepGlucose(delta: number) {
    const current = Number(glucose);
    const base = Number.isFinite(current) ? current : reading.glucoseMgDl;
    const next = Math.min(
      GLUCOSE_INPUT_RANGE.max,
      Math.max(GLUCOSE_INPUT_RANGE.min, Math.round(base + delta)),
    );
    setGlucose(String(next));
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = glucose.trim();
    const manual: ManualEntry = {
      mood,
      fatigue,
      glucoseMgDl: trimmed === "" ? Number.NaN : Number(trimmed),
    };
    if (cycle === "tracked" && periodToday !== undefined) manual.periodToday = periodToday;
    if (!confirmCheckIn(manual)) return;
    setAdvancing(true);
    timer.current = setTimeout(() => goTo("body"), reduce ? 0 : ADVANCE_MS);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6" noValidate>
      <Reveal>
        <section aria-labelledby={`${glucoseId}-synced`} className="flex flex-col gap-3">
          <h2
            id={`${glucoseId}-synced`}
            className="flex items-center gap-2 text-body font-semibold"
          >
            <CircleCheck className="h-4 w-4 text-nominal" aria-hidden="true" />
            Synced from your wearable
          </h2>
          <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            <SyncedChip icon={Moon} label="Sleep" value={reading.sleepHours.toFixed(1)} unit="h" />
            <SyncedChip icon={HeartPulse} label="Resting HR" value={reading.restingHr} unit="bpm" />
            <SyncedChip
              icon={Thermometer}
              label="Temperature"
              value={reading.tempC.toFixed(1)}
              unit="°C"
            />
            <SyncedChip icon={Wind} label="SpO₂" value={reading.spo2} unit="%" />
          </ul>
        </section>
      </Reveal>

      <Reveal delay={0.05}>
        <section className="flex flex-col gap-5 rounded-3xl border border-line bg-surface p-5 sm:p-6">
          <h2 className="font-display text-title font-semibold">How do you feel?</h2>
          <IconScale label="Mood" value={mood} onChange={setMood} options={MOOD} />
          <IconScale label="Fatigue" value={fatigue} onChange={setFatigue} options={FATIGUE} />
          <div className="flex flex-wrap items-center justify-between gap-3">
            <label htmlFor={glucoseId} className="text-body font-medium">
              Glucose (mg/dL)
            </label>
            <div className="flex items-center gap-2">
              <Button
                aria-label="Decrease glucose"
                onClick={() => stepGlucose(-GLUCOSE_STEP)}
                className="w-11 px-0"
              >
                <Minus className="h-4 w-4" aria-hidden="true" />
              </Button>
              <input
                id={glucoseId}
                type="text"
                inputMode="numeric"
                value={glucose}
                onChange={(event) => setGlucose(event.target.value)}
                aria-invalid={status === "error"}
                aria-describedby={status === "error" ? `${glucoseId}-error` : undefined}
                className={cn(
                  "h-11 w-24 rounded-xl border bg-surface-strong px-3 text-center font-mono text-lead text-ink tabular-nums",
                  status === "error" ? "border-urgent" : "border-line",
                )}
              />
              <Button
                aria-label="Increase glucose"
                onClick={() => stepGlucose(GLUCOSE_STEP)}
                className="w-11 px-0"
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
          {status === "error" && (
            <p
              id={`${glucoseId}-error`}
              role="alert"
              className="flex items-center gap-2 text-caption text-urgent"
            >
              <TriangleAlert className="h-4 w-4" aria-hidden="true" />
              Glucose must be a whole number from {GLUCOSE_INPUT_RANGE.min} to{" "}
              {GLUCOSE_INPUT_RANGE.max} mg/dL
            </p>
          )}
          {cycle === "tracked" && <PeriodField value={periodToday} onChange={setPeriodToday} />}
        </section>
      </Reveal>

      {advancing ? (
        <p
          role="status"
          className="flex items-center justify-center gap-2 rounded-2xl border border-nominal/40 bg-nominal-soft px-5 py-4 text-lead font-semibold text-nominal"
        >
          <CircleCheck className="h-6 w-6" aria-hidden="true" />
          Confirmed. Opening your body summary…
        </p>
      ) : status === "confirmed" ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p role="status" className="flex items-center gap-2 text-body text-nominal">
            <CircleCheck className="h-5 w-5" aria-hidden="true" />
            Check-in confirmed
          </p>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" variant="ghost">
              Update check-in
            </Button>
            <NextStep to="body" label="See your body" />
          </div>
        </div>
      ) : (
        <Button type="submit" variant="primary" size="lg" className="w-full">
          <CircleCheck className="h-5 w-5" aria-hidden="true" />
          Confirm
        </Button>
      )}
    </form>
  );
}

function SyncedChip({
  icon: Icon,
  label,
  value,
  unit,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  unit: string;
}) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-3 py-2.5">
      <Icon className="h-5 w-5 shrink-0 text-faint" aria-hidden="true" />
      <span className="flex flex-col">
        <span className="font-display text-lead font-semibold tabular-nums">
          {value}
          <span className="ml-1 text-caption font-normal text-muted">{unit}</span>
        </span>
        <span className="text-caption text-muted">{label}</span>
      </span>
    </li>
  );
}

function IconScale({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: Score;
  onChange: (value: Score) => void;
  options: Record<Score, { label: string; icon: LucideIcon }>;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-body font-medium">{label}</span>
        <span className="text-caption text-muted">{options[value].label}</span>
      </div>
      <div role="radiogroup" aria-label={label} className="grid grid-cols-5 gap-2">
        {SCORES.map((score) => {
          const Icon = options[score].icon;
          return (
            <SegmentButton
              key={score}
              selected={value === score}
              label={`${score} · ${options[score].label}`}
              onClick={() => onChange(score)}
              className="flex h-14 flex-col items-center justify-center gap-0.5"
            >
              <Icon className="h-6 w-6" aria-hidden="true" />
              <span className="text-label">{options[score].label}</span>
            </SegmentButton>
          );
        })}
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
