import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { connection } from "next/server";

import { ApiError, backendFetch, reportServerError } from "@/shared/server";

import { publicStatusResponseSchema, publicTargetDetailSchema } from "../model/public-schema";
import type { PublicStatusResponse, PublicTargetDetail } from "../model/types";

export const PUBLIC_STATUS_TAG = "public-status";

// Ошибки не кешируются: исключение из "use cache" не сохраняется, следующий запрос попробует снова.
async function loadPublicStatus(): Promise<PublicStatusResponse> {
  "use cache";
  cacheLife("status");
  cacheTag(PUBLIC_STATUS_TAG);
  const path = "/public/status";
  const response = await backendFetch(path);

  if (!response.ok) {
    throw new ApiError(path, response.status);
  }

  return publicStatusResponseSchema.parse(await response.json());
}

async function loadPublicTarget(slug: string): Promise<PublicTargetDetail | null> {
  "use cache";
  cacheLife("status");
  cacheTag(PUBLIC_STATUS_TAG);
  const path = `/public/status/by-slug/${encodeURIComponent(slug)}`;
  const response = await backendFetch(path);

  if (response.status === 404 || response.status === 422) {
    return null;
  }

  if (!response.ok) {
    throw new ApiError(path, response.status);
  }

  return publicTargetDetailSchema.parse(await response.json());
}

// connection(): адрес бэкенда известен только в рантайме, на сборке данные не запрашиваем.
export async function getPublicStatus(): Promise<PublicStatusResponse | null> {
  await connection();

  try {
    return await loadPublicStatus();
  } catch (error) {
    reportServerError(error);

    return null;
  }
}

export async function getPublicTarget(slug: string): Promise<PublicTargetDetail | null> {
  await connection();

  return loadPublicTarget(slug);
}
