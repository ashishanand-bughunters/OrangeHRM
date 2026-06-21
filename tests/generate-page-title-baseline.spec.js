/**
 * Page Title Baseline Generator
 * Purpose: Navigate through all accessible pages in OrangeHRM and capture page titles
 * Output: Generates baseline.json with title mappings
 */
const { test } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
const USERNAME = process.env.ADMIN_USERNAME || 'Admin';
const PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Map of page routes and their descriptive names
const PAGES_TO_CAPTURE = {
  'dashboard': '/web/index.php/dashboard/index',
  'admin': '/web/index.php/admin/viewSystemUsers',
  'pim': '/web/index.php/pim/viewEmployeeList',
  'leave': '/web/index.php/leave/viewLeaveList',
  'time': '/web/index.php/time/viewEmployeeTimesheet',
  'recruitment': '/web/index.php/recruitment/viewJobVacancyList',
  'performance': '/web/index.php/performance/searchPerformanceReview',
  'claim': '/web/index.php/claim/viewClaim',
  'directory': '/web/index.php/directory/viewDirectory',
  'maintenance': '/web/index.php/maintenance/viewMaintenance',
};

test.setTimeout(120000);

async function loginAsAdmin(page) {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.fill('input[name="username"]', USERNAME);
  await page.fill('input[name="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard/**', { timeout: 30000 });
}

function extractPageTitle(page) {
  // Try multiple selectors for page title
  const titleSelectors = [
    'h1.oxd-topbar-header-breadcrumb-module',
    'h1',
    '[role="heading"]',
    '.oxd-heading-1',
  ];

  // Fall back to page title if element title not found
  return page.title();
}

test('Generate page title baseline', async ({ page }) => {
  const baseline = {};
  const errors = [];

  await loginAsAdmin(page);
  console.log('✓ Login successful');

  // Navigate to each page and capture title
  for (const [pageName, pageRoute] of Object.entries(PAGES_TO_CAPTURE)) {
    try {
      const fullUrl = new URL(pageRoute, BASE_URL).toString();
      await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 30000 });

      const title = await extractPageTitle(page);
      baseline[pageName] = title;
      console.log(`✓ ${pageName}: "${title}"`);
    } catch (error) {
      errors.push(`✗ ${pageName}: ${error.message}`);
      console.log(`✗ ${pageName}: ${error.message}`);
    }
  }

  // Save baseline to file
  const baselineFilePath = path.join(__dirname, '../baseline.json');
  fs.writeFileSync(baselineFilePath, JSON.stringify(baseline, null, 2));
  console.log(`\n✓ Baseline saved to ${baselineFilePath}`);

  if (errors.length > 0) {
    console.log('\nErrors encountered:');
    errors.forEach(err => console.log(err));
  }

  console.log(`\nBaseline contains ${Object.keys(baseline).length} pages`);
});
