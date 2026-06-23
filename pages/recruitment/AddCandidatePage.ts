import { Page, Locator } from "@playwright/test";
import { ADD_CANDIDATE_SELECTORS } from "../../selectors/recruitment/AddCandidatePage.selectors";

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
  readonly vacancyDropdown: Locator;
  readonly vacancyOptions: Locator;

  constructor(private readonly page: Page) {
    this.firstNameInput = page.getByPlaceholder(ADD_CANDIDATE_SELECTORS.firstNameInput.placeholder);
    this.middleNameInput = page.getByPlaceholder(ADD_CANDIDATE_SELECTORS.middleNameInput.placeholder);
    this.lastNameInput = page.getByPlaceholder(ADD_CANDIDATE_SELECTORS.lastNameInput.placeholder);
    this.emailInput = page
      .locator(ADD_CANDIDATE_SELECTORS.emailInput.parent)
      .filter({ hasText: ADD_CANDIDATE_SELECTORS.emailInput.filterText })
      .locator(ADD_CANDIDATE_SELECTORS.emailInput.child)
      .first();
    this.contactNumberInput = page
      .locator(ADD_CANDIDATE_SELECTORS.contactNumberInput.parent)
      .filter({ hasText: ADD_CANDIDATE_SELECTORS.contactNumberInput.filterText })
      .locator(ADD_CANDIDATE_SELECTORS.contactNumberInput.child);
    this.notesInput = page.locator(ADD_CANDIDATE_SELECTORS.notesInput);
    this.saveButton = page.getByRole(ADD_CANDIDATE_SELECTORS.saveButton.role, { name: ADD_CANDIDATE_SELECTORS.saveButton.name });
    this.cancelButton = page.getByRole(ADD_CANDIDATE_SELECTORS.cancelButton.role, { name: ADD_CANDIDATE_SELECTORS.cancelButton.name });
    this.successToast = page.locator(ADD_CANDIDATE_SELECTORS.successToast);
    this.errorToast = page.locator(ADD_CANDIDATE_SELECTORS.errorToast);
    this.validationErrors = page.locator(ADD_CANDIDATE_SELECTORS.validationErrors);
    this.vacancyDropdown = page
      .locator(ADD_CANDIDATE_SELECTORS.vacancyDropdown.parent)
      .filter({ hasText: ADD_CANDIDATE_SELECTORS.vacancyDropdown.filterText })
      .locator(ADD_CANDIDATE_SELECTORS.vacancyDropdown.child);
    this.vacancyOptions = page.locator(ADD_CANDIDATE_SELECTORS.vacancyOptions);
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
    await this.vacancyDropdown.click();
    await this.page
      .locator(ADD_CANDIDATE_SELECTORS.vacancyOptions)
      .filter({ hasText: vacancyName })
      .click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  async selectFirstVacancy(): Promise<void> {
    await this.vacancyDropdown.click();
    await this.vacancyOptions.first().click();
  }

  get emailError(): Locator {
    return this.page
      .locator(ADD_CANDIDATE_SELECTORS.emailError.parent)
      .filter({ hasText: ADD_CANDIDATE_SELECTORS.emailError.filterText })
      .locator(ADD_CANDIDATE_SELECTORS.emailError.child);
  }
}
