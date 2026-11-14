import { BookOpen, CircleAlert, ListChecks } from "lucide-react";
import { SYSTEM_INFO } from "../../content/systems";
import type { Assessment } from "../../domain/types";
import { Badge, LevelBadge } from "../ui/Badge";
import { Card } from "../ui/Card";
import { Panel } from "../ui/Panel";

/** The main finding: level, "Because…", action card and sources. Display only. */
export function AssessmentCard({ assessment }: { assessment: Assessment }) {
  return (
    <Panel
      kicker={SYSTEM_INFO[assessment.system].label}
      title={assessment.title}
      actions={<LevelBadge level={assessment.level} />}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h3 className="flex items-center gap-2 font-mono text-label font-medium text-faint uppercase">
            <CircleAlert className="h-3.5 w-3.5" aria-hidden="true" />
            Because…
          </h3>
          <ul className="mt-3 flex flex-col gap-2 text-body">
            {assessment.because.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden="true" className="text-faint">
                  ·
                </span>
                {line}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="flex items-center gap-2 font-mono text-label font-medium text-faint uppercase">
            <ListChecks className="h-3.5 w-3.5" aria-hidden="true" />
            Do now
          </h3>
          <ol className="mt-3 flex flex-col gap-2 text-body">
            {assessment.actions.map((action, index) => (
              <li key={action} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-accent-soft font-mono text-caption text-accent">
                  {index + 1}
                </span>
                {action}
              </li>
            ))}
          </ol>
        </Card>
      </div>
      <ul aria-label="Sources" className="mt-4 flex flex-wrap items-center gap-2 text-caption">
        <BookOpen className="h-3.5 w-3.5 text-faint" aria-hidden="true" />
        {assessment.source.map((source) => (
          <li key={source.label} className="flex items-center gap-2 text-muted">
            {source.url ? (
              <a href={source.url} target="_blank" rel="noreferrer" className="underline">
                {source.label}
              </a>
            ) : (
              source.label
            )}
            {!source.verified && <Badge tone="watch">Source pending verification</Badge>}
          </li>
        ))}
      </ul>
    </Panel>
  );
}
