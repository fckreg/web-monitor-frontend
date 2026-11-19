import { describe, expect, it } from "vitest";

import { formatHourWindow, hourStateLabel, hourWindow } from "./hour-caption";

describe("hourWindow", () => {
  it("ставит полные часы с нуля минут, а текущий до момента сборки", () => {
    const asOf = new Date("2026-11-15T12:58:00.000Z");
    const latest = hourWindow(asOf, 23);
    const previous = hourWindow(asOf, 22);
    const oldest = hourWindow(asOf, 0);
    expect(latest.start.toISOString()).toBe("2026-11-15T12:00:00.000Z");
    expect(latest.end.toISOString()).toBe(asOf.toISOString());
    expect(previous.start.toISOString()).toBe("2026-11-15T11:00:00.000Z");
    expect(previous.end.toISOString()).toBe("2026-11-15T12:00:00.000Z");
    expect(oldest.start.toISOString()).toBe("2026-11-14T13:00:00.000Z");
    expect(oldest.end.toISOString()).toBe("2026-11-14T14:00:00.000Z");
  });

  it("подписывает окно по московскому времени", () => {
    const asOf = new Date("2026-11-15T12:58:00.000Z");
    expect(formatHourWindow(asOf, 23)).toBe("15:00–15:58");
  });
});

describe("hourStateLabel", () => {
  it("называет три состояния часа", () => {
    expect(hourStateLabel(true)).toBe("на все запросы был ответ");
    expect(hourStateLabel(false)).toBe("не на все запросы был ответ");
    expect(hourStateLabel(null)).toBe("запросов не было");
  });
});
