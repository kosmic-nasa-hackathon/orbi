import { clsx } from "clsx";
import type { ReactNode } from "react";
import type { Level, SystemId } from "../../domain/types";
import { BodyFigure } from "./BodyFigure";
import { BONES, BRAIN_WAVES, GUT, HEART, LUNGS } from "./geometry";
import { LEVEL_FILL_OPACITY, LEVEL_TEXT, ZONE_ANCHOR } from "./scene";

/**
 * The 7 zones of the body in orbit. Every zone takes its level colour from
 * `evaluate().bySystem` — never from local rules. Organ glyphs are simplified
 * anatomical shapes: readable, not literal. Bone lines overlay the limb
 * strokes so the MSK zone reads as the skeleton's core. Shapes and their
 * anatomical placement are documented in geometry.ts.
 */
/** The heart sits on the lungs: a smaller tap target keeps both reachable. */
const HIT_RADIUS: Partial<Record<SystemId, number>> = { cardio: 14 };

export function BodyZones({
  bySystem,
  selected,
  onSelect,
}: {
  bySystem: Record<SystemId, Level>;
  selected: SystemId | null;
  onSelect: (system: SystemId) => void;
}) {
  return (
    <g>
      {/* Immune zone: the silhouette itself (see BodyFigure). */}
      <g
        className={clsx(
          LEVEL_TEXT[bySystem.immune],
          "stroke-current",
          bySystem.immune === "URGENT" && "orbi-pulse",
        )}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <BodyFigure onSelect={() => onSelect("immune")} />
      </g>

      <Zone
        system="msk"
        level={bySystem.msk}
        selected={selected === "msk"}
        onSelect={onSelect}
        label="Bones — resistance exercise"
      >
        {BONES.map((d) => (
          <path key={d} d={d} />
        ))}
      </Zone>

      <Zone
        system="behavioral"
        level={bySystem.behavioral}
        selected={selected === "behavioral"}
        onSelect={onSelect}
        label="Brain — sleep, mood and workload"
      >
        <path d={BRAIN_WAVES} fill="none" />
      </Zone>

      <Zone
        system="respiratory"
        level={bySystem.respiratory}
        selected={selected === "respiratory"}
        onSelect={onSelect}
        label="Lungs — SpO₂ and cabin air"
      >
        {LUNGS.map((d) => (
          <path key={d} d={d} />
        ))}
      </Zone>

      <Zone
        system="cardio"
        level={bySystem.cardio}
        selected={selected === "cardio"}
        onSelect={onSelect}
        label="Heart — resting heart rate"
      >
        <path d={HEART.d} transform={HEART.transform} />
      </Zone>

      <Zone
        system="metabolic"
        level={bySystem.metabolic}
        selected={selected === "metabolic"}
        onSelect={onSelect}
        label="Abdomen — glucose and nutrition"
      >
        <ellipse {...GUT.ellipse} />
        <path d={GUT.folds} fill="none" />
      </Zone>
    </g>
  );
}

function Zone({
  system,
  level,
  selected,
  onSelect,
  label,
  children,
}: {
  system: SystemId;
  level: Level;
  selected: boolean;
  onSelect: (system: SystemId) => void;
  label: string;
  children: ReactNode;
}) {
  const anchor = ZONE_ANCHOR[system];
  return (
    <g
      className={clsx(LEVEL_TEXT[level], "stroke-current", level === "URGENT" && "orbi-pulse")}
      fill="currentColor"
      fillOpacity={LEVEL_FILL_OPACITY[level]}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={level === "NOMINAL" ? 0.8 : 1}
      style={{
        filter: level === "NOMINAL" ? undefined : "drop-shadow(0 0 5px currentColor)",
      }}
    >
      {/* biome-ignore lint/a11y/useSemanticElements: an SVG group cannot be a <button>; it gets role, tabIndex and Enter/Space handling. */}
      <g
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        aria-label={label}
        onClick={() => onSelect(system)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") onSelect(system);
        }}
      >
        <title>{label}</title>
        {children}

        {/* Selection halo */}
        {selected && (
          <circle
            cx={anchor.x}
            cy={anchor.y}
            r={24}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.2}
            strokeDasharray="3 5"
          />
        )}

        {/* Invisible hit area for comfortable tapping */}
        <circle
          cx={anchor.x}
          cy={anchor.y}
          r={HIT_RADIUS[system] ?? 30}
          fill="transparent"
          stroke="none"
        />
      </g>
    </g>
  );
}
