import { describe, expect, it } from "vitest";

import {
  formatCalendarDay,
  formatDateTime,
  formatPercent,
  formatTime,
  formatTimeRange,
} from "./format";

describe("формат времени", () => {
  it("показывает время по Москве независимо от зоны сервера", () => {
    expect(formatTime("2026-11-15T09:05:00Z")).toBe("12:05");
    expect(formatDateTime("2026-11-15T22:30:00Z")).toBe("16.11, 01:30");
  });

  it("склеивает одинаковые границы интервала", () => {
    expect(formatTimeRange("2026-11-15T09:05:00Z", "2026-11-15T09:05:30Z")).toBe("12:05");

    expect(formatTimeRange("2026-11-15T09:05:00Z", "2026-11-15T09:40:00Z")).toBe("12:05–12:40");
  });

  it("не сдвигает календарный день", () => {
    expect(formatCalendarDay("2026-11-01")).toBe("01.11");
  });
});

describe("formatPercent", () => {
  it("ставит запятую и убирает лишние нули", () => {
    expect(formatPercent(99.5)).toBe("99,5%");
    expect(formatPercent(100)).toBe("100%");
    expect(formatPercent(50, { minDigits: 1 })).toBe("50,0%");
  });
});
