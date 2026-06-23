import { test, expect } from "../../fixtures/auth.fixture";
import { TimesheetPendingPage } from "../../pages/leave/TimesheetPendingPage";

test.describe("Timesheet Pending Actions - Duplication Check", () => {
  test("should not display duplicate employee entries in the pending timesheets list", async ({
    authenticatedPage,
  }) => {
    const timesheetPage = new TimesheetPendingPage(authenticatedPage);

    await timesheetPage.navigate();

    const names = await timesheetPage.getEmployeeNames();

    // Verify we actually have entries to check
    expect(names.length).toBeGreaterThan(0);

    // Check for duplicates: the list of names should have the same length as the unique set
    const uniqueNames = new Set(names);
    expect(
      names.length,
      `Found duplicate entries in pending timesheets. All names: [${names.join(", ")}]`
    ).toBe(uniqueNames.size);
  });

  test("should list at least one employee in pending timesheets", async ({
    authenticatedPage,
  }) => {
    const timesheetPage = new TimesheetPendingPage(authenticatedPage);

    await timesheetPage.navigate();

    const names = await timesheetPage.getEmployeeNames();

    expect(names.length).toBeGreaterThan(0);
    // Each name entry should be non-empty
    for (const name of names) {
      expect(name.trim()).not.toBe("");
    }
  });
});
