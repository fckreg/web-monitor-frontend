"use client";

import {
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  chartColor,
  chartTick,
  type LatencyPoint,
  type LatencyRow,
  outageSpans,
  toLatencyRow,
} from "@/entities/check";
import { formatDateTime } from "@/shared/lib";
import { Card, ChartValue, ChartValues, TooltipCard } from "@/shared/ui";

function latencyText(ok: boolean, latency: number | null): string {
  return ok ? `${latency ?? "—"} мс` : "ответ не получен";
}

export function LatencyChart({ points }: { points: LatencyPoint[] }) {
  const data = points.map((point) => toLatencyRow(point, formatDateTime(point.checked_at)));
  const spans = outageSpans(data);
  const failed = data.filter((row) => !row.ok).length;

  return (
    <Card className="row-span-3 grid grid-rows-subgrid p-0">
      <div className="px-4 pt-4">
        <h2 className="type-section-title">Задержка запросов за 24 часа</h2>
        <div className="mt-2 space-y-2">
          <p className="type-note">
            Зелёная линия — на запрос получен ответ. Розовым отмечены запросы без ответа.
          </p>
          {failed > 0 ? (
            <p className="text-sm font-light text-down">
              Без ответа {failed} из {data.length} запросов
            </p>
          ) : null}
        </div>
      </div>
      <div className="h-52 px-4">
        {data.length === 0 ? (
          <p className="type-note">Запросов за 24 часа не было</p>
        ) : (
          <div className="h-full" aria-hidden="true">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                accessibilityLayer={false}
                data={data}
                margin={{ top: 8, right: 28, bottom: 0, left: 0 }}
              >
                <CartesianGrid stroke={chartColor.line} strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tick={chartTick}
                  height={32}
                  minTickGap={24}
                  padding={{ left: 8, right: 24 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={chartTick}
                  unit=" мс"
                  width={72}
                  padding={{ bottom: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<LatencyTooltip />} />
                {spans.map((span) => (
                  <ReferenceArea
                    key={`${span.from}-${span.to}`}
                    x1={span.from}
                    x2={span.to}
                    fill={chartColor.down}
                    fillOpacity={0.28}
                    strokeOpacity={0}
                    ifOverflow="hidden"
                  />
                ))}
                <Line
                  type="monotone"
                  dataKey="latency"
                  stroke={chartColor.up}
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
      <ChartValues className="mt-0 px-4 pb-4" label="Значения задержки">
        {points.map((point) => (
          <ChartValue
            key={point.checked_at}
            when={formatDateTime(point.checked_at)}
            value={latencyText(point.ok, point.latency_ms)}
            tone={point.ok ? "ink" : "down"}
          />
        ))}
      </ChartValues>
    </Card>
  );
}

function LatencyTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: LatencyRow }>;
}) {
  const row = payload?.[0]?.payload;

  if (!active || !row) {
    return null;
  }

  return (
    <TooltipCard>
      <p className="text-muted">{row.time}</p>
      <p className={row.ok ? "text-ink" : "text-down"}>{latencyText(row.ok, row.latency)}</p>
    </TooltipCard>
  );
}
