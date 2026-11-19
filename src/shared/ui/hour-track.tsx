import { cn } from "@/shared/lib";

import { formatHourWindow, hourStateLabel } from "./hour-caption";

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

function bucketTone(bucket: boolean | null) {
  if (bucket === null) {
    return { bar: "bg-idle group-hover/hour:ring-idle", text: "text-muted" };
  }

  if (bucket) {
    return { bar: "bg-up-mark group-hover/hour:ring-up-mark", text: "text-up" };
  }

  return {
    bar: "bg-down-mark group-hover/hour:ring-down-mark",
    text: "text-down",
  };
}

export function HourTrack({
  buckets,
  asOf,
  className,
}: {
  buckets: Array<boolean | null>;
  asOf?: string;
  className?: string;
}) {
  const failedHours = buckets.filter((bucket) => bucket === false).length;
  const moment = asOf ? new Date(asOf) : null;

  return (
    <div
      className={cn(
        "grid h-4 grid-cols-[repeat(23,minmax(0,1fr))_minmax(0,1.4fr)] items-center gap-1",
        className,
      )}
      role="img"
      aria-label={
        failedHours > 0
          ? `Не на все запросы был ответ в ${failedHours} из 24 часов`
          : "За сутки на все запросы был ответ"
      }
    >
      {HOURS.map((hour) => {
        const bucket = buckets[hour] ?? null;
        const tone = bucketTone(bucket);

        return (
          <span
            key={hour}
            className={cn("group/hour relative w-full", hour === HOURS.length - 1 ? "h-4" : "h-3")}
          >
            <span
              className={cn(
                "block h-full w-full rounded-full group-hover/hour:ring-2 group-hover/hour:ring-offset-1 group-hover/hour:ring-offset-paper",
                tone.bar,
              )}
            />
            {moment ? (
              <span
                className={cn(
                  "surface-card pointer-events-none absolute bottom-full z-20 mb-2 hidden w-max px-3 py-2 text-sm font-light group-hover/hour:block",
                  hour <= 2 && "left-0",
                  hour >= 21 && "right-0",
                  hour > 2 && hour < 21 && "left-1/2 -translate-x-1/2",
                )}
              >
                <span className="block text-muted">{formatHourWindow(moment, hour)}</span>
                <span className={cn("mt-0.5 block", tone.text)}>{hourStateLabel(bucket)}</span>
              </span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}
