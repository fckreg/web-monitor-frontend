import { describe, expect, it } from "vitest";

import { STATUS_LABEL } from "./status";

describe("STATUS_LABEL", () => {
  it("даёт русские подписи состояний", () => {
    expect(STATUS_LABEL.up).toBe("ответ получен");
    expect(STATUS_LABEL.down).toBe("ответ не получен");
    expect(STATUS_LABEL.unknown).toBe("нет данных");
  });
});
