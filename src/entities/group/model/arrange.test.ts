import { describe, expect, it } from "vitest";

import { arrangeByGroup } from "./arrange";

const groups = [
  { id: "news", name: "Новости", position: 1 },
  { id: "banks", name: "Банки", position: 3 },
  { id: "social", name: "Соцсети", position: 2 },
];

describe("arrangeByGroup", () => {
  it("раскладывает сайты по позиции группы и оставляет чужие отдельно", () => {
    const sections = arrangeByGroup(
      groups,
      [
        { id: "a", group_id: "banks" },
        { id: "b", group_id: "news" },
        { id: "c", group_id: null },
        { id: "d", group_id: "missing" },
      ],
      { includeEmpty: true },
    );

    expect(sections.map((section) => section.group?.name ?? "Без группы")).toEqual([
      "Новости",
      "Соцсети",
      "Банки",
      "Без группы",
    ]);

    expect(sections[0]?.items.map((item) => item.id)).toEqual(["b"]);
    expect(sections[3]?.items.map((item) => item.id)).toEqual(["c", "d"]);
  });

  it("скрывает пустые группы, пока это не попросили явно", () => {
    const hidden = arrangeByGroup(groups, [{ id: "a", group_id: "news" }]);
    expect(hidden.map((section) => section.group?.id)).toEqual(["news"]);
    const shown = arrangeByGroup(groups, [{ id: "a", group_id: "news" }], {
      includeEmpty: true,
    });

    expect(shown.map((section) => section.group?.id)).toEqual(["news", "social", "banks"]);
  });
});
