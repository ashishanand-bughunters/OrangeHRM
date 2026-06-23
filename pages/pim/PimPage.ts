import { Page, Locator } from "@playwright/test";
import selectors from "../../selectors/pim.json";
import { resolve } from "../utils/selectorHelper";

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
    this.pimLink = resolve(page, selectors.pimLink);
    this.addButton = resolve(page, selectors.addButton);
    this.employeeTableRows = page.locator(selectors.employeeTableRows);
    this.searchInputEmployeeName = page
      .locator(selectors.searchInputEmployeeName_parent)
      .filter({ hasText: selectors.searchInputEmployeeName_filterText })
      .locator(selectors.searchInputEmployeeName_child)
      .first();
    this.searchButton = resolve(page, selectors.searchButton);
    this.resetButton = resolve(page, selectors.resetButton);
    this.recordsFoundText = page.locator(selectors.recordsFoundText);
    this.noRecordsMessage = page.locator(selectors.noRecordsMessage, {
      hasText: selectors.noRecordsMessage_hasText,
    });
    this.successToast = page.locator(selectors.successToast);
    this.deleteConfirmButton = resolve(page, selectors.deleteConfirmButton);
    this.tableHeaders = page.locator(selectors.tableHeaders);
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
    return row.locator(selectors.editIcon).first();
  }

  async getDeleteButtonForRow(row: Locator): Promise<Locator> {
    return row.locator(selectors.deleteIcon).first();
  }

  async searchByEmployeeName(name: string): Promise<void> {
    await this.searchInputEmployeeName.fill(name);
    const autocompleteOption = this.page
      .locator(selectors.autocompleteOption)
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
