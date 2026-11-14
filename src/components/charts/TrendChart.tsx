import { useReducedMotion } from "motion/react";
import {
  Area,
  ComposedChart,
  Line,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { SeriesPoint, VitalSeries } from "../../domain/series";
import type { Level } from "../../domain/types";

const LEVEL_STROKE: Record<Level, string> = {
  NOMINAL: "var(--color-nominal)",
  WATCH: "var(--color-watch)",
  CONCERN: "var(--color-concern)",
  URGENT: "var(--color-urgent)",
};

interface Row {
  label: string;
  day: number;
  training: number | null;
  mission: number | null;
  band: [number, number];
  point: SeriesPoint;
}

export function dayLabel(day: number): string {
  return day < 0 ? `G${day}` : `D${day}`;
}

function domainFor(series: VitalSeries): [number, number] {
  const values = [
    ...series.points.map((point) => point.value),
    series.normal.low,
    series.normal.high,
  ];
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = Math.max((max - min) * 0.2, 0.1);
  return [min - pad, max + pad];
}

function PointDot({ cx, cy, payload }: { cx?: number | null; cy?: number | null; payload?: Row }) {
  if (cx == null || cy == null || !payload || payload.mission === null) return null;
  const outside = payload.point.outsideNormal;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={outside ? 4 : 2.5}
      fill={outside ? "var(--color-surface)" : "currentColor"}
      stroke="currentColor"
      strokeWidth={outside ? 2 : 0}
    />
  );
}

/** Line chart of one vital: ground training, mission days, the "your normal" band and thresholds. */
export function TrendChart({
  series,
  unit,
  decimals,
  label,
}: {
  series: VitalSeries;
  unit: string;
  decimals: number;
  label: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const [min, max] = domainFor(series);
  const rows: Row[] = series.points.map((point) => ({
    label: dayLabel(point.day),
    day: point.day,
    training: point.phase === "training" ? point.value : null,
    mission: point.phase === "mission" ? point.value : null,
    band: [series.normal.low, series.normal.high],
    point,
  }));
  const training = rows.filter((row) => row.point.phase === "training");
  const firstMission = rows.find((row) => row.point.phase === "mission");
  const format = (value: number) => value.toFixed(decimals);

  return (
    <div className="h-80 w-full text-accent">
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{ width: 800, height: 320 }}
      >
        <ComposedChart
          data={rows}
          margin={{ top: 12, right: 96, bottom: 4, left: 0 }}
          accessibilityLayer
          title={`${label} over time`}
        >
          {training.length > 0 && (
            <ReferenceArea
              x1={training[0]?.label}
              x2={training.at(-1)?.label}
              fill="var(--color-surface-strong)"
              fillOpacity={1}
              label={{
                value: "Ground training",
                position: "insideTopLeft",
                fill: "var(--color-faint)",
                fontSize: 11,
              }}
            />
          )}
          <Area
            dataKey="band"
            stroke="none"
            fill="var(--color-accent)"
            fillOpacity={0.12}
            isAnimationActive={!reduce}
          />
          <ReferenceLine
            y={series.normal.mean}
            stroke="var(--color-accent)"
            strokeDasharray="4 4"
            strokeOpacity={0.6}
            label={{
              value: "Your normal",
              position: "right",
              fill: "var(--color-muted)",
              fontSize: 11,
            }}
          />
          {series.references
            .filter((reference) => reference.value >= min && reference.value <= max)
            .map((reference) => (
              <ReferenceLine
                key={reference.label}
                y={reference.value}
                stroke={LEVEL_STROKE[reference.level]}
                strokeDasharray="2 4"
                label={{
                  value: `${reference.label} ${format(reference.value)}`,
                  position: "right",
                  fill: LEVEL_STROKE[reference.level],
                  fontSize: 11,
                }}
              />
            ))}
          {firstMission && (
            <ReferenceLine
              x={firstMission.label}
              stroke="var(--color-line-strong)"
              label={{
                value: "Mission",
                position: "insideTopRight",
                fill: "var(--color-faint)",
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
            domain={[min, max]}
            tickFormatter={format}
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
              return (
                <div className="rounded-xl border border-line bg-surface px-3 py-2 text-caption text-ink shadow-sm">
                  <p className="font-mono text-label text-faint uppercase">
                    {row.point.phase === "training" ? "Ground training" : "Mission"} · {row.label}
                  </p>
                  <p className="font-semibold tabular-nums">
                    {format(row.point.value)} {unit}
                  </p>
                  <p className="text-muted">
                    {row.point.outsideNormal ? "Outside your normal" : "Inside your normal"}
                  </p>
                </div>
              );
            }}
          />
          <Line
            dataKey="training"
            stroke="var(--color-muted)"
            strokeDasharray="3 3"
            strokeWidth={1.5}
            dot={false}
            connectNulls={false}
            isAnimationActive={!reduce}
          />
          <Line
            dataKey="mission"
            stroke="var(--color-accent)"
            strokeWidth={2.5}
            dot={<PointDot />}
            activeDot={{ r: 5 }}
            connectNulls={false}
            isAnimationActive={!reduce}
            animationDuration={900}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
