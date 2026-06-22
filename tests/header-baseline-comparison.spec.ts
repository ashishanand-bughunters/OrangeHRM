import * as fs from "fs";
import * as path from "path";
import { test, expect } from "../fixtures/auth.fixture";
import { PageTitleCapture } from "../pages/PageTitleCapture";

const HEADER_PAGES = [
  { key: "admin", path: "/web/index.php/admin/viewSystemUsers" },
  { key: "pim", path: "/web/index.php/pim/viewEmployeeList" },
  { key: "leave", path: "/web/index.php/leave/viewLeaveList" },
  { key: "time", path: "/web/index.php/time/viewEmployeeTimesheet" },
  { key: "recruitment", path: "/web/index.php/recruitment/viewCandidates" },
  { key: "myInfo", path: "/web/index.php/pim/viewPersonalDetails/empNumber/7" },
  { key: "performance", path: "/web/index.php/performance/searchEvaluatePerformanceReview" },
  { key: "dashboard", path: "/web/index.php/dashboard/index" },
  { key: "directory", path: "/web/index.php/directory/viewDirectory" },
  { key: "maintenance", path: "/web/index.php/maintenance/viewMaintenance" },
  { key: "claim", path: "/web/index.php/claim/viewClaim" },
  { key: "buzz", path: "/web/index.php/buzz/viewBuzz" },
];

let baseline: Record<string, string>;

test.beforeAll(() => {
  const baselinePath = path.resolve(__dirname, "../files/headerBaseline.json");
  if (!fs.existsSync(baselinePath)) {
    throw new Error(`Baseline file not found: ${baselinePath}`);
  }
  baseline = JSON.parse(fs.readFileSync(baselinePath, "utf-8"));
});

test("all page headers match baseline", async ({ authenticatedPage }) => {
  test.setTimeout(180_000);

  const titleCapture = new PageTitleCapture(authenticatedPage);
  const passed: string[] = [];
  const failed: string[] = [];

  for (const entry of HEADER_PAGES) {
    await titleCapture.navigateToModule(entry.path);
    const actual = await titleCapture.getFullHeader();
    const expected = baseline[entry.key];

    if (actual === expected) {
      passed.push(entry.key);
    } else {
      failed.push(`${entry.key} (expected: "${expected}", got: "${actual}")`);
    }
  }

  console.log(`Header check passed: ${passed.join(", ")}`);
  console.log(`Header check failed: ${failed.length > 0 ? failed.join(", ") : "none"}`);

  expect(failed.length, `${failed.length} header(s) did not match baseline:\n${failed.join("\n")}`).toBe(0);
});
