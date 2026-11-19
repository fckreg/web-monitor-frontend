import { z } from "zod";

export const loginResultSchema = z.discriminatedUnion("status", [
  z.object({ status: z.literal("totp_setup"), secret: z.string().min(1) }),
  z.object({ status: z.literal("totp_required") }),
]);

// Бэкенд отдаёт отсутствующие коды как null.
export const sessionResultSchema = z.object({
  username: z.string(),
  recovery_codes: z
    .array(z.string())
    .nullish()
    .transform((codes) => codes ?? []),
});
