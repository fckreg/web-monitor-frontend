import { describe, expect, it } from "vitest";

import { parseServerEnv } from "./env-schema";

describe("parseServerEnv", () => {
  it("нормализует адреса и включает индексацию только явным true", () => {
    const env = parseServerEnv({
      BACKEND_URL: "http://backend:8000/",
      SITE_URL: "https://example.com/some/path?x=1",
    });
    expect(env.BACKEND_URL).toBe("http://backend:8000");
    expect(env.SITE_URL).toBe("https://example.com");
    expect(env.INDEXING_ENABLED).toBe(false);
  });

  it("считает пустой SITE_URL незаданным", () => {
    const env = parseServerEnv({
      BACKEND_URL: "http://127.0.0.1:8010",
      SITE_URL: " ",
    });
    expect(env.SITE_URL).toBeUndefined();
  });

  it("не принимает отсутствующий BACKEND_URL и чужую схему", () => {
    expect(() => parseServerEnv({})).toThrow(/BACKEND_URL/);

    expect(() => parseServerEnv({ BACKEND_URL: "ftp://backend" })).toThrow(/BACKEND_URL/);
  });

  it("не принимает INDEXING_ENABLED с опечаткой", () => {
    expect(() =>
      parseServerEnv({
        BACKEND_URL: "http://backend:8000",
        INDEXING_ENABLED: "yes",
      }),
    ).toThrow(/INDEXING_ENABLED/);
  });

  it("требует SITE_URL для индексации в продакшене", () => {
    expect(() =>
      parseServerEnv({
        NODE_ENV: "production",
        BACKEND_URL: "http://backend:8000",
        INDEXING_ENABLED: "true",
      }),
    ).toThrow(/SITE_URL/);
  });
});
