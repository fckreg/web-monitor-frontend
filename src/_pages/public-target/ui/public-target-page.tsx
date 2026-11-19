import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { dailyAvailability, hourlyAvailability } from "@/entities/check";
import {
  formatUptime,
  ProbeNotice,
  publicIconSrc,
  publicTargetDescription,
} from "@/entities/target";
import { getPublicTarget } from "@/entities/target/index.server";
import { routes } from "@/shared/config";
import { absoluteUrl, JsonLd, pageMetadata, resolveSiteUrl, webPageJsonLd } from "@/shared/seo";
import { ErrorTable } from "@/widgets/error-table";
import { LatencyChart } from "@/widgets/latency-chart";
import { TargetHeading } from "@/widgets/target-heading";
import { DayAvailabilityChart, UptimeChart } from "@/widgets/uptime-chart";

type Props = { params: Promise<{ slug: string }> };

// getPublicTarget кеширует ответ ("use cache"), поэтому второй вызов на странице не идёт в бэкенд.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const detail = await getPublicTarget(slug);

  if (!detail) {
    notFound();
  }

  return pageMetadata({
    title: detail.name,
    description: publicTargetDescription(detail),
    path: routes.status(slug),
  });
}

export function PublicTargetPage({ params }: Props) {
  return (
    <Suspense fallback={<TargetSkeleton />}>
      <TargetContent params={params} />
    </Suspense>
  );
}

async function TargetContent({ params }: Props) {
  const { slug } = await params;
  const [detail, site] = await Promise.all([getPublicTarget(slug), resolveSiteUrl()]);

  if (!detail) {
    notFound();
  }

  return (
    <div className="pt-6 pb-12">
      <JsonLd
        data={webPageJsonLd({
          url: absoluteUrl(site, routes.status(slug)),
          name: detail.name,
          description: publicTargetDescription(detail),
          siteUrl: absoluteUrl(site, routes.home),
        })}
      />
      <TargetHeading
        name={detail.name}
        iconSrc={publicIconSrc(detail.id)}
        state={detail.state}
        backHref={routes.home}
        backLabel="К сайтам"
      >
        {detail.group_name}
      </TargetHeading>
      <ProbeNotice className="mt-4" />
      <div className="mt-10 space-y-10">
        <DayAvailabilityChart
          hours={hourlyAvailability(detail.points, new Date())}
          uptime={detail.uptime_24h}
        />
        <div className="grid gap-3 lg:grid-cols-2">
          <LatencyChart points={detail.points} />
          <UptimeChart
            days={dailyAvailability(detail.days)}
            week={formatUptime(detail.uptime_7d)}
          />
        </div>
        <ErrorTable items={detail.errors} />
      </div>
    </div>
  );
}

function TargetSkeleton() {
  return (
    <div className="pt-6 pb-12">
      <p role="status" className="sr-only">
        Загружаем данные сайта…
      </p>
      <div aria-hidden>
        <div className="h-5 w-24 animate-pulse rounded bg-plate" />
        <div className="mt-4 flex items-start gap-3">
          <div className="size-16 shrink-0 animate-pulse rounded-2xl bg-plate" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <div className="h-9 w-52 animate-pulse rounded bg-plate sm:h-12 sm:w-72" />
              <div className="h-[1.375rem] w-20 animate-pulse rounded-full bg-plate" />
            </div>
            <div className="mt-2 h-6 w-40 animate-pulse rounded bg-plate" />
          </div>
        </div>
        <div className="mt-4 max-w-2xl space-y-2">
          <div className="h-5 w-full animate-pulse rounded bg-plate" />
          <div className="h-5 w-2/3 animate-pulse rounded bg-plate" />
        </div>
        <div className="mt-10 space-y-10">
          <div className="surface-card h-80 animate-pulse" />
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="surface-card h-80 animate-pulse" />
            <div className="surface-card h-80 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
