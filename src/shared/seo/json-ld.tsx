import { SITE_NAME } from "@/shared/config";

export function JsonLd({ data }: { data: unknown }) {
  const json = JSON.stringify(data).replaceAll("<", "\\u003c");

  return (
    <script
      type="application/ld+json"
      // JSON-LD собираем сами, без HTML извне
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

export function websiteJsonLd(url: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    description,
    url,
    inLanguage: "ru",
  };
}

export function webPageJsonLd({
  url,
  name,
  description,
  siteUrl,
}: {
  url: string;
  name: string;
  description: string;
  siteUrl: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description,
    url,
    inLanguage: "ru",
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: siteUrl,
    },
  };
}
