import { clsx } from "clsx";
import { Check } from "lucide-react";
import { goTo, type MissionView } from "../../navigation";

export type FlowStep = "today" | "body" | "decision";

const STEPS: { id: FlowStep; label: string }[] = [
  { id: "today", label: "Check-in" },
  { id: "body", label: "Body" },
  { id: "decision", label: "What to do" },
];

/** The daily flow: Check-in → Body → What to do. Earlier steps show as done. */
export function FlowSteps({ current }: { current: FlowStep }) {
  const currentIndex = STEPS.findIndex((step) => step.id === current);
  return (
    <nav aria-label="Daily check steps">
      <ol className="flex items-center gap-2">
        {STEPS.map((step, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          return (
            <li key={step.id} className="flex items-center gap-2">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className={clsx("h-px w-6 sm:w-10", done || active ? "bg-accent" : "bg-line")}
                />
              )}
              <button
                type="button"
                onClick={() => goTo(step.id satisfies MissionView)}
                aria-current={active ? "step" : undefined}
                className={clsx(
                  "flex items-center gap-2 rounded-full py-1 pr-3 pl-1 text-body font-medium transition-colors pointer-coarse:min-h-11",
                  active ? "bg-accent-soft text-accent" : "text-muted hover:text-ink",
                )}
              >
                <span
                  className={clsx(
                    "grid h-6 w-6 place-items-center rounded-full border font-mono text-label",
                    done && "border-accent bg-accent text-on-accent",
                    active && "border-accent text-accent",
                    !done && !active && "border-line-strong",
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : index + 1}
                </span>
                {step.label}
                {done && <span className="sr-only">(done)</span>}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
