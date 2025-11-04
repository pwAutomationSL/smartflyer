import { Page, expect } from "@playwright/test";

export class SideBar {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }
  public readonly MODULE_BY_TEXT = (module: string) =>
    `//div[@class="body-sidebar"]//a[contains(.,'${module}')]`;
  public async goToModule(module: string) {
    await this.page.locator(this.MODULE_BY_TEXT(module)).click();
  }
}
export const sidebar = (page: Page) => new SideBar({ page });
