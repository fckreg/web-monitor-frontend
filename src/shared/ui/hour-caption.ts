import { formatTimeRange } from "@/shared/lib";

const HOUR_MS = 3_600_000;

export function hourWindow(asOf: Date, index: number): { start: Date; end: Date } {
  const current = Math.floor(asOf.getTime() / HOUR_MS) * HOUR_MS;
  const start = new Date(current - (23 - index) * HOUR_MS);
  const end = index === 23 ? asOf : new Date(start.getTime() + HOUR_MS);

  return { start, end };
}

export function formatHourWindow(asOf: Date, index: number): string {
  const { start, end } = hourWindow(asOf, index);

  return formatTimeRange(start, end);
}

export const HOUR_CAPTION = {
  up: "на все запросы был ответ",
  down: "не на все запросы был ответ",
  idle: "запросов не было",
} as const;

export function hourStateLabel(bucket: boolean | null): string {
  if (bucket === null) {
    return HOUR_CAPTION.idle;
  }

  if (bucket) {
    return HOUR_CAPTION.up;
  }

  return HOUR_CAPTION.down;
}
