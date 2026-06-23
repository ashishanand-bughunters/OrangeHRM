import * as fs from "fs";
import * as path from "path";
import { test, expect } from "../../fixtures/auth.fixture";
import { PageTitleCapture, MODULES } from "../../pages/utils/PageTitleCapture";

const BASELINE_PATH = path.resolve(__dirname, "../baselines/page-titles.json");

test.describe("Page Title Baseline Generation", () => {
  test("capture module titles for all navigation sections", async ({
    authenticatedPage,
  }) => {
    test.setTimeout(180_000);
    const titleCapture = new PageTitleCapture(authenticatedPage);
    const baseline = await titleCapture.captureAllModuleTitles();

    // Verify we captured a title for every module
    for (const mod of MODULES) {
      expect(baseline[mod.name], `Title captured for ${mod.name}`).toBeTruthy();
    }

    // Write baseline JSON to disk
    const dir = path.dirname(BASELINE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(BASELINE_PATH, JSON.stringify(baseline, null, 2), "utf-8");

    // Verify baseline file was written
    expect(fs.existsSync(BASELINE_PATH)).toBe(true);

    const written = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf-8"));
    expect(Object.keys(written)).toHaveLength(MODULES.length);
  });
});
