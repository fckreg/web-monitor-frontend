import type { Metadata } from "next";

import { CLOSED_ROBOTS } from "@/shared/seo";

export const metadata: Metadata = {
  robots: CLOSED_ROBOTS,
};

export { PrivateLayout as default } from "@/_app/private-layout";
