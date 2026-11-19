import type { Metadata } from "next";
import { Suspense } from "react";

import { ProbeNotice } from "@/entities/target";
import { getPublicStatus } from "@/entities/target/index.server";
import { routes } from "@/shared/config";
import { absoluteUrl, JsonLd, pageMetadata, resolveSiteUrl, websiteJsonLd } from "@/shared/seo";
import { StatusBoard, StatusBoardSkeleton, StatusLegend } from "@/widgets/status-board";

import { HOME_DESCRIPTION, HOME_TITLE } from "../config/texts";

export function generateMetadata(): Promise<Metadata> {
  return pageMetadata({
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    path: routes.home,
  });
}

// Заголовок и легенда попадают в статическую оболочку, доска с данными догружается потоком.
export function PublicStatusPage() {
  return (
    <div className="pt-6 pb-12">
      <h1 className="type-page-title">{HOME_TITLE}</h1>
      <ProbeNotice className="mt-4" />
      <StatusLegend />
      <Suspense fallback={<StatusBoardSkeleton />}>
        <LiveBoard />
      </Suspense>
    </div>
  );
}

async function LiveBoard() {
  const [data, site] = await Promise.all([getPublicStatus(), resolveSiteUrl()]);

  return (
    <>
      <JsonLd data={websiteJsonLd(absoluteUrl(site, routes.home), HOME_DESCRIPTION)} />
      {data ? (
        <StatusBoard groups={data.groups} items={data.items} asOf={new Date().toISOString()} />
      ) : (
        <p role="alert" className="mt-10 text-sm text-down">
          Не удалось загрузить проверки. Попробуйте обновить страницу.
        </p>
      )}
    </>
  );
}
