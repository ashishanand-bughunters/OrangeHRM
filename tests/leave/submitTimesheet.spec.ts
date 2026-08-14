import { test, expect } from "../../fixtures/auth.fixture";
import { MyTimesheetPage } from "../../pages/leave/MyTimesheetPage";

test.describe("TC-01 — Submit Weekly Timesheet", () => {
  test("should successfully submit a complete weekly timesheet", async ({
    authenticatedPage,
  }) => {
    const ts = new MyTimesheetPage(authenticatedPage);

    await ts.navigate();
    await ts.ensureEditMode();
    await ts.clickAddRow();

    const firstRow = ts.getRow(0);

    // Fill project — type a short prefix to trigger autocomplete, pick first match
    await ts.fillProject(firstRow, "D");

    // Fill activity — async-loaded after project selection, pick first option
    await ts.fillActivity(firstRow);

    // Fill Mon–Fri with 08:00 each (indices 0–4)
    for (let i = 0; i < 5; i++) {
      await ts.fillHour(firstRow, i, "08:00");
    }

    await ts.submit();

    // Assert timesheet status changed to Submitted
    await expect(ts.statusFooter).toContainText("Submitted");

    // Assert timesheet became read-only (input fields no longer visible)
    await expect(firstRow.locator("input").first()).not.toBeVisible();
  });
});
