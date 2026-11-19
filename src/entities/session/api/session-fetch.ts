import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { z } from "zod";

import { routes } from "@/shared/config";
import { ApiError, backendFetch } from "@/shared/server";

import { SESSION_COOKIE } from "../model/cookie";

export async function sessionFetch(path: string): Promise<Response> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;

  return backendFetch(path, {
    headers: token ? { cookie: `${SESSION_COOKIE}=${token}` } : undefined,
  });
}

export async function sessionJson<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const response = await sessionFetch(path);

  if (response.status === 401) {
    redirect(routes.login);
  }

  if (!response.ok) {
    throw new ApiError(path, response.status);
  }

  return schema.parse(await response.json());
}
