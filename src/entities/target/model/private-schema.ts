import { z } from "zod";

import { monitorStateSchema } from "./public-schema";

export const targetSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  url: z.string(),
  expected_status: z.number().nullable(),
  interval_seconds: z.number(),
  enabled: z.boolean(),
  is_public: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  last_state: monitorStateSchema,
  last_checked_at: z.string().nullable(),
  last_latency_ms: z.number().nullable(),
  group_id: z.string().nullable(),
});

export const targetListSchema = z.array(targetSchema);
