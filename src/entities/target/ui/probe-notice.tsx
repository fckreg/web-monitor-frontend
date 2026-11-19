import Link from "next/link";

import { routes, TIME_ZONE_LABEL } from "@/shared/config";
import { cn } from "@/shared/lib";

import { PROBE_NOTICE } from "../model/status";

export function ProbeNotice({ className }: { className?: string }) {
  return (
    <p className={cn("type-note max-w-2xl", className)}>
      {PROBE_NOTICE} Время {TIME_ZONE_LABEL}.{" "}
      <Link href={routes.disclaimer} className="underline underline-offset-2 hover:text-ink">
        Подробнее<span className="sr-only"> о том, что означают проверки</span>
      </Link>
    </p>
  );
}
