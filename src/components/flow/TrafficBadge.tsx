import { clsx } from "clsx";
import type { Level } from "../../domain/types";
import { TONE_CLASS, TRAFFIC } from "./traffic";

/** Traffic-light level: colour + icon + text. */
export function TrafficBadge({ level, className }: { level: Level; className?: string }) {
  const { tone, label, icon: Icon } = TRAFFIC[level];
  const toneClass = TONE_CLASS[tone];
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 text-caption font-semibold",
        toneClass.border,
        toneClass.soft,
        toneClass.text,
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
