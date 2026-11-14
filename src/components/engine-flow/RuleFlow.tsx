import { ArrowRight, CircleCheck, GitBranch, Radar } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { SYSTEM_INFO } from "../../content/systems";
import { scenarios } from "../../data/scenarios";
import { RULES, THRESHOLDS } from "../../domain/rules";
import type { DailyReading, EnvReading, Evaluation, Level, Scenario } from "../../domain/types";
import { EASE_OUT } from "../motion/Reveal";
import { Badge, cn, LevelBadge } from "../ui";

type SignalId =
  | "sleep"
  | "temp"
  | "hr"
  | "spo2"
  | "glucose"
  | "mood"
  | "co2"
  | "dose"
  | "exercise"
  | "spe";

interface FlowContext {
  reading?: DailyReading;
  env?: EnvReading;
  evaluation: Evaluation;
  scenario: Scenario;
}

interface SignalMeta {
  label: string;
  threshold: string;
  value: (context: FlowContext) => string;
}

const SIGNAL_META: Record<SignalId, SignalMeta> = {
  sleep: {
    label: "Sleep",
    threshold: `< ${THRESHOLDS.sleepHours.low} h`,
    value: ({ reading }) => (reading ? `${reading.sleepHours.toFixed(1)} h` : "no reading"),
  },
  temp: {
    label: "Temp",
    threshold: `≥ ${THRESHOLDS.tempC.watch} °C`,
    value: ({ reading }) => (reading ? `${reading.tempC.toFixed(1)} °C` : "no reading"),
  },
  hr: {
    label: "Resting HR",
    threshold: `+${THRESHOLDS.restingHr.baselineDelta} bpm / > ${THRESHOLDS.restingHr.concern}`,
    value: ({ reading }) => (reading ? `${reading.restingHr} bpm` : "no reading"),
  },
  spo2: {
    label: "SpO₂",
    threshold: `< ${THRESHOLDS.spo2.watch}%`,
    value: ({ reading }) => (reading ? `${reading.spo2}%` : "no reading"),
  },
  glucose: {
    label: "Glucose",
    threshold: `${THRESHOLDS.glucoseMgDl.watchLow}–${THRESHOLDS.glucoseMgDl.watchHigh} mg/dL`,
    value: ({ reading }) => (reading ? `${reading.glucoseMgDl} mg/dL` : "no reading"),
  },
  mood: {
    label: "Mood",
    threshold: `≤ ${THRESHOLDS.mood.low}/5`,
    value: ({ reading }) => (reading ? `${reading.mood}/5` : "no reading"),
  },
  co2: {
    label: "Cabin CO₂",
    threshold: `> ${THRESHOLDS.cabinCo2MmHg.watch} mmHg`,
    value: ({ env }) => (env ? `${env.cabinCo2MmHg.toFixed(1)} mmHg` : "no sensor"),
  },
  dose: {
    label: "Dose",
    threshold: `${THRESHOLDS.radiationPct.watch}% / ${THRESHOLDS.radiationPct.concern}% budget`,
    value: ({ evaluation }) =>
      `${evaluation.estimates.radiationDoseMSv} mSv · ${evaluation.estimates.radiationPct}%`,
  },
  exercise: {
    label: "Exercise",
    threshold: "resistive target",
    value: ({ evaluation }) => `${evaluation.estimates.exerciseAdherencePct}% of target`,
  },
  spe: {
    label: "SPE",
    threshold: "event signal",
    value: ({ env }) => (env?.spe ? "active" : "clear"),
  },
};

const RULE_SIGNALS: Record<string, SignalId[]> = {
  temperature: ["temp"],
  spo2: ["spo2"],
  restingHr: ["hr"],
  glucose: ["glucose"],
  sleep: ["sleep"],
  mood: ["mood"],
  cabinCo2: ["co2"],
  radiation: ["dose"],
  bone: ["exercise"],
  "early-infection": ["sleep", "temp", "hr"],
  "cabin-air": ["spo2", "co2"],
  "solar-event": ["spe", "dose"],
};

