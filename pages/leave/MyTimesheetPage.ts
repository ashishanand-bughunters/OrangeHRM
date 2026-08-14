import { Page, Locator } from "@playwright/test";
import selectors from "../../selectors/leave.json";
import { resolve } from "../utils/selectorHelper";

export class MyTimesheetPage {
  readonly container: Locator;
  readonly submitButton: Locator;
  readonly createTimesheetButton: Locator;
  readonly editButton: Locator;
  readonly statusFooter: Locator;

  constructor(private readonly page: Page) {
    this.container = page.locator(selectors.myTimesheetContainer);
    this.submitButton = resolve(page, selectors.timesheetSubmitButton);
    this.createTimesheetButton = resolve(page, selectors.timesheetCreateButton);
    this.editButton = resolve(page, selectors.timesheetEditButton);
    this.statusFooter = page.locator(selectors.timesheetStatusFooter);
  }

  async navigate(): Promise<void> {
    await this.page.goto("/web/index.php/time/viewMyTimesheets", {
      waitUntil: "domcontentloaded",
    });
    await this.container.waitFor({ state: "visible" });
  }

  async ensureEditMode(): Promise<void> {
    if (await this.createTimesheetButton.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await this.createTimesheetButton.click();
      await this.container.waitFor({ state: "visible" });
    } else if (await this.editButton.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await this.editButton.click();
    }
  }

  async clickAddRow(): Promise<void> {
    const addRowCell = this.page.locator(selectors.timesheetAddRowCell);
    await addRowCell.waitFor({ state: "visible" });
    await addRowCell.getByRole("button").click();
  }

  getRow(index: number): Locator {
    return this.page.locator(selectors.timesheetDataRow).nth(index);
  }

  async fillProject(row: Locator, searchPrefix: string): Promise<void> {
    const projectInput = row.locator(selectors.timesheetProjectInput);
    await projectInput.fill(searchPrefix);
    const option = this.page.locator(selectors.timesheetAutocompleteOption).first();
    await option.waitFor({ state: "visible", timeout: 10_000 });
    await option.click();
  }

  async fillActivity(row: Locator): Promise<void> {
    const activityWrapper = row.locator(selectors.timesheetActivityWrapper);
    await activityWrapper.click();
    const option = this.page.locator(selectors.timesheetActivityOption).first();
    await option.waitFor({ state: "visible", timeout: 10_000 });
    await option.click();
  }

  async fillHour(row: Locator, dayIndex: number, value: string): Promise<void> {
    const hourInput = row.locator(selectors.timesheetHourInput).nth(dayIndex);
    await hourInput.fill(value);
    await hourInput.press("Tab");
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
