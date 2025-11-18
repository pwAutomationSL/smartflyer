import { Page } from "@playwright/test";

export class SearchPage {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }
  public readonly SEARCH_INPUT = `//input[@name="search"]`;
  public readonly CLIENT_FILTER_BUTTON = `//span[contains(.,'Clients')]/../../button`;
  public readonly ANNOUNCEMENTS_FILTER_BUTTON = `//span[contains(.,'Announcements')]/../../button`;
  public readonly CLIENTS_FILTER_BUTTON = `//span[contains(.,'Clients')]/../../button`;
  public readonly SEARCH_RESULT_LINKS = `//div[contains(@class,'Layout_content')]//div/a[contains(@href,'https')]`;
  public readonly SEARCH_RESULT_MATCHES = `//div[contains(@class,'Layout_content')]//div/a[contains(@href,'https')]/div/div/div/p/span//mark`;
  public readonly SEARCH_RESULT_MATCHES_A = `//div[contains(@class,'Layout_content')]//div/a[contains(@href,'https://crm.')]//mark`;
  public readonly SEARCH_RESULT_MATCHES_DETAIL = `//div[contains(@class,'Layout_content')]//div/a[contains(@href,'https://crm.')]//p`;
  public readonly SPINNER_LOADER = `//div[contains(@class,'Spinner_load')]`;
  public async clickClientFilter() {
    await this.page.locator(this.CLIENT_FILTER_BUTTON).click();
  }
  public async textToSearch(text: string) {
    await this.page.locator(this.SEARCH_INPUT).clear();
    await this.page.locator(this.SEARCH_INPUT).fill(text);
  }
  public async clickFirstResult() {
    await this.page.locator(this.SEARCH_RESULT_LINKS).first().click();
  }
  public async getResultsCount(): Promise<number> {
    return await this.page.locator(this.SEARCH_RESULT_LINKS).count();
  }
  public async clickAnnouncementsFilter() {
    await this.page.locator(this.ANNOUNCEMENTS_FILTER_BUTTON).click();
  }
  public async clickClientsFilter() {
    await this.page.locator(this.CLIENTS_FILTER_BUTTON).click();
  }
}
export const searchPage = (page: Page) => new SearchPage({ page });
