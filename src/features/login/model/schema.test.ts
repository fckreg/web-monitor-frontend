import { describe, expect, it } from "vitest";

import { loginResultSchema, sessionResultSchema } from "./schema";

describe("loginResultSchema", () => {
  it("принимает ответ бэкенда с null в необязательных полях", () => {
    const result = loginResultSchema.parse({
      status: "totp_required",
      secret: null,
      otpauth_url: null,
    });
    expect(result.status).toBe("totp_required");
  });

  it("требует секрет для подключения аутентификатора", () => {
    const result = loginResultSchema.safeParse({
      status: "totp_setup",
      secret: null,
    });
    expect(result.success).toBe(false);
  });

  it("отклоняет неизвестный статус", () => {
    expect(loginResultSchema.safeParse({ status: "ok" }).success).toBe(false);
  });
});

describe("sessionResultSchema", () => {
  it("превращает отсутствующие коды в пустой список", () => {
    const session = sessionResultSchema.parse({
      username: "admin",
      recovery_codes: null,
    });
    expect(session.recovery_codes).toEqual([]);
  });
});
