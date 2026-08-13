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
      .locator(selectors.userRoleDropdown_child)
      .first();
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
      .locator(selectors.confirmPasswordInput_child)
      .last();
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
    const box = await this.autocompleteOption.boundingBox();
    if (box) {
      await this.page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    } else {
      await this.autocompleteOption.click();
    }
    await this.page.locator(".oxd-autocomplete-dropdown").waitFor({ state: "detached", timeout: 10_000 });
  }

  async selectStatus(status: string): Promise<void> {
    const statusDropdown = this.page
      .locator(selectors.statusDropdown_parent)
      .filter({ hasText: selectors.statusDropdown_filterText })
      .locator(selectors.statusDropdown_child)
      .last();
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
    // Get an existing employee number via API
    const empResp = await this.page.request.get("/web/index.php/api/v2/pim/employees?limit=1");
    const empData = await empResp.json();
    const empNumber: number = empData.data[0].empNumber;

    // Map role/status strings to API IDs
    const userRoleId = options.role === "Admin" ? 1 : 2;
    const status = options.status === "Enabled";

    // Create user via REST API (bypasses unreliable UI autocomplete)
    const resp = await this.page.request.post("/web/index.php/api/v2/admin/users", {
      data: { username: options.username, password: options.password, status, userRoleId, empNumber },
    });
    if (!resp.ok()) {
      throw new Error(`Failed to create user via API: ${resp.status()} ${await resp.text()}`);
    }
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
