"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  type AvailabilityBucket,
  availabilityLine,
  chartColor,
  chartTick,
  uptimeBarColor,
} from "@/entities/check";
import { cn } from "@/shared/lib";
import { ChartValue, ChartValues, TooltipCard } from "@/shared/ui";

// Пустой час и почти нулевой uptime получают минимальную высоту, иначе столбец не виден.
function barHeight(uptime: number | null): number {
  return uptime === null ? 8 : Math.max(uptime, 4);
}

// Два соседних элемента, а не обёртка: карточка может разложить их по строкам subgrid.
export function AvailabilityBars({
  buckets,
  valuesLabel,
  minTickGap,
  chartClassName,
  valuesClassName,
}: {
  buckets: AvailabilityBucket[];
  valuesLabel: string;
  minTickGap?: number;
  chartClassName?: string;
  valuesClassName?: string;
}) {
  const data = buckets.map((bucket) => ({
    ...bucket,
    share: barHeight(bucket.uptime),
  }));

  return (
    <>
      <div className={cn("h-52", chartClassName)} aria-hidden="true">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            accessibilityLayer={false}
            data={data}
            margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          >
            <CartesianGrid stroke={chartColor.line} strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tick={chartTick}
              height={32}
              minTickGap={minTickGap}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={chartTick}
              unit="%"
              width={48}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<AvailabilityTooltip />} />
            <Bar dataKey="share" radius={[6, 6, 0, 0]} isAnimationActive={false}>
              {data.map((entry) => (
                <Cell key={entry.label} fill={uptimeBarColor(entry.uptime)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ChartValues label={valuesLabel} className={valuesClassName}>
        {buckets.map((bucket) => {
          const line = availabilityLine(bucket);

          return (
            <ChartValue
              key={bucket.label}
              when={bucket.label}
              value={line.value}
              note={line.note}
              tone={line.tone}
            />
          );
        })}
      </ChartValues>
    </>
  );
}

function AvailabilityTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: AvailabilityBucket }>;
}) {
  const bucket = payload?.[0]?.payload;

  if (!active || !bucket) {
    return null;
  }

  const line = availabilityLine(bucket);

  return (
    <TooltipCard>
      <p className="text-muted">{bucket.label}</p>
      <p className="text-ink">{line.tone === "muted" ? line.value : `ответов ${line.value}`}</p>
      {bucket.gaps.length > 0 ? (
        <p className="mt-1 whitespace-pre-line text-down">
          {`запросы без ответа\n${bucket.gaps.join("\n")}`}
        </p>
      ) : null}
      {bucket.gapRest > 0 ? <p className="mt-1 text-muted">ещё {bucket.gapRest}</p> : null}
    </TooltipCard>
  );
}
