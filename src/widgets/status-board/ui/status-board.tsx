import type { GroupRef } from "@/entities/group";
import type { PublicStatusItem } from "@/entities/target";
import { cn } from "@/shared/lib";
import { HOUR_CAPTION } from "@/shared/ui";

import { boardSections, EMPTY_BOARD } from "../model/board";
import { StatusCard } from "./status-card";

const LEGEND = [
  { mark: "bg-up-mark", label: HOUR_CAPTION.up },
  { mark: "bg-down-mark", label: HOUR_CAPTION.down },
  { mark: "bg-idle", label: HOUR_CAPTION.idle },
] as const;

export function StatusLegend() {
  return (
    <ul aria-label="Обозначения часов" className="type-note mt-3 flex flex-wrap gap-x-6 gap-y-2">
      {LEGEND.map((entry) => (
        <li key={entry.label} className="flex items-center gap-2">
          <span aria-hidden className={cn("h-3.5 w-2.5 rounded-full", entry.mark)} />
          {entry.label}
        </li>
      ))}
    </ul>
  );
}

export function StatusBoard({
  groups,
  items,
  asOf,
}: {
  groups: GroupRef[];
  items: PublicStatusItem[];
  asOf: string;
}) {
  const sections = boardSections(groups, items);

  if (sections.length === 0) {
    return <p className="mt-10 text-lg font-light text-muted">{EMPTY_BOARD}</p>;
  }

  return (
    <div className="mt-10 space-y-10">
      {sections.map((section) => {
        const headingId = `group-${section.group?.id ?? "none"}`;

        return (
          <section key={headingId} aria-labelledby={headingId}>
            <h2
              id={headingId}
              className={cn("type-section-title mb-2", section.group ? undefined : "text-muted")}
            >
              {section.group?.name ?? "Без группы"}
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {section.items.map((item) => (
                <li key={item.id}>
                  <StatusCard item={item} asOf={asOf} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
