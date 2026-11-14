import { CircleCheck } from "lucide-react";
import { useState } from "react";
import type { CoachProvider } from "../ai/types";
import { DemoBar } from "../components/DemoBar";
import { AssessmentCard } from "../components/decision/AssessmentCard";
import { CoachExplain } from "../components/decision/CoachExplain";
import { EscalationPanel, formatLatency } from "../components/decision/EscalationPanel";
import { PacketAction } from "../components/decision/PacketAction";
import { Reveal } from "../components/motion/Reveal";
import { LevelBadge } from "../components/ui/Badge";
import { cn } from "../components/ui/cn";
import { Panel } from "../components/ui/Panel";
import { SYSTEM_INFO } from "../content/systems";
import { LEVEL_HINT } from "../domain/levels";
import type { Evaluation } from "../domain/types";
import { useEvaluation } from "../store/orbiStore";

const MISSION_LABEL = { ISS: "ISS", MOON: "Moon", MARS: "Mars" } as const;

export default function Decision() {
  return <DecisionScreen />;
}

export function DecisionScreen({ coach }: { coach?: CoachProvider }) {
  const evaluation = useEvaluation();
  const key = `${evaluation.scenarioId}:${evaluation.day}:${evaluation.mission}`;

  return (
    <div className="mx-auto flex max-w-[1180px] flex-col gap-6 px-4 py-8 sm:px-6">
      <DemoBar />
      <header>
        <p className="font-mono text-label font-medium text-faint uppercase">
          Mission day {evaluation.day} · {MISSION_LABEL[evaluation.mission]} ·{" "}
          {formatLatency(evaluation.latencySeconds)}
        </p>
        <h1 className="mt-1 font-display text-headline font-semibold">Decision</h1>
        <p className="mt-1 text-lead text-muted">How serious is it, and what do I do?</p>
      </header>
      {evaluation.assessments.length === 0 ? (
        <NominalDay evaluation={evaluation} coach={coach} key={key} />
      ) : (
        <Findings evaluation={evaluation} coach={coach} key={key} />
      )}
    </div>
  );
}

function Findings({ evaluation, coach }: { evaluation: Evaluation; coach?: CoachProvider }) {
  const [selected, setSelected] = useState(0);
  const assessment = evaluation.assessments[selected] ?? evaluation.assessments[0];
  if (!assessment) return null;

  return (
    <>
      {evaluation.assessments.length > 1 && (
        <nav aria-label="Findings" className="flex flex-wrap gap-2">
          {evaluation.assessments.map((item, index) => (
            <button
              key={item.ruleId}
              type="button"
              aria-pressed={index === selected}
              onClick={() => setSelected(index)}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-caption transition-colors",
                index === selected
                  ? "border-accent bg-accent-soft text-ink"
                  : "border-line bg-surface text-muted hover:text-ink",
              )}
            >
              <LevelBadge level={item.level} />
              <span>
                {item.title}
                <span className="block text-faint">{SYSTEM_INFO[item.system].label}</span>
              </span>
            </button>
          ))}
        </nav>
      )}
      <Reveal key={assessment.ruleId}>
        <AssessmentCard assessment={assessment} />
      </Reveal>
      <div className="grid gap-6 lg:grid-cols-2">
        <EscalationPanel
          escalation={assessment.escalation}
          mission={evaluation.mission}
          latencySeconds={evaluation.latencySeconds}
        />
        <CoachExplain evaluation={evaluation} provider={coach} />
      </div>
      <PacketAction evaluation={evaluation} />
    </>
  );
}

function NominalDay({ evaluation, coach }: { evaluation: Evaluation; coach?: CoachProvider }) {
  return (
    <>
      <Panel
        kicker="All systems"
        title="Nothing to act on today"
        actions={<LevelBadge level="NOMINAL" />}
      >
        <p className="flex items-center gap-2 text-body text-muted">
          <CircleCheck className="h-4 w-4 text-nominal" aria-hidden="true" />
          {LEVEL_HINT.NOMINAL}. No escalation needed.
        </p>
      </Panel>
      <CoachExplain evaluation={evaluation} provider={coach} />
    </>
  );
}
