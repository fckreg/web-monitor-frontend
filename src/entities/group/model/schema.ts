import { z } from "zod";

export const groupNameSchema = z.object({
  name: z.string().trim().min(1, "Укажите название").max(200, "Название слишком длинное"),
});

export const siteGroupSchema = z.object({
  id: z.string(),
  name: z.string(),
  position: z.number(),
  created_at: z.string(),
  updated_at: z.string(),
  target_count: z.number(),
});

export const siteGroupListSchema = z.array(siteGroupSchema);
