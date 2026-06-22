import { Page, Locator } from "@playwright/test";

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
    this.firstNameInput = page.getByPlaceholder("First Name");
    this.middleNameInput = page.getByPlaceholder("Middle Name");
    this.lastNameInput = page.getByPlaceholder("Last Name");
    this.employeeIdInput = page
      .locator(".oxd-form-row")
      .filter({ hasText: "Employee Id" })
      .locator("input");
    this.saveButtons = page.getByRole("button", { name: "Save" });
    this.successToast = page.locator(".oxd-toast--success");
    this.errorToast = page.locator(".oxd-toast--error");
    this.validationErrors = page.locator(".oxd-input-field-error-message");
    this.personalDetailsHeader = page.locator("h6", {
      hasText: "Personal Details",
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
