/**
 * Page Title Validation Test
 * Purpose: Validate that current page titles match baseline values
 * Fails if: Title differs, page is missing, or title cannot be retrieved
 * Generates: Report of all mismatches
 */
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const BASE_URL = process.env.BASE_URL || 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
const USERNAME = process.env.ADMIN_USERNAME || 'Admin';
const PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

test.setTimeout(120000);

async function loginAsAdmin(page) {
  await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.fill('input[name="username"]', USERNAME);
  await page.fill('input[name="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard/**', { timeout: 30000 });
}

function extractPageTitle(page) {
  return page.title();
}

test('Validate page titles against baseline', async ({ page }) => {
  // Load baseline
  const baselineFilePath = path.join(__dirname, '../baseline.json');

  if (!fs.existsSync(baselineFilePath)) {
    throw new Error(`Baseline file not found at ${baselineFilePath}. Run generate-page-title-baseline test first.`);
  }

  const baseline = JSON.parse(fs.readFileSync(baselineFilePath, 'utf8'));
  console.log(`\n📋 Loaded baseline with ${Object.keys(baseline).length} pages`);

  const report = {
    totalPages: Object.keys(baseline).length,
    passedPages: 0,
    failedPages: [],
    missingPages: [],
  };

  await loginAsAdmin(page);
  console.log('✓ Login successful\n');

  // Validate each page in baseline
  for (const [pageName, expectedTitle] of Object.entries(baseline)) {
    try {
      // Route pattern - find the corresponding URL from page name
      let pageRoute;
      const routeMap = {
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

      pageRoute = routeMap[pageName];
      if (!pageRoute) {
        report.missingPages.push(pageName);
        console.log(`✗ ${pageName}: Route not found`);
        continue;
      }

      const fullUrl = new URL(pageRoute, BASE_URL).toString();
      await page.goto(fullUrl, { waitUntil: 'networkidle', timeout: 30000 });

      const currentTitle = await extractPageTitle(page);

      if (currentTitle === expectedTitle) {
        report.passedPages++;
        console.log(`✓ ${pageName}: "${currentTitle}"`);
      } else {
        report.failedPages.push({
          pageName,
          expectedTitle,
          actualTitle: currentTitle,
        });
        console.log(`✗ ${pageName}:`);
        console.log(`  Expected: "${expectedTitle}"`);
        console.log(`  Actual:   "${currentTitle}"`);
      }
    } catch (error) {
      report.failedPages.push({
        pageName,
        expectedTitle,
        actualTitle: null,
        error: error.message,
      });
      console.log(`✗ ${pageName}: Failed to retrieve - ${error.message}`);
    }
  }

  // Generate report
  console.log('\n' + '='.repeat(60));
  console.log('📊 PAGE TITLE VALIDATION REPORT');
  console.log('='.repeat(60));
  console.log(`Total pages: ${report.totalPages}`);
  console.log(`Passed: ${report.passedPages}`);
  console.log(`Failed: ${report.failedPages.length}`);
  console.log(`Missing: ${report.missingPages.length}`);

  if (report.failedPages.length > 0) {
    console.log('\n❌ TITLE MISMATCHES:');
    report.failedPages.forEach(({ pageName, expectedTitle, actualTitle, error }) => {
      console.log(`\n  ${pageName}:`);
      if (error) {
        console.log(`    Error: ${error}`);
      } else {
        console.log(`    Expected: "${expectedTitle}"`);
        console.log(`    Actual:   "${actualTitle}"`);
      }
    });
  }

  if (report.missingPages.length > 0) {
    console.log('\n⚠️  MISSING PAGES:');
    report.missingPages.forEach(page => console.log(`  - ${page}`));
  }

  // Save report to file
  const reportFilePath = path.join(__dirname, '../title-validation-report.json');
  fs.writeFileSync(reportFilePath, JSON.stringify(report, null, 2));
  console.log(`\n📝 Report saved to ${reportFilePath}`);

  // Fail test if any titles don't match
  expect(report.failedPages.length).toBe(0, `${report.failedPages.length} page title(s) do not match baseline`);
});
