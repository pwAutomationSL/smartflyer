import { Page } from "@playwright/test";
import { text } from "node:stream/consumers";

export class Clients {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }
  public readonly HEADER = `//h1`;
  public readonly HEADER_H2 = `//h2`;
  public readonly QUICK_ADD = `//button[contains(.,'Quick Add')]`;
  public readonly SPINNER_LOADER = `//div[@id="ClientTable_processing"]`;
  public readonly USERNAME_HEADER = `//div[contains(@class,'user-data')]//h4`;
  public readonly ALL_ACTIVE_CLIENTS = `//tbody/tr//p`;
  public readonly ALL_RELATED_TRAVELERS = `//tbody[@id="related_travellers_list"]/tr/td[2]/span`;
  public readonly CONFIRM_DELETE = `//button[contains(.,'Yes, release it')]`;
  public readonly CONFIRM_DELETE_FF = `//button[contains(.,'Yes, delete it!')]`;
  public readonly LOYALTY_PROGRAMS_POPUP = `//form[@id="add-important-number-single"]`;
  public readonly TRAVELER_ADDED = (traveler: string) =>
    `//tbody[@id="related_travellers_list"]/tr/td[2]/span[contains(.,'${traveler}')]//../../td//button[contains(@id,'dropdown')]`;
  public readonly REMOVE_TRAVELER_BY_NAME = (traveler: string) =>
    `//tbody[@id="related_travellers_list"]/tr/td[2]/span[contains(.,'${traveler}')]//../../td//a[contains(.,'Remove')]`;
  public async clickCreate() {
    await this.page.locator(this.HEADER).click();
  }
  public async clickAddClient() {
    await this.page.getByRole("link", { name: "Add Client" }).click();
  }
  public async quickAdd() {
    await this.page.locator(this.QUICK_ADD).click();
  }
  public async saveQuickAdd() {
    await this.page.getByRole("button", { name: "Save" }).click();
  }
  public async mainInformationQuickAdd(LAST_NAME: string, EMAIL: string) {
    await this.page
      .getByRole("textbox", { name: "Enter Preferred name" })
      .fill("TestName");
    await this.page
      .getByRole("textbox", { name: "Enter First Name" })
      .fill("FirstName");
    await this.page
      .getByRole("textbox", { name: "Enter Middle Name" })
      .fill("Middle");
    await this.page
      .getByRole("textbox", { name: "Enter Last Name" })
      .fill(LAST_NAME);
    await this.page
      .getByRole("textbox", { name: "Enter Email Address" })
      .fill(EMAIL);
    await this.page
      .getByRole("textbox", { name: "eg.8000011111" })
      .fill("08001111111");
    await this.page.getByPlaceholder("mm/dd/yy").fill("2000-11-19");
    await this.page.getByRole("textbox", { name: "Select Gender" }).click();
    await this.page
      .getByRole("treeitem", { name: "Male", exact: true })
      .click();
  }

  public async mainInformation() {
    await this.page
      .locator('input[name="client_preferred_name"]')
      .fill("Testname");
    await this.page
      .locator('input[name="client_first_name"]')
      .fill("FirstName");
    await this.page.locator('input[name="client_middle_name"]').fill("MidName");
    await this.page.locator('input[name="client_last_name"]').fill("LastName");
    await this.page.locator("#dob").fill("2000-11-17");
    await this.page
      .getByRole("textbox", { name: "Select Gender" })
      .first()
      .click();
    await this.page
      .getByRole("treeitem", { name: "Male", exact: true })
      .click();
    await this.page.getByRole("textbox", { name: "Select Source" }).click();
    await this.page.getByRole("treeitem", { name: "Virtuoso.com" }).click();
    await this.page.locator("#client_phone").fill("(800) 001-1111");
    await this.page.locator("#client_email").fill("test@email.com");
    await this.page
      .locator("#airport_container")
      .getByLabel("", { exact: true })
      .click();
    await this.page.locator('input[type="search"]').fill("eze");
    await this.page
      .getByRole("treeitem", { name: "EZE - Buenos Aires, Ezeiza" })
      .click();
  }
  public async emergencyContact() {
    await this.page
      .getByRole("textbox", { name: "Enter emergency contact name" })
      .fill("EmergencyContact");
    await this.page
      .getByRole("textbox", { name: "Select Relationship" })
      .first()
      .click();
    await this.page
      .getByRole("treeitem", { name: "Sibling", exact: true })
      .click();
    await this.page.locator("#emergency_contact_phone").fill("(800) 000-1111");
    await this.page
      .getByRole("textbox", { name: "Enter Email", exact: true })
      .fill("testEmergency@contact.com");
  }

  public async mailingAddress() {
    await this.page.locator("#client_mailing_address").fill("Fake");
    await this.page
      .locator("#client_mailing_address_line_2")
      .fill("Fake Adress");
    await this.page.locator("#mailing_country").fill("United States");
    await this.page
      .getByRole("textbox", { name: "State/Province State/Province" })
      .fill("California");
    await this.page
      .getByRole("textbox", { name: "City City" })
      .fill("Los Angeles");
    await this.page
      .getByRole("textbox", { name: "Zip Code Zip Code" })
      .fill("90001");
  }
  public async relatedTravelers() {
    await this.page.locator("#rt_preferred_name").fill("RelatedName");
    await this.page.locator("#qa_first_name").fill("RelatedName");
    await this.page.locator("#rt_middle_name").fill("MiddleRelated");
    await this.page.locator("#rt_last_name").fill("LastRelated");
    await this.page.locator("#qa_date_of_birth").fill("2000-11-12");
    await this.page.getByRole("textbox", { name: "Select Gender" }).click();
    await this.page.getByRole("treeitem", { name: "Female" }).click();
    await this.page
      .getByRole("textbox", { name: "Select Relationship" })
      .click();
    await this.page
      .getByRole("treeitem", { name: "Sibling", exact: true })
      .click();
    await this.page.locator("#rt_email").fill("related@contact.com");
    await this.page.locator("#mobile_code").fill("(800) 001-1111");
  }

  public async importantTravelData() {
    await this.page
      .getByRole("textbox", { name: "Global Entry Number" })
      .fill("123345456");
    await this.page
      .getByPlaceholder("Global Entry Expiry Date")
      .fill("2028-11-19");
    await this.page
      .getByRole("textbox", { name: "Known Traveler Number" })
      .fill("123345456");
    await this.page
      .getByPlaceholder("Expiry date", { exact: true })
      .fill("2028-11-20");
    await this.page.getByRole("textbox", { name: "Please Select" }).click();
    await this.page.getByRole("treeitem", { name: "Yes" }).click();
    await this.page
      .getByPlaceholder("Clear Membership Expiry Date")
      .fill("2028-11-21");
  }
  public async selectAgentAndContinue() {
    await this.page
      .locator("div")
      .filter({ hasText: /^Select an agent$/ })
      .nth(1)
      .click();
    await this.page
      .locator(`(//div[contains(@id,'listbox')]/div/p)[1]`)
      .click();
    await this.page.getByRole("button", { name: "Continue" }).click();
  }
  public async startFromScrath() {
    await this.page.getByRole("button", { name: "Start from scratch" }).click();
  }
  public async clickAirRequest() {
    await this.page.getByRole("button", { name: "Air Request" }).click();
  }
  public async clickRelatedTravelers() {
    await this.page.getByRole("button", { name: "Related Travelers" }).click();
  }
  public async clickDatesAndNumbers() {
    await this.page.getByRole("tab", { name: "Dates & Numbers" }).click();
  }
  public async clickDatesAndNumbersAPP() {
    await this.page.getByRole("button", { name: "DATES & NUMBERS" }).click();
  }
  public async deleteLoyaltyProgram() {
    await this.page
      .locator(
        `//a[contains(@class,'delete-item') and contains(@message_title,'Loyalty')]`
      )
      .click();
  }
  public async loyaltyProgramsFill(program: string, number: string) {
    await this.page
      .locator(
        `(//div[@id="loyalty_programs_list"]//span[contains(@id,'select')]/../span)[2]`
      )
      .click();
    await this.page
      .locator(
        `//ul//li[contains(@class,'option') and contains(.,'${program}')]`
      )
      .click({ delay: 500 });
    await this.page.waitForTimeout(200);
    await this.page
      .locator(
        `(//div[@id="loyalty_programs_list"]//input[@placeholder="Enter Number"])`
      )
      .fill(number);
  }
  public async loyaltyProgramsAdd() {
    await this.page
      .locator(`//h4[contains(.,'Loyalty programs')]/..//a`)
      .click();
  }
  public async clickFirstResult() {
    await this.page.locator(this.ALL_ACTIVE_CLIENTS).first().click();
  }
  public async goToCreditCard() {
    await this.page.getByRole("tab", { name: "credit card" }).click();
  }
  public async searchClient(client: string) {
    await this.page.getByRole("textbox", { name: "Search" }).fill(client);
    await this.page.getByRole("textbox", { name: "Search" }).press("Enter");
    await this.page.getByText("Candice & Ben (Conway)").click();
  }

  public async deleteAddedTraveler(traveler: string) {
    await this.page.locator(this.TRAVELER_ADDED(traveler)).first().click();
    await this.page
      .locator(this.REMOVE_TRAVELER_BY_NAME(traveler))
      .first()
      .click();
  }
  public async confirmDelete() {
    await this.page.locator(this.CONFIRM_DELETE).click();
  }
  public async confirmDeleteFF() {
    await this.page.locator(this.CONFIRM_DELETE_FF).click();
  }
  public async clickOkPopUp() {
    await this.page.getByRole("button", { name: "OK" }).click();
  }
}
export const clients = (page: Page) => new Clients({ page });
