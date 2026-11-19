import type { ReactNode } from "react";

import { cn } from "@/shared/lib";

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <section className={cn("surface-card p-5", className)}>{children}</section>;
}
