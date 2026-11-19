import "server-only";

import * as Sentry from "@sentry/nextjs";

export function reportServerError(error: unknown): void {
  Sentry.captureException(error);
}
