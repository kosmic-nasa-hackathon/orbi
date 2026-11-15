import clsx from "clsx";
import {
  ArrowRight,
  ArrowUpRight,
  Bone,
  Brain,
  CalendarCheck,
  ChevronRight,
  CircleDot,
  Flame,
  HeartPulse,
  type LucideIcon,
  Orbit,
  Presentation,
  Radiation,
  Route,
  ShieldCheck,
  SquareTerminal,
  TriangleAlert,
  Wind,
} from "lucide-react";
import { GithubMark } from "../components/GithubMark";
import { LEVEL_BG, LEVEL_COLOR, SYSTEM_INFO } from "../content/systems";
import { scenarios } from "../data/scenarios";
import { evaluate } from "../domain/evaluate";
import { LEVEL_LABEL } from "../domain/levels";
import { SOURCES } from "../domain/rules";
import {
  type Assessment,
  type Evaluation,
  type Level,
  SYSTEM_IDS,
  type SystemId,
} from "../domain/types";
import type { View } from "../navigation";

const PENDING_SOURCES = Object.values(SOURCES).filter((source) => !source.verified).length;

const scenario = scenarios.find((item) => item.id === "early-infection") ?? scenarios[0]!;
const day = scenario.readings.at(-1)!.day;
const evaluation = evaluate(scenario, day, "MARS");

const topAssessment = evaluation.assessments[0];
const topLevel: Level = topAssessment?.level ?? "NOMINAL";

const SYSTEM_ICONS: Record<SystemId, LucideIcon> = {
  cardio: HeartPulse,
  msk: Bone,
  immune: ShieldCheck,
  metabolic: Flame,
  respiratory: Wind,
  behavioral: Brain,
  radiation: Radiation,
};

const CORE_SYSTEMS = SYSTEM_IDS.filter((id) => id !== "radiation");

