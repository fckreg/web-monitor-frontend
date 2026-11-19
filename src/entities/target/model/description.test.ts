import { describe, expect, it } from "vitest";

import { publicTargetDescription } from "./description";

describe("publicTargetDescription", () => {
  it("собирает описание из статуса, суток и группы", () => {
    expect(
      publicTargetDescription({
        name: "Госуслуги",
        state: "up",
        uptime_24h: 0.991,
        group_name: "Государственные",
      }),
    ).toBe(
      "Госуслуги: сейчас ответ получен. За последние сутки ответ приходил в 99,1% проверок. Группа «Государственные». Мы проверяем сайт автоматически со своего сервера. Это не официальный статус сервиса.",
    );
  });

  it("не подставляет процент, если проверок за сутки нет", () => {
    expect(
      publicTargetDescription({
        name: "Налог",
        state: "unknown",
        uptime_24h: null,
        group_name: null,
      }),
    ).toBe(
      "Налог: сейчас нет данных. За последние сутки данных ещё нет. Мы проверяем сайт автоматически со своего сервера. Это не официальный статус сервиса.",
    );
  });
});
