export const routes = {
  home: "/",
  disclaimer: "/disclaimer",
  login: "/login",
  targets: "/targets",
  status: (slug: string) => `/status/${encodeURIComponent(slug)}`,
} as const;
