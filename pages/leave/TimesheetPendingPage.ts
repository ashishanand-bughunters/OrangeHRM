import { Page } from "@playwright/test";

export class TimesheetPendingPage {
  constructor(private readonly page: Page) {}

  async navigate(): Promise<void> {
    await this.page.goto("/web/index.php/time/timesheetApprovals", {
      waitUntil: "domcontentloaded",
    });

    // Wait for the table body to be present before interacting
    await this.page.locator(".oxd-table-body").waitFor({ state: "visible" });
  }

  async getEmployeeNames(): Promise<string[]> {
    const rows = this.page.locator(
      '//div[@class="oxd-table-body"]/div[contains(@class,"oxd-table-row")]/div[2]'
    );

    await rows.first().waitFor({ state: "visible" });

    return rows.allInnerTexts();
  }
}
