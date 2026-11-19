import { z } from "zod";

const httpUrl = z.url({
  protocol: /^https?$/,
  error: "Нужен адрес со схемой http или https",
});

function blankToUndefined(value: unknown): unknown {
  return typeof value === "string" && value.trim() === "" ? undefined : value;
}

export const serverEnvSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    BACKEND_URL: httpUrl.transform((value) => value.replace(/\/+$/, "")),
    SITE_URL: z.preprocess(
      blankToUndefined,
      httpUrl.transform((value) => new URL(value).origin).optional(),
    ),
    INDEXING_ENABLED: z
      .enum(["true", "false"])
      .default("false")
      .transform((value) => value === "true"),
  })
  .superRefine((env, context) => {
    if (env.NODE_ENV === "production" && env.INDEXING_ENABLED && !env.SITE_URL) {
      context.addIssue({
        code: "custom",
        path: ["SITE_URL"],
        message:
          "При INDEXING_ENABLED=true в продакшене нужен SITE_URL: canonical и Open Graph нельзя строить из заголовка Host",
      });
    }
  });

export type ServerEnv = z.output<typeof serverEnvSchema>;

export function parseServerEnv(source: Record<string, string | undefined>): ServerEnv {
  const result = serverEnvSchema.safeParse(source);

  if (!result.success) {
    throw new Error(`Некорректные переменные окружения:\n${z.prettifyError(result.error)}`);
  }

  return result.data;
}
