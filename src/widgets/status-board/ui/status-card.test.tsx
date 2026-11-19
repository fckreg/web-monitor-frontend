// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import type { PublicStatusItem } from "@/entities/target";

import { StatusCard } from "./status-card";

afterEach(cleanup);

const item: PublicStatusItem = {
  id: "0f6a1f9e-6a43-4c4f-9a39-8a3c1e0d5b21",
  slug: "сайт пример",
  name: "Пример",
  group_id: null,
  state: "down",
  uptime_24h: 97.5,
  uptime_7d: null,
  buckets: [true, false, null],
};

describe("StatusCard", () => {
  it("даёт ссылке только название сайта и экранирует slug", () => {
    render(<StatusCard item={item} asOf="2026-11-17T10:00:00Z" />);

    const link = screen.getByRole("link");
    expect(link.textContent).toBe("Пример");

    expect(link.getAttribute("href")).toBe(`/status/${encodeURIComponent("сайт пример")}`);
  });

  it("показывает состояние словом, а не только цветом", () => {
    render(<StatusCard item={item} asOf="2026-11-17T10:00:00Z" />);
    expect(screen.getByText("ответ не получен")).toBeTruthy();
  });
});
