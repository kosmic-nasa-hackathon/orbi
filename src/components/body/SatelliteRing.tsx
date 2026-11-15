import { clsx } from "clsx";
import { SYSTEM_INFO } from "../../content/systems";
import type { DailyReading, Level, SystemId } from "../../domain/types";
import {
  LEVEL_TEXT,
  NODE_R,
  ORBIT_R,
  orbitPoint,
  SATELLITES,
  slotAngle,
  splitReading,
  towardZone,
  VIEW,
  ZONE_ANCHOR,
} from "./scene";

/** Length of the subtle connector stub every satellite keeps toward its zone. */
const STUB_LEN = 14;

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
        const stubStart = { x: pos.x + dir.x * (NODE_R + 2), y: pos.y + dir.y * (NODE_R + 2) };
        const stubEnd = {
          x: stubStart.x + dir.x * STUB_LEN,
          y: stubStart.y + dir.y * STUB_LEN,
        };
        const anchor = ZONE_ANCHOR[satellite.zone];
        const Icon = satellite.icon;
        const value = reading ? satellite.format(satellite.pick(reading)) : "—";
        const { value: number, unit } = splitReading(value);

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
                x1={stubStart.x}
                y1={stubStart.y}
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
                r={isSelected ? NODE_R + 3 : NODE_R}
                className="fill-surface-strong"
                stroke="currentColor"
                strokeWidth={isSelected ? 2 : 1.4}
              />

              {/* Icon + value, always upright */}
              {/* Icon, number and unit stacked: about 14 px and 10 px at tablet width. */}
              <Icon
                x={pos.x - 9}
                y={pos.y - 30}
                width={18}
                height={18}
                strokeWidth={1.75}
                className="text-ink"
              />
              <text
                x={pos.x}
                y={pos.y + 6}
                textAnchor="middle"
                fontSize={18}
                className="fill-ink font-mono font-semibold tabular-nums"
              >
                {number}
              </text>
              {unit && (
                <text
                  x={pos.x}
                  y={pos.y + 22}
                  textAnchor="middle"
                  fontSize={13}
                  className="fill-muted font-mono"
                >
                  {unit}
                </text>
              )}
            </g>
          </g>
        );
      })}
    </g>
  );
}
