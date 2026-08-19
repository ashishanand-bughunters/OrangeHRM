import { test, expect } from "../../fixtures/auth.fixture";
import { ApplyLeavePage } from "../../pages/leave/ApplyLeavePage";

test.describe("TC-06: Leave request date reverse order validation", () => {
  test("should accept dates when toDate is after fromDate", async ({
    authenticatedPage,
  }) => {
    const applyLeavePage = new ApplyLeavePage(authenticatedPage);

    await applyLeavePage.navigate();
    await applyLeavePage.selectFirstLeaveType();

    await applyLeavePage.fillFromDate("2026-08-15");
    await applyLeavePage.fillToDate("2026-08-20");

    // No validation error should appear for a valid date range
    await expect(applyLeavePage.validationErrorLocator).not.toBeVisible();
  });

  test("should show validation error when toDate is before fromDate", async ({
    authenticatedPage,
  }) => {
    const applyLeavePage = new ApplyLeavePage(authenticatedPage);

    await applyLeavePage.navigate();
    await applyLeavePage.selectFirstLeaveType();

    // Set fromDate to a later date
    await applyLeavePage.fillFromDate("2026-08-20");

    // Attempt to set toDate to a date before fromDate
    await applyLeavePage.fillToDate("2026-08-15");

    // Validation error should be displayed for reversed date range
    await expect(applyLeavePage.validationErrorLocator).toBeVisible();
  });
});
