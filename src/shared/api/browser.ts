export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

const FALLBACK = "Запрос не выполнен";

export async function readError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as { detail?: unknown };

    if (typeof data.detail === "string") {
      return data.detail;
    }

    if (Array.isArray(data.detail)) {
      const messages = data.detail.flatMap((item: unknown) =>
        typeof item === "object" && item !== null && "msg" in item && typeof item.msg === "string"
          ? [item.msg]
          : [],
      );

      if (messages.length > 0) {
        return messages.join(". ");
      }
    }
  } catch {
    return FALLBACK;
  }

  return FALLBACK;
}

export function apiSend(path: string, method: HttpMethod, body?: unknown): Promise<Response> {
  return fetch(`/api${path}`, {
    method,
    credentials: "same-origin",
    headers: body === undefined ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
}
