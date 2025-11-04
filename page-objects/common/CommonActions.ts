import { Page, expect } from "@playwright/test";

export class CommonActions {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }
  public readonly TEST = `//button[contains(.,'Accept')]`;

  async accept() {
    await this.page.locator(this.TEST).click();
  }
}
export const commonActions = (page: Page) => new CommonActions({ page });
