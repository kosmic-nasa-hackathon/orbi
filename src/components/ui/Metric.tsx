import type { ReactNode } from "react";
import type { Level } from "../../domain/types";
import { LevelBadge } from "./Badge";
import { cn } from "./cn";

/** A single reading: label, value with unit, optional level and hint. */
export function Metric({
  label,
  value,
  unit,
  level,
  hint,
  className,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  level?: Level;
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-label font-medium text-faint uppercase">{label}</span>
        {level && <LevelBadge level={level} />}
      </div>
      <p className="font-display text-headline font-semibold tabular-nums">
        {value}
        {unit && <span className="ml-1 text-body font-normal text-muted">{unit}</span>}
      </p>
      {hint && <p className="text-caption text-muted">{hint}</p>}
    </div>
  );
}
