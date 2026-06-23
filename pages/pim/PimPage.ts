import { Page, Locator } from "@playwright/test";
import { PIM_SELECTORS } from "../../selectors/pim/PimPage.selectors";

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
    this.pimLink = page.getByRole(PIM_SELECTORS.pimLink.role, { name: PIM_SELECTORS.pimLink.name });
    this.addButton = page.getByRole(PIM_SELECTORS.addButton.role, { name: PIM_SELECTORS.addButton.name });
    this.employeeTableRows = page.locator(PIM_SELECTORS.employeeTableRows);
    this.searchInputEmployeeName = page
      .locator(PIM_SELECTORS.searchInputEmployeeName.parent)
      .filter({ hasText: PIM_SELECTORS.searchInputEmployeeName.filterText })
      .locator(PIM_SELECTORS.searchInputEmployeeName.child)
      .first();
    this.searchButton = page.getByRole(PIM_SELECTORS.searchButton.role, { name: PIM_SELECTORS.searchButton.name });
    this.resetButton = page.getByRole(PIM_SELECTORS.resetButton.role, { name: PIM_SELECTORS.resetButton.name });
    this.recordsFoundText = page.locator(PIM_SELECTORS.recordsFoundText);
    this.noRecordsMessage = page.locator(PIM_SELECTORS.noRecordsMessage.locator, {
      hasText: PIM_SELECTORS.noRecordsMessage.hasText,
    });
    this.successToast = page.locator(PIM_SELECTORS.successToast);
    this.deleteConfirmButton = page.getByRole(PIM_SELECTORS.deleteConfirmButton.role, {
      name: PIM_SELECTORS.deleteConfirmButton.name,
    });
    this.tableHeaders = page.locator(PIM_SELECTORS.tableHeaders);
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
    return row.locator(PIM_SELECTORS.editIcon).first();
  }

  async getDeleteButtonForRow(row: Locator): Promise<Locator> {
    return row.locator(PIM_SELECTORS.deleteIcon).first();
  }

  async searchByEmployeeName(name: string): Promise<void> {
    await this.searchInputEmployeeName.fill(name);
    const autocompleteOption = this.page
      .locator(PIM_SELECTORS.autocompleteOption)
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
