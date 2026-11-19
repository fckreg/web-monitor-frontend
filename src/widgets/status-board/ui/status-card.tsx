import Link from "next/link";

import {
  formatUptime,
  publicIconSrc,
  type PublicStatusItem,
  SiteMark,
  STATUS_LABEL,
} from "@/entities/target";
import { routes } from "@/shared/config";
import { DayStrip, StatusWord } from "@/shared/ui";

// Ссылка растянута на карточку через ::after, но её доступное имя — только название сайта.
export function StatusCard({ item, asOf }: { item: PublicStatusItem; asOf: string }) {
  return (
    <article className="surface-card relative h-full px-3 py-3 transition duration-200 ease-out hover:shadow-raised has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent">
      <div className="flex items-center gap-2">
        <SiteMark name={item.name} src={publicIconSrc(item.id)} size="md" />
        <h3 className="min-w-0 flex-1 truncate text-sm font-medium tracking-tight">
          <Link
            href={routes.status(item.slug)}
            className="after:absolute after:inset-0 after:rounded-card focus-visible:outline-none"
          >
            {item.name}
          </Link>
        </h3>
        <StatusWord tone={item.state} className="shrink-0 text-xs">
          {STATUS_LABEL[item.state]}
        </StatusWord>
      </div>
      <DayStrip
        className="relative z-10 mt-2"
        uptime={item.uptime_24h === null ? null : formatUptime(item.uptime_24h)}
        buckets={item.buckets}
        asOf={asOf}
      />
    </article>
  );
}
