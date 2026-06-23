import { test, expect } from "../fixtures/auth.fixture";
import { PimPage } from "../pages/PimPage";
import { AddEmployeePage } from "../pages/AddEmployeePage";
import { EmployeeDetailPage } from "../pages/EmployeeDetailPage";

const uniqueId = Date.now();

test.describe("PIM - Add Employee", () => {
  test("should add a new employee with first and last name", async ({
    authenticatedPage,
  }) => {
    const pimPage = new PimPage(authenticatedPage);
    const addEmployeePage = new AddEmployeePage(authenticatedPage);

    const firstName = `PimFirst${uniqueId}`;
    const lastName = `PimLast${uniqueId}`;

    await pimPage.navigate();
    await pimPage.clickAdd();

    await addEmployeePage.fillEmployeeForm({ firstName, lastName });
    await addEmployeePage.save();

    await expect(addEmployeePage.successToast).toBeVisible();
    // After save, redirected to personal details page
    await authenticatedPage.waitForURL("**/pim/viewPersonalDetails/**");
  });

  test("should show validation error when first name is empty", async ({
    authenticatedPage,
  }) => {
    const pimPage = new PimPage(authenticatedPage);
    const addEmployeePage = new AddEmployeePage(authenticatedPage);

    await pimPage.navigate();
    await pimPage.clickAdd();

    // Fill only last name, leave first name empty
    await addEmployeePage.fillEmployeeForm({
      firstName: "",
      lastName: "OnlyLast",
    });
    await addEmployeePage.save();

    await expect(addEmployeePage.validationErrors.first()).toBeVisible();
    await expect(
      addEmployeePage.validationErrors.first()
    ).toContainText("Required");
  });

  test("should show validation error when last name is empty", async ({
    authenticatedPage,
  }) => {
    const pimPage = new PimPage(authenticatedPage);
    const addEmployeePage = new AddEmployeePage(authenticatedPage);

    await pimPage.navigate();
    await pimPage.clickAdd();

    await addEmployeePage.firstNameInput.fill("OnlyFirst");
    // Leave last name empty and save
    await addEmployeePage.save();

    await expect(addEmployeePage.validationErrors.first()).toBeVisible();
    await expect(
      addEmployeePage.validationErrors.first()
    ).toContainText("Required");
  });
});

test.describe("PIM - Search Employee", () => {
  let employeeFirstName: string;
  let employeeLastName: string;

  test.beforeAll(async ({ browser }) => {
    // Create an employee to search for
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("/web/index.php/auth/login", {
      waitUntil: "domcontentloaded",
    });
    await page.locator('input[name="username"]').fill("Admin");
    await page.locator('input[name="password"]').fill("admin123");
    await page.locator('button[type="submit"]').click();
    await page.waitForURL("**/dashboard/index");

    employeeFirstName = `SearchFirst${uniqueId}`;
    employeeLastName = `SearchLast${uniqueId}`;

    await page.getByRole("link", { name: "PIM" }).click();
    await page.waitForURL("**/pim/viewEmployeeList");
    await page.getByRole("button", { name: "Add" }).click();
    await page.waitForURL("**/pim/addEmployee");

    await page.getByPlaceholder("First Name").fill(employeeFirstName);
    await page.getByPlaceholder("Last Name").fill(employeeLastName);
    await page.getByRole("button", { name: "Save" }).click();
    await page.locator(".oxd-toast--success").waitFor({ state: "visible" });

    await context.close();
  });

  test("should find employee by name using search", async ({
    authenticatedPage,
  }) => {
    const pimPage = new PimPage(authenticatedPage);

    await pimPage.navigate();
    await pimPage.searchByEmployeeName(employeeFirstName);

    const matchingRow = pimPage.getRowByText(employeeFirstName);
    await expect(matchingRow.first()).toBeVisible();
  });

  test("should show no records for non-existent employee", async ({
    authenticatedPage,
  }) => {
    const pimPage = new PimPage(authenticatedPage);

    await pimPage.navigate();
    await pimPage.searchByEmployeeNameNoAutocomplete(
      `NonExistent${Date.now()}`
    );

    // Either "No Records Found" or toast indicating invalid value
    const noRecords = authenticatedPage.locator("span", {
      hasText: "No Records Found",
    });
    const invalidToast = authenticatedPage.locator(".oxd-toast--warn, .oxd-toast--error");
    await expect(noRecords.or(invalidToast).first()).toBeVisible();
  });
});

