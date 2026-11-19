import { permanentRedirect } from "next/navigation";

import { routes } from "@/shared/config";

export default async function DashboardTargetRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  permanentRedirect(routes.status(slug));
}
