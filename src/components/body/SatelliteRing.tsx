import { clsx } from "clsx";
import { SYSTEM_INFO } from "../../content/systems";
import type { DailyReading, Level, SystemId } from "../../domain/types";
import {
  LEVEL_TEXT,
  ORBIT_R,
  orbitPoint,
  SATELLITES,
  slotAngle,
  towardZone,
  VIEW,
  ZONE_ANCHOR,
} from "./scene";

/** Length of the subtle connector stub every satellite keeps toward its zone. */
const STUB_LEN = 22;

/**
 * The 7 check-in readings as satellites at fixed slots on the orbit ring, so
 * their values stay readable and never cross the head. Each satellite is
 * coloured by the level of the zone it feeds, keeps a dashed stub toward its
 * zone, and the selected zone gets the full connector highlighted.
 */
export function SatelliteRing({
  reading,
  bySystem,
  selected,
  onSelect,
}: {
  reading: DailyReading | undefined;
  bySystem: Record<SystemId, Level>;
  selected: SystemId | null;
  onSelect: (system: SystemId) => void;
}) {
  return (
    <g>
      {/* Orbit guide ring */}
      <circle
        cx={VIEW.cx}
        cy={VIEW.cy}
        r={ORBIT_R}
        fill="none"
        className="stroke-line"
        strokeWidth={1}
        strokeDasharray="2 8"
      />

      {SATELLITES.map((satellite, index) => {
        const base = slotAngle(index);
        const pos = orbitPoint(base);
        const level = bySystem[satellite.zone];
        const isSelected = selected === satellite.zone;
        const dir = towardZone(pos, satellite.zone);
        const stubEnd = {
          x: pos.x + dir.x * STUB_LEN,
          y: pos.y + dir.y * STUB_LEN,
        };
        const anchor = ZONE_ANCHOR[satellite.zone];
        const Icon = satellite.icon;
        const value = reading ? satellite.format(satellite.pick(reading)) : "—";

        return (
          <g key={satellite.field}>
            {/* Connector: full to the zone when selected, stub otherwise */}
            {isSelected && reading ? (
              <line
                x1={pos.x}
                y1={pos.y}
                x2={anchor.x}
                y2={anchor.y}
                stroke="currentColor"
                className={clsx(LEVEL_TEXT[level], "orbi-dash")}
                strokeWidth={1}
                strokeDasharray="5 7"
                opacity={0.4}
              />
            ) : (
              <line
                x1={pos.x + dir.x * 28}
                y1={pos.y + dir.y * 28}
                x2={stubEnd.x}
                y2={stubEnd.y}
                stroke="currentColor"
                className={LEVEL_TEXT[level]}
                strokeWidth={1}
                strokeDasharray="3 5"
                opacity={0.3}
              />
            )}

            {/* biome-ignore lint/a11y/useSemanticElements: an SVG group cannot be a <button>; it gets role, tabIndex and Enter/Space handling. */}
            <g
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`${satellite.label}: ${value} — ${SYSTEM_INFO[satellite.zone].label}`}
              onClick={() => onSelect(satellite.zone)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") onSelect(satellite.zone);
              }}
            >
              <title>
                {satellite.label}: {value} — feeds {SYSTEM_INFO[satellite.zone].label}
              </title>

              {/* Node */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isSelected ? 31 : 28}
                className="fill-surface-strong"
                stroke="currentColor"
                strokeWidth={isSelected ? 2 : 1.4}
              />

              {/* Icon + value, always upright */}
              <Icon
                x={pos.x - 8}
                y={pos.y - 17}
                width={16}
                height={16}
                strokeWidth={1.75}
                className="text-ink"
              />
              <text
                x={pos.x}
                y={pos.y + 13}
                textAnchor="middle"
                fontSize={10}
                className="fill-ink font-mono font-medium"
              >
                {value}
              </text>
            </g>
          </g>
        );
      })}
    </g>
  );
}
