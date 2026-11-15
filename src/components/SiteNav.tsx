import {
  Activity,
  ArrowUpRight,
  CalendarCheck,
  ChartLine,
  House,
  type LucideIcon,
  Orbit,
  PersonStanding,
  Presentation,
  Satellite,
  SquareTerminal,
  Stethoscope,
} from "lucide-react";
import { isMissionView, type MissionView, type View } from "../navigation";
import { ThemeToggle } from "../theme/ThemeToggle";
import { GithubMark } from "./GithubMark";
import { cn } from "./ui/cn";

const NAV: { view: View; label: string; icon: LucideIcon }[] = [
  { view: "home", label: "Home", icon: House },
  { view: "today", label: "App", icon: Activity },
  { view: "eva", label: "EVA", icon: Orbit },
  { view: "console", label: "Console", icon: SquareTerminal },
];

const MISSION_NAV: { view: MissionView; label: string; icon: LucideIcon }[] = [
  { view: "today", label: "Today", icon: CalendarCheck },
  { view: "body", label: "Body", icon: PersonStanding },
  { view: "decision", label: "Decision", icon: Stethoscope },
  { view: "trends", label: "Trends", icon: ChartLine },
];

const LINK_CLASS =
  "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 pointer-coarse:h-11 text-body font-medium text-muted transition-colors hover:bg-surface-strong hover:text-ink";

export function SiteNav({
  current,
  onNavigate,
}: {
  current: View;
  onNavigate: (view: View) => void;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-canvas/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1500px] items-center gap-2 px-3 sm:px-5">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="group flex items-center gap-2 rounded-lg py-1 pr-2 text-left"
          aria-label="ORBI home"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-accent/25 bg-accent-soft text-accent transition-colors group-hover:border-accent/50">
            <svg
              viewBox="0 0 32 32"
              className="h-5 w-5 transition-transform duration-500 group-hover:rotate-12"
              role="presentation"
              aria-hidden="true"
            >
              <ellipse
                cx="16"
                cy="16"
                rx="12"
                ry="5.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                transform="rotate(-24 16 16)"
              />
              <circle cx="16" cy="16" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="25.4" cy="10.6" r="1.7" fill="currentColor" />
            </svg>
          </span>
          <span className="font-display text-[15px] font-semibold tracking-[0.2em] text-ink">
            ORBI
          </span>
          <span className="hidden text-label font-medium tracking-[0.2em] text-faint uppercase md:inline">
            health autonomy
          </span>
        </button>

        <span className="mx-1 hidden h-5 w-px bg-line xl:block" />
        <span className="hidden items-center gap-1.5 font-mono text-label tracking-[0.16em] text-faint uppercase xl:flex">
          <Satellite className="h-3 w-3 text-accent" aria-hidden="true" />
          Mars · day 148
        </span>

        <nav className="ml-auto flex items-center gap-1" aria-label="Primary">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active =
              current === item.view || (item.view === "today" && isMissionView(current));
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => onNavigate(item.view)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  LINK_CLASS,
                  active && "bg-accent-soft text-accent hover:bg-accent-soft hover:text-accent",
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <span className="mx-1 hidden h-5 w-px bg-line sm:block" />

        <a href="/pitch/" className={LINK_CLASS} title="Open the pitch deck">
          <Presentation className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden lg:inline">Pitch</span>
          <ArrowUpRight className="h-3 w-3 text-faint" aria-hidden="true" />
        </a>
        <a
          href="https://github.com/kosmic-nasa-hackathon/orbi"
          target="_blank"
          rel="noreferrer"
          className={LINK_CLASS}
          title="Open the GitHub repository"
        >
          <GithubMark className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">GitHub</span>
        </a>
        <ThemeToggle />
      </div>
      {isMissionView(current) && <MissionNav current={current} onNavigate={onNavigate} />}
    </header>
  );
}

function MissionNav({
  current,
  onNavigate,
}: {
  current: MissionView;
  onNavigate: (view: View) => void;
}) {
  return (
    <nav className="border-t border-line" aria-label="Mission screens">
      <div className="mx-auto flex h-12 max-w-[1500px] items-center gap-1 overflow-x-auto px-3 sm:px-5">
        {MISSION_NAV.map((item) => {
          const Icon = item.icon;
          const active = current === item.view;
          return (
            <button
              key={item.view}
              type="button"
              onClick={() => onNavigate(item.view)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex h-9 shrink-0 items-center gap-2 rounded-lg px-3 text-body font-medium transition-colors pointer-coarse:h-11",
                active
                  ? "bg-surface-strong text-ink shadow-[inset_0_-2px_0_var(--orbi-accent)]"
                  : "text-muted hover:bg-surface-strong hover:text-ink",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
