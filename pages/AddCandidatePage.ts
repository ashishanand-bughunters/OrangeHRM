import { Page, Locator } from "@playwright/test";

export interface CandidateFormData {
  firstName: string;
  lastName: string;
  email: string;
  middleName?: string;
  contactNumber?: string;
  notes?: string;
}

export class AddCandidatePage {
  readonly firstNameInput: Locator;
  readonly middleNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly contactNumberInput: Locator;
  readonly notesInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly successToast: Locator;
  readonly errorToast: Locator;
  readonly validationErrors: Locator;
  readonly vacancySelect: Locator;

  constructor(private readonly page: Page) {
    this.firstNameInput = page.getByPlaceholder("First Name");
    this.middleNameInput = page.getByPlaceholder("Middle Name");
    this.lastNameInput = page.getByPlaceholder("Last Name");
    this.emailInput = page.locator(".oxd-form-row").filter({ hasText: "Email" }).locator("input").first();
    this.contactNumberInput = page.locator(".oxd-form-row").filter({ hasText: "Contact Number" }).locator("input");
    this.notesInput = page.locator("textarea.oxd-textarea");
    this.saveButton = page.getByRole("button", { name: "Save" });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
    this.successToast = page.locator(".oxd-toast--success");
    this.errorToast = page.locator(".oxd-toast--error");
    this.validationErrors = page.locator(".oxd-input-field-error-message");
    this.vacancySelect = page.locator(".oxd-form-row").filter({ hasText: "Vacancy" }).locator(".oxd-select-wrapper");
  }

  async fillCandidateForm(data: CandidateFormData): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    if (data.middleName) {
      await this.middleNameInput.fill(data.middleName);
    }
    await this.lastNameInput.fill(data.lastName);
    await this.emailInput.fill(data.email);
    if (data.contactNumber) {
      await this.contactNumberInput.fill(data.contactNumber);
    }
    if (data.notes) {
      await this.notesInput.fill(data.notes);
    }
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async selectVacancy(vacancyName: string): Promise<void> {
    await this.vacancySelect.click();
    await this.page
      .locator(".oxd-select-dropdown .oxd-select-option")
      .filter({ hasText: vacancyName })
      .click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }
}
