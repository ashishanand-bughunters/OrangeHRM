import { Page, Locator } from "@playwright/test";
import selectors from "../../selectors/timesheet.json";
import { resolve } from "../utils/selectorHelper";

export class MyTimesheetPage {
  readonly mainTitle: Locator;
  readonly prevPeriod: Locator;
  readonly statusText: Locator;
  readonly editButton: Locator;
  readonly submitButton: Locator;
  readonly saveButton: Locator;
  readonly successToast: Locator;
  readonly timesheetActionsSection: Locator;
  readonly commentCell: Locator;
  readonly hoursInput: Locator;

  constructor(private readonly page: Page) {
    this.mainTitle = page
      .locator(selectors.mainTitle)
      .filter({ hasText: "My Timesheet" });
    this.prevPeriod = page.locator(selectors.prevPeriod);
    this.statusText = page.locator(selectors.statusText);
    this.editButton = resolve(page, selectors.editButton);
    this.submitButton = resolve(page, selectors.submitButton);
    this.saveButton = resolve(page, selectors.saveButton);
    this.successToast = page.locator(selectors.successToast);
    this.timesheetActionsSection = page
      .locator(selectors.timesheetActionsSection)
      .filter({ hasText: selectors.timesheetActionsSection_filterText });
    this.commentCell = this.timesheetActionsSection.locator(
      selectors.commentCell
    );
    this.hoursInput = page.locator(selectors.hoursInputCell);
  }

  async navigate(): Promise<void> {
    await this.page.goto("/web/index.php/time/viewMyTimesheet", {
      waitUntil: "domcontentloaded",
    });
    await this.mainTitle.waitFor({ state: "visible", timeout: 30_000 });
  }

  async getStatus(): Promise<string> {
    try {
      await this.statusText.waitFor({ state: "visible", timeout: 5_000 });
      return (await this.statusText.textContent()) ?? "";
    } catch {
      return "";
    }
  }

  async clickPrevious(): Promise<void> {
    await this.prevPeriod.click();
    await this.page.waitForLoadState("networkidle");
  }

  async clickEdit(): Promise<void> {
    await this.editButton.click();
    await this.page.waitForURL("**/time/editTimesheet/**", {
      timeout: 30_000,
    });
  }

  async modifyFirstHour(value: string): Promise<void> {
    const firstInput = this.hoursInput.first();
    await firstInput.waitFor({ state: "visible" });
    await firstInput.fill(value);
  }

  async clickSave(): Promise<void> {
    await this.saveButton.click();
    await this.page.waitForURL("**/time/viewMyTimesheet**", {
      timeout: 30_000,
    });
  }

  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
    await this.successToast.waitFor({ state: "visible", timeout: 30_000 });
  }
}
