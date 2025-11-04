import { Page, expect } from "@playwright/test";

export class SearchPage {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }
  public readonly SEARCH_INPUT = `//input[@name="search"]`;
  public readonly CLIENT_FILTER_BUTTON = `//span[contains(.,'Clients')]/../../button`;
  public readonly SEARCH_RESULT_LINKS = `//div[contains(@class,'Layout_content')]//div/a[contains(@href,'https')]`;
  public readonly SEARCH_RESULT_MATCHES = `//div[contains(@class,'Layout_content')]//div/a[contains(@href,'https')]/div/div/div/p/span//mark`;
  public async clickClientFilter() {
    await this.page.locator(this.CLIENT_FILTER_BUTTON).click();
  }
  public async textToSearch(text: string) {
    await this.page.locator(this.SEARCH_INPUT).fill(text);
  }
  public async clickFirstResult() {
    await this.page.locator(this.SEARCH_RESULT_LINKS).first().click();
  }
  public async getResultsCount(): Promise<number> {
    return await this.page.locator(this.SEARCH_RESULT_LINKS).count();
  }
}
export const searchPage = (page: Page) => new SearchPage({ page });
