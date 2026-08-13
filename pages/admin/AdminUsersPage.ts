import { Page, Locator } from "@playwright/test";
import selectors from "../../selectors/admin.json";
import { resolve } from "../utils/selectorHelper";

export class AdminUsersPage {
  readonly adminLink: Locator;
  readonly addButton: Locator;
  readonly saveButton: Locator;
  readonly successToast: Locator;
  readonly userTableRows: Locator;

  constructor(private readonly page: Page) {
    this.adminLink = resolve(page, selectors.adminLink);
    this.addButton = resolve(page, selectors.addButton);
    this.saveButton = resolve(page, selectors.saveButton);
    this.successToast = page.locator(selectors.successToast);
    this.userTableRows = page.locator(selectors.userTableRows);
  }

  async navigate(): Promise<void> {
    await this.adminLink.click();
    await this.page.waitForURL("**/admin/viewSystemUsers");
  }

  async clickAdd(): Promise<void> {
    await this.addButton.click();
    await this.page.waitForURL("**/admin/saveSystemUser");
  }

  async selectUserRole(role: string): Promise<void> {
    await this.page.locator(".oxd-select-wrapper").first().click();
    await this.page
      .locator(selectors.selectDropdownOption, { hasText: role })
      .click();
  }

  async selectStatus(status: string): Promise<void> {
    await this.page.locator(".oxd-select-wrapper").nth(1).click();
    await this.page
      .locator(selectors.selectDropdownOption, { hasText: status })
      .click();
  }

  async fillEmployeeName(namePrefix: string): Promise<void> {
    const input = this.page.getByRole("textbox", { name: "Type for hints..." });
    await input.click();
    await input.fill(namePrefix);
    // Wait for actual results (not the "Searching..." loading state)
    await this.page.waitForFunction(
      () => {
        const opts = document.querySelectorAll(".oxd-autocomplete-option");
        return (
          opts.length > 0 && !opts[0].textContent?.includes("Searching")
        );
      },
      { timeout: 15_000 }
    );
    // Click the first actual result
    const option = this.page.locator(selectors.autocompleteOption).first();
    await option.click();
    // Verify the field value changed (employee selected)
    await this.page.waitForFunction(
      (prefix) => {
        const el = document.querySelector(
          ".oxd-autocomplete-wrapper input"
        ) as HTMLInputElement;
        return el && el.value !== prefix && el.value.length > 0;
      },
      namePrefix,
      { timeout: 5_000 }
    );
  }

  async fillUsername(username: string): Promise<void> {
    await this.page.getByRole("textbox").nth(2).fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    const passwordInputs = this.page.locator('input[type="password"]');
    await passwordInputs.nth(0).fill(password);
    await passwordInputs.nth(1).fill(password);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  getRowByText(text: string): Locator {
    return this.userTableRows.filter({ hasText: text });
  }
}
