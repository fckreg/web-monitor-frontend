import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function expectNoAxeViolations(page: Page) {
  const result = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  const summary = result.violations.map(
    (violation) =>
      `${violation.id}: ${violation.nodes.map((node) => node.target.join(" ")).join(", ")}`,
  );
  expect(summary).toEqual([]);
}

async function firstTargetPath(page: Page): Promise<string | null> {
  await page.goto("/");
  const link = page.locator('a[href^="/status/"]').first();

  if ((await link.count()) === 0) {
    return null;
  }

  return link.getAttribute("href");
}

test.describe("публичные страницы", () => {
  for (const path of ["/", "/disclaimer", "/login", "/missing-page"]) {
    test(`${path}: нет нарушений WCAG`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
      await expectNoAxeViolations(page);
    });
  }

  test("страница сайта: нет нарушений WCAG", async ({ page }) => {
    const path = await firstTargetPath(page);
    test.skip(path === null, "бэкенд не вернул ни одного сайта");
    await page.goto(path as string);
    await page.waitForLoadState("networkidle");
    await expect(page.locator("h1")).toHaveCount(1);
    await expectNoAxeViolations(page);
  });

  test("главная: один h1, landmarks и рабочая ссылка пропуска", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main#main")).toHaveCount(1);
    await expect(page.locator("header")).toHaveCount(1);
    await expect(page.locator("footer")).toHaveCount(1);

    await page.keyboard.press("Tab");
    const skip = page.getByRole("link", { name: "Перейти к содержимому" });
    await expect(skip).toBeFocused();
    await expect(skip).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/#main$/);
  });

  test("главная: мета-теги и canonical", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);

    await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
  });

  test("несуществующая страница отдаёт 404 и noindex", async ({ page }) => {
    const response = await page.goto("/missing-page");
    expect(response?.status()).toBe(404);

    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
  });
});
