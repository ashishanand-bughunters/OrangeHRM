import { Page } from "@playwright/test";
import { TIMESHEET_PENDING_SELECTORS } from "../../selectors/leave/TimesheetPendingPage.selectors";

export class TimesheetPendingPage {
  constructor(private readonly page: Page) {}

  async navigate(): Promise<void> {
    await this.page.goto("/web/index.php/time/timesheetApprovals", {
      waitUntil: "domcontentloaded",
    });

    await this.page.locator(TIMESHEET_PENDING_SELECTORS.tableBody).waitFor({ state: "visible" });
  }

  async getEmployeeNames(): Promise<string[]> {
    const rows = this.page.locator(TIMESHEET_PENDING_SELECTORS.employeeNameRows);

    await rows.first().waitFor({ state: "visible" });

    return rows.allInnerTexts();
  }
}
