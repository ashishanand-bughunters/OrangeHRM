import { test, expect } from "../../fixtures/auth.fixture";
import { ApplyLeavePage } from "../../pages/leave/ApplyLeavePage";

test.describe("TC-03 — Reject leave request with toDate one day before fromDate", () => {
  test("should display validation error when toDate is one day before fromDate", async ({
    authenticatedPage,
  }) => {
    const applyLeavePage = new ApplyLeavePage(authenticatedPage);

    await applyLeavePage.navigate();

    // Select the first available leave type
    await applyLeavePage.selectFirstLeaveType();

    // Enter fromDate as 2026-08-20
    await applyLeavePage.fillFromDate("2026-20-08");

    // Enter toDate as 2026-08-19 (one day before fromDate)
    await applyLeavePage.fillToDate("2026-19-08");

    // Click Apply
    await applyLeavePage.clickApply();

    // Validation error should be displayed
    const errors = await applyLeavePage.getValidationErrors();
    expect(errors.length).toBeGreaterThan(0);

    // Request should not be created — no success toast
    const success = await applyLeavePage.hasSuccessToast();
    expect(success).toBe(false);
  });
});
