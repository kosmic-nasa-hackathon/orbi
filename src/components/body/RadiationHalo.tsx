import { clsx } from "clsx";
import type { Level } from "../../domain/types";
import { HALO, LEVEL_TEXT, VIEW } from "./scene";

const TOP = VIEW.cy - HALO.ry;
const BOTTOM = VIEW.cy + HALO.ry;
/** The halo ellipse as a path that starts at 12 o'clock, so the dash runs clockwise from there. */
const ARC = `M ${VIEW.cx} ${TOP} A ${HALO.rx} ${HALO.ry} 0 1 1 ${VIEW.cx} ${BOTTOM} A ${HALO.rx} ${HALO.ry} 0 1 1 ${VIEW.cx} ${TOP}`;

/**
 * Radiation halo: a dashed ellipse around the whole figure. The filled arc
 * tracks the dose against the mission budget (pathLength=100 makes the
 * dasharray a percentage), and the level colour comes from `bySystem.radiation`.
 */
export function RadiationHalo({
  level,
  doseMSv,
  budgetMSv,
  pct,
  onSelect,
}: {
  level: Level;
  doseMSv: number;
  budgetMSv: number;
  pct: number;
  onSelect: () => void;
}) {
  const fill = Math.min(100, Math.max(0, pct));
  return (
    // biome-ignore lint/a11y/useSemanticElements: an SVG group cannot be a <button>; it gets role, tabIndex and Enter/Space handling.
    <g
      className={clsx("cursor-pointer", LEVEL_TEXT[level])}
      role="button"
      tabIndex={0}
      aria-label={`Radiation halo — ${Math.round(pct)}% of the mission budget`}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") onSelect();
      }}
    >
      <title>Radiation halo — cumulative exposure</title>

      {/* Dashed reference ellipse */}
      <ellipse
        cx={VIEW.cx}
        cy={VIEW.cy}
        rx={HALO.rx}
        ry={HALO.ry}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeDasharray="6 10"
        opacity={0.45}
      />

      {/* Budget progress arc on the same ellipse, clockwise from 12 o'clock */}
      <path
        d={ARC}
        fill="none"
        stroke="currentColor"
        strokeWidth={3}
        pathLength={100}
        strokeDasharray={`${fill} ${100 - fill}`}
        opacity={0.9}
        strokeLinecap="round"
      />

      {/* Dose / budget readout */}
      <text x={VIEW.cx} y={644} textAnchor="middle" fontSize={14} className="fill-muted font-mono">
        {doseMSv.toFixed(0)} / {budgetMSv} mSv · {Math.round(pct)}%
      </text>
    </g>
  );
}
