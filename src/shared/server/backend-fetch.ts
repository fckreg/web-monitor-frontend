import "server-only";

import { serverEnv } from "@/shared/config/index.server";

const TIMEOUT_MS = 10_000;

export function backendFetch(
  path: string,
  init: { headers?: HeadersInit } = {},
): Promise<Response> {
  return fetch(`${serverEnv().BACKEND_URL}/api${path}`, {
    headers: init.headers,
    cache: "no-store",
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
}
