import { Page, Locator } from "@playwright/test";
import selectors from "../../selectors/pim.json";
import { resolve } from "../utils/selectorHelper";

export class EmployeeDetailPage {
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveButtons: Locator;
  readonly successToast: Locator;
  readonly errorToast: Locator;
  readonly validationErrors: Locator;
  readonly personalDetailsHeader: Locator;

  constructor(private readonly page: Page) {
    this.firstNameInput = resolve(page, selectors.firstNameInput);
    this.middleNameInput = resolve(page, selectors.middleNameInput);
    this.lastNameInput = resolve(page, selectors.lastNameInput);
    this.employeeIdInput = page
      .locator(selectors.employeeIdInput_parent)
      .filter({ hasText: selectors.employeeIdInput_filterText })
      .locator(selectors.employeeIdInput_child);
    this.saveButtons = resolve(page, selectors.saveButton);
    this.successToast = page.locator(selectors.successToast);
    this.errorToast = page.locator(selectors.errorToast);
    this.validationErrors = page.locator(selectors.validationErrors);
    this.personalDetailsHeader = page.locator(selectors.personalDetailsHeader, {
      hasText: selectors.personalDetailsHeader_hasText,
    });
  }

  async updateLastName(newLastName: string): Promise<void> {
    await this.lastNameInput.clear();
    await this.lastNameInput.fill(newLastName);
    await this.saveButtons.first().click();
  }

  async getFirstName(): Promise<string> {
    return await this.firstNameInput.inputValue();
  }

  async getLastName(): Promise<string> {
    return await this.lastNameInput.inputValue();
  }

  async getEmployeeId(): Promise<string> {
    return await this.employeeIdInput.inputValue();
  }
}
