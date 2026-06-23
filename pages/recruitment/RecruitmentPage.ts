import { Page, Locator } from "@playwright/test";
import { RECRUITMENT_SELECTORS } from "../../selectors/recruitment/RecruitmentPage.selectors";

export class RecruitmentPage {
  private readonly recruitmentLink: Locator;
  private readonly addButton: Locator;
  private readonly candidateTableRows: Locator;

  constructor(private readonly page: Page) {
    this.recruitmentLink = page.getByRole(RECRUITMENT_SELECTORS.recruitmentLink.role, { name: RECRUITMENT_SELECTORS.recruitmentLink.name });
    this.addButton = page.getByRole(RECRUITMENT_SELECTORS.addButton.role, { name: RECRUITMENT_SELECTORS.addButton.name });
    this.candidateTableRows = page.locator(RECRUITMENT_SELECTORS.candidateTableRows);
  }

  async navigate(): Promise<void> {
    await this.recruitmentLink.click();
    await this.page.waitForURL("**/recruitment/viewCandidates");
  }

  async clickAdd(): Promise<void> {
    await this.addButton.click();
    await this.page.waitForURL("**/recruitment/addCandidate");
  }

  getRowByName(fullName: string): Locator {
    return this.candidateTableRows.filter({ hasText: fullName });
  }
}
