import type { LucideIcon } from "lucide-react";
import { Reveal } from "../motion/Reveal";
import { Badge } from "./Badge";

/** Temporary screen body until the owning lane replaces it. */
export function ScreenPlaceholder({
  icon: Icon,
  title,
  question,
  lane,
}: {
  icon: LucideIcon;
  title: string;
  question: string;
  lane: string;
}) {
  return (
    <div className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6">
      <Reveal className="rounded-2xl border border-dashed border-line-strong bg-surface p-10 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-accent-soft text-accent">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="mt-4 font-display text-headline font-semibold">{title}</h1>
        <p className="mt-2 text-lead text-muted">{question}</p>
        <Badge tone="neutral" className="mt-6">
          In progress · {lane}
        </Badge>
      </Reveal>
    </div>
  );
}
