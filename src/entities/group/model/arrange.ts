import type { GroupRef, GroupSection } from "./types";

export function arrangeByGroup<T extends { group_id: string | null }>(
  groups: GroupRef[],
  items: T[],
  options?: { includeEmpty?: boolean },
): GroupSection<T>[] {
  const sorted = [...groups].sort(
    (left, right) => left.position - right.position || left.name.localeCompare(right.name, "ru"),
  );
  const known = new Set(sorted.map((group) => group.id));
  const sections: GroupSection<T>[] = sorted
    .map((group) => ({
      group,
      items: items.filter((item) => item.group_id === group.id),
    }))
    .filter((section) => options?.includeEmpty || section.items.length > 0);
  const loose = items.filter((item) => item.group_id === null || !known.has(item.group_id));

  if (loose.length > 0) {
    sections.push({ group: null, items: loose });
  }

  return sections;
}
