import { withSentryConfig } from "@sentry/nextjs/config";
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Без nonce: статическая оболочка страниц собирается заранее, а nonce нужен на каждый запрос.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
];

const nextConfig: NextConfig = {
  output: "standalone",
  agentRules: false,
  poweredByHeader: false,
  reactCompiler: true,
  cacheComponents: true,
  partialPrefetching: true,
  // Шрифт OG-картинки читается с диска и в standalone-сборку сам не попадает.
  outputFileTracingIncludes: {
    "/*": ["./node_modules/@fontsource/geologica/files/geologica-{cyrillic,latin}-300-normal.woff"],
  },
  cacheLife: {
    // Проверки идут раз в 30 секунд и чаще: минута задержки на публичной странице допустима.
    status: { stale: 30, revalidate: 60, expire: 600 },
  },
  turbopack: {
    root: import.meta.dirname,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  telemetry: false,
  tunnelRoute: "/monitoring",
  widenClientFileUpload: true,
  suppressOnRouterTransitionStartWarning: true,
  sourcemaps: {
    disable: process.env.SENTRY_AUTH_TOKEN ? false : "disable-upload",
    deleteSourcemapsAfterUpload: true,
  },
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
    excludeTracing: true,
  },
});
