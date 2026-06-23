import { Page, Locator } from "@playwright/test";
import { EMPLOYEE_DETAIL_SELECTORS } from "../../selectors/pim/EmployeeDetailPage.selectors";

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
    this.firstNameInput = page.getByPlaceholder(EMPLOYEE_DETAIL_SELECTORS.firstNameInput.placeholder);
    this.middleNameInput = page.getByPlaceholder(EMPLOYEE_DETAIL_SELECTORS.middleNameInput.placeholder);
    this.lastNameInput = page.getByPlaceholder(EMPLOYEE_DETAIL_SELECTORS.lastNameInput.placeholder);
    this.employeeIdInput = page
      .locator(EMPLOYEE_DETAIL_SELECTORS.employeeIdInput.parent)
      .filter({ hasText: EMPLOYEE_DETAIL_SELECTORS.employeeIdInput.filterText })
      .locator(EMPLOYEE_DETAIL_SELECTORS.employeeIdInput.child);
    this.saveButtons = page.getByRole(EMPLOYEE_DETAIL_SELECTORS.saveButtons.role, { name: EMPLOYEE_DETAIL_SELECTORS.saveButtons.name });
    this.successToast = page.locator(EMPLOYEE_DETAIL_SELECTORS.successToast);
    this.errorToast = page.locator(EMPLOYEE_DETAIL_SELECTORS.errorToast);
    this.validationErrors = page.locator(EMPLOYEE_DETAIL_SELECTORS.validationErrors);
    this.personalDetailsHeader = page.locator(EMPLOYEE_DETAIL_SELECTORS.personalDetailsHeader.tag, {
      hasText: EMPLOYEE_DETAIL_SELECTORS.personalDetailsHeader.hasText,
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