test.describe("PIM - Edit Employee", () => {
  let editFirstName: string;
  let editLastName: string;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("/web/index.php/auth/login", {
      waitUntil: "domcontentloaded",
    });
    await page.locator('input[name="username"]').fill("Admin");
    await page.locator('input[name="password"]').fill("admin123");
    await page.locator('button[type="submit"]').click();
    await page.waitForURL("**/dashboard/index");

    editFirstName = `EditFirst${uniqueId}`;
    editLastName = `EditLast${uniqueId}`;

    await page.getByRole("link", { name: "PIM" }).click();
    await page.waitForURL("**/pim/viewEmployeeList");
    await page.getByRole("button", { name: "Add" }).click();
    await page.waitForURL("**/pim/addEmployee");

    await page.getByPlaceholder("First Name").fill(editFirstName);
    await page.getByPlaceholder("Last Name").fill(editLastName);
    await page.getByRole("button", { name: "Save" }).click();
    await page.locator(".oxd-toast--success").waitFor({ state: "visible" });

    await context.close();
  });

  test("should edit employee last name and verify update", async ({
    authenticatedPage,
  }) => {
    const pimPage = new PimPage(authenticatedPage);
    const detailPage = new EmployeeDetailPage(authenticatedPage);

    await pimPage.navigate();
    await pimPage.searchByEmployeeName(editFirstName);

    const row = pimPage.getRowByText(editFirstName);
    await expect(row.first()).toBeVisible();
    await pimPage.editEmployee(row.first());

    await expect(detailPage.personalDetailsHeader).toBeVisible();

    const updatedLastName = `Updated${uniqueId}`;
    await detailPage.updateLastName(updatedLastName);
    await expect(detailPage.successToast).toBeVisible();

    // Verify the updated value persists
    await expect(detailPage.lastNameInput).toHaveValue(updatedLastName);
  });
});

test.describe("PIM - Delete Employee", () => {
  let deleteFirstName: string;
  let deleteLastName: string;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("/web/index.php/auth/login", {
      waitUntil: "domcontentloaded",
    });
    await page.locator('input[name="username"]').fill("Admin");
    await page.locator('input[name="password"]').fill("admin123");
    await page.locator('button[type="submit"]').click();
    await page.waitForURL("**/dashboard/index");

    deleteFirstName = `DeleteFirst${uniqueId}`;
    deleteLastName = `DeleteLast${uniqueId}`;

    await page.getByRole("link", { name: "PIM" }).click();
    await page.waitForURL("**/pim/viewEmployeeList");
    await page.getByRole("button", { name: "Add" }).click();
    await page.waitForURL("**/pim/addEmployee");

    await page.getByPlaceholder("First Name").fill(deleteFirstName);
    await page.getByPlaceholder("Last Name").fill(deleteLastName);
    await page.getByRole("button", { name: "Save" }).click();
    await page.locator(".oxd-toast--success").waitFor({ state: "visible" });

    await context.close();
  });

  test("should delete an employee and verify removal", async ({
    authenticatedPage,
  }) => {
    const pimPage = new PimPage(authenticatedPage);

    await pimPage.navigate();
    await pimPage.searchByEmployeeName(deleteFirstName);

    const row = pimPage.getRowByText(deleteFirstName);
    await expect(row.first()).toBeVisible();

    await pimPage.deleteEmployee(row.first());
    await expect(pimPage.successToast).toBeVisible();

    // Verify employee no longer appears in search
    await pimPage.navigate();
    await pimPage.searchByEmployeeNameNoAutocomplete(deleteFirstName);

    const noRecords = authenticatedPage.locator("span", {
      hasText: "No Records Found",
    });
    const invalidToast = authenticatedPage.locator(".oxd-toast--warn, .oxd-toast--error");
    await expect(noRecords.or(invalidToast).first()).toBeVisible();
  });
});

test.describe("PIM - Employee List", () => {
  test("should display employee list table with expected columns", async ({
    authenticatedPage,
  }) => {
    const pimPage = new PimPage(authenticatedPage);

    await pimPage.navigate();

    // Verify table headers are visible
    await expect(pimPage.tableHeaders.first()).toBeVisible();

    // PIM list should show standard columns
    const headerTexts = await pimPage.tableHeaders.allTextContents();
    const headerString = headerTexts.join(" ");
    expect(headerString).toContain("Id");
    expect(headerString).toContain("First");
    expect(headerString).toContain("Last");
  });

  test("should show records count on employee list", async ({
    authenticatedPage,
  }) => {
    const pimPage = new PimPage(authenticatedPage);

    await pimPage.navigate();

    // The records count text should be visible (e.g., "(50) Records Found")
    await expect(pimPage.recordsFoundText.first()).toBeVisible();
    const text = await pimPage.recordsFoundText.first().textContent();
    expect(text).toMatch(/Record/i);
  });

  test("should navigate to add employee page and back", async ({
    authenticatedPage,
  }) => {
    const pimPage = new PimPage(authenticatedPage);
    const addEmployeePage = new AddEmployeePage(authenticatedPage);

    await pimPage.navigate();
    await pimPage.clickAdd();

    // Verify we're on the add page
    await expect(addEmployeePage.firstNameInput).toBeVisible();
    await expect(addEmployeePage.lastNameInput).toBeVisible();

    // Cancel and return to list
    await addEmployeePage.cancel();
    await authenticatedPage.waitForURL("**/pim/viewEmployeeList");
  });
});
