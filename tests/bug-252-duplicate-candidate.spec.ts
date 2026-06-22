import { test, expect } from "../fixtures/auth.fixture";
import { RecruitmentPage } from "../pages/RecruitmentPage";
import { AddCandidatePage } from "../pages/AddCandidatePage";

test.describe("Recruitment - Duplicate Candidate Prevention", () => {
  test("should prevent adding a candidate with a duplicate email", async ({ authenticatedPage }) => {
    const recruitmentPage = new RecruitmentPage(authenticatedPage);
    const addCandidatePage = new AddCandidatePage(authenticatedPage);

    const uniqueId = Date.now();
    const sharedEmail = `dup${uniqueId}@example.com`;

    // Step 1: Add the first candidate successfully
    await recruitmentPage.navigate();
    await recruitmentPage.clickAdd();

    await addCandidatePage.fillCandidateForm({
      firstName: `DupFirst${uniqueId}`,
      lastName: `DupLast${uniqueId}`,
      email: sharedEmail,
    });
    await addCandidatePage.selectFirstVacancy();
    await addCandidatePage.save();

    await expect(addCandidatePage.successToast).toBeVisible();

    // Step 2: Attempt to add a second candidate with the same email
    await recruitmentPage.navigate();
    await recruitmentPage.clickAdd();

    await addCandidatePage.fillCandidateForm({
      firstName: `DupSecond${uniqueId}`,
      lastName: `DupLast2${uniqueId}`,
      email: sharedEmail,
    });
    await addCandidatePage.selectFirstVacancy();
    await addCandidatePage.save();

    // Step 3: Expect the duplicate email error
    await expect(addCandidatePage.emailError).toBeVisible();
    await expect(addCandidatePage.emailError).toContainText("Already exists");
  });

  test("should still allow saving a candidate with a unique email after a duplicate attempt", async ({ authenticatedPage }) => {
    const recruitmentPage = new RecruitmentPage(authenticatedPage);
    const addCandidatePage = new AddCandidatePage(authenticatedPage);

    const uniqueId = Date.now();
    const duplicateEmail = `duprecov${uniqueId}@example.com`;

    // Add the first candidate
    await recruitmentPage.navigate();
    await recruitmentPage.clickAdd();

    await addCandidatePage.fillCandidateForm({
      firstName: `RecovFirst${uniqueId}`,
      lastName: `RecovLast${uniqueId}`,
      email: duplicateEmail,
    });
    await addCandidatePage.save();

    await expect(addCandidatePage.successToast).toBeVisible();

    // Attempt duplicate — expect error
    await recruitmentPage.navigate();
    await recruitmentPage.clickAdd();

    await addCandidatePage.fillCandidateForm({
      firstName: `RecovDup${uniqueId}`,
      lastName: `RecovDupLast${uniqueId}`,
      email: duplicateEmail,
    });
    await addCandidatePage.save();

    await expect(addCandidatePage.emailError).toBeVisible();
    await expect(addCandidatePage.emailError).toContainText("Already exists");

    // Fix the email and save successfully
    const freshEmail = `fresh${uniqueId}@example.com`;
    await addCandidatePage.emailInput.clear();
    await addCandidatePage.emailInput.fill(freshEmail);
    await addCandidatePage.save();

    await expect(addCandidatePage.successToast).toBeVisible();
  });
});
