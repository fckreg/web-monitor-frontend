"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// Серверные ошибки Sentry уже получил через onRequestError, у них есть digest.
export function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (!error.digest) {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <main id="main" className="flex min-h-screen items-center justify-center px-4">
      <div className="surface-card max-w-md p-6">
        <h1 className="text-xl font-semibold">Не удалось открыть страницу</h1>
        <p className="mt-2 text-sm text-muted">
          Сервис временно недоступен. Повторите попытку чуть позже.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <button
            type="button"
            className="rounded-control bg-accent px-4 py-2 text-sm text-on-accent hover:bg-accent-hover"
            onClick={() => reset()}
          >
            Повторить
          </button>
          <a href="/" className="text-sm underline underline-offset-2">
            На главную
          </a>
        </div>
      </div>
    </main>
  );
}
