import { Page, Locator } from "@playwright/test";
import selectors from "../../selectors/recruitment.json";
import { resolve } from "../utils/selectorHelper";

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
    this.firstNameInput = resolve(page, selectors.firstNameInput);
    this.middleNameInput = resolve(page, selectors.middleNameInput);
    this.lastNameInput = resolve(page, selectors.lastNameInput);
    this.emailInput = page
      .locator(selectors.emailInput_parent)
      .filter({ hasText: selectors.emailInput_filterText })
      .locator(selectors.emailInput_child)
      .first();
    this.contactNumberInput = page
      .locator(selectors.contactNumberInput_parent)
      .filter({ hasText: selectors.contactNumberInput_filterText })
      .locator(selectors.contactNumberInput_child);
    this.notesInput = page.locator(selectors.notesInput);
    this.saveButton = resolve(page, selectors.saveButton);
    this.cancelButton = resolve(page, selectors.cancelButton);
    this.successToast = page.locator(selectors.successToast);
    this.errorToast = page.locator(selectors.errorToast);
    this.validationErrors = page.locator(selectors.validationErrors);
    this.vacancyDropdown = page
      .locator(selectors.vacancyDropdown_parent)
      .filter({ hasText: selectors.vacancyDropdown_filterText })
      .locator(selectors.vacancyDropdown_child);
    this.vacancyOptions = page.locator(selectors.vacancyOptions);
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
      .locator(selectors.vacancyOptions)
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
      .locator(selectors.emailError_parent)
      .filter({ hasText: selectors.emailError_filterText })
      .locator(selectors.emailError_child);
  }
}
