import { test, expect } from "../fixtures/auth.fixture";
import { RecruitmentPage } from "../pages/RecruitmentPage";
import { AddCandidatePage } from "../pages/AddCandidatePage";

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
