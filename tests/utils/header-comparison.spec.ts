import * as fs from "fs";
import * as path from "path";
import { test, expect } from "../../fixtures/auth.fixture";

const BASELINE_PATH = path.resolve(__dirname, "../../files/headerBaseline.json");

const PAGES: Record<string, string> = {
  dashboard: "/web/index.php/dashboard/index",
  admin: "/web/index.php/admin/viewSystemUsers",
  pim: "/web/index.php/pim/viewEmployeeList",
  leave: "/web/index.php/leave/viewLeaveList",
  time: "/web/index.php/time/viewEmployeeTimesheet",
  recruitment: "/web/index.php/recruitment/viewCandidates",
  myInfo: "/web/index.php/pim/viewPersonalDetails/empNumber/7",
  performance: "/web/index.php/performance/searchEvaluatePerformanceReview",
  directory: "/web/index.php/directory/viewDirectory",
  maintenance: "/web/index.php/maintenance/purgeEmployee",
  claim: "/web/index.php/claim/viewAssignClaim",
  buzz: "/web/index.php/buzz/viewBuzz",
};

test.describe("Header Baseline Comparison", () => {
  let baseline: Record<string, string>;

  test.beforeAll(() => {
    if (!fs.existsSync(BASELINE_PATH)) {
      throw new Error(
        `Baseline file not found at ${BASELINE_PATH}. Ensure files/headerBaseline.json exists.`
      );
    }
    baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf-8"));
  });

  test("header text matches baseline for all pages", async ({
    authenticatedPage,
  }) => {
    test.setTimeout(180_000);

    const passed: string[] = [];
    const failed: { page: string; expected: string; actual: string }[] = [];

    for (const [pageName, pagePath] of Object.entries(PAGES)) {
      await authenticatedPage.goto(pagePath, { waitUntil: "domcontentloaded" });

      // Handle Administrator Access re-validation overlay: on sensitive pages
      // (e.g. Maintenance) an overlay appears after the Vue SPA renders — after
      // domcontentloaded but before the breadcrumb is painted. Wait for EITHER
      // the breadcrumb OR the overlay to become visible before deciding which path to take.
      const breadcrumbLocator = authenticatedPage.locator(
        ".oxd-topbar-header-breadcrumb-module"
      );
      const adminLockHeading = authenticatedPage.getByRole("heading", {
        name: "Administrator Access",
      });
      await Promise.race([
        breadcrumbLocator.waitFor({ state: "visible", timeout: 20_000 }),
        adminLockHeading.waitFor({ state: "visible", timeout: 20_000 }),
      ]).catch(() => {});
      const isLocked = await adminLockHeading.isVisible().catch(() => false);
      if (isLocked) {
        await authenticatedPage
          .locator('input[type="password"]')
          .fill("admin123");
        await authenticatedPage
          .getByRole("button", { name: "Confirm" })
          .click();
        await adminLockHeading.waitFor({ state: "hidden", timeout: 10_000 });
      }

      await breadcrumbLocator.waitFor({ state: "visible", timeout: 15_000 });

      const moduleText = ((await breadcrumbLocator.textContent()) ?? "").trim();

      const crumbLocator = authenticatedPage.locator(
        ".oxd-topbar-header-breadcrumb-level"
      );
      const crumbCount = await crumbLocator.count();
      const crumbText =
        crumbCount > 0
          ? ((await crumbLocator.first().textContent()) ?? "").trim()
          : "";

      const actualHeader =
        crumbText !== "" ? `${moduleText} / ${crumbText}` : moduleText;

      const expectedHeader = baseline[pageName];

      if (actualHeader === expectedHeader) {
        passed.push(pageName);
      } else {
        failed.push({
          page: pageName,
          expected: expectedHeader ?? "(missing from baseline)",
          actual: actualHeader,
        });
      }
    }

    console.log(`Header check passed: ${passed.join(", ")}`);
    if (failed.length > 0) {
      console.log(
        `Header check failed: ${failed.map((f) => f.page).join(", ")}`
      );
      for (const f of failed) {
        console.log(
          `  ${f.page}: expected "${f.expected}", got "${f.actual}"`
        );
      }
    }

    expect(
      failed.length,
      `Header mismatch on ${failed.length} page(s): ${failed
        .map((f) => `${f.page} (expected "${f.expected}", got "${f.actual}")`)
        .join("; ")}`
    ).toBe(0);
  });
});
