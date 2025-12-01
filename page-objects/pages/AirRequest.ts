import { Page } from "@playwright/test";
export class AirRequest {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }
  public readonly AGENT_SELECT = `(//p[contains(.,'Agent name')]//..//div)[2]/div/div[1]`;
  public readonly CONTINUE_BUTTON = `//button[contains(.,'Continue')]`;
  public readonly CANCEL_BUTTON = `//button[contains(.,'Cancel')]`;
  public readonly AGENT_SUCCESS = `//span[contains(.,'Agent information')]//..//div`;
  public readonly AGENTS_OPTIONS = `(//div[contains(@id,'listbox')]/div/p)`;
  public readonly DRAFTS_ELEMENTS = `//div[@id="modal-content"]/div/div/div[2]/div`;
  public readonly DRAFTS_ELEMENTS_TIME_ONLY = `//div[@id="modal-content"]/div/div/div[2]/div/div[2]/p[2]`;
  public readonly HEADER = `//h2`;

  public async clickCancel() {
    await this.page.locator(this.CANCEL_BUTTON).click();
  }
  public async clickContinue() {
    await this.page.locator(this.CONTINUE_BUTTON).click();
  }
  public async getAgentsNames() {
    return await this.page.locator(this.AGENTS_OPTIONS).allTextContents();
  }
  public async selectAgent() {
    await this.page
      .locator("div")
      .filter({ hasText: /^Select an agent$/ })
      .nth(1)
      .click();
  }
  public async selectFirstAgent() {
    await this.page
      .locator(`(//div[contains(@id,'listbox')]/div/p)[1]`)
      .click();
  }
  public async startFromScrath() {
    await this.page.getByRole("button", { name: "Start from scratch" }).click();
  }
  public async startFromDraft() {
    await this.page.getByRole("button", { name: "Choose from Draft" }).click();
  }
  public async returnFirstDraftTime() {
    return await this.page
      .locator(this.DRAFTS_ELEMENTS_TIME_ONLY)
      .first()
      .textContent();
  }
  public async clickAirRequest() {
    await this.page.getByRole("button", { name: "Air Request" }).click();
  }
  public async goToCreditCard() {
    await this.page.getByRole("tab", { name: "credit card" }).click();
  }
  public async searchClient(client: string) {
    await this.page.getByRole("textbox", { name: "Search" }).fill(client);
    await this.page.getByRole("textbox", { name: "Search" }).press("Enter");
    await this.page.getByText("Candice & Ben (Conway)").click();
  }
}
export const airRequest = (page: Page) => new AirRequest({ page });
