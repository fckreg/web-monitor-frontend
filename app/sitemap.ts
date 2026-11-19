import type { MetadataRoute } from "next";

import { getPublicStatus } from "@/entities/target/index.server";
import { routes } from "@/shared/config";
import { absoluteUrl, isIndexingEnabled, resolveSiteUrl } from "@/shared/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await resolveSiteUrl();

  if (!isIndexingEnabled()) {
    return [];
  }

  const data = await getPublicStatus();
  const now = new Date();

  return [
    {
      url: absoluteUrl(site, routes.home),
      lastModified: now,
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: absoluteUrl(site, routes.disclaimer),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    ...(data?.items ?? []).map((item) => ({
      url: absoluteUrl(site, routes.status(item.slug)),
      lastModified: now,
      changeFrequency: "hourly" as const,
      priority: 0.8,
    })),
  ];
}