export default function Home({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <div className="relative overflow-hidden">
      <div className="orbi-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-24 -left-40 h-[34rem] w-[34rem] rounded-full bg-cyan-400/[0.06] blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute top-[30rem] -right-44 h-[30rem] w-[30rem] rounded-full bg-amber-400/[0.045] blur-[130px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1500px] px-4 pt-8 pb-20 sm:px-6 lg:pt-14">
        <section className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
          <div className="orbi-enter">
            <p className="flex items-center gap-2 font-mono text-[11px] tracking-[0.22em] text-cyan-300/75 uppercase">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-300" />
              </span>
              NASA Space Apps 2026 · Team Kosmic
            </p>

            <h1 className="mt-5 max-w-[16ch] font-display text-[clamp(2.9rem,6.3vw,5.6rem)] leading-[0.92] font-semibold tracking-[-0.055em] text-balance text-white">
              Health autonomy, <span className="text-cyan-300">when Earth is 14 minutes away.</span>
            </h1>

            <p className="mt-6 max-w-[58ch] text-[15px] leading-relaxed text-white/55 sm:text-base">
              ORBI is a tablet console for astronauts on long missions. A 90-second check-in feeds a
              deterministic engine that prioritizes, explains and escalates — on board, before the
              reply from Earth arrives.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate("today")}
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-cyan-300 px-4 text-[13px] font-semibold text-[#041016] shadow-[0_0_0_1px_rgba(34,211,238,0.45),0_14px_42px_rgba(34,211,238,0.16)] transition hover:bg-cyan-200 hover:shadow-[0_0_0_1px_rgba(34,211,238,0.6),0_18px_52px_rgba(34,211,238,0.24)]"
              >
                <CalendarCheck className="h-4 w-4" aria-hidden="true" />
                Start the daily check
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate("eva")}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.035] px-4 text-[13px] font-medium text-white/75 transition hover:border-cyan-300/30 hover:bg-white/[0.065] hover:text-white"
              >
                <Orbit className="h-4 w-4" aria-hidden="true" />
                Open EVA demo
              </button>
              <button
                type="button"
                onClick={() => onNavigate("console")}
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.035] px-4 text-[13px] font-medium text-white/75 transition hover:border-cyan-300/30 hover:bg-white/[0.065] hover:text-white"
              >
                <SquareTerminal className="h-4 w-4" aria-hidden="true" />
                Explore the engine
              </button>
              <a
                href="/pitch/"
                className="inline-flex h-11 items-center gap-2 rounded-xl px-3 text-[13px] font-medium text-white/45 transition hover:text-cyan-200"
              >
                <Presentation className="h-4 w-4" aria-hidden="true" />
                Pitch deck
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] tracking-[0.16em] text-white/30 uppercase">
              <span className="inline-flex items-center gap-1.5">
                <CircleDot className="h-3 w-3 text-emerald-300/70" aria-hidden="true" />
                No backend
              </span>
              <span aria-hidden="true">·</span>
              <span>Deterministic rules</span>
              <span aria-hidden="true">·</span>
              <span>Synthetic day 148</span>
              <span aria-hidden="true">·</span>
              <span>No diagnosis</span>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => onNavigate("console")}
                className="inline-flex items-center gap-1.5 text-amber-200/70 uppercase transition hover:text-amber-100"
              >
                <TriangleAlert className="h-3 w-3" aria-hidden="true" />
                {PENDING_SOURCES} sources pending verification
              </button>
            </div>
          </div>

          <div className="orbi-enter" style={{ animationDelay: "180ms" }}>
            <HaloPanel
              evaluation={evaluation}
              topAssessment={topAssessment}
              topLevel={topLevel}
              onOpenConsole={() => onNavigate("console")}
            />
          </div>
        </section>

        <StatStrip />

        <section className="mt-16">
          <SectionHeading
            kicker="Operate"
            title="Three ways into the mission."
            text="A simulation, an auditable engine and the story behind them. Every surface uses the same deterministic day-148 data."
          />
          <div className="mt-6 grid gap-3 lg:grid-cols-12">
            <RouteCard
              className="lg:col-span-7"
              icon={Orbit}
              kicker="Simulation 01"
              title="EVA autonomy"
              description="When the link disappears, the suit keeps deciding. Lose sync, watch inertial drift grow, and follow the return guidance back to the airlock."
              chips={["Link loss", "Inertial drift", "Autonomous audit"]}
              cta="Open the EVA simulation"
              onClick={() => onNavigate("eva")}
              secondary={{ label: "Jump to no-sync", href: "/?view=eva&t=18" }}
              featured
            />
            <div className="grid gap-3 lg:col-span-5">
              <RouteCard
                icon={SquareTerminal}
                kicker="Engine"
                title="Engine console"
                description="The rules, scenarios and facts behind every state. Change the mission and watch the escalation adapt."
                chips={["4 scenarios", "6 systems + halo", "Coach facts"]}
                cta="Explore the engine"
                onClick={() => onNavigate("console")}
              />
              <RouteCard
                icon={Presentation}
                kicker="Story"
                title="Pitch deck"
                description="The case for health autonomy: NASA hazards, explained triage, latency as a clinical variable and the honest gaps."
                chips={["15 slides", "Speaker notes", "Print to PDF"]}
                cta="Open the deck"
                href="/pitch/"
              />
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <SectionHeading
              kicker="Live evaluation"
              title="The engine is the product."
              text="This is not a mock. The state below comes from evaluate() on the deterministic day-148 scenario."
            />
            {topAssessment && <AssessmentCard assessment={topAssessment} />}
            <button
              type="button"
              onClick={() => onNavigate("console")}
              className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-cyan-200/80 transition hover:text-cyan-100"
            >
              Inspect every fact in the console
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-display text-base font-medium text-white/85">
                Six systems + a halo
              </h3>
              <span className="font-mono text-[11px] tracking-[0.16em] text-white/30 uppercase">
                early-infection · day {day}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {SYSTEM_IDS.map((id) => (
                <SystemTile key={id} id={id} level={evaluation.bySystem[id]} />
              ))}
            </div>
            <div className="mt-4 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] px-3 py-2.5 text-[11px] leading-relaxed text-amber-100/75">
              Mars escalation: local protocol first. The flight surgeon packet waits for the next
              communication window.
            </div>
          </div>
        </section>

        <Footer onNavigate={onNavigate} />
      </div>
    </div>
  );
}

