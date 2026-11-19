import { z } from "zod";

import { checkErrorSchema, latencyPointSchema, uptimeDaySchema } from "@/entities/check/@x/target";

export const monitorStateSchema = z.enum(["up", "down", "unknown"]);

const bucketsSchema = z.array(z.boolean().nullable());

export const publicStatusResponseSchema = z.object({
  groups: z.array(z.object({ id: z.string(), name: z.string(), position: z.number() })),
  items: z.array(
    z.object({
      id: z.string(),
      slug: z.string(),
      name: z.string(),
      group_id: z.string().nullable(),
      state: monitorStateSchema,
      uptime_24h: z.number().nullable(),
      uptime_7d: z.number().nullable(),
      buckets: bucketsSchema,
    }),
  ),
});

export const publicTargetDetailSchema = z.object({
  id: z.string(),
  name: z.string(),
  group_name: z.string().nullable(),
  state: monitorStateSchema,
  uptime_24h: z.number().nullable(),
  uptime_7d: z.number().nullable(),
  buckets: bucketsSchema,
  points: z.array(latencyPointSchema),
  days: z.array(uptimeDaySchema),
  errors: z.array(checkErrorSchema),
});
