import { Page, Locator } from "@playwright/test";
import selectors from "../../selectors/recruitment.json";
import { resolve } from "../utils/selectorHelper";

export class RecruitmentPage {
  private readonly recruitmentLink: Locator;
  private readonly addButton: Locator;
  private readonly candidateTableRows: Locator;

  constructor(private readonly page: Page) {
    this.recruitmentLink = resolve(page, selectors.recruitmentLink);
    this.addButton = resolve(page, selectors.addButton);
    this.candidateTableRows = page.locator(selectors.candidateTableRows);
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