function HaloPanel({
  evaluation,
  topAssessment,
  topLevel,
  onOpenConsole,
}: {
  evaluation: Evaluation;
  topAssessment?: Assessment;
  topLevel: Level;
  onOpenConsole: () => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-[#070d18]/85 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:p-5">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_0%,rgba(34,211,238,0.13),transparent_58%)]"
        aria-hidden="true"
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-white/35 uppercase">
            Mission status
          </p>
          <p className="mt-1 font-display text-lg font-medium text-white/90">Day {day} · Mars</p>
        </div>
        <LevelBadge level={topLevel} />
      </div>

      <div className="relative mx-auto my-1 aspect-square w-full max-w-[24rem]">
        <HaloMap evaluation={evaluation} topLevel={topLevel} />
        <div
          className="orbi-scanline pointer-events-none absolute inset-x-10 top-1/2 h-14 bg-gradient-to-b from-transparent via-cyan-300/[0.07] to-transparent"
          aria-hidden="true"
        />
      </div>

      <div className="relative grid grid-cols-2 gap-2">
        <Metric label="One-way latency" value="14 min" tone="amber" />
        <Metric label="Top signal" value={topAssessment?.title ?? "Nominal"} />
        <Metric
          label="Radiation budget"
          value={`${evaluation.estimates.radiationPct}%`}
          tone="orange"
        />
        <Metric
          label="Bone loss est."
          value={`${evaluation.estimates.boneLossPct.min}–${evaluation.estimates.boneLossPct.max}%`}
        />
      </div>

      <button
        type="button"
        onClick={onOpenConsole}
        className="relative mt-3 inline-flex w-full items-center justify-between rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-2.5 text-[11px] font-medium text-cyan-100/85 transition hover:border-cyan-300/40 hover:bg-cyan-400/[0.11] hover:text-cyan-50"
      >
        Inspect this scenario
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

function HaloMap({ evaluation, topLevel }: { evaluation: Evaluation; topLevel: Level }) {
  const center = 200;
  const orbit = 118;
  const radiationLevel = evaluation.bySystem.radiation;

  return (
    <svg
      viewBox="0 0 400 400"
      className="h-full w-full"
      role="img"
      aria-label={`Body map for mission day ${day}. Overall level ${LEVEL_LABEL[topLevel]}.`}
    >
      <defs>
        <radialGradient id="home-core" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(34,211,238,0.18)" />
          <stop offset="100%" stopColor="rgba(34,211,238,0.01)" />
        </radialGradient>
      </defs>

      <circle
        cx={center}
        cy={center}
        r="178"
        fill="none"
        stroke={LEVEL_COLOR[radiationLevel]}
        strokeOpacity="0.22"
        strokeWidth="1.5"
        strokeDasharray="2 8"
        className="orbi-orbit"
      />
      <circle
        cx={center}
        cy={center}
        r="150"
        fill="none"
        stroke="rgba(148,163,184,0.14)"
        strokeWidth="1"
      />
      <ellipse
        cx={center}
        cy={center}
        rx="170"
        ry="62"
        fill="none"
        stroke="rgba(34,211,238,0.2)"
        strokeWidth="1"
        strokeDasharray="3 9"
        transform="rotate(-18 200 200)"
      />
      <circle
        cx={center}
        cy={center}
        r="96"
        fill="rgba(34,211,238,0.025)"
        stroke="rgba(34,211,238,0.16)"
        strokeWidth="1"
      />
      <circle cx={center} cy={center} r="62" fill="url(#home-core)" />

      <text
        x={center}
        y="188"
        textAnchor="middle"
        fill="#e8edf7"
        fontSize="17"
        fontWeight="600"
        letterSpacing="3"
        fontFamily="var(--font-display)"
      >
        ORBI
      </text>
      <text
        x={center}
        y="208"
        textAnchor="middle"
        fill={LEVEL_COLOR[topLevel]}
        fontSize="8"
        letterSpacing="2.6"
        fontFamily="var(--font-mono)"
      >
        {LEVEL_LABEL[topLevel]}
      </text>
      <text
        x={center}
        y="24"
        textAnchor="middle"
        fill="rgba(148,163,184,0.5)"
        fontSize="7"
        letterSpacing="2.4"
        fontFamily="var(--font-mono)"
      >
        RADIATION HALO
      </text>

      {CORE_SYSTEMS.map((id, index) => {
        const angle = (Math.PI * 2 * index) / CORE_SYSTEMS.length - Math.PI / 2;
        const x = center + Math.cos(angle) * orbit;
        const y = center + Math.sin(angle) * orbit;
        const level = evaluation.bySystem[id];
        return (
          <g key={id}>
            <line
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(148,163,184,0.12)"
              strokeWidth="0.8"
            />
            <circle
              cx={x}
              cy={y}
              r="13"
              fill="rgba(5,7,13,0.9)"
              stroke={LEVEL_COLOR[level]}
              strokeOpacity="0.5"
              strokeWidth="1"
            />
            <circle cx={x} cy={y} r="5" fill={LEVEL_COLOR[level]} />
            <title>
              {SYSTEM_INFO[id].label}: {LEVEL_LABEL[level]}
            </title>
          </g>
        );
      })}
    </svg>
  );
}

function StatStrip() {
  const stats = [
    { value: "90 s", label: "daily check-in" },
    { value: "6 + halo", label: "body systems" },
    { value: "4", label: "deterministic scenarios" },
    { value: "0", label: "backend services" },
  ];

  return (
    <div className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-[#070d18] px-4 py-4">
          <p className="font-mono text-xl font-medium tracking-[-0.03em] text-white/90 tabular-nums">
            {stat.value}
          </p>
          <p className="mt-1 font-mono text-[11px] tracking-[0.16em] text-white/30 uppercase">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}

function SectionHeading({ kicker, title, text }: { kicker: string; title: string; text?: string }) {
  return (
    <div>
      <p className="font-mono text-[11px] tracking-[0.22em] text-cyan-300/60 uppercase">{kicker}</p>
      <h2 className="mt-2 font-display text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">
        {title}
      </h2>
      {text && (
        <p className="mt-2 max-w-[62ch] text-[13px] leading-relaxed text-white/45">{text}</p>
      )}
    </div>
  );
}

function RouteCard({
  className,
  icon: Icon,
  kicker,
  title,
  description,
  chips,
  cta,
  onClick,
  href,
  secondary,
  featured,
}: {
  className?: string;
  icon: LucideIcon;
  kicker: string;
  title: string;
  description: string;
  chips: string[];
  cta: string;
  onClick?: () => void;
  href?: string;
  secondary?: { label: string; href: string };
  featured?: boolean;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-200">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <span className="font-mono text-[11px] tracking-[0.18em] text-white/30 uppercase">
          {kicker}
        </span>
      </div>
      <h3 className="mt-4 font-display text-2xl font-medium tracking-[-0.03em] text-white/95">
        {title}
      </h3>
      <p className="mt-2 max-w-[48ch] text-[13px] leading-relaxed text-white/50">{description}</p>

      {featured && (
        <div className="relative mt-4 h-24 overflow-hidden rounded-xl border border-white/[0.06] bg-[#050a13]">
          <svg
            viewBox="0 0 640 110"
            className="h-full w-full"
            role="presentation"
            aria-hidden="true"
          >
            <path
              d="M52 82 C 180 8, 420 8, 588 72"
              fill="none"
              stroke="rgba(34,211,238,0.32)"
              strokeWidth="1.4"
              strokeDasharray="4 7"
              className="orbi-dash"
            />
            <circle cx="52" cy="82" r="6" fill="#fbbf24" />
            <circle cx="52" cy="82" r="12" fill="none" stroke="rgba(251,191,36,0.3)" />
            <circle cx="588" cy="72" r="6" fill="#34d399" />
            <circle cx="588" cy="72" r="12" fill="none" stroke="rgba(52,211,153,0.3)" />
            <text
              x="52"
              y="104"
              fill="rgba(148,163,184,0.45)"
              fontSize="8"
              fontFamily="var(--font-mono)"
              letterSpacing="2"
            >
              SUIT
            </text>
            <text
              x="540"
              y="98"
              fill="rgba(148,163,184,0.45)"
              fontSize="8"
              fontFamily="var(--font-mono)"
              letterSpacing="2"
            >
              AIRLOCK
            </text>
          </svg>
          <span className="absolute top-2.5 left-3 font-mono text-[11px] tracking-[0.18em] text-white/30 uppercase">
            No sync · inertial return
          </span>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-1.5">
        {chips.map((chip) => (
          <span
            key={chip}
            className="rounded-full border border-white/[0.08] bg-white/[0.025] px-2 py-1 font-mono text-[11px] tracking-[0.1em] text-white/40 uppercase"
          >
            {chip}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
        {href ? (
          <a
            href={href}
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-cyan-200/85 transition hover:text-cyan-100"
          >
            {cta}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : (
          <button
            type="button"
            onClick={onClick}
            className="inline-flex items-center gap-1.5 text-[12px] font-medium text-cyan-200/85 transition hover:text-cyan-100"
          >
            {cta}
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
        {secondary && (
          <a
            href={secondary.href}
            className="inline-flex items-center gap-1 text-[11px] text-white/35 transition hover:text-white/65"
          >
            {secondary.label}
            <ChevronRight className="h-3 w-3" aria-hidden="true" />
          </a>
        )}
      </div>
    </>
  );

  return (
    <article
      className={clsx(
        "group orbi-lift relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 text-left sm:p-5",
        "hover:border-cyan-300/25 hover:bg-white/[0.04]",
        className,
      )}
    >
      {body}
    </article>
  );
}

function SystemTile({ id, level }: { id: SystemId; level: Level }) {
  const Icon = SYSTEM_ICONS[id];
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-2.5 transition hover:border-white/[0.14] hover:bg-white/[0.04]">
      <span
        className="grid h-8 w-8 flex-none place-items-center rounded-lg"
        style={{ background: LEVEL_BG[level], color: LEVEL_COLOR[level] }}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium text-white/75">{SYSTEM_INFO[id].label}</p>
        <p
          className="font-mono text-[11px] tracking-[0.14em] uppercase"
          style={{ color: LEVEL_COLOR[level] }}
        >
          {LEVEL_LABEL[level]}
        </p>
      </div>
    </div>
  );
}

function AssessmentCard({ assessment }: { assessment: Assessment }) {
  return (
    <article
      className="mt-5 rounded-2xl border p-4"
      style={{
        borderColor: `${LEVEL_COLOR[assessment.level]}55`,
        background: LEVEL_BG[assessment.level],
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-mono text-[11px] tracking-[0.16em] text-white/40 uppercase">
          {SYSTEM_INFO[assessment.system].label} · {assessment.ruleId}
        </span>
        <LevelBadge level={assessment.level} />
      </div>
      <h3 className="mt-2 font-display text-xl font-medium tracking-[-0.02em] text-white/95">
        {assessment.title}
      </h3>
      <ul className="mt-3 space-y-1.5">
        {assessment.because.map((line) => (
          <li key={line} className="flex gap-2 text-[12px] leading-relaxed text-white/60">
            <span
              className="mt-1.5 h-1 w-1 flex-none rounded-full"
              style={{ background: LEVEL_COLOR[assessment.level] }}
              aria-hidden="true"
            />
            {line}
          </li>
        ))}
      </ul>
      <div className="mt-3 border-t border-white/10 pt-3">
        <p className="font-mono text-[11px] tracking-[0.16em] text-white/35 uppercase">Now</p>
        <p className="mt-1 text-[12px] text-white/75">{assessment.escalation.now}</p>
        {assessment.escalation.next && (
          <p className="mt-0.5 text-[11px] text-white/40">Next: {assessment.escalation.next}</p>
        )}
        <p className="mt-2 text-[11px] leading-relaxed text-white/35">
          {assessment.escalation.note}
        </p>
      </div>
    </article>
  );
}

function LevelBadge({ level }: { level: Level }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[11px] tracking-[0.16em] uppercase"
      style={{
        borderColor: `${LEVEL_COLOR[level]}55`,
        background: LEVEL_BG[level],
        color: LEVEL_COLOR[level],
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: LEVEL_COLOR[level] }}
        aria-hidden="true"
      />
      {LEVEL_LABEL[level]}
    </span>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "amber" | "orange";
}) {
  const color =
    tone === "amber" ? "text-amber-100" : tone === "orange" ? "text-orange-100" : "text-white/80";
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2.5">
      <p className="font-mono text-[11px] tracking-[0.16em] text-white/30 uppercase">{label}</p>
      <p className={clsx("mt-1 truncate text-[12px] font-medium", color)}>{value}</p>
    </div>
  );
}

function Footer({ onNavigate }: { onNavigate: (view: View) => void }) {
  return (
    <footer className="mt-16 border-t border-white/[0.07] pt-6">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="font-display text-sm font-semibold tracking-[0.18em] text-white/80">ORBI</p>
          <p className="mt-1 max-w-[64ch] text-[11px] leading-relaxed text-white/35">
            Deterministic engine · no diagnosis, no treatment · synthetic day-148 data. Built for
            NASA Space Apps Challenge 2026 by Team Kosmic.
          </p>
        </div>
        <nav
          className="flex flex-wrap items-center gap-3 text-[11px] text-white/40"
          aria-label="Footer"
        >
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="inline-flex items-center gap-1.5 transition hover:text-cyan-200"
          >
            Home
          </button>
          <button
            type="button"
            onClick={() => onNavigate("eva")}
            className="inline-flex items-center gap-1.5 transition hover:text-cyan-200"
          >
            <Route className="h-3 w-3" aria-hidden="true" />
            EVA
          </button>
          <button
            type="button"
            onClick={() => onNavigate("console")}
            className="inline-flex items-center gap-1.5 transition hover:text-cyan-200"
          >
            <SquareTerminal className="h-3 w-3" aria-hidden="true" />
            Console
          </button>
          <a
            href="/pitch/"
            className="inline-flex items-center gap-1.5 transition hover:text-cyan-200"
          >
            <Presentation className="h-3 w-3" aria-hidden="true" />
            Pitch
          </a>
          <a
            href="https://github.com/kosmic-nasa-hackathon/orbi"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition hover:text-cyan-200"
          >
            <GithubMark className="h-3 w-3" />
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
