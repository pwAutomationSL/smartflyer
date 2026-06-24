import { Page } from '@playwright/test';

export class SideBar {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }
  public readonly MODULE_BY_TEXT = (module: string) =>
    `//div[contains(@class,"body-sidebar")]//a[contains(.,'${module}')]`;
  public readonly MODULE_BY_TEXT_APP = (module: string) =>
    `//ul//*[self::a or self::button][.//p[normalize-space(.)="${module}"] or normalize-space(.)="${module}"]`;
  public readonly CONTENT_MENU = `//*//p[contains(.,'Content')]`;
  public readonly CONTENT_SOCIETY_MENU = `//*//p[contains(.,'-society crm')]`;
  public readonly SEARCH_APP = `//a[@href="/search/" or .//p[normalize-space(.)="Search"]]`;
  public readonly CONTENT_SOCIETY_SUBMENU = (submenu: string) =>
    `//a[normalize-space(.)='${submenu}']`;
  public async goToModule(module: string) {
    try {
      await this.clickFirstAvailable([
        this.page.locator(this.MODULE_BY_TEXT_APP(module)).first(),
        this.page.locator(this.MODULE_BY_TEXT(module)).first(),
      ]);
    } catch (error) {
      if (module === 'Clients') {
        await this.page.goto('/clients/');
      } else {
        throw error;
      }
    }
    await this.page.waitForLoadState('networkidle');
  }
  public async goToModuleAPP(module: string) {
    await this.clickFirstAvailable([
      this.page.locator(this.MODULE_BY_TEXT_APP(module)).first(),
      this.page.locator(this.MODULE_BY_TEXT(module)).first(),
    ]);
    await this.page.waitForLoadState('networkidle');
  }
  public async goToSearchApp() {
    await this.clickFirstAvailable([
      this.page.locator(this.SEARCH_APP).first(),
      this.page.locator(this.MODULE_BY_TEXT_APP('Search')).first(),
      this.page.locator(this.MODULE_BY_TEXT('Search')).first(),
    ]);
  }
  public async openContentCRM(submenu: string) {
    await this.openContentMenu();
    await this.page.locator(this.CONTENT_SOCIETY_SUBMENU(submenu)).first().click();
  }
  public async openContentCRMFromApp(submenu: string) {
    await this.openContentMenu();
    await this.page.locator(this.CONTENT_SOCIETY_SUBMENU(submenu)).first().click();
  }
  private async openContentMenu() {
    await this.clickFirstAvailable([
      this.page.getByRole('button', { name: 'Content' }),
      this.page.getByRole('link', { name: 'Content' }),
    ]);
    await this.clickFirstAvailable([
      this.page.getByRole('button', { name: /Society CRM/i }),
      this.page.getByRole('link', { name: /Society CRM/i }),
    ]);
  }
  private async clickFirstAvailable(locators: Array<ReturnType<Page['locator']>>) {
    for (const locator of locators) {
      try {
        await locator.waitFor({ state: 'visible', timeout: 15000 });
        await locator.click();
        return;
      } catch {
        // Try the next layout variant.
      }
    }
    await locators[0].click();
  }
}
export const sidebar = (page: Page) => new SideBar({ page });
