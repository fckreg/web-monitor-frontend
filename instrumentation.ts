import * as Sentry from "@sentry/nextjs";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Неверное окружение должно остановить старт сервера, а не всплыть на первом запросе.
    if (process.env.NEXT_PHASE !== "phase-production-build") {
      const { parseServerEnv } = await import("./src/shared/config/env-schema");
      parseServerEnv(process.env);
    }

    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = Sentry.captureRequestError;
