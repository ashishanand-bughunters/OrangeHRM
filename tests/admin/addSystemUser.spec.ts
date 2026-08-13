import { test, expect } from "../../fixtures/auth.fixture";
import { AdminUsersPage } from "../../pages/admin/AdminUsersPage";

const uniqueId = Date.now();

test.describe("Admin - Add System User", () => {
  test("TC-01 — Create a new enabled system user with valid data", async ({
    authenticatedPage,
  }) => {
    const adminPage = new AdminUsersPage(authenticatedPage);
    const username = `testuser${uniqueId}`;
    const password = "Pass@123";

    // Navigate to Admin > User Management > Users
    await adminPage.navigate();

    // Click + Add
    await adminPage.clickAdd();

    // Select 'Admin' as user role
    await adminPage.selectUserRole("Admin");

    // Type employee name prefix and select from suggestions
    await adminPage.fillEmployeeName("a");

    // Set status to 'Enabled'
    await adminPage.selectStatus("Enabled");

    // Fill username and password
    await adminPage.fillUsername(username);
    await adminPage.fillPassword(password);

    // Save the new user
    await adminPage.save();

    // Verify success: redirected to user list
    await authenticatedPage.waitForURL("**/admin/viewSystemUsers");

    // Verify the new user appears in the list
    const userRow = adminPage.getRowByText(username);
    await expect(userRow.first()).toBeVisible();
  });
});
