import clsx from "clsx";
import { ArrowLeft, Navigation, ShieldAlert, Timer } from "lucide-react";
import { formatEta, type ReturnGuidance } from "../../simulation/eva";

const URGENCY_STYLE = {
  routine: "border-white/10 bg-white/[0.03] text-white/65",
  recommended: "border-amber-400/35 bg-amber-400/10 text-amber-100",
  mandatory: "border-red-400/45 bg-red-400/15 text-red-100",
};

export function ReturnPanel({
  guidance,
  onReturn,
  disabled,
}: {
  guidance: ReturnGuidance;
  onReturn: () => void;
  disabled: boolean;
}) {
  const canReturn = !disabled && !guidance.active;
  const stateLabel = guidance.active ? "ACTIVE" : guidance.urgency;
  const stateStyle = guidance.active
    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-100"
    : URGENCY_STYLE[guidance.urgency];
  const buttonLabel = guidance.active
    ? guidance.distanceM <= 0.2
      ? "At the airlock"
      : "Inertial return active"
    : "Return to airlock";

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">Return guidance</p>
          <h2 className="mt-1 flex items-center gap-2 text-base font-medium text-white/90">
            <Navigation className="h-4 w-4 text-cyan-300" aria-hidden="true" />
            {guidance.active
              ? "Inertial return"
              : guidance.urgency === "recommended"
                ? "Return recommended"
                : "Hold position"}
          </h2>
        </div>
        <span
          className={clsx(
            "rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-wide",
            stateStyle,
          )}
        >
          {stateLabel}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl border border-white/10 bg-black/20 p-2.5">
          <p className="text-[11px] uppercase tracking-wide text-white/40">Distance</p>
          <p className="mt-0.5 text-lg font-semibold tabular-nums text-white/90">
            {Math.round(guidance.distanceM)} m
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/20 p-2.5">
          <p className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-white/40">
            <Timer className="h-3 w-3" aria-hidden="true" /> ETA
          </p>
          <p className="mt-0.5 text-lg font-semibold tabular-nums text-white/90">
            {formatEta(guidance.etaSeconds)}
          </p>
        </div>
      </div>

      <ul className="mt-3 space-y-1 text-[11px] text-white/55">
        {guidance.why.map((line) => (
          <li key={line} className="flex items-start gap-1.5">
            <ShieldAlert className="mt-0.5 h-3 w-3 shrink-0 text-amber-300/70" aria-hidden="true" />
            {line}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onReturn}
        disabled={!canReturn}
        className={clsx(
          "mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition",
          canReturn
            ? "border-cyan-400/45 bg-cyan-400/15 text-cyan-50 hover:bg-cyan-400/20"
            : "border-white/10 bg-white/[0.03] text-white/35",
        )}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {buttonLabel}
      </button>
      <p className="mt-2 text-[11px] leading-relaxed text-white/30">
        Simulated guidance. The astronaut confirms before the suit moves; the rule engine keeps the
        clinical decision.
      </p>
    </section>
  );
}
