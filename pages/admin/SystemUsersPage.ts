import { Page, Locator } from "@playwright/test";
import selectors from "../../selectors/admin.json";
import { resolve } from "../utils/selectorHelper";

export class SystemUsersPage {
  readonly adminLink: Locator;
  readonly addButton: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly successToast: Locator;
  readonly tableRows: Locator;
  readonly usernameSearchInput: Locator;
  readonly userRoleDropdown: Locator;
  readonly employeeNameInput: Locator;
  readonly autocompleteOption: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;

  constructor(private readonly page: Page) {
    this.adminLink = resolve(page, selectors.adminLink);
    this.addButton = resolve(page, selectors.addButton);
    this.searchButton = resolve(page, selectors.searchButton);
    this.resetButton = resolve(page, selectors.resetButton);
    this.saveButton = resolve(page, selectors.saveButton);
    this.cancelButton = resolve(page, selectors.cancelButton);
    this.successToast = page.locator(selectors.successToast);
    this.tableRows = page.locator(selectors.tableRows);
    this.usernameSearchInput = page
      .locator(selectors.usernameSearchInput_parent)
      .filter({ hasText: selectors.usernameSearchInput_filterText })
      .locator(selectors.usernameSearchInput_child)
      .first();
    this.userRoleDropdown = page
      .locator(selectors.userRoleDropdown_parent)
      .filter({ hasText: selectors.userRoleDropdown_filterText })
      .locator(selectors.userRoleDropdown_child);
    this.employeeNameInput = page
      .locator(selectors.employeeNameInput_parent)
      .filter({ hasText: selectors.employeeNameInput_filterText })
      .locator(selectors.employeeNameInput_child)
      .first();
    this.autocompleteOption = page
      .locator(selectors.autocompleteOption)
      .first();
    this.passwordInput = page
      .locator(selectors.passwordInput_parent)
      .filter({ hasText: selectors.passwordInput_filterText })
      .locator(selectors.passwordInput_child)
      .first();
    this.confirmPasswordInput = page
      .locator(selectors.confirmPasswordInput_parent)
      .filter({ hasText: selectors.confirmPasswordInput_filterText })
      .locator(selectors.confirmPasswordInput_child);
  }

  async navigateToSystemUsers(): Promise<void> {
    await this.adminLink.click();
    await this.page.waitForURL("**/admin/viewSystemUsers");
  }

  async navigateToAddUser(): Promise<void> {
    await this.page.goto("/web/index.php/admin/saveSystemUser");
    await this.page.waitForLoadState("networkidle");
  }

  async selectUserRole(role: string): Promise<void> {
    await this.userRoleDropdown.click();
    const option = this.page
      .locator(selectors.selectDropdownOption)
      .filter({ hasText: role });
    await option.click();
  }

  async fillEmployeeName(name: string): Promise<void> {
    await this.employeeNameInput.fill(name);
    await this.autocompleteOption.waitFor({ state: "visible", timeout: 10_000 });
    await this.autocompleteOption.click();
  }

  async selectStatus(status: string): Promise<void> {
    const statusDropdown = this.page
      .locator(selectors.statusDropdown_parent)
      .filter({ hasText: selectors.statusDropdown_filterText })
      .locator(selectors.statusDropdown_child);
    await statusDropdown.click();
    const option = this.page
      .locator(selectors.selectDropdownOption)
      .filter({ hasText: status });
    await option.click();
  }

  async createUser(options: {
    username: string;
    password: string;
    role: string;
    status: string;
  }): Promise<void> {
    await this.navigateToAddUser();
    await this.selectUserRole(options.role);
    await this.selectStatus(options.status);
    await this.fillEmployeeName("a");
    await this.usernameSearchInput.fill(options.username);
    await this.passwordInput.fill(options.password);
    await this.confirmPasswordInput.fill(options.password);
    await this.saveButton.click();
    await this.successToast.waitFor({ state: "visible", timeout: 15_000 });
  }

  async searchByUsername(username: string): Promise<void> {
    await this.usernameSearchInput.fill(username);
    await this.searchButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  getRowByText(text: string): Locator {
    return this.tableRows.filter({ hasText: text });
  }
}
