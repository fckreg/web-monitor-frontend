import { describe, expect, it } from "vitest";

import { formatUptime } from "./format";

describe("formatUptime", () => {
  it("показывает отсутствие данных", () => {
    expect(formatUptime(null)).toBe("нет данных");
  });

  it("форматирует долю в проценты", () => {
    expect(formatUptime(0.5)).toBe("50,0%");
    expect(formatUptime(1)).toBe("100,0%");
  });

  it("в целых процентах не округляет вверх", () => {
    expect(formatUptime(0.999, { whole: true })).toBe("99%");
    expect(formatUptime(0.29, { whole: true })).toBe("29%");
    expect(formatUptime(1, { whole: true })).toBe("100%");
  });
});
