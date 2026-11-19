import { z } from "zod";

export const sessionUserSchema = z.object({
  username: z.string(),
});

export type SessionUser = z.infer<typeof sessionUserSchema>;
