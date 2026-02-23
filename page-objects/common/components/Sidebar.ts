import { Page } from '@playwright/test';

export class SideBar {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }
  public readonly MODULE_BY_TEXT = (module: string) =>
    `//div[@class="body-sidebar"]//a[contains(.,'${module}')]`;
  public readonly CONTENT_MENU = `//*//p[contains(.,'Content')]`;
  public readonly CONTENT_SOCIETY_MENU = `//*//p[contains(.,'-society crm')]`;
  public readonly SEARCH_APP = `//a[@href="/search/"]`;
  public readonly CONTENT_SOCIETY_SUBMENU = (submenu: string) =>
    `//*//a[contains(.,'${submenu}') and contains(@class,'dropdown')]`;
  public async goToModule(module: string) {
    await this.page.locator(this.MODULE_BY_TEXT(module)).first().click();
    await this.page.waitForTimeout(1000);
  }
  public async goToSearchApp() {
    await this.page.locator(this.SEARCH_APP).click();
  }
  public async openContentCRM(submenu: string) {
    await this.page.waitForTimeout(1500);
    await this.page.getByRole('link', { name: 'Content' }).click({ force: true });
    await this.page.getByRole('link', { name: '- Society CRM' }).waitFor({ state: 'visible' });
    await this.page.getByRole('link', { name: '- Society CRM' }).click();
    await this.page.locator(this.CONTENT_SOCIETY_SUBMENU(submenu)).first().click();
  }
  public async openContentCRMFromApp(submenu: string) {
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('button', { name: 'Content' }).click({ force: true });
    await this.page.getByRole('button', { name: 'Society CRM' }).waitFor({ state: 'visible' });
    await this.page.getByRole('button', { name: 'Society CRM' }).click();
    await this.page.locator(this.CONTENT_SOCIETY_SUBMENU(submenu)).first().click();
  }
}
export const sidebar = (page: Page) => new SideBar({ page });
