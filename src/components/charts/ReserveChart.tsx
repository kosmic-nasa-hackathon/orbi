import { useReducedMotion } from "motion/react";
import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PillReservePoint } from "../../content/reproductive";
import { dayLabel } from "./TrendChart";

interface Row extends PillReservePoint {
  label: string;
}

/** Pill reserve against the mission days left. The gap between the lines is the shortfall. */
export function ReserveChart({
  points,
  eventDay,
}: {
  points: PillReservePoint[];
  eventDay?: number;
}) {
  const reduce = useReducedMotion() ?? false;
  const rows: Row[] = points.map((point) => ({ ...point, label: dayLabel(point.day) }));
  const values = points.flatMap((point) => [point.reserve, point.daysLeft]);
  const pad = Math.max((Math.max(...values) - Math.min(...values)) * 0.2, 4);
  const domain: [number, number] = [
    Math.floor(Math.min(...values) - pad),
    Math.ceil(Math.max(...values) + pad),
  ];
  const event = rows.find((row) => row.day === eventDay);

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{ width: 800, height: 320 }}
      >
        <LineChart
          data={rows}
          margin={{ top: 12, right: 24, bottom: 4, left: 0 }}
          accessibilityLayer
          title="Pill reserve against mission days left"
        >
          {event && (
            <ReferenceLine
              x={event.label}
              stroke="var(--color-watch)"
              strokeDasharray="2 4"
              label={{
                value: "Stability check",
                position: "insideTopLeft",
                fill: "var(--color-watch)",
                fontSize: 11,
              }}
            />
          )}
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--color-faint)", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "var(--color-line)" }}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            domain={domain}
            tick={{ fill: "var(--color-faint)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip
            cursor={{ stroke: "var(--color-line-strong)" }}
            content={({ active, payload }) => {
              const row = active ? (payload?.[0]?.payload as Row | undefined) : undefined;
              if (!row) return null;
              const gap = row.reserve - row.daysLeft;
              return (
                <div className="rounded-xl border border-line bg-surface px-3 py-2 text-caption text-ink shadow-sm">
                  <p className="font-mono text-label text-faint uppercase">Mission · {row.label}</p>
                  <p className="font-semibold tabular-nums">{row.reserve} pills left</p>
                  <p className="text-muted tabular-nums">{row.daysLeft} mission days left</p>
                  <p className="text-muted tabular-nums">
                    {gap < 0 ? `${-gap} pills short` : "Covers the mission"}
                  </p>
                </div>
              );
            }}
          />
          <Line
            dataKey="daysLeft"
            name="Mission days left"
            stroke="var(--color-muted)"
            strokeDasharray="4 4"
            strokeWidth={2}
            dot={false}
            isAnimationActive={!reduce}
          />
          <Line
            dataKey="reserve"
            name="Pills left"
            stroke="var(--color-watch)"
            strokeWidth={2}
            dot={false}
            isAnimationActive={!reduce}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
