import type { MetadataRoute } from "next";

import { routes } from "@/shared/config";
import { absoluteUrl, isIndexingEnabled, resolveSiteUrl } from "@/shared/seo";

// /login не закрыт здесь: иначе поисковик не увидит его noindex.
const PRIVATE_PATHS = ["/dashboard", routes.targets, "/api/"];

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await resolveSiteUrl();

  if (!isIndexingEnabled()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
    sitemap: absoluteUrl(site, "/sitemap.xml"),
  };
}
