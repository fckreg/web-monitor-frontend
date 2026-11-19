import type { ReactNode } from "react";

import { cn } from "@/shared/lib";

const toneClass = {
  up: "text-up",
  down: "text-down",
  unknown: "text-muted",
} as const;

export function StatusWord({
  tone,
  className,
  children,
}: {
  tone: keyof typeof toneClass;
  className?: string;
  children: ReactNode;
}) {
  return <span className={cn("font-light", toneClass[tone], className)}>{children}</span>;
}
