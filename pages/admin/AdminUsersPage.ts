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
    // Wait for a real option (not the transient "Searching..." placeholder)
    const realOption = this.page
      .getByRole("option")
      .filter({ hasNotText: /Searching/i })
      .first();
    await realOption.waitFor({ state: "visible", timeout: 20_000 });
    await realOption.click();
  }

  async fillUsername(username: string): Promise<void> {
    // nth(2): 0=sidebar search, 1=employee name autocomplete, 2=username
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
