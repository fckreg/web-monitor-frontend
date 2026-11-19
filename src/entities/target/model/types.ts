import type { z } from "zod";

import type { targetSchema } from "./private-schema";
import type {
  monitorStateSchema,
  publicStatusResponseSchema,
  publicTargetDetailSchema,
} from "./public-schema";

export type MonitorState = z.infer<typeof monitorStateSchema>;

export type PublicStatusResponse = z.infer<typeof publicStatusResponseSchema>;

export type PublicStatusItem = PublicStatusResponse["items"][number];

export type PublicGroup = PublicStatusResponse["groups"][number];

export type PublicTargetDetail = z.infer<typeof publicTargetDetailSchema>;

export type Target = z.infer<typeof targetSchema>;

export type TargetFormValues = {
  name: string;
  url: string;
  expected_status: number | null;
  interval_seconds: number;
  enabled: boolean;
  is_public: boolean;
  group_id: string | null;
};
