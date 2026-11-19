import { describe, expect, it } from "vitest";

import { targetFormSchema } from "./schema";

const valid = {
  name: "Пример",
  url: "https://example.com/health",
  interval_seconds: 60,
  expected_status: null,
  enabled: true,
  is_public: false,
  group_id: null,
};

describe("targetFormSchema", () => {
  it("принимает корректную цель", () => {
    expect(targetFormSchema.safeParse(valid).success).toBe(true);
  });

  it("отклоняет короткий интервал и чужую схему", () => {
    expect(targetFormSchema.safeParse({ ...valid, interval_seconds: 10 }).success).toBe(false);

    expect(targetFormSchema.safeParse({ ...valid, url: "ftp://example.com" }).success).toBe(false);

    expect(targetFormSchema.safeParse({ ...valid, name: "  " }).success).toBe(false);
  });
});
