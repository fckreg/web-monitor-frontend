import { LOCALE, TIME_ZONE } from "@/shared/config";

const timeFormat = new Intl.DateTimeFormat(LOCALE, {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: TIME_ZONE,
});

const dateTimeFormat = new Intl.DateTimeFormat(LOCALE, {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: TIME_ZONE,
});

const percentFormats = new Map<string, Intl.NumberFormat>();

function toDate(value: Date | string): Date {
  return typeof value === "string" ? new Date(value) : value;
}

export function formatTime(value: Date | string): string {
  return timeFormat.format(toDate(value));
}

export function formatDateTime(value: Date | string): string {
  return dateTimeFormat.format(toDate(value));
}

export function formatTimeRange(start: Date | string, end: Date | string) {
  const from = formatTime(start);
  const to = formatTime(end);

  return from === to ? from : `${from}–${to}`;
}

// Календарная дата без времени: сдвиг зоны не должен перенести её на соседний день.
export function formatCalendarDay(isoDate: string): string {
  const [, month, day] = isoDate.split("-");

  return month && day ? `${day}.${month}` : isoDate;
}

export function formatPercent(
  value: number,
  { minDigits = 0, maxDigits = 1 }: { minDigits?: number; maxDigits?: number } = {},
): string {
  const key = `${minDigits}:${maxDigits}`;
  let format = percentFormats.get(key);

  if (!format) {
    format = new Intl.NumberFormat(LOCALE, {
      minimumFractionDigits: minDigits,
      maximumFractionDigits: maxDigits,
      useGrouping: false,
    });

    percentFormats.set(key, format);
  }

  return `${format.format(value)}%`;
}
