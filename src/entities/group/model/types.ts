import type { z } from "zod";

import type { siteGroupSchema } from "./schema";

export type SiteGroup = z.infer<typeof siteGroupSchema>;

export type GroupRef = Pick<SiteGroup, "id" | "name" | "position">;

export type GroupSection<T> = {
  group: GroupRef | null;
  items: T[];
};
