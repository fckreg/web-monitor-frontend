const ID = "[0-9a-f-]{36}";

// Только то, что вызывает браузер. Серверные страницы ходят в бэкенд напрямую.
const ALLOWED: Array<{ method: string; pattern: RegExp }> = [
  { method: "GET", pattern: new RegExp(`^public/status/${ID}/icon$`, "i") },

  { method: "POST", pattern: /^auth\/login$/ },
  { method: "GET", pattern: /^auth\/totp\/qr$/ },
  { method: "POST", pattern: /^auth\/totp\/confirm$/ },
  { method: "POST", pattern: /^auth\/totp$/ },
  { method: "POST", pattern: /^auth\/recovery-codes$/ },
  { method: "POST", pattern: /^auth\/logout$/ },

  { method: "POST", pattern: /^groups$/ },
  { method: "PATCH", pattern: new RegExp(`^groups/${ID}$`, "i") },
  { method: "DELETE", pattern: new RegExp(`^groups/${ID}$`, "i") },

  { method: "POST", pattern: /^targets$/ },
  { method: "GET", pattern: new RegExp(`^targets/${ID}/icon$`, "i") },
  { method: "PATCH", pattern: new RegExp(`^targets/${ID}$`, "i") },
  { method: "DELETE", pattern: new RegExp(`^targets/${ID}$`, "i") },
];

export function isAllowedRoute(method: string, path: string): boolean {
  const verb = method === "HEAD" ? "GET" : method;

  return ALLOWED.some((route) => route.method === verb && route.pattern.test(path));
}
