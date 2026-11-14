import { clsx } from "clsx";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CircleCheck,
  ListChecks,
  type LucideIcon,
  MessageCircleQuestion,
  Radio,
  Square,
  SquareCheck,
} from "lucide-react";
import { type KeyboardEvent, type PointerEvent, type ReactNode, useRef, useState } from "react";
import type { CoachProvider } from "../../ai/types";
import type { Evaluation } from "../../domain/types";
import { goTo } from "../../navigation";
import { isPacketFor, useOrbiStore } from "../../store/orbiStore";
import { TrafficBadge } from "../flow/TrafficBadge";
import { TONE_CLASS, TRAFFIC } from "../flow/traffic";
import { Reveal } from "../motion/Reveal";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { CoachExplain } from "./CoachExplain";
import { PacketAction } from "./PacketAction";

const CARDS = ["How you are", "Why", "Do this now", "Who to tell", "Done for today"] as const;
const MAX_REASONS = 3;
const SWIPE_PX = 50;

/**
 * The top finding as five simple cards, one idea each. Everything shown comes from
 * evaluate(); the carousel only decides the order and the traffic-light colour.
 */
export function DecisionCarousel({
  evaluation,
  coach,
}: {
  evaluation: Evaluation;
  coach?: CoachProvider;
}) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState<Set<string>>(new Set());
  const swipeStart = useRef<number | null>(null);
  const packet = useOrbiStore((state) => state.packet);
  const top = evaluation.assessments[0];
  if (!top) return null;

  const others = evaluation.assessments.slice(1);
  const traffic = TRAFFIC[top.level];
  const tone = TONE_CLASS[traffic.tone];
  const last = CARDS.length - 1;
  const go = (next: number) => setIndex(Math.min(last, Math.max(0, next)));

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "ArrowRight") go(index + 1);
    else if (event.key === "ArrowLeft") go(index - 1);
    else return;
    event.preventDefault();
  }

  function onPointerUp(event: PointerEvent<HTMLElement>) {
    if (swipeStart.current === null) return;
    const delta = event.clientX - swipeStart.current;
    swipeStart.current = null;
    if (delta <= -SWIPE_PX) go(index + 1);
    else if (delta >= SWIPE_PX) go(index - 1);
  }

  function toggle(action: string) {
    setDone((current) => {
      const next = new Set(current);
      if (next.has(action)) next.delete(action);
      else next.add(action);
      return next;
    });
  }

  const cards: ReactNode[] = [
    <CardBody key="how" icon={traffic.icon} toneText={tone.text} toneSoft={tone.soft}>
      <p className={clsx("font-display text-headline font-semibold", tone.text)}>{traffic.label}</p>
      <h2 className="font-display text-title font-semibold">{top.title}</h2>
      <p className="text-lead text-muted">{top.escalation.now}.</p>
      {others.length > 0 && (
        <details className="mt-2 rounded-2xl border border-line bg-surface-strong">
          <summary className="cursor-pointer px-4 py-3 text-body text-muted">
            +{others.length} more {others.length === 1 ? "signal" : "signals"}
          </summary>
          <ul className="flex flex-col gap-2 px-4 pb-4">
            {others.map((assessment) => (
              <li key={assessment.ruleId} className="flex items-center gap-3 text-body">
                <TrafficBadge level={assessment.level} />
                {assessment.title}
              </li>
            ))}
          </ul>
        </details>
      )}
    </CardBody>,

    <CardBody key="why" icon={MessageCircleQuestion} toneText={tone.text} toneSoft={tone.soft}>
      <h2 className="font-display text-title font-semibold">Why</h2>
      <ul className="flex flex-col gap-3">
        {top.because.slice(0, MAX_REASONS).map((line) => (
          <li key={line} className="flex items-start gap-3 text-lead">
            <span
              aria-hidden="true"
              className={clsx("mt-2.5 h-2 w-2 shrink-0 rounded-full", tone.solid)}
            />
            {line}
          </li>
        ))}
      </ul>
      <details className="mt-2 rounded-2xl border border-line bg-surface-strong">
        <summary className="cursor-pointer px-4 py-3 text-body text-muted">
          Why? Sources and explanation
        </summary>
        <div className="flex flex-col gap-4 px-4 pb-4">
          <ul aria-label="Sources" className="flex flex-col gap-2 text-caption">
            {top.source.map((source) => (
              <li key={source.label} className="flex flex-wrap items-center gap-2 text-muted">
                <BookOpen className="h-3.5 w-3.5 text-faint" aria-hidden="true" />
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
          <CoachExplain evaluation={evaluation} provider={coach} />
        </div>
      </details>
    </CardBody>,

    <CardBody key="do" icon={ListChecks} toneText={tone.text} toneSoft={tone.soft}>
      <h2 className="font-display text-title font-semibold">Do this now</h2>
      <ul className="flex flex-col gap-2">
        {top.actions.map((action) => {
          const checked = done.has(action);
          const Icon = checked ? SquareCheck : Square;
          return (
            <li key={action}>
              <label
                className={clsx(
                  "flex w-full cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-left text-lead transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent",
                  checked
                    ? "border-nominal/40 bg-nominal-soft text-muted line-through"
                    : "border-line bg-surface-strong hover:border-line-strong",
                )}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(action)}
                  className="sr-only"
                />
                <Icon
                  className={clsx("h-6 w-6 shrink-0", checked ? "text-nominal" : "text-faint")}
                  aria-hidden="true"
                />
                {action}
              </label>
            </li>
          );
        })}
      </ul>
      <p className="text-caption text-muted">
        {done.size} of {top.actions.length} done
      </p>
    </CardBody>,

    <CardBody key="tell" icon={Radio} toneText={tone.text} toneSoft={tone.soft}>
      <h2 className="font-display text-title font-semibold">Who to tell</h2>
      <ol className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <li className={clsx("flex-1 rounded-2xl border p-4", tone.border, tone.soft)}>
          <p className="font-mono text-label text-faint uppercase">Now</p>
          <p className="mt-1 text-lead font-semibold">{top.escalation.now}</p>
        </li>
        {top.escalation.next && (
          <li className="flex-1 rounded-2xl border border-line bg-surface-strong p-4">
            <p className="font-mono text-label text-faint uppercase">Next</p>
            <p className="mt-1 text-lead">{top.escalation.next}</p>
          </li>
        )}
      </ol>
      <p className="text-caption text-muted">{top.escalation.note}</p>
      <PacketAction evaluation={evaluation} />
    </CardBody>,

    <CardBody key="done" icon={CircleCheck} toneText="text-nominal" toneSoft="bg-nominal-soft">
      <h2 className="font-display text-title font-semibold">Done for today</h2>
      <ul className="flex flex-col gap-2 text-lead">
        <li className="flex items-center gap-3">
          <TrafficBadge level={top.level} />
          {top.title}
        </li>
        <li>
          {done.size} of {top.actions.length} steps done
        </li>
        <li>
          {isPacketFor(packet, evaluation)
            ? "Flight surgeon packet sent"
            : "Flight surgeon packet not sent yet"}
        </li>
      </ul>
      <div className="flex flex-wrap gap-3">
        <Button variant="primary" size="lg" onClick={() => goTo("trends")}>
          See your trends
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Button>
        <Button variant="ghost" size="lg" onClick={() => goTo("today")}>
          Back to check-in
        </Button>
      </div>
    </CardBody>,
  ];

  return (
    // Arrow keys bubble up from the focused card controls and the navigation buttons.
    <section
      aria-roledescription="carousel"
      aria-label="What to do"
      onKeyDown={onKeyDown}
      onPointerDown={(event) => {
        swipeStart.current = event.clientX;
      }}
      onPointerUp={onPointerUp}
      className="flex flex-col gap-4"
    >
      <section
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${CARDS.length}: ${CARDS[index]}`}
        className={clsx(
          "overflow-hidden rounded-3xl border bg-surface",
          index === last ? TONE_CLASS.green.border : tone.border,
        )}
      >
        <div
          aria-hidden="true"
          className={clsx("h-2", index === last ? "bg-nominal" : tone.solid)}
        />
        <Reveal key={index} className="p-6 sm:p-8">
          {cards[index]}
        </Reveal>
      </section>

      <div className="flex items-center justify-between gap-4">
        <Button onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous card">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          {CARDS.map((label, position) => (
            <button
              key={label}
              type="button"
              aria-label={`Card ${position + 1}: ${label}`}
              aria-current={position === index ? "step" : undefined}
              onClick={() => go(position)}
              className={clsx(
                "h-2.5 rounded-full transition-all",
                position === index ? clsx("w-8", tone.solid) : "w-2.5 bg-line-strong",
              )}
            />
          ))}
        </div>
        {index < last ? (
          <Button variant="primary" onClick={() => go(index + 1)} aria-label="Next card">
            {CARDS[index + 1]}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        ) : (
          <span className="w-24" />
        )}
      </div>
    </section>
  );
}

function CardBody({
  icon: Icon,
  toneText,
  toneSoft,
  children,
}: {
  icon: LucideIcon;
  toneText: string;
  toneSoft: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <span className={clsx("grid h-14 w-14 place-items-center rounded-2xl", toneSoft, toneText)}>
        <Icon className="h-7 w-7" aria-hidden="true" />
      </span>
      {children}
    </div>
  );
}
