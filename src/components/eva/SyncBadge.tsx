import clsx from "clsx";
import { Radio, RefreshCw, Satellite, WifiOff } from "lucide-react";
import type { LinkState } from "../../simulation/eva";

const SYNC_STYLE: Record<LinkState, { label: string; className: string; icon: typeof Radio }> = {
  SYNCED: {
    label: "SYNCED",
    className: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200",
    icon: Satellite,
  },
  DEGRADED: {
    label: "DEGRADED",
    className: "border-amber-400/40 bg-amber-400/10 text-amber-100",
    icon: Radio,
  },
  LOST: {
    label: "NO SYNC",
    className: "border-red-400/50 bg-red-400/15 text-red-100",
    icon: WifiOff,
  },
  REACQUIRING: {
    label: "REACQUIRING",
    className: "border-cyan-400/40 bg-cyan-400/10 text-cyan-100",
    icon: RefreshCw,
  },
};

export function SyncBadge({ link, age }: { link: LinkState; age: number }) {
  const style = SYNC_STYLE[link];
  const Icon = style.icon;
  const lost = link === "LOST";

  return (
    <div
      className={clsx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px] font-medium tracking-wide",
        style.className,
        lost && "orbi-pulse",
      )}
      role="status"
      aria-live="polite"
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{style.label}</span>
      <span className="text-white/45">
        {lost ? `${Math.round(age)} s` : link === "SYNCED" ? "live" : "waiting"}
      </span>
    </div>
  );
}
