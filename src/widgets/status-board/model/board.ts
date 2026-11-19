import { arrangeByGroup, type GroupRef, type GroupSection } from "@/entities/group";
import type { PublicStatusItem } from "@/entities/target";

const STATE_RANK = { down: 0, unknown: 1, up: 2 } as const;

export function boardSections(
  groups: GroupRef[],
  items: PublicStatusItem[],
): GroupSection<PublicStatusItem>[] {
  return arrangeByGroup(groups, items).map((section) => ({
    ...section,
    items: [...section.items].sort(
      (left, right) =>
        STATE_RANK[left.state] - STATE_RANK[right.state] ||
        left.name.localeCompare(right.name, "ru"),
    ),
  }));
}

export const EMPTY_BOARD =
  "На главной пока нет сайтов. В админке отметьте «На главной» у тех, что нужно показать.";
