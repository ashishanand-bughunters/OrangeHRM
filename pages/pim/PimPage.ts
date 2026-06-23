import { Page, Locator } from "@playwright/test";

export class PimPage {
  readonly pimLink: Locator;
  readonly addButton: Locator;
  readonly employeeTableRows: Locator;
  readonly searchInputEmployeeName: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly recordsFoundText: Locator;
  readonly noRecordsMessage: Locator;
  readonly successToast: Locator;
  readonly deleteConfirmButton: Locator;
  readonly tableHeaders: Locator;

  constructor(private readonly page: Page) {
    this.pimLink = page.getByRole("link", { name: "PIM" });
    this.addButton = page.getByRole("button", { name: "Add" });
    this.employeeTableRows = page.locator(".oxd-table-body .oxd-table-row");
    this.searchInputEmployeeName = page
      .locator(".oxd-form-row")
      .filter({ hasText: "Employee Name" })
      .locator("input")
      .first();
    this.searchButton = page.getByRole("button", { name: "Search" });
    this.resetButton = page.getByRole("button", { name: "Reset" });
    this.recordsFoundText = page.locator(".orangehrm-horizontal-padding span");
    this.noRecordsMessage = page.locator(".orangehrm-horizontal-padding span", {
      hasText: "No Records Found",
    });
    this.successToast = page.locator(".oxd-toast--success");
    this.deleteConfirmButton = page.getByRole("button", {
      name: "Yes, Delete",
    });
    this.tableHeaders = page.locator(
      ".oxd-table-header .oxd-table-row .oxd-table-cell"
    );
  }

  async navigate(): Promise<void> {
    await this.pimLink.click();
    await this.page.waitForURL("**/pim/viewEmployeeList");
  }

  async clickAdd(): Promise<void> {
    await this.addButton.click();
    await this.page.waitForURL("**/pim/addEmployee");
  }

  getRowByText(text: string): Locator {
    return this.employeeTableRows.filter({ hasText: text });
  }

  async getEditButtonForRow(row: Locator): Promise<Locator> {
    return row.locator("i.bi-pencil-fill").first();
  }

  async getDeleteButtonForRow(row: Locator): Promise<Locator> {
    return row.locator("i.bi-trash").first();
  }

  async searchByEmployeeName(name: string): Promise<void> {
    await this.searchInputEmployeeName.fill(name);
    // Wait for autocomplete dropdown and select the first matching option
    const autocompleteOption = this.page
      .locator(".oxd-autocomplete-dropdown .oxd-autocomplete-option")
      .first();
    await autocompleteOption.waitFor({ state: "visible", timeout: 10_000 });
    await autocompleteOption.click();
    await this.searchButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  async searchByEmployeeNameNoAutocomplete(name: string): Promise<void> {
    await this.searchInputEmployeeName.fill(name);
    await this.searchButton.click();
    await this.page.waitForLoadState("networkidle");
  }

  async deleteEmployee(row: Locator): Promise<void> {
    const deleteBtn = await this.getDeleteButtonForRow(row);
    await deleteBtn.click();
    await this.deleteConfirmButton.waitFor({ state: "visible" });
    await this.deleteConfirmButton.click();
  }

  async editEmployee(row: Locator): Promise<void> {
    const editBtn = await this.getEditButtonForRow(row);
    await editBtn.click();
    await this.page.waitForURL("**/pim/viewPersonalDetails/**");
  }
}
