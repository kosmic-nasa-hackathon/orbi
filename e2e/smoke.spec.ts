import { expect, type Page, test } from "@playwright/test";

const ROUTES = [
  { name: "home", path: "/", app: true },
  { name: "today", path: "/?view=today", app: true },
  { name: "body", path: "/?view=body", app: true },
  { name: "decision", path: "/?view=decision", app: true },
  { name: "eva", path: "/?view=eva", app: true },
  { name: "pitch", path: "/pitch/", app: false },
] as const;

const THEMES = ["dark", "light"] as const;

function collectErrors(page: Page): string[] {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() !== "error") return;
    if (message.text().includes("favicon")) return;
    errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

function setTheme(page: Page, theme: string) {
  return page.addInitScript((value) => {
    window.localStorage.setItem("orbi-theme", value);
  }, theme);
}

for (const theme of THEMES) {
  test.describe(`${theme} theme`, () => {
    for (const route of ROUTES) {
      test(`${route.name} loads at 1180x820`, async ({ page }) => {
        const errors = collectErrors(page);
        await setTheme(page, theme);
        await page.goto(route.path);

        await expect(page.locator("main")).toBeVisible();
        if (route.app) {
          await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        }
        await page.waitForTimeout(200);

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth + 1,
        );
        expect(overflow).toBe(false);
        expect(errors).toEqual([]);
      });
    }
  });
}
