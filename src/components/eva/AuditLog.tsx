import clsx from "clsx";
import { Activity, Link2, Navigation } from "lucide-react";
import type { AuditPriority, EvaAuditEntry } from "../../simulation/eva";

const PRIORITY_STYLE: Record<AuditPriority, string> = {
  P0: "border-red-400/40 bg-red-400/10 text-red-100",
  P1: "border-amber-400/30 bg-amber-400/10 text-amber-100",
  P2: "border-cyan-400/20 bg-cyan-400/[0.07] text-cyan-50/90",
  P3: "border-white/10 bg-white/[0.03] text-white/60",
};

const KIND_ICON = {
  link: Link2,
  navigation: Navigation,
  clinical: Activity,
};

function clock(seconds: number): string {
  return `T+${seconds.toFixed(1).padStart(4, "0")}`;
}

export function AuditLog({ entries }: { entries: EvaAuditEntry[] }) {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-muted">
          Autonomous audit
        </h3>
        <span className="text-[11px] text-faint">
          {entries.length} event{entries.length === 1 ? "" : "s"}
        </span>
      </div>
      <ol className="flex-1 space-y-1.5 overflow-y-auto pr-1" aria-label="EVA audit log">
        {[...entries].reverse().map((entry) => {
          const Icon = KIND_ICON[entry.kind];
          return (
            <li
              key={entry.id}
              className={clsx(
                "rounded-lg border px-2.5 py-2 text-[11px] leading-snug",
                PRIORITY_STYLE[entry.priority],
              )}
            >
              <div className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-wide text-faint">
                <span className="inline-flex items-center gap-1">
                  <Icon className="h-3 w-3" aria-hidden="true" />
                  {entry.kind}
                </span>
                <span>{clock(entry.at)}</span>
              </div>
              <p className="mt-0.5 text-white/80">{entry.text}</p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
