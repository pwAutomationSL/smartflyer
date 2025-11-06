import { Page, APIResponse } from "@playwright/test";

export class Partners {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }
  private shareEndpoint = "https://crm.test.smartflyer.com/share_link";
  public readonly HEADER = `//h1`;
  public readonly SHARE_TOPBAR = `//div[contains(@class,'topbar')]//button[contains(.,'Share')]`;
  public readonly CREATE_BUTTON_MODAL = `(//div[contains(@class,'modal')]//button[contains(.,'Create')])[2]`;
  public readonly SEARCH_RESULT_MATCHES = `//div[contains(@class,'Layout_content')]//div/a[contains(@href,'https')]/div/div/div/p/span//mark`;
  public readonly PARTNER_TYPE_SELECT = `//select[@id="form_type"]`;
  public readonly DESTINATION_SELECT = `//select[@id="new_destination_id"]`;
  public readonly PARTNER_PROGRAM_SELECT = `//select[@id="partner_program2"]`;
  public readonly PROPERTY_NAME = `//input[@id="share_title"]`;
  public readonly BRAND_SUBMISSION_FORM_H1 = `//H1`;
  public readonly DESTINATIONS_CHECKBOXES = (destination: string) =>
    `//input[contains(@id,"destination")]/../label[contains(.,'${destination}')]`;
  public readonly REQUIRED_FIELDS_BY_LABEL = (field: string) =>
    `//span[contains(.,'*')]/../../*[contains(.,'${field}')]`;
  public readonly TEXT_BY_LABEL = (label: string) =>
    `//h4[contains(.,'${label}')]/../p`;
  public async clickShare() {
    await this.page.waitForTimeout(1000);
    await this.page.locator(this.SHARE_TOPBAR).isVisible();
    await this.page.locator(this.SHARE_TOPBAR).click({ force: true });
  }
  public async clickCreate() {
    await this.page.locator(this.CREATE_BUTTON_MODAL).click();
  }
  async createAndReturnResponse() {
    const waitForCreate = this.page.waitForResponse(
      (res) =>
        res.ok() &&
        res.request().method() === "POST" &&
        res.url() === this.shareEndpoint
    );
    const [newTab] = await Promise.all([
      this.page.context().waitForEvent("page"),
      await this.page.locator(this.CREATE_BUTTON_MODAL).click(),
    ]);
    const response = await waitForCreate;
    const json = await response.json();
    await newTab.waitForLoadState("domcontentloaded");
    await newTab.close();
    return { json };
  }
  public async selectPartnerType(option: string) {
    await this.page.locator(this.PARTNER_TYPE_SELECT).selectOption(option);
  }
  public async selectDestination(option: string) {
    await this.page.locator(this.DESTINATION_SELECT).selectOption(option);
  }
  public async selectPartnerProgram(option: string) {
    await this.page.locator(this.PARTNER_PROGRAM_SELECT).selectOption(option);
  }
  public async typePropertyName(name: string) {
    await this.page.locator(this.PROPERTY_NAME).fill(name);
  }
}
export const partners = (page: Page) => new Partners({ page });
