import { defineConfig, devices } from "@playwright/test";

// E2E_BASE_URL — уже запущенный сервер; без него Playwright сам поднимает `next start`.
const externalUrl = process.env.E2E_BASE_URL;
const baseURL = externalUrl ?? "http://127.0.0.1:3000";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL,
    locale: "ru-RU",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: externalUrl
    ? undefined
    : {
        command: "pnpm start",
        url: `${baseURL}/healthz`,
        reuseExistingServer: !process.env.CI,
        timeout: 60_000,
      },
});
