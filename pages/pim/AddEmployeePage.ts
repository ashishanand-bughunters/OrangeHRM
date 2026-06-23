import { Page, Locator } from "@playwright/test";
import { ADD_EMPLOYEE_SELECTORS } from "../../selectors/pim/AddEmployeePage.selectors";

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
    this.firstNameInput = page.getByPlaceholder(ADD_EMPLOYEE_SELECTORS.firstNameInput.placeholder);
    this.middleNameInput = page.getByPlaceholder(ADD_EMPLOYEE_SELECTORS.middleNameInput.placeholder);
    this.lastNameInput = page.getByPlaceholder(ADD_EMPLOYEE_SELECTORS.lastNameInput.placeholder);
    this.employeeIdInput = page
      .locator(ADD_EMPLOYEE_SELECTORS.employeeIdInput.parent)
      .filter({ hasText: ADD_EMPLOYEE_SELECTORS.employeeIdInput.filterText })
      .locator(ADD_EMPLOYEE_SELECTORS.employeeIdInput.child);
    this.saveButton = page.getByRole(ADD_EMPLOYEE_SELECTORS.saveButton.role, { name: ADD_EMPLOYEE_SELECTORS.saveButton.name });
    this.cancelButton = page.getByRole(ADD_EMPLOYEE_SELECTORS.cancelButton.role, { name: ADD_EMPLOYEE_SELECTORS.cancelButton.name });
    this.successToast = page.locator(ADD_EMPLOYEE_SELECTORS.successToast);
    this.errorToast = page.locator(ADD_EMPLOYEE_SELECTORS.errorToast);
    this.validationErrors = page.locator(ADD_EMPLOYEE_SELECTORS.validationErrors);
    this.createLoginToggle = page.locator(ADD_EMPLOYEE_SELECTORS.createLoginToggle);
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
