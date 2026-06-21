import { Page, Locator } from "@playwright/test";

/** Navigation modules in the OrangeHRM sidebar */
export const MODULES = [
  { name: "Admin", path: "/web/index.php/admin/viewSystemUsers" },
  { name: "PIM", path: "/web/index.php/pim/viewEmployeeList" },
  { name: "Leave", path: "/web/index.php/leave/viewLeaveList" },
  { name: "Time", path: "/web/index.php/time/viewEmployeeTimesheet" },
  { name: "Recruitment", path: "/web/index.php/recruitment/viewCandidates" },
  { name: "My Info", path: "/web/index.php/pim/viewPersonalDetails/empNumber/7" },
  { name: "Performance", path: "/web/index.php/performance/searchEvaluatePerformanceReview" },
  { name: "Dashboard", path: "/web/index.php/dashboard/index" },
  { name: "Directory", path: "/web/index.php/directory/viewDirectory" },
] as const;

export type ModuleName = (typeof MODULES)[number]["name"];

export interface TitleBaseline {
  [moduleName: string]: string;
}

export class PageTitleCapture {
  private readonly moduleTitle: Locator;
  private readonly breadcrumbLevel: Locator;

  constructor(private readonly page: Page) {
    this.moduleTitle = page.locator(".oxd-topbar-header-breadcrumb-module");
    this.breadcrumbLevel = page.locator(".oxd-topbar-header-breadcrumb-level");
  }

  /** Navigate to a module via its direct URL path */
  async navigateToModule(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.moduleTitle.waitFor({ state: "visible", timeout: 15_000 });
  }

  /** Get the module title text from the top breadcrumb */
  async getModuleTitle(): Promise<string> {
    const text = await this.moduleTitle.textContent();
    return (text ?? "").trim();
  }

  /** Get the sub-page breadcrumb level text (if present) */
  async getBreadcrumbLevel(): Promise<string> {
    const count = await this.breadcrumbLevel.count();
    if (count === 0) return "";
    const text = await this.breadcrumbLevel.first().textContent();
    return (text ?? "").trim();
  }

  /** Get the full header: module title + breadcrumb level (if present) */
  async getFullHeader(): Promise<string> {
    const module = await this.getModuleTitle();
    const level = await this.getBreadcrumbLevel();
    return level ? `${module} / ${level}` : module;
  }

  /** Capture titles for all modules and return as a baseline map */
  async captureAllModuleTitles(): Promise<TitleBaseline> {
    const baseline: TitleBaseline = {};
    for (const mod of MODULES) {
      await this.navigateToModule(mod.path);
      baseline[mod.name] = await this.getModuleTitle();
    }
    return baseline;
  }
}
