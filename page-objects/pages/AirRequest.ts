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
  public readonly PASSENGERS_SUCCESS = `//span[contains(.,'Passengers')]//..//div`;
  public readonly AGENTS_OPTIONS = `(//div[contains(@id,'listbox')]/div/p)`;
  public readonly DRAFTS_ELEMENTS = `//div[@id="modal-content"]/div/div/div[2]/div`;
  public readonly DRAFTS_ELEMENTS_TIME_ONLY = `//div[@id="modal-content"]/div/div/div[2]/div/div[2]/p[2]`;
  public readonly DRAFTS_ELEMENTS_ID_ONLY = `//div[@id="modal-content"]/div/div/div[2]/div/div[2]/p[1]`;
  public readonly HEADER = `//h2`;
  public readonly USERNAME_HEADER = `//button//h4`;
  public readonly DELETE_DRAFTS = `//div[@id="modal-content"]/div/div/div[2]/div/button`;
  public readonly CONFIRM_DELETE_DRAFTS = `//dialog//button[contains(.,'Delete Draft')]`;
  public readonly SEARCH_DRAFT = `//dialog//input[@name="search"]`;
  public readonly SPINNER_LOADER = `(//div[contains(@class,'Spinner')])[1]`;
  public readonly DOMESTIC_RADIO = `//label[contains(.,'Domestic')]//../input`;
  public readonly FIRST_NAME_PASSENGER = `//input[contains(@name,'first_name')]`;
  public readonly MIDDLE_NAME_PASSENGER = `//input[contains(@name,'middle_name')]`;
  public readonly LAST_NAME_PASSENGER = `//input[contains(@name,'last_name')]`;
  public readonly PASSENGER_EMAIL = `//input[contains(@name,'email')]`;
  public readonly CLIENT_ID = `//input[contains(@name,'client_identity')]`;
  public readonly GENDER_RED_ASTERISK = `//input[contains(@name,'gender')]//..//p[contains(@class,'after:text-red-500')]`;
  public readonly GENDER_DROPDOWN = `(//div[contains(.,'Select...') and contains(@id,'select')]//../..//div)[4]`;
  public readonly MALE_DROPDOWN = `//div[@role="listbox"]//p[contains(.,'Male')]`;
  public readonly FEMALE_DROPDOWN = `//div[@role="listbox"]//p[contains(.,'Female')]`;
  public readonly ADD_PASSPORT_INFORMATION = `//label[contains(.,'Add passport information')]//..//button`;
  public readonly CERTIFY_CHECKBOX = `//span[contains(.,'I certify the information')]//..//span`;
  public readonly DELETE_TRAVELER_BUTTON = `//button[contains(.,'Delete traveler')]`;
  public readonly KNOW_TRAVELER_LABEL = `//label[contains(.,'Known traveler number')]`;
  public readonly WARNING_EMAIL = `//label[contains(.,'Email')]//../p`;
  public readonly WARNING_PHONE = `//label[contains(.,'Phone')]//../p`;
  public readonly WARNING_NAME = `//label[contains(@for,'first_name')]//../p`;
  public readonly WARNING_MIDDLE_NAME = `//label[contains(@for,'middle_name')]//../p`;
  public readonly WARNING_LAST_NAME = `//label[contains(@for,'last_name')]//../p`;
  public readonly WARNING_DOB = `//label[contains(@for,'date-day')]//../p`;
  public readonly PHONE_FLAG = `//button//img[contains(@src,'/icons/flags')]`;
  public readonly PHONE_INPUT_PASSENGER = `//input[contains(@name,'phone')]`;
  public readonly DOB_DAY = `//input[contains(@id,'dob-day')]`;
  public readonly DOB_YEAR = `//input[@name="year"]`;
  public readonly DOB_MONTH = `(//div[contains(@id,'select') and contains(.,'Month')]//..//..//div)[4]`;
  public readonly JANUARY_OPTION = `//div[contains(@id,'option') and contains(.,'January')]`;

  public async clickCancel() {
    await this.page.locator(this.CANCEL_BUTTON).click();
  }
  public async clickContinue() {
    await this.page.locator(this.CONTINUE_BUTTON).click();
  }
  public async searchDraftByID(draftID: string) {
    await this.page.locator(this.SEARCH_DRAFT).fill(draftID);
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
    return (
      (await this.page
        .locator(this.DRAFTS_ELEMENTS_ID_ONLY)
        .first()
        .textContent()) ?? "Not Found"
    );
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
  public async waitForSpinner() {
    const spinner = this.page.locator(this.SPINNER_LOADER);
    await spinner.waitFor({ state: "visible", timeout: 200 }).catch(() => {});
    await spinner.waitFor({ state: "hidden", timeout: 5000 });
  }

  public async clickGenderDropdown() {
    await this.page.locator(this.GENDER_DROPDOWN).click();
  }
  public async selectMale() {
    await this.page.locator(this.MALE_DROPDOWN).click();
  }
  public async fillPassengerEmail(email: string) {
    await this.page.locator(this.EMAIL_INPUT).fill(email);
  }
  public async fillPassengerFirstName(name: string) {
    await this.page.locator(this.FIRST_NAME_PASSENGER).fill(name);
  }
  public async fillPassengerMiddleName(name: string) {
    await this.page.locator(this.MIDDLE_NAME_PASSENGER).fill(name);
  }
  public async fillPassengerLastName(name: string) {
    await this.page.locator(this.LAST_NAME_PASSENGER).fill(name);
  }
  public async clickLabel() {
    await this.page.locator(this.KNOW_TRAVELER_LABEL).click();
  }
  public async fillPassengerPhone(phone: string) {
    await this.page.locator(this.PHONE_INPUT_PASSENGER).fill(phone);
    await this.page.waitForTimeout(1000);
  }
  public async checkCertify() {
    await this.page.locator(this.CERTIFY_CHECKBOX).first().click();
  }
  public async fillDateOfBirth() {
    await this.page.locator(this.DOB_DAY).fill("15");
    await this.page.locator(this.DOB_YEAR).fill("1990");
    await this.page.locator(this.DOB_MONTH).click();
    await this.page.locator(this.JANUARY_OPTION).click();
  }
  public async fillDayOfBirth(day: string) {
    await this.page.locator(this.DOB_DAY).fill(day);
  }
  public async fillYearOfBirth(year: string) {
    await this.page.locator(this.DOB_YEAR).fill(year);
  }
}
export const airRequest = (page: Page) => new AirRequest({ page });
