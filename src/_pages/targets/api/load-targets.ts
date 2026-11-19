import "server-only";

import { siteGroupListSchema } from "@/entities/group";
import { sessionJson } from "@/entities/session/index.server";
import { targetListSchema } from "@/entities/target";

export function loadTargets() {
  return Promise.all([
    sessionJson("/targets", targetListSchema),
    sessionJson("/groups", siteGroupListSchema),
  ]);
}
