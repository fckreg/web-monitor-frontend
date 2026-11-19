import { HourTrack } from "./hour-track";

export function DayStrip({
  uptime,
  buckets,
  asOf,
  className,
}: {
  uptime: string | null;
  buckets: Array<boolean | null>;
  asOf?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-xs font-light text-muted">
        {uptime === null ? (
          "нет данных"
        ) : (
          <>
            ответов <span className="text-ink">{uptime}</span>
          </>
        )}
      </p>
      <HourTrack buckets={buckets} asOf={asOf} className="mt-2" />
      <p className="mt-2 flex justify-between text-[11px] font-light text-muted">
        <span>24 ч назад</span>
        <span>этот час</span>
      </p>
    </div>
  );
}