const CORRELATIONS = new Set(["early-infection", "cabin-air", "solar-event"]);

const FLOW_NOTES: Record<string, string> = {
  "early-infection": "Three signals align; the correlation outranks each single reading.",
  "cabin-air": "The environment is the patient: SpO₂ and cabin CO₂ move together.",
  "solar-event": "An event, not chronic exposure: the radiation halo goes urgent.",
};

const LEVEL_EDGE: Record<Level, string> = {
  NOMINAL: "border-l-nominal/50",
  WATCH: "border-l-watch/50",
  CONCERN: "border-l-concern/50",
  URGENT: "border-l-urgent/50",
};

export interface RuleFlowProps {
  evaluation: Evaluation;
  scenario: Scenario;
  onScenarioChange: (id: string) => void;
}

export function RuleFlow({ evaluation, scenario, onScenarioChange }: RuleFlowProps) {
  const reduce = useReducedMotion() ?? false;
  const reading = lastAtOrBefore(scenario.readings, evaluation.day);
  const env = lastAtOrBefore(scenario.env, evaluation.day);
  const context: FlowContext = { reading, env, evaluation, scenario };
  const active = new Set(evaluation.assessments.map((assessment) => assessment.ruleId));
  const standby = Object.values(RULES).filter((rule) => !active.has(rule.id));
  const flowKey = `${scenario.id}-${evaluation.day}-${evaluation.mission}`;

  return (
    <section className="rounded-3xl border border-line bg-surface p-5 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 grid h-9 w-9 flex-none place-items-center rounded-xl border border-accent/25 bg-accent-soft text-accent">
            <GitBranch className="h-4 w-4" aria-hidden="true" />
          </span>
          <div>
            <p className="font-mono text-label font-medium text-faint uppercase">Explainability</p>
            <h2 className="mt-1 font-display text-title font-semibold">How ORBI decided</h2>
            <p className="mt-1 text-caption text-muted">
              {scenario.title} · day {evaluation.day} · {evaluation.mission}
            </p>
          </div>
        </div>
        <Badge tone="accent">
          <Radar className="h-3 w-3" aria-hidden="true" />
          deterministic
        </Badge>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="font-mono text-label font-medium text-faint uppercase">Cases</span>
        {scenarios.map((item) => {
          const selected = item.id === scenario.id;
          return (
            <button
              key={item.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onScenarioChange(item.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-caption font-medium transition-colors",
                selected
                  ? "border-accent/40 bg-accent-soft text-accent"
                  : "border-line bg-surface-strong text-muted hover:text-ink",
              )}
            >
              {item.title}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-label text-faint uppercase">
        <span>Signal</span>
        <ArrowRight className="h-3 w-3" aria-hidden="true" />
        <span>Rule check</span>
        <ArrowRight className="h-3 w-3" aria-hidden="true" />
        <span>Level</span>
        <ArrowRight className="h-3 w-3" aria-hidden="true" />
        <span>Action</span>
      </div>

      {evaluation.assessments.length === 0 ? (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-nominal/30 bg-nominal-soft p-4">
          <CircleCheck className="h-5 w-5 flex-none text-nominal" aria-hidden="true" />
          <div>
            <p className="font-display text-body font-medium text-ink">No rule fired today</p>
            <p className="mt-0.5 text-caption text-muted">
              Every signal is inside the personal baseline and the absolute thresholds.
            </p>
          </div>
        </div>
      ) : (
        <div key={flowKey} className="mt-4 space-y-3">
          {evaluation.assessments.map((assessment, index) => {
            const delay = reduce ? 0 : index * 0.08;
            const note = FLOW_NOTES[assessment.ruleId];
            const source = assessment.source[0];
            return (
              <motion.article
                key={assessment.ruleId}
                initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduce ? 0.15 : 0.45,
                  delay,
                  ease: EASE_OUT,
                }}
                className="grid gap-3 rounded-2xl border border-line bg-canvas/40 p-3 lg:grid-cols-[minmax(0,0.9fr)_2.5rem_minmax(0,1.6fr)_2.5rem_minmax(0,0.9fr)] lg:items-stretch"
              >
                <div>
                  <p className="font-mono text-label font-medium text-faint uppercase">Signals</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(RULE_SIGNALS[assessment.ruleId] ?? []).map((id) => (
                      <SignalChip key={id} id={id} context={context} />
                    ))}
                  </div>
                </div>

                <Connector delay={delay + 0.18} reduce={reduce} />

                <div className="rounded-xl border border-line bg-surface-strong/60 p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-body font-medium text-ink">
                      {assessment.title}
                    </p>
                    {CORRELATIONS.has(assessment.ruleId) && (
                      <Badge tone="accent">
                        <GitBranch className="h-3 w-3" aria-hidden="true" />
                        correlation
                      </Badge>
                    )}
                  </div>
                  <ul className="mt-2 space-y-1 font-mono text-caption text-muted">
                    {assessment.because.map((line) => (
                      <li key={line}>· {line}</li>
                    ))}
                  </ul>
                  {note && <p className="mt-2 text-caption text-faint">{note}</p>}
                </div>

                <Connector delay={delay + 0.3} reduce={reduce} />

                <div
                  className={cn(
                    "rounded-xl border border-l-2 border-line bg-surface p-3",
                    LEVEL_EDGE[assessment.level],
                  )}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <LevelBadge level={assessment.level} />
                    <span className="font-mono text-label text-muted">
                      {SYSTEM_INFO[assessment.system].label}
                    </span>
                  </div>
                  <p className="mt-2 text-caption text-ink">{assessment.escalation.now}</p>
                  {assessment.escalation.next && (
                    <p className="mt-1 text-caption text-muted">
                      Next: {assessment.escalation.next}
                    </p>
                  )}
                  {assessment.actions[0] && (
                    <p className="mt-2 text-caption text-muted">
                      <span className="font-mono text-label text-faint uppercase">Action</span>{" "}
                      {assessment.actions[0]}
                    </p>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-line pt-2">
                    <span className="text-caption text-faint">{source?.label}</span>
                    {assessment.source.some((item) => !item.verified) && (
                      <Badge tone="watch">source pending</Badge>
                    )}
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}

      <div className="mt-5 border-t border-line pt-4">
        <p className="font-mono text-label font-medium text-faint uppercase">
          Standby rules · not fired today
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {standby.map((rule) => (
            <span
              key={rule.id}
              className="rounded-full border border-line bg-surface-strong/50 px-2.5 py-1 text-caption text-faint"
            >
              {rule.title}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function SignalChip({ id, context }: { id: SignalId; context: FlowContext }) {
  const meta = SIGNAL_META[id];
  return (
    <span className="inline-flex min-w-24 flex-col rounded-lg border border-accent/25 bg-accent-soft px-2 py-1">
      <span className="font-mono text-label font-semibold text-accent uppercase">{meta.label}</span>
      <span className="font-mono text-caption font-medium text-ink">{meta.value(context)}</span>
      <span className="font-mono text-label text-faint">{meta.threshold}</span>
    </span>
  );
}

function Connector({ delay, reduce }: { delay: number; reduce: boolean }) {
  return (
    <div className="relative hidden min-h-10 items-center lg:flex" aria-hidden="true">
      <div className="h-px w-full bg-line" />
      <motion.div
        className="absolute top-1/2 left-0 h-px w-full origin-left bg-accent/70"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : delay, ease: EASE_OUT }}
      />
      <ArrowRight className="absolute top-1/2 -right-1 h-3 w-3 -translate-y-1/2 text-accent/80" />
    </div>
  );
}

function lastAtOrBefore<T extends { day: number }>(items: T[], day: number): T | undefined {
  let best: T | undefined;
  for (const item of items) {
    if (item.day <= day && (!best || item.day > best.day)) best = item;
  }
  return best;
}
