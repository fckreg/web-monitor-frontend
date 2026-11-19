import type { MetadataRoute } from "next";

import { routes, SITE_DESCRIPTION, SITE_NAME } from "@/shared/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    lang: "ru",
    start_url: routes.home,
    display: "browser",
    background_color: "#f4f7f5",
    theme_color: "#10211e",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
