import { test, expect } from "../../fixtures/auth.fixture";
import { RecruitmentPage } from "../../pages/recruitment/RecruitmentPage";
import { AddCandidatePage } from "../../pages/recruitment/AddCandidatePage";

test.describe("Recruitment - Add Candidate", () => {
  test("should add a new candidate successfully", async ({ authenticatedPage }) => {
    const recruitmentPage = new RecruitmentPage(authenticatedPage);
    const addCandidatePage = new AddCandidatePage(authenticatedPage);

    const uniqueId = Date.now();
    const candidateData = {
      firstName: `TestFirst${uniqueId}`,
      lastName: `TestLast${uniqueId}`,
      email: `test${uniqueId}@example.com`,
    };

    await recruitmentPage.navigate();
    await recruitmentPage.clickAdd();

    await addCandidatePage.fillCandidateForm(candidateData);
    await addCandidatePage.save();

    await expect(addCandidatePage.successToast).toBeVisible();
  });

  test("should show candidate in recruitment list after adding", async ({ authenticatedPage }) => {
    const recruitmentPage = new RecruitmentPage(authenticatedPage);
    const addCandidatePage = new AddCandidatePage(authenticatedPage);

    const uniqueId = Date.now();
    const firstName = `ListFirst${uniqueId}`;
    const lastName = `ListLast${uniqueId}`;
    const fullName = `${firstName}  ${lastName}`;

    await recruitmentPage.navigate();
    await recruitmentPage.clickAdd();

    await addCandidatePage.fillCandidateForm({
      firstName,
      lastName,
      email: `list${uniqueId}@example.com`,
    });
    await addCandidatePage.save();
    await expect(addCandidatePage.successToast).toBeVisible();

    await recruitmentPage.navigate();
    await expect(recruitmentPage.getRowByName(fullName)).toBeVisible();
  });

  test("should show validation error when required fields are empty", async ({ authenticatedPage }) => {
    const recruitmentPage = new RecruitmentPage(authenticatedPage);
    const addCandidatePage = new AddCandidatePage(authenticatedPage);

    await recruitmentPage.navigate();
    await recruitmentPage.clickAdd();

    // Click save without filling any fields
    await addCandidatePage.save();

    await expect(addCandidatePage.validationErrors.first()).toBeVisible();
    await expect(addCandidatePage.validationErrors.first()).toContainText("Required");
  });
});

test.describe("Recruitment - Duplicate Candidate Validation", () => {
  test("should prevent adding the same candidate twice for the same vacancy", async ({ authenticatedPage }) => {
    const recruitmentPage = new RecruitmentPage(authenticatedPage);
    const addCandidatePage = new AddCandidatePage(authenticatedPage);

    const uniqueId = Date.now();
    const firstName = `DupFirst${uniqueId}`;
    const lastName = `DupLast${uniqueId}`;
    const email = `dup${uniqueId}@example.com`;

    // First submission: navigate to recruitment, add candidate with vacancy
    await recruitmentPage.navigate();
    await recruitmentPage.clickAdd();

    await addCandidatePage.fillCandidateForm({ firstName, lastName, email });

    // Select the first available vacancy from the dropdown
    await addCandidatePage.vacancyDropdown.click();
    const firstOption = authenticatedPage
      .locator(".oxd-select-dropdown .oxd-select-option")
      .first();
    await firstOption.waitFor({ state: "visible" });
    const vacancyName = await firstOption.textContent();
    await firstOption.click();

    await addCandidatePage.save();
    await expect(addCandidatePage.successToast).toBeVisible();

    // Second submission: same email and same vacancy
    await recruitmentPage.navigate();
    await recruitmentPage.clickAdd();

    await addCandidatePage.fillCandidateForm({ firstName, lastName, email });
    await addCandidatePage.selectVacancy(vacancyName!.trim());

    await addCandidatePage.save();

    // Duplicate should be rejected with error toast
    await expect(addCandidatePage.errorToast).toBeVisible();
    await expect(addCandidatePage.successToast).not.toBeVisible();
  });
});
