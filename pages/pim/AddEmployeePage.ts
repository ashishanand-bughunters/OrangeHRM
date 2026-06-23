import { Page, Locator } from "@playwright/test";
import selectors from "../../selectors/pim.json";
import { resolve } from "../utils/selectorHelper";

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  middleName?: string;
  employeeId?: string;
}

export class AddEmployeePage {
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly successToast: Locator;
  readonly errorToast: Locator;
  readonly validationErrors: Locator;
  readonly createLoginToggle: Locator;

  constructor(private readonly page: Page) {
    this.firstNameInput = resolve(page, selectors.firstNameInput);
    this.middleNameInput = resolve(page, selectors.middleNameInput);
    this.lastNameInput = resolve(page, selectors.lastNameInput);
    this.employeeIdInput = page
      .locator(selectors.employeeIdInput_parent)
      .filter({ hasText: selectors.employeeIdInput_filterText })
      .locator(selectors.employeeIdInput_child);
    this.saveButton = resolve(page, selectors.saveButton);
    this.cancelButton = resolve(page, selectors.cancelButton);
    this.successToast = page.locator(selectors.successToast);
    this.errorToast = page.locator(selectors.errorToast);
    this.validationErrors = page.locator(selectors.validationErrors);
    this.createLoginToggle = page.locator(selectors.createLoginToggle);
  }

  async fillEmployeeForm(data: EmployeeFormData): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    if (data.middleName) {
      await this.middleNameInput.fill(data.middleName);
    }
    await this.lastNameInput.fill(data.lastName);
    if (data.employeeId) {
      await this.employeeIdInput.clear();
      await this.employeeIdInput.fill(data.employeeId);
    }
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
