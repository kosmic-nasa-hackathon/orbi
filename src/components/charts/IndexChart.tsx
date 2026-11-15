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
import { dayLabel } from "./TrendChart";

export interface IndexLine<K extends string> {
  key: K;
  label: string;
  stroke: string;
  dashed?: boolean;
}

/**
 * Several signals as a percentage of her ground-training level (100 %), with optional day
 * markers. Used for demo series that have no clinical unit or threshold.
 */
export function IndexChart<K extends string>({
  rows,
  lines,
  markers = [],
  markerLabel,
  title,
}: {
  rows: ({ day: number } & Record<K, number>)[];
  lines: IndexLine<K>[];
  markers?: number[];
  markerLabel?: string;
  title: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const data = rows.map((row) => ({ ...row, label: dayLabel(row.day) }));
  const values = rows.flatMap((row) => lines.map((line) => row[line.key]));
  const min = Math.min(100, ...values);
  const max = Math.max(100, ...values);
  const pad = Math.max((max - min) * 0.15, 4);
  const shown = new Set(data.map((row) => row.day));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
        initialDimension={{ width: 800, height: 288 }}
      >
        <LineChart
          data={data}
          margin={{ top: 12, right: 96, bottom: 4, left: 0 }}
          accessibilityLayer
          title={title}
        >
          <ReferenceLine
            y={100}
            stroke="var(--color-accent)"
            strokeDasharray="4 4"
            strokeOpacity={0.6}
            label={{
              value: "Her ground level",
              position: "right",
              fill: "var(--color-muted)",
              fontSize: 11,
            }}
          />
          {markers
            .filter((day) => shown.has(day))
            .map((day, index) => (
              <ReferenceLine
                key={day}
                x={dayLabel(day)}
                stroke="var(--color-watch)"
                strokeDasharray="2 4"
                label={
                  index === 0 && markerLabel
                    ? {
                        value: markerLabel,
                        position: "insideTopLeft",
                        fill: "var(--color-watch)",
                        fontSize: 11,
                      }
                    : undefined
                }
              />
            ))}
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--color-faint)", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "var(--color-line)" }}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            domain={[Math.floor(min - pad), Math.ceil(max + pad)]}
            tickFormatter={(value: number) => `${value}%`}
            tick={{ fill: "var(--color-faint)", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={48}
          />
          <Tooltip
            cursor={{ stroke: "var(--color-line-strong)" }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="rounded-xl border border-line bg-surface px-3 py-2 text-caption text-ink shadow-sm">
                  <p className="font-mono text-label text-faint uppercase">Mission · {label}</p>
                  {lines.map((line) => {
                    const value = payload[0]?.payload?.[line.key];
                    return (
                      <p key={line.key} className="tabular-nums">
                        {line.label}: <span className="font-semibold">{value}%</span>
                      </p>
                    );
                  })}
                </div>
              );
            }}
          />
          {lines.map((line) => (
            <Line
              key={line.key}
              dataKey={line.key}
              name={line.label}
              stroke={line.stroke}
              strokeDasharray={line.dashed ? "5 4" : undefined}
              strokeWidth={2}
              dot={false}
              isAnimationActive={!reduce}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
