import clsx from "clsx";
import {
  ArrowUpRight,
  House,
  type LucideIcon,
  Orbit,
  Presentation,
  Satellite,
  SquareTerminal,
} from "lucide-react";
import type { View } from "../navigation";
import { GithubMark } from "./GithubMark";

const NAV: { view: View; label: string; icon: LucideIcon }[] = [
  { view: "home", label: "Home", icon: House },
  { view: "eva", label: "EVA", icon: Orbit },
  { view: "console", label: "Console", icon: SquareTerminal },
];

export function SiteNav({
  current,
  onNavigate,
}: {
  current: View;
  onNavigate: (view: View) => void;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#05070d]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1500px] items-center gap-2 px-3 sm:px-5">
        <button
          type="button"
          onClick={() => onNavigate("home")}
          className="group flex items-center gap-2 rounded-lg py-1 pr-2 text-left"
          aria-label="ORBI home"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg border border-cyan-400/25 bg-cyan-400/[0.08] text-cyan-300 transition-colors group-hover:border-cyan-300/50 group-hover:bg-cyan-400/[0.14]">
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
          <span className="font-display text-[15px] font-semibold tracking-[0.2em] text-white">
            ORBI
          </span>
          <span className="hidden text-[9px] font-medium tracking-[0.2em] text-white/30 uppercase md:inline">
            health autonomy
          </span>
        </button>

        <span className="mx-1 hidden h-5 w-px bg-white/10 xl:block" />
        <span className="hidden items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] text-white/35 uppercase xl:flex">
          <Satellite className="h-3 w-3 text-cyan-300/60" aria-hidden="true" />
          Mars · day 148
        </span>

        <nav className="ml-auto flex items-center gap-1" aria-label="Primary">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = current === item.view;
            return (
              <button
                key={item.view}
                type="button"
                onClick={() => onNavigate(item.view)}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium transition-colors",
                  active
                    ? "bg-cyan-400/[0.12] text-cyan-100"
                    : "text-white/50 hover:bg-white/5 hover:text-white/85",
                )}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <span className="mx-1 hidden h-5 w-px bg-white/10 sm:block" />

        <a
          href="/pitch/"
          className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white/85"
          title="Open the pitch deck"
        >
          <Presentation className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden lg:inline">Pitch</span>
          <ArrowUpRight className="h-3 w-3 text-white/30" aria-hidden="true" />
        </a>
        <a
          href="https://github.com/kosmic-nasa-hackathon/orbi"
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[11px] font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white/85"
          title="Open the GitHub repository"
        >
          <GithubMark className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">GitHub</span>
        </a>
      </div>
    </header>
  );
}
