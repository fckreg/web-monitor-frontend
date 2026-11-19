import { z } from "zod";

export const recoveryCodesSchema = z.object({
  recovery_codes: z.array(z.string()).min(1),
});
