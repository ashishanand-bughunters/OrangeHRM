import { Page } from "@playwright/test";
import selectors from "../../selectors/leave.json";

export class TimesheetPendingPage {
  constructor(private readonly page: Page) {}

  async navigate(): Promise<void> {
    await this.page.goto("/web/index.php/time/timesheetApprovals", {
      waitUntil: "domcontentloaded",
    });

    await this.page.locator(selectors.tableBody).waitFor({ state: "visible" });
  }

  async getEmployeeNames(): Promise<string[]> {
    const rows = this.page.locator(selectors.employeeNameRows);

    await rows.first().waitFor({ state: "visible" });

    return rows.allInnerTexts();
  }
}
