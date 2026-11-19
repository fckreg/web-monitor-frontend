import { describe, expect, it } from "vitest";

import { isAllowedRoute } from "./allowed-routes";

const id = "12dff2c8-a839-5f4a-81d2-0977f49db219";

describe("isAllowedRoute", () => {
  it("пропускает вызовы из браузера", () => {
    expect(isAllowedRoute("POST", "auth/login")).toBe(true);
    expect(isAllowedRoute("GET", `public/status/${id}/icon`)).toBe(true);
    expect(isAllowedRoute("HEAD", `targets/${id}/icon`)).toBe(true);
    expect(isAllowedRoute("PATCH", `targets/${id}`)).toBe(true);
  });

  it("не открывает служебные и непредусмотренные маршруты", () => {
    expect(isAllowedRoute("GET", "dashboard/overview")).toBe(false);
    expect(isAllowedRoute("GET", "targets")).toBe(false);
    expect(isAllowedRoute("DELETE", "auth/login")).toBe(false);
    expect(isAllowedRoute("PATCH", "targets/../auth/me")).toBe(false);
    expect(isAllowedRoute("GET", `public/status/${id}/icon/extra`)).toBe(false);
  });
});
