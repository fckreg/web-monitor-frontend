import type { ErrorEvent } from "@sentry/nextjs";

const SECRET_HEADERS = new Set(["cookie", "authorization", "set-cookie"]);

export function sentryDsn(): string {
  return process.env.NEXT_PUBLIC_SENTRY_DSN?.trim() ?? "";
}

export function scrubSentryEvent<T extends ErrorEvent>(event: T): T {
  const request = event.request;

  if (!request) {
    return event;
  }

  delete request.cookies;
  delete request.data;
  const headers = request.headers;

  if (headers) {
    for (const key of Object.keys(headers)) {
      if (SECRET_HEADERS.has(key.toLowerCase())) {
        delete headers[key];
      }
    }
  }

  return event;
}

export function sentryInitOptions() {
  const dsn = sentryDsn();

  return {
    dsn,
    enabled: dsn.length > 0,
    sendDefaultPii: false,
    tracesSampleRate: 0,
    dataCollection: {
      userInfo: false,
      cookies: false,
      httpHeaders: false,
      httpBodies: [],
    },
    beforeSend(event: ErrorEvent) {
      return scrubSentryEvent(event);
    },
  };
}
