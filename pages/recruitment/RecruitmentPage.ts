import { Page, Locator } from "@playwright/test";

export class RecruitmentPage {
  private readonly recruitmentLink: Locator;
  private readonly addButton: Locator;
  private readonly candidateTableRows: Locator;

  constructor(private readonly page: Page) {
    this.recruitmentLink = page.getByRole("link", { name: "Recruitment" });
    this.addButton = page.getByRole("button", { name: "Add" });
    this.candidateTableRows = page.locator(".oxd-table-body .oxd-table-row");
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
