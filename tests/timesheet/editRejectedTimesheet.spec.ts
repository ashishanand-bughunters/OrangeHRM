import { test, expect } from "../../fixtures/auth.fixture";
import { MyTimesheetPage } from "../../pages/timesheet/MyTimesheetPage";

test.describe("TC-02 — Edit and resubmit a rejected timesheet", () => {
  test("should allow editing and resubmitting a rejected timesheet with supervisor comment visible", async ({
    authenticatedPage,
  }) => {
    const ts = new MyTimesheetPage(authenticatedPage);
    await ts.navigate();

    // Navigate back up to 4 periods to find a rejected timesheet
    let foundRejected = false;
    const status = await ts.getStatus();
    if (status.includes("Rejected")) {
      foundRejected = true;
    }
    for (let i = 0; i < 4 && !foundRejected; i++) {
      await ts.clickPrevious();
      const periodStatus = await ts.getStatus();
      if (periodStatus.includes("Rejected")) {
        foundRejected = true;
      }
    }

    test.skip(!foundRejected, "No rejected timesheet found — precondition not met");

    // Step 2: Verify supervisor comment is visible in TimesheetActions section
    await expect(ts.timesheetActionsSection).toBeVisible();
    await expect(ts.commentCell.first()).toBeVisible();

    // Step 1: Click Edit on the rejected timesheet
    await ts.clickEdit();

    // Step 3: Modify hours in one field
    await ts.modifyFirstHour("08:00");

    // Save and return to My Timesheet view
    await ts.clickSave();

    // Step 4: Submit the timesheet
    await ts.clickSubmit();

    // Expected: status changes to Submitted
    await expect(ts.statusText).toContainText("Submitted");

    // Expected: timesheet becomes read-only (Edit button no longer visible)
    await expect(ts.editButton).not.toBeVisible();
  });
});
