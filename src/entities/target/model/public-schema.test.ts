import { describe, expect, it } from "vitest";

import { publicStatusResponseSchema, publicTargetDetailSchema } from "./public-schema";

const item = {
  id: "t1",
  slug: "example",
  name: "Пример",
  group_id: null,
  state: "up",
  uptime_24h: 100,
  uptime_7d: 99.5,
  buckets: [true, null, false],
};

describe("publicStatusResponseSchema", () => {
  it("принимает ответ бэкенда", () => {
    const parsed = publicStatusResponseSchema.parse({
      groups: [{ id: "g1", name: "Новости", position: 0 }],
      items: [item],
    });
    expect(parsed.items[0]?.state).toBe("up");
  });

  it("отклоняет неизвестное состояние", () => {
    const result = publicStatusResponseSchema.safeParse({
      groups: [],
      items: [{ ...item, state: "degraded" }],
    });
    expect(result.success).toBe(false);
  });
});

describe("publicTargetDetailSchema", () => {
  it("подставляет значения по умолчанию для старого формата дней", () => {
    const parsed = publicTargetDetailSchema.parse({
      id: "t1",
      name: "Пример",
      group_name: null,
      state: "unknown",
      uptime_24h: null,
      uptime_7d: null,
      buckets: [],
      points: [],
      days: [{ date: "2026-11-17", uptime: null, total: 0 }],
      errors: [],
    });
    expect(parsed.days[0]).toMatchObject({ gaps: [], gap_rest: 0 });
  });
});
