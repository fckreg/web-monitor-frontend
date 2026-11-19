"use client";

import "@/_app/styles/globals.css";

import { RouteError } from "@/_app/route-error";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ru">
      <body>
        <RouteError error={error} reset={reset} />
      </body>
    </html>
  );
}
