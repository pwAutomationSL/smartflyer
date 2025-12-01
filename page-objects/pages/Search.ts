import { Page } from "@playwright/test";

export class SearchPage {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }
  public readonly SEARCH_INPUT = `//input[@name="search"]`;
  public readonly CLIENT_FILTER_BUTTON = `//span[contains(.,'Clients')]/../../button`;
  public readonly ANNOUNCEMENTS_FILTER_BUTTON = `//span[contains(.,'Announcements')]/../../button`;
  public readonly GALLERY_FILTER_BUTTON = `//span[contains(.,'Gallery')]/../../button`;
  public readonly TOOLKIT_FILTER_BUTTON = `//span[contains(.,'Toolkits')]/../../button`;
  public readonly FAQ_FILTER_BUTTON = `//span[contains(.,'FAQs')]/../../button`;
  public readonly CLIENTS_FILTER_BUTTON = `//span[contains(.,'Clients')]/../../button`;
  public readonly PARTNERS_FILTER_BUTTON = `//span[contains(.,'Partners')]/../../button`;
  public readonly DIRECTORY_FILTER_BUTTON = `//span[contains(.,'Directory')]/../../button`;
  public readonly PARTNERS_BRAND_FILTER_CHECKBOX = `//span[contains(.,'Brand')]/../../label/input`;
  public readonly SEARCH_RESULT_LINKS = `//div[contains(@class,'Layout_content')]//div/a[contains(@href,'https')]`;
  public readonly SEARCH_RESULT_MATCHES = `//div[contains(@class,'Layout_content')]//div/a[contains(@href,'https')]/div/div/div/p/span//mark`;
  public readonly SEARCH_RESULT_MATCHES_A = `//div[contains(@class,'Layout_content')]//div/a[contains(@href,'https://crm.')]//mark`;
  public readonly SEARCH_RESULT_IMAGES = `//div[contains(@class,'Layout_content')]//a//img`;
  public readonly SEARCH_RESULT_MATCHES_A_FIRSTONLY = `(//div[contains(@class,'Layout_content')]//div/a[contains(@href,'https://crm.')]//span)[1]`;
  public readonly SEARCH_RESULT_MATCHES_DIRECTORY_FIRSTONLY = `(//div[contains(@class,'Layout_content')]//div//div/p/span)[1]`;
  public readonly HEADER = `//h1`;
  public readonly SUBHEADER = `//div[contains(@class,'toolkit')]//h4`;
  public readonly SEARCH_RESULT_MATCHES_DETAIL = `//div[contains(@class,'Layout_content')]//div/a[contains(@href,'https://crm.')]//p`;
  public readonly SPINNER_LOADER = `//div[contains(@class,'Spinner_load')]`;
  public async clickClientFilter() {
    await this.page.locator(this.CLIENT_FILTER_BUTTON).click();
  }
  public async textToSearch(text: string) {
    await this.page.locator(this.SEARCH_INPUT).clear();
    await this.page.locator(this.SEARCH_INPUT).fill(text);
    await this.page.waitForTimeout(1000);
  }
  public async clickFirstImage() {
    await this.page.locator(this.SEARCH_RESULT_IMAGES).first().click();
  }
  public async clickFirstResult() {
    await this.page.locator(this.SEARCH_RESULT_LINKS).first().click();
  }
  public async getResultsCount(): Promise<number> {
    return await this.page.locator(this.SEARCH_RESULT_LINKS).count();
  }
  public async clickPartnerFilter() {
    await this.page.locator(this.PARTNERS_FILTER_BUTTON).click();
  }
  public async checkPartnerBrandFilter() {
    await this.page.locator("label").filter({ hasText: "Brand" }).check();
  }
  public async checkPartnerHotelFilter() {
    await this.page.locator("label").filter({ hasText: "Hotel" }).check();
  }
  public async checkPartnerOnsiteFilter() {
    await this.page.locator("label").filter({ hasText: "Onsite" }).check();
  }
  public async clickAnnouncementsFilter() {
    await this.page.locator(this.ANNOUNCEMENTS_FILTER_BUTTON).click();
  }
  public async clickGalleryFilter() {
    await this.page.locator(this.GALLERY_FILTER_BUTTON).click();
  }
  public async clickDirectoriesFilter(subMenu: string) {
    await this.page.waitForTimeout(1000);
    await this.page
      .getByRole("button", { name: "Directory" })
      .click({ force: true });
    await this.page.locator("label").filter({ hasText: subMenu }).check();
  }
  public async clickToolkitFilter() {
    await this.page.locator(this.TOOLKIT_FILTER_BUTTON).click();
  }
  public async clickFaqFilter() {
    await this.page.locator(this.FAQ_FILTER_BUTTON).click();
  }
  public async clickFirstToolkit() {
    await this.page.locator(this.SEARCH_RESULT_MATCHES_A).first().click();
  }
  public async getFirstName() {
    const name = await this.page
      .locator(this.SEARCH_RESULT_MATCHES_A_FIRSTONLY)
      .textContent();
    return name ? name : "not found";
  }
  public async clickClientsFilter() {
    await this.page.locator(this.CLIENTS_FILTER_BUTTON).click();
  }
}
export const searchPage = (page: Page) => new SearchPage({ page });
