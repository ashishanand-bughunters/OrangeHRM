import * as fs from "fs";
import * as path from "path";
import { test, expect } from "../fixtures/auth.fixture";
import {
  PageTitleCapture,
  MODULES,
  TitleBaseline,
} from "../pages/PageTitleCapture";

const BASELINE_PATH = path.resolve(__dirname, "../baselines/page-titles.json");

test.describe("Page Title Validation", () => {
  let baseline: TitleBaseline;

  test.beforeAll(() => {
    if (!fs.existsSync(BASELINE_PATH)) {
      throw new Error(
        `Baseline file not found at ${BASELINE_PATH}. Run baseline-generation.spec.ts first.`
      );
    }
    baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, "utf-8"));
  });

  for (const mod of MODULES) {
    test(`${mod.name} page title matches baseline`, async ({
      authenticatedPage,
    }) => {
      const titleCapture = new PageTitleCapture(authenticatedPage);
      await titleCapture.navigateToModule(mod.path);

      const actualTitle = await titleCapture.getModuleTitle();
      const expectedTitle = baseline[mod.name];

      expect(actualTitle, `${mod.name} title mismatch`).toBe(expectedTitle);
    });
  }

  test("no module returns an empty title", async ({ authenticatedPage }) => {
    const titleCapture = new PageTitleCapture(authenticatedPage);

    for (const mod of MODULES) {
      await titleCapture.navigateToModule(mod.path);
      const title = await titleCapture.getModuleTitle();
      expect(title, `${mod.name} should not have empty title`).not.toBe("");
    }
  });
});
