import { CircleCheck, Eye, type LucideIcon, OctagonAlert, TriangleAlert } from "lucide-react";
import type { ComponentPropsWithoutRef } from "react";
import { LEVEL_LABEL } from "../../domain/levels";
import type { Level } from "../../domain/types";
import { cn } from "./cn";

export type Tone = "neutral" | "accent" | "nominal" | "watch" | "concern" | "urgent";

const TONE_CLASS: Record<Tone, string> = {
  neutral: "border-line bg-surface-strong text-muted",
  accent: "border-accent/30 bg-accent-soft text-accent",
  nominal: "border-nominal/30 bg-nominal-soft text-nominal",
  watch: "border-watch/30 bg-watch-soft text-watch",
  concern: "border-concern/30 bg-concern-soft text-concern",
  urgent: "border-urgent/30 bg-urgent-soft text-urgent",
};

export const LEVEL_TONE: Record<Level, Tone> = {
  NOMINAL: "nominal",
  WATCH: "watch",
  CONCERN: "concern",
  URGENT: "urgent",
};

export const LEVEL_ICON: Record<Level, LucideIcon> = {
  NOMINAL: CircleCheck,
  WATCH: Eye,
  CONCERN: TriangleAlert,
  URGENT: OctagonAlert,
};

export function Badge({
  tone = "neutral",
  className,
  ...rest
}: ComponentPropsWithoutRef<"span"> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-mono text-label font-semibold uppercase",
        TONE_CLASS[tone],
        className,
      )}
      {...rest}
    />
  );
}

/** Triage level with colour, icon and text: colour is never the only signal. */
export function LevelBadge({ level, className }: { level: Level; className?: string }) {
  const Icon = LEVEL_ICON[level];
  return (
    <Badge tone={LEVEL_TONE[level]} className={className}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {LEVEL_LABEL[level]}
    </Badge>
  );
}
