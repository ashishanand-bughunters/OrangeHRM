import { test, expect } from "../../fixtures/auth.fixture";
import { ApplyLeavePage } from "../../pages/leave/ApplyLeavePage";

test.describe("TC-04: Accept valid leave request with toDate after fromDate", () => {
  test("should create leave request successfully when toDate is after fromDate", async ({
    authenticatedPage,
  }) => {
    const applyLeavePage = new ApplyLeavePage(authenticatedPage);

    await applyLeavePage.navigate();
    await applyLeavePage.selectFirstLeaveType();
    await applyLeavePage.fillFromDate("2026-08-15");
    await applyLeavePage.fillToDate("2026-08-20");
    await applyLeavePage.clickApply();

    const success = await applyLeavePage.hasSuccessToast();
    expect(success, "Leave request should be created successfully").toBe(true);
  });
});
