import { type AvailabilityBucket, uptimeLevel } from "@/entities/check";
import { formatUptime } from "@/entities/target";
import { cn } from "@/shared/lib";
import { Card } from "@/shared/ui";

import { AvailabilityBars } from "./availability-bars";

const LEVEL_TONE = {
  idle: "text-muted",
  up: "text-up-mark",
  warn: "text-warn",
  down: "text-down-mark",
} as const;

export function DayAvailabilityChart({
  hours,
  uptime,
}: {
  hours: AvailabilityBucket[];
  uptime: number | null;
}) {
  const tone = LEVEL_TONE[uptimeLevel(uptime === null ? null : uptime * 100)];

  return (
    <Card className="p-4">
      <div className="mb-2 flex flex-wrap items-baseline gap-x-3 gap-y-2">
        <h2 className="type-section-title">Ответы за 24 часа</h2>
        <p className={cn("text-lg font-light", tone)}>{formatUptime(uptime, { whole: true })}</p>
      </div>
      <p className="type-note mb-3">
        Красный столбец — ответов меньше 90%. Серый — запросов не было.
      </p>
      <AvailabilityBars buckets={hours} valuesLabel="Значения по часам" minTickGap={28} />
    </Card>
  );
}
