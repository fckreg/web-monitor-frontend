import type { AvailabilityBucket } from "@/entities/check";
import { Card } from "@/shared/ui";

import { AvailabilityBars } from "./availability-bars";

export function UptimeChart({ days, week }: { days: AvailabilityBucket[]; week: string }) {
  return (
    <Card className="row-span-3 grid grid-rows-subgrid p-0">
      <div className="px-4 pt-4">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <h2 className="type-section-title">Ответы по дням</h2>
          <p className="type-note">
            ответов за 7 дней <span className="text-ink">{week}</span>
          </p>
        </div>
        <p className="type-note mt-2">
          Красный столбец — ответов меньше 90%. Серый — запросов не было.
        </p>
      </div>
      <AvailabilityBars
        buckets={days}
        valuesLabel="Значения по дням"
        chartClassName="px-4"
        valuesClassName="mt-0 px-4 pb-4"
      />
    </Card>
  );
}
