import { ArrowRight, Radio } from "lucide-react";
import type { Escalation, Mission } from "../../domain/types";
import { Panel } from "../ui/Panel";

const MISSION_LABEL: Record<Mission, string> = { ISS: "ISS", MOON: "Moon", MARS: "Mars" };

export function formatLatency(seconds: number): string {
  if (seconds === 0) return "live link";
  if (seconds < 60) return `${seconds} s one-way`;
  return `${Math.round(seconds / 60)} min one-way`;
}

/** Who to involve, adapted by the engine to the communication latency. */
export function EscalationPanel({
  escalation,
  mission,
  latencySeconds,
}: {
  escalation: Escalation;
  mission: Mission;
  latencySeconds: number;
}) {
  return (
    <Panel
      kicker={`${MISSION_LABEL[mission]} · ${formatLatency(latencySeconds)}`}
      title="Escalation"
      actions={<Radio className="h-5 w-5 text-faint" aria-hidden="true" />}
    >
      <ol className="flex flex-wrap items-stretch gap-3">
        <li className="flex-1 rounded-2xl border border-accent/30 bg-accent-soft p-4">
          <p className="font-mono text-label text-faint uppercase">Now</p>
          <p className="mt-1 text-lead font-semibold">{escalation.now}</p>
        </li>
        {escalation.next && (
          <>
            <li aria-hidden="true" className="self-center text-faint">
              <ArrowRight className="h-5 w-5" />
            </li>
            <li className="flex-1 rounded-2xl border border-line bg-surface-strong p-4">
              <p className="font-mono text-label text-faint uppercase">Next</p>
              <p className="mt-1 text-lead">{escalation.next}</p>
            </li>
          </>
        )}
      </ol>
      <p className="mt-4 text-caption text-muted">{escalation.note}</p>
    </Panel>
  );
}
