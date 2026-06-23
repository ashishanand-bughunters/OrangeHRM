import { Page, Locator } from "@playwright/test";

/**
 * Resolves a selector string from JSON into a Playwright Locator.
 *
 * Conventions:
 * - "button:Name"      → page.getByRole("button", { name: "Name" })
 * - "link:Name"         → page.getByRole("link", { name: "Name" })
 * - "placeholder:Text"  → page.getByPlaceholder("Text")
 * - anything else        → page.locator(selector)
 */
export function resolve(page: Page, selector: string): Locator {
  if (selector.startsWith("button:")) {
    return page.getByRole("button", { name: selector.slice(7) });
  }
  if (selector.startsWith("link:")) {
    return page.getByRole("link", { name: selector.slice(5) });
  }
  if (selector.startsWith("placeholder:")) {
    return page.getByPlaceholder(selector.slice(12));
  }
  return page.locator(selector);
}
