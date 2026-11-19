import type { ReactNode } from "react";

import { cn } from "@/shared/lib";

const TONE = {
  up: { badge: "bg-up-soft text-up", dot: "bg-up" },
  down: { badge: "bg-down-soft text-down", dot: "bg-down" },
  unknown: { badge: "bg-unknown-soft text-muted", dot: "bg-idle-strong" },
} as const;

export function Badge({ tone, children }: { tone: keyof typeof TONE; children: ReactNode }) {
  return (
    <span
      className={cn(
        "flex w-fit shrink-0 items-center gap-2 rounded-full px-3 py-1 text-sm leading-none font-medium whitespace-nowrap",
        TONE[tone].badge,
      )}
    >
      <span
        aria-hidden
        className={cn("size-2 shrink-0 translate-y-px rounded-full", TONE[tone].dot)}
      />
      {children}
    </span>
  );
}
