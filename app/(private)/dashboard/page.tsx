import { permanentRedirect } from "next/navigation";

import { routes } from "@/shared/config";

export default function DashboardRedirect() {
  permanentRedirect(routes.targets);
}
