import { z } from "zod";

export const latencyPointSchema = z.object({
  checked_at: z.string(),
  latency_ms: z.number().nullable(),
  ok: z.boolean(),
});

export const uptimeDaySchema = z.object({
  date: z.string(),
  uptime: z.number().nullable(),
  total: z.number(),
  gaps: z.array(z.object({ start: z.string(), end: z.string() })).default([]),
  gap_rest: z.number().default(0),
});

export const checkErrorSchema = z.object({
  id: z.number(),
  checked_at: z.string(),
  status_code: z.number().nullable(),
  error: z.string().nullable(),
});

export type LatencyPoint = z.infer<typeof latencyPointSchema>;

export type UptimeDay = z.infer<typeof uptimeDaySchema>;

export type CheckError = z.infer<typeof checkErrorSchema>;
