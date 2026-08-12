import { Page, Locator } from "@playwright/test";
import { resolve } from "../utils/selectorHelper";
import selectors from "../../selectors/leaveRequest.json";

export class ApplyLeavePage {
  private readonly applyButton: Locator;
  private readonly validationErrors: Locator;
  private readonly successToast: Locator;
  private readonly leaveTypeDropdown: Locator;

  constructor(private readonly page: Page) {
    this.leaveTypeDropdown = page.locator(selectors.leaveTypeDropdown);
    this.applyButton = resolve(page, selectors.applyButton);
    this.validationErrors = page.locator(selectors.validationError);
    this.successToast = page.locator(selectors.successMessage);
  }

  // Scoped locators: find date inputs by their label text to avoid fragile index-based selectors
  private getDateInput(label: string): Locator {
    return this.page
      .locator(".oxd-form-row")
      .filter({ hasText: label })
      .locator("input");
  }

  async navigate(): Promise<void> {
    await this.page.goto("/web/index.php/leave/applyLeave", {
      waitUntil: "domcontentloaded",
    });
    await this.page.locator(selectors.formContainer).waitFor({ state: "visible" });
  }

  async selectLeaveType(option: string): Promise<void> {
    await this.leaveTypeDropdown.click();
    await this.page.getByRole("option", { name: option }).click();
  }

  async selectFirstLeaveType(): Promise<void> {
    await this.leaveTypeDropdown.click();
    await this.page.locator(".oxd-select-dropdown .oxd-select-option").first().waitFor({ state: "visible" });
    await this.page.locator(".oxd-select-dropdown .oxd-select-option").first().click();
  }

  async fillFromDate(date: string): Promise<void> {
    const input = this.getDateInput("From Date");
    await input.click();
    await input.fill(date);
    await input.press("Escape");
  }

  async fillToDate(date: string): Promise<void> {
    const input = this.getDateInput("To Date");
    await input.click();
    await input.fill(date);
    await input.press("Escape");
  }

  async clickApply(): Promise<void> {
    await this.applyButton.click();
  }

  async getValidationErrors(): Promise<string[]> {
    const count = await this.validationErrors.count();
    if (count === 0) return [];
    return this.validationErrors.allInnerTexts();
  }

  get validationErrorLocator(): Locator {
    return this.validationErrors;
  }

  async hasValidationError(): Promise<boolean> {
    return (await this.validationErrors.count()) > 0;
  }

  async hasSuccessToast(): Promise<boolean> {
    try {
      await this.successToast.waitFor({ state: "visible", timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  async getBalanceText(): Promise<string> {
    const balanceEl = this.page.locator(".oxd-input-group .oxd-text--span");
    try {
      await balanceEl.first().waitFor({ state: "visible", timeout: 3000 });
      return (await balanceEl.first().innerText()).trim();
    } catch {
      return "";
    }
  }
}
