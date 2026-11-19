import type { Metadata } from "next";

import { SITE_NAME } from "@/shared/config";

import { isIndexingEnabled, resolveSiteUrl } from "./site";

export const CLOSED_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
};

type PageText = { title: string; description: string };

function socialMetadata(
  { title, description }: PageText,
  url?: string,
): Pick<Metadata, "openGraph" | "twitter"> {
  const fullTitle = `${title} — ${SITE_NAME}`;

  return {
    openGraph: {
      type: "website",
      locale: "ru_RU",
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      url,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

// Адрес сайта и флаг индексации известны только в рантайме, поэтому метаданные публичных страниц асинхронные.
export async function pageMetadata({
  title,
  description,
  path,
}: PageText & { path: string }): Promise<Metadata> {
  return {
    metadataBase: await resolveSiteUrl(),
    title,
    description,
    alternates: { canonical: path },
    robots: isIndexingEnabled() ? { index: true, follow: true } : CLOSED_ROBOTS,
    ...socialMetadata({ title, description }, path),
  };
}

export function closedPageMetadata(text: PageText): Metadata {
  return {
    title: text.title,
    description: text.description,
    robots: CLOSED_ROBOTS,
    ...socialMetadata(text),
  };
}
