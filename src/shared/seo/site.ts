import "server-only";

import { headers } from "next/headers";
import { connection } from "next/server";

import { serverEnv } from "@/shared/config/index.server";

// Публичные страницы закрыты, пока INDEXING_ENABLED не равен "true".
export function isIndexingEnabled(): boolean {
  return serverEnv().INDEXING_ENABLED;
}

export function absoluteUrl(site: URL, path: string): string {
  if (path === "/") {
    return site.origin;
  }

  return new URL(path, site).toString();
}

// Адрес сайта известен только в рантайме: SITE_URL задают окружению контейнера, а не сборке.
export async function resolveSiteUrl(): Promise<URL> {
  await connection();
  const configured = serverEnv().SITE_URL;

  if (configured) {
    return new URL(configured);
  }

  const headerList = await headers();
  const host = requestHost(headerList);
  const proto = requestProto(headerList, host);

  return new URL(`${proto}://${host}`);
}

function requestHost(headerList: Headers): string {
  const raw = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const host = raw.split(",")[0]?.trim() ?? "";

  if (!/^[a-z0-9.-]+(?::\d+)?$/i.test(host)) {
    return "localhost:3000";
  }

  return host;
}

function requestProto(headerList: Headers, host: string): "http" | "https" {
  const raw = headerList.get("x-forwarded-proto")?.split(",")[0]?.trim();

  if (raw === "http" || raw === "https") {
    return raw;
  }

  if (host.startsWith("localhost") || host.startsWith("127.0.0.1")) {
    return "http";
  }

  return "https";
}
