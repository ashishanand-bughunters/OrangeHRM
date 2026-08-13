import { test, expect } from "../../fixtures/auth.fixture";
import { SystemUsersPage } from "../../pages/admin/SystemUsersPage";

test.describe("System Users - Search", () => {
  let systemUsersPage: SystemUsersPage;
  let createdUsername: string;

  test.beforeEach(async ({ authenticatedPage }) => {
    systemUsersPage = new SystemUsersPage(authenticatedPage);
    createdUsername = `testUser${Date.now()}`;

    // Create a unique system user as precondition
    await systemUsersPage.createUser({
      username: createdUsername,
      password: "Password@123",
      role: "Admin",
      status: "Enabled",
    });
  });

  test("TC-03: should find newly created user via System Users search", async ({
    authenticatedPage,
  }) => {
    // Navigate to System Users list
    await systemUsersPage.navigateToSystemUsers();

    // Search for the created username
    await systemUsersPage.searchByUsername(createdUsername);

    // Assert the created username row is visible in the table
    const matchingRow = systemUsersPage.getRowByText(createdUsername);
    await expect(matchingRow.first()).toBeVisible();
    await expect(matchingRow.first()).toContainText(createdUsername);
  });
});
