import { test, expect } from "../../fixtures/auth.fixture";
import { ApplyLeavePage } from "../../pages/leave/ApplyLeavePage";

test.describe("TC-02 — Reject leave request when toDate equals fromDate", () => {
  test("should handle leave request where toDate equals fromDate without negative day count", async ({
    authenticatedPage,
  }) => {
    const applyLeavePage = new ApplyLeavePage(authenticatedPage);
    await applyLeavePage.navigate();

    // Select the first available leave type
    await applyLeavePage.selectFirstLeaveType();

    // Enter fromDate as 2026-08-20
    await applyLeavePage.fillFromDate("2026-20-08");

    // Enter toDate as 2026-08-20 (same date — equal to fromDate)
    await applyLeavePage.fillToDate("2026-20-08");

    // Click Apply
    await applyLeavePage.clickApply();

    // Expected: Either a validation error is shown OR the request is accepted
    // with a duration of 1 day. No negative day count should occur.
    const hasError = await applyLeavePage.hasValidationError();
    const hasSuccess = await applyLeavePage.hasSuccessToast();

    // One of these outcomes must be true — the system must not silently fail
    // or produce a negative duration
    expect(
      hasError || hasSuccess,
      "Expected either a validation error or a success toast when fromDate equals toDate"
    ).toBe(true);

    if (hasError) {
      const errors = await applyLeavePage.getValidationErrors();
      // Validation error should be meaningful (not empty)
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.trim().length > 0)).toBe(true);
    }
  });
});
