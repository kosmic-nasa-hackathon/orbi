import { clsx } from "clsx";
import { ArrowRight, CircleCheck } from "lucide-react";
import type { CoachProvider } from "../ai/types";
import { DemoBar } from "../components/DemoBar";
import { CoachExplain } from "../components/decision/CoachExplain";
import { DecisionCarousel } from "../components/decision/DecisionCarousel";
import { formatLatency } from "../components/decision/latency";
import { FlowSteps } from "../components/flow/FlowSteps";
import { TONE_CLASS } from "../components/flow/traffic";
import { Reveal } from "../components/motion/Reveal";
import { Button } from "../components/ui/Button";
import { LEVEL_HINT } from "../domain/levels";
import type { Evaluation } from "../domain/types";
import { goTo } from "../navigation";
import { useEvaluation } from "../store/orbiStore";

const MISSION_LABEL = { ISS: "ISS", MOON: "Moon", MARS: "Mars" } as const;

export default function Decision() {
  return <DecisionScreen />;
}

export function DecisionScreen({ coach }: { coach?: CoachProvider }) {
  const evaluation = useEvaluation();
  const key = `${evaluation.scenarioId}:${evaluation.day}`;

  return (
    <div className="mx-auto flex max-w-[960px] flex-col gap-6 px-4 py-6 sm:px-6">
      <DemoBar />
      <FlowSteps current="decision" />
      <header>
        <p className="font-mono text-label font-medium text-faint uppercase">
          Day {evaluation.day} · {MISSION_LABEL[evaluation.mission]} · Earth{" "}
          {formatLatency(evaluation.latencySeconds)}
        </p>
        <h1 className="mt-1 font-display text-headline font-semibold">What to do</h1>
      </header>
      {evaluation.assessments.length === 0 ? (
        <AllGood evaluation={evaluation} coach={coach} key={key} />
      ) : (
        <DecisionCarousel evaluation={evaluation} coach={coach} key={key} />
      )}
    </div>
  );
}

function AllGood({ evaluation, coach }: { evaluation: Evaluation; coach?: CoachProvider }) {
  const green = TONE_CLASS.green;
  return (
    <Reveal>
      <section
        aria-label="All good today"
        className={clsx("overflow-hidden rounded-3xl border bg-surface", green.border)}
      >
        <div aria-hidden="true" className={clsx("h-2", green.solid)} />
        <div className="flex flex-col gap-4 p-6 sm:p-8">
          <span
            className={clsx(
              "grid h-14 w-14 place-items-center rounded-2xl",
              green.soft,
              green.text,
            )}
          >
            <CircleCheck className="h-7 w-7" aria-hidden="true" />
          </span>
          <h2 className={clsx("font-display text-headline font-semibold", green.text)}>
            All good today
          </h2>
          <p className="text-lead text-muted">{LEVEL_HINT.NOMINAL}. Nothing to act on.</p>
          <CoachExplain evaluation={evaluation} provider={coach} />
          <div>
            <Button variant="primary" size="lg" onClick={() => goTo("trends")}>
              Done · see your trends
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
