import { describe, expect, it } from "vitest";

import {
  availabilityLine,
  dailyAvailability,
  hourlyAvailability,
  outageRanges,
  outageSpans,
  toLatencyRow,
  uptimeBarColor,
  uptimeLevel,
} from "./chart";

describe("toLatencyRow", () => {
  it("оставляет задержку только у успешного ответа", () => {
    expect(
      toLatencyRow({ checked_at: "2026-11-13T10:00:00Z", latency_ms: 120, ok: true }, "10:00"),
    ).toEqual({ time: "10:00", latency: 120, ok: true });

    expect(
      toLatencyRow({ checked_at: "2026-11-13T10:01:00Z", latency_ms: null, ok: false }, "10:01"),
    ).toEqual({ time: "10:01", latency: null, ok: false });
  });
});

describe("outageSpans", () => {
  it("собирает соседние сбои в одну полосу и захватывает крайние ответы", () => {
    const rows = [
      { time: "1", latency: 100, ok: true },
      { time: "2", latency: null, ok: false },
      { time: "3", latency: 80, ok: true },
      { time: "4", latency: 90, ok: true },
    ];
    expect(outageSpans(rows)).toEqual([{ from: "1", to: "3" }]);
  });
});

describe("hourlyAvailability", () => {
  it("ставит столбцы на ровные часы по Москве, пустой час остаётся на сетке", () => {
    const now = new Date("2026-11-14T20:07:00Z");
    const rows = hourlyAvailability(
      [
        { checked_at: "2026-11-14T20:05:00Z", ok: true },
        { checked_at: "2026-11-14T20:20:00Z", ok: false },
        { checked_at: "2026-11-13T21:10:00Z", ok: true },
        { checked_at: "2026-11-13T20:10:00Z", ok: false },
      ],
      now,
    );

    expect(rows).toHaveLength(24);

    expect(rows[23]).toMatchObject({
      label: "23:00",
      uptime: 50,
      total: 2,
      gaps: ["23:20"],
    });

    expect(rows[22]).toMatchObject({ label: "22:00", uptime: null, total: 0 });
    expect(rows[0]).toMatchObject({ label: "00:00", uptime: 100, total: 1 });
    expect(rows.every((row) => row.label.endsWith("00"))).toBe(true);
  });
});

describe("dailyAvailability", () => {
  it("переводит долю в проценты и не сдвигает дату", () => {
    expect(
      dailyAvailability([
        {
          date: "2026-11-01",
          uptime: 0.9951,
          total: 10,
          gaps: [{ start: "2026-11-01T09:00:00Z", end: "2026-11-01T09:10:00Z" }],
          gap_rest: 2,
        },
        { date: "2026-11-02", uptime: null, total: 0, gaps: [], gap_rest: 0 },
      ]),
    ).toEqual([
      {
        label: "01.11",
        uptime: 99.5,
        total: 10,
        gaps: ["12:00–12:10"],
        gapRest: 2,
      },
      { label: "02.11", uptime: null, total: 0, gaps: [], gapRest: 0 },
    ]);
  });
});

describe("availabilityLine", () => {
  it("описывает час без запросов и час со сбоями", () => {
    expect(
      availabilityLine({
        label: "10:00",
        uptime: null,
        total: 0,
        gaps: [],
        gapRest: 0,
      }),
    ).toEqual({ value: "запросов не было", tone: "muted" });

    expect(
      availabilityLine({
        label: "10:00",
        uptime: 87.5,
        total: 8,
        gaps: ["10:05"],
        gapRest: 1,
      }),
    ).toEqual({ value: "87,5%", note: "без ответа 10:05, ещё 1" });
  });
});

describe("outageRanges", () => {
  it("склеивает соседние сбои и не режет одиночный", () => {
    const ranges = outageRanges([
      { checked_at: "2026-11-15T10:00:00Z", ok: true },
      { checked_at: "2026-11-15T10:02:00Z", ok: false },
      { checked_at: "2026-11-15T10:04:00Z", ok: false },
      { checked_at: "2026-11-15T10:06:00Z", ok: true },
      { checked_at: "2026-11-15T10:08:00Z", ok: false },
    ]);
    expect(ranges).toHaveLength(2);
    expect(ranges[0].start.toISOString()).toBe("2026-11-15T10:02:00.000Z");
    expect(ranges[0].end.toISOString()).toBe("2026-11-15T10:04:00.000Z");
    expect(ranges[1].start.toISOString()).toBe("2026-11-15T10:08:00.000Z");
    expect(ranges[1].end.toISOString()).toBe("2026-11-15T10:08:00.000Z");
  });
});

describe("uptimeLevel", () => {
  it("делит uptime на уровни и красит столбцы по ним", () => {
    expect(uptimeLevel(null)).toBe("idle");
    expect(uptimeLevel(99)).toBe("up");
    expect(uptimeLevel(95)).toBe("warn");
    expect(uptimeLevel(18)).toBe("down");
    expect(uptimeBarColor(null)).toBe("var(--color-idle)");
    expect(uptimeBarColor(100)).toBe("var(--color-up-mark)");
    expect(uptimeBarColor(95)).toBe("var(--color-warn)");
    expect(uptimeBarColor(18)).toBe("var(--color-down-mark)");
  });
});
