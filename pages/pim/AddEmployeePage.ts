import { Page, Locator } from "@playwright/test";

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
    this.firstNameInput = page.getByPlaceholder("First Name");
    this.middleNameInput = page.getByPlaceholder("Middle Name");
    this.lastNameInput = page.getByPlaceholder("Last Name");
    this.employeeIdInput = page
      .locator(".oxd-form-row")
      .filter({ hasText: "Employee Id" })
      .locator("input");
    this.saveButton = page.getByRole("button", { name: "Save" });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
    this.successToast = page.locator(".oxd-toast--success");
    this.errorToast = page.locator(".oxd-toast--error");
    this.validationErrors = page.locator(".oxd-input-field-error-message");
    this.createLoginToggle = page.locator(".oxd-switch-input");
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
