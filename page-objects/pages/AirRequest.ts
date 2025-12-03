import { Page } from "@playwright/test";

export class AirRequest {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }
  public readonly AGENT_SELECT = `(//p[contains(.,'Agent name')]//..//div)[2]/div/div[1]`;
  public readonly EMAIL_INPUT = `//input[@type='email']`;
  public readonly PHONE_INPUT = `//input[@name="phoneNumber"]`;
  public readonly CONTINUE_BUTTON = `//button[contains(.,'Continue')]`;
  public readonly CANCEL_BUTTON = `//button[contains(.,'Cancel')]`;
  public readonly AGENT_SUCCESS = `//span[contains(.,'Agent information')]//..//div`;
  public readonly AGENTS_OPTIONS = `(//div[contains(@id,'listbox')]/div/p)`;
  public readonly DRAFTS_ELEMENTS = `//div[@id="modal-content"]/div/div/div[2]/div`;
  public readonly DRAFTS_ELEMENTS_TIME_ONLY = `//div[@id="modal-content"]/div/div/div[2]/div/div[2]/p[2]`;
  public readonly DRAFTS_ELEMENTS_ID_ONLY = `//div[@id="modal-content"]/div/div/div[2]/div/div[2]/p[1]`;
  public readonly HEADER = `//h2`;
  public readonly USERNAME_HEADER = `//button//h4`;
  public readonly DELETE_DRAFTS = `//div[@id="modal-content"]/div/div/div[2]/div/button`;
  public readonly CONFIRM_DELETE_DRAFTS = `//dialog//button[contains(.,'Delete Draft')]`;

  public async clickCancel() {
    await this.page.locator(this.CANCEL_BUTTON).click();
  }
  public async clickContinue() {
    await this.page.locator(this.CONTINUE_BUTTON).click();
  }
  public async confirmDeleteDraft() {
    await this.page.locator(this.CONFIRM_DELETE_DRAFTS).click();
  }
  public async clickDeleteDraft() {
    await this.page.locator(this.DELETE_DRAFTS).first().click();
  }
  public async getAgentsNames() {
    return await this.page.locator(this.AGENTS_OPTIONS).allTextContents();
  }
  public async getPrefilledData() {
    const phone = await this.page.locator(this.PHONE_INPUT).inputValue();
    const email = await this.page.locator(this.EMAIL_INPUT).inputValue();
    const agentRaw = await this.page.locator(this.AGENT_SELECT).textContent();
    const agent = agentRaw?.trim() ?? "";
    return { agent, phone, email };
  }
  public async getLoggedUsername() {
    const username = await this.page
      .locator(this.USERNAME_HEADER)
      .textContent();
    return username ? username : "not found";
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
  public async startFromScrathAndGetUserData() {
    const waitForCreate = this.page.waitForResponse(
      (res) =>
        res.ok() &&
        res.request().method() === "GET" &&
        res.url().includes("/api/air-request/")
    );
    await this.page.getByRole("button", { name: "Start from scratch" }).click();
    const response = await waitForCreate;
    const responseData = await response.json();
    await this.page.waitForTimeout(3000);
    return { responseData };
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
  public async returnFirstDraftName() {
    return await this.page
      .locator(this.DRAFTS_ELEMENTS_ID_ONLY)
      .first()
      .textContent();
  }
  public async clickFirstDraftTime() {
    await this.page.locator(this.DRAFTS_ELEMENTS_TIME_ONLY).first().click();
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
