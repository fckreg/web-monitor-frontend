import type { ReactNode } from "react";

import { cn } from "@/shared/lib";

export function TooltipCard({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("surface-card px-3 py-2 text-sm font-light", className)}>{children}</div>
  );
}
