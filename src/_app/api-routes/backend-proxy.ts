import type { NextRequest } from "next/server";

import { serverEnv } from "@/shared/config/index.server";

import { isAllowedRoute } from "./allowed-routes";

const TIMEOUT_MS = 15_000;
const MAX_BODY_BYTES = 64 * 1024;

const FORWARD_REQUEST = new Set([
  "accept",
  "accept-language",
  "content-type",
  "cookie",
  "if-modified-since",
  "if-none-match",
  "user-agent",
]);
const DROP_RESPONSE = new Set([
  "content-encoding",
  "content-length",
  "transfer-encoding",
  "connection",
  "set-cookie",
]);
const UNSAFE_METHODS = new Set(["POST", "PATCH", "DELETE"]);

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  const { path } = await context.params;
  const route = path.join("/");

  if (!isAllowedRoute(request.method, route)) {
    return problem(404, "Маршрут не найден");
  }

  if (UNSAFE_METHODS.has(request.method) && !isSameOrigin(request)) {
    return problem(403, "Запрос с чужого сайта отклонён");
  }

  let body: ArrayBuffer | undefined;

  if (UNSAFE_METHODS.has(request.method)) {
    const declared = Number(request.headers.get("content-length") ?? 0);

    if (declared > MAX_BODY_BYTES) {
      return problem(413, "Слишком большой запрос");
    }

    body = await request.arrayBuffer();

    if (body.byteLength > MAX_BODY_BYTES) {
      return problem(413, "Слишком большой запрос");
    }
  }

  const target = new URL(
    `${serverEnv().BACKEND_URL}/api/${path.map(encodeURIComponent).join("/")}`,
  );
  target.search = request.nextUrl.search;

  const headers = new Headers();

  request.headers.forEach((value, key) => {
    if (FORWARD_REQUEST.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  });

  // От протокола зависит флаг Secure у куки, которую ставит бэкенд.
  headers.set("x-forwarded-proto", publicProtocol(request));

  let response: Response;

  try {
    response = await fetch(target, {
      method: request.method,
      headers,
      body,
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (error) {
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";

    return timedOut ? problem(504, "Бэкенд не ответил вовремя") : problem(502, "Бэкенд недоступен");
  }

  const outHeaders = new Headers();

  response.headers.forEach((value, key) => {
    if (!DROP_RESPONSE.has(key.toLowerCase())) {
      outHeaders.append(key, value);
    }
  });

  for (const cookie of response.headers.getSetCookie()) {
    outHeaders.append("set-cookie", cookie);
  }

  return new Response(response.body, {
    status: response.status,
    headers: outHeaders,
  });
}

// Браузеры 2020+ присылают Sec-Fetch-Site; Origin проверяем для остальных.
function isSameOrigin(request: NextRequest): boolean {
  const site = request.headers.get("sec-fetch-site");

  if (site) {
    return site === "same-origin";
  }

  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ?? request.headers.get("host");

  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function publicProtocol(request: NextRequest): "http" | "https" {
  const configured = serverEnv().SITE_URL;

  if (configured) {
    return configured.startsWith("https:") ? "https" : "http";
  }

  const forwarded = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();

  if (forwarded === "http" || forwarded === "https") {
    return forwarded;
  }

  return request.nextUrl.protocol === "https:" ? "https" : "http";
}

function problem(status: number, detail: string): Response {
  return Response.json({ detail }, { status, headers: { "cache-control": "no-store" } });
}

export const GET = proxy;

export const POST = proxy;

export const PATCH = proxy;

export const DELETE = proxy;
