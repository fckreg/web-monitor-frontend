import { formatCalendarDay, formatPercent, formatTime, formatTimeRange } from "@/shared/lib";

import type { LatencyPoint, UptimeDay } from "./schema";

export type LatencyRow = {
  time: string;
  latency: number | null;
  ok: boolean;
};

export function toLatencyRow(point: LatencyPoint, time: string): LatencyRow {
  return {
    time,
    latency: point.ok ? point.latency_ms : null,
    ok: point.ok,
  };
}

// Полоса сбоя захватывает соседние ответы, чтобы одиночный сбой был виден на графике.
export function outageSpans(rows: LatencyRow[]): { from: string; to: string }[] {
  const spans: { from: string; to: string }[] = [];
  let start: number | null = null;
  const marked = rows.map(
    (row, index) =>
      !row.ok ||
      (index > 0 && !rows[index - 1].ok) ||
      (index + 1 < rows.length && !rows[index + 1].ok),
  );

  for (let index = 0; index <= marked.length; index += 1) {
    const on = index < marked.length && marked[index];

    if (on && start === null) {
      start = index;
    }

    if (!on && start !== null) {
      spans.push({ from: rows[start].time, to: rows[index - 1].time });
      start = null;
    }
  }

  return spans;
}

export const chartColor = {
  line: "var(--color-line)",
  idle: "var(--color-idle)",
  up: "var(--color-up-mark)",
  warn: "var(--color-warn)",
  down: "var(--color-down-mark)",
} as const;

export const chartTick = {
  fontSize: 12,
  fill: "var(--color-muted)",
} as const;

export type UptimeLevel = "idle" | "up" | "warn" | "down";

export function uptimeLevel(percent: number | null): UptimeLevel {
  if (percent === null) {
    return "idle";
  }

  if (percent >= 99) {
    return "up";
  }

  if (percent >= 90) {
    return "warn";
  }

  return "down";
}

export function uptimeBarColor(percent: number | null): string {
  return chartColor[uptimeLevel(percent)];
}

export type AvailabilityBucket = {
  label: string;
  uptime: number | null;
  total: number;
  gaps: string[];
  gapRest: number;
};

const GAP_LIMIT = 10;
const HOUR_MS = 3_600_000;
const NO_REQUESTS = "запросов не было";

export function outageRanges(
  points: Array<{ checked_at: string; ok: boolean }>,
): { start: Date; end: Date }[] {
  const sorted = [...points].sort(
    (left, right) => new Date(left.checked_at).getTime() - new Date(right.checked_at).getTime(),
  );
  const ranges: { start: Date; end: Date }[] = [];
  let current: { start: Date; end: Date } | null = null;

  for (const point of sorted) {
    const moment = new Date(point.checked_at);

    if (Number.isNaN(moment.getTime())) {
      continue;
    }

    if (!point.ok) {
      if (current) {
        current.end = moment;
      } else {
        current = { start: moment, end: moment };
      }
    } else if (current) {
      ranges.push(current);
      current = null;
    }
  }

  if (current) {
    ranges.push(current);
  }

  return ranges;
}

function startOfHour(ms: number): number {
  return Math.floor(ms / HOUR_MS) * HOUR_MS;
}

function toPercent(share: number): number {
  return Math.round(share * 1000) / 10;
}

export function hourlyAvailability(
  points: Array<{ checked_at: string; ok: boolean }>,
  now: Date,
): AvailabilityBucket[] {
  const current = startOfHour(now.getTime());
  const first = current - 23 * HOUR_MS;
  const slots: Array<Array<{ checked_at: string; ok: boolean }>> = Array.from(
    { length: 24 },
    () => [],
  );

  for (const point of points) {
    const moment = Date.parse(point.checked_at);

    if (Number.isNaN(moment)) {
      continue;
    }

    const index = (startOfHour(moment) - first) / HOUR_MS;

    if (index < 0 || index > 23) {
      continue;
    }

    slots[index].push(point);
  }

  return slots.map((values, index) => {
    const total = values.length;
    const okCount = values.filter((point) => point.ok).length;
    const ranges = outageRanges(values);

    return {
      label: formatTime(new Date(first + index * HOUR_MS)),
      uptime: total === 0 ? null : toPercent(okCount / total),
      total,
      gaps: ranges.slice(0, GAP_LIMIT).map((range) => formatTimeRange(range.start, range.end)),
      gapRest: Math.max(0, ranges.length - GAP_LIMIT),
    };
  });
}

export function dailyAvailability(days: UptimeDay[]): AvailabilityBucket[] {
  return days.map((day) => ({
    label: formatCalendarDay(day.date),
    uptime: day.total === 0 || day.uptime === null ? null : toPercent(day.uptime),
    total: day.total,
    gaps: day.gaps.map((gap) => formatTimeRange(gap.start, gap.end)),
    gapRest: day.gap_rest,
  }));
}

export function availabilityLine(bucket: AvailabilityBucket): {
  value: string;
  note?: string;
  tone?: "muted";
} {
  if (bucket.total === 0 || bucket.uptime === null) {
    return { value: NO_REQUESTS, tone: "muted" };
  }

  const rest = bucket.gapRest > 0 ? `, ещё ${bucket.gapRest}` : "";
  const note = bucket.gaps.length > 0 ? `без ответа ${bucket.gaps.join(", ")}${rest}` : undefined;

  return { value: formatPercent(bucket.uptime), note };
}
