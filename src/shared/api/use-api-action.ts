"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { z } from "zod";

import { apiSend, type HttpMethod, readError } from "./browser";

const NETWORK_ERROR = "Нет связи с сервером. Повторите попытку.";
const UNEXPECTED_RESPONSE = "Сервер ответил в неожиданном формате. Повторите попытку.";

type RunOptions = { refresh?: boolean };

export function useApiAction() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // null — запрос не удался, текст ошибки уже в error.
  async function run(
    path: string,
    method: HttpMethod,
    body?: unknown,
    { refresh = true }: RunOptions = {},
  ): Promise<Response | null> {
    setPending(true);
    setError(null);

    try {
      const response = await apiSend(path, method, body);

      if (!response.ok) {
        setError(await readError(response));

        return null;
      }

      if (refresh) {
        router.refresh();
      }

      return response;
    } catch {
      setError(NETWORK_ERROR);

      return null;
    } finally {
      setPending(false);
    }
  }

  // Как run, но тело успешного ответа проверяется схемой; null — ошибка уже в error.
  async function runJson<T>(
    path: string,
    method: HttpMethod,
    body: unknown,
    schema: z.ZodType<T>,
    options?: RunOptions,
  ): Promise<T | null> {
    const response = await run(path, method, body, options);

    if (!response) {
      return null;
    }

    const parsed = schema.safeParse(await response.json().catch(() => undefined));

    if (parsed.success) {
      return parsed.data;
    }

    setError(UNEXPECTED_RESPONSE);

    return null;
  }

  return { run, runJson, pending, error, setError };
}
