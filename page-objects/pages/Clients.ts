import { Page } from '@playwright/test';
import { text } from 'node:stream/consumers';

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
  public readonly CONFIRM_DELETE_PASSPORT = `//div[@id="modal-content"]//button[contains(.,'Delete')]`;
  public readonly LOYALTY_PROGRAMS_POPUP = `//form[@id="add-important-number-single"]`;
  public readonly PASSPORTS_ADDED = `//div[contains(.,'Passport and Travel Document Uploads')]//td/button[1]`;
  public readonly EDIT_PASSPORT_BUTTONS = `//div[contains(.,'Passport and Travel Document Uploads')]//td/button[1]`;
  public readonly DELETE_PASSPORT_BUTTONS = `//div[contains(.,'Passport and Travel Document Uploads')]//td/button[2]`;
  public readonly PASSPORTS_ADDED_DROPDOWN = `//tbody/tr[contains(@id,'passport')]//button`;
  public readonly ADD_NEW_PASSPORT = `//p[contains(.,'Passport and Travel Document Uploads')]/following-sibling::button`;
  public readonly EDIT_PASSPORT = `//ul[contains(@class,'show')]//a[contains(.,'Edit')]`;
  public readonly PASSPORT_MODAL = `//div[@id="modal-content"]`;
  public readonly PASSPORT_NAME = `//input[contains(@name,"document_name")]`;
  public readonly DELETE_PASSPORT_ICON = `//form[contains(@id,'passport')]//i`;
  public readonly UPLOADED_DOCUMENTS = `//form//div[@id="uploadedFileList"]`;
  public readonly UPLOAD_DOCUMENTS = `//form//a[contains(.,'Upload Documents')]`;
  public readonly INPUT_PASSPORT = `//input[@id="fileInput"]`;
  public readonly SAVE_MODAL = `//button[text()='Save Changes']`;
  public readonly PASSPORT_NUMBER = `//input[contains(@name,"passport_number")]`;
  public readonly PASSPORT_DATE_OF_ISSUE = `//input[contains(@name,"issue_date")]`;
  public readonly PASSPORT_DATE_OF_EXPIRY = `//input[contains(@name,"expiry_date")]`;
  public readonly PASSENGER_DOB = `//form//input[@id="passport_dob"]`;
  public readonly SUCCESS_MODAL = `//h2[contains(.,'Success')]`;
  public readonly PRIMARY_PASSENGER = `//button[contains(.,'Primary Passenger')]`;
  public readonly RELATED_PASSENGERS = `//button[contains(.,'Related Passengers')]`;
  public readonly EDIT_CLIENT_DETAILS = `//button[text()='Edit']`;
  public readonly CONFIRM_UPLOAD = `//button[contains(.,'Upload Files')]`;
  public readonly PASSPORT_ISSUE_COUNTRY = `//p[text()='Passport issue country']/following-sibling::div/div/div[2]`;
  public readonly DATES_NUMNBERS_PASSPORT_NAME = `(//h5[text()="Passport Details"]/following-sibling::div/div[2]/div/div)[1]`;
  public readonly PRIMARY_PASSENGER_FIRST_NAME = `//input[@name="primary_passenger.client.first_name"]`;

  public readonly PRIMARY_PASSENGER_LAST_NAME = `//input[@name="primary_passenger.client.last_name"]`;

  public readonly PRIMARY_PASSENGER_DATE_OF_BIRTH = `//input[@name="primary_passenger.client.date_of_birth"]`;

  public readonly PRIMARY_PASSENGER_GENDER = `//div[contains(text(),'Select gender')]/../following-sibling::div`;

  public readonly PRIMARY_PASSENGER_EMAIL = `//input[@name="primary_passenger.client.email"]`;

  public readonly PRIMARY_PASSENGER_PHONE_NUMBER = `//input[@name="primary_passenger.client.phone"]`;

  public readonly PRIMARY_PASSENGER_ADDRESS_LINE_1 = `//input[@name="primary_passenger.client.address_line_1"]`;

  public readonly PRIMARY_PASSENGER_COUNTRY = `//select[@name="primary_passenger.client.country"]`;

  public readonly PRIMARY_PASSENGER_CITY = `//input[@name="primary_passenger.client.city"]`;

  public readonly PRIMARY_PASSENGER_ZIP_CODE = `//input[@name="primary_passenger.client.zip_code"]`;

  public readonly PRIMARY_PASSENGER_PASSPORT = `//input[@name="primary_passenger.client.passport_number"]`;
  public readonly PRIMARY_PASSENGER_GREEN_CHECK = `(//h4[text()='1']/../following-sibling::div/*/*[@width="24"])[1]`;

  public readonly PASSPORT_ISSUE_COUNTRY_OPTION = (country: string) =>
    `//div[@role="listbox"]//p[text()='${country}']`;
  public readonly MAIN_PASSENGER_TAB = `(//div[contains(@class,"Layout_content")]//button[@aria-expanded="false"])[1]`;
  public readonly TRAVELER_ADDED = (traveler: string) =>
    `//tbody[@id="related_travellers_list"]/tr/td[2]/span[contains(.,'${traveler}')]//../../td//button[contains(@id,'dropdown')]`;
  public readonly REMOVE_TRAVELER_BY_NAME = (traveler: string) =>
    `//tbody[@id="related_travellers_list"]/tr/td[2]/span[contains(.,'${traveler}')]//../../td//a[contains(.,'Remove')]`;

  public async clickCreate() {
    await this.page.locator(this.HEADER).click();
  }
  public async clickAddClient() {
    await this.page.getByRole('link', { name: 'Add Client' }).click();
  }
  public async quickAdd() {
    await this.page.locator(this.QUICK_ADD).click();
  }
  public async saveQuickAdd() {
    await this.page.getByRole('button', { name: 'Save' }).click();
  }
  public async startFromScratch() {
    await this.page.getByRole('button', { name: 'Start from scratch' }).click();
  }
  public async mainInformationQuickAdd(LAST_NAME: string, EMAIL: string) {
    await this.page.getByRole('textbox', { name: 'Enter Preferred name' }).fill('TestName');
    await this.page.getByRole('textbox', { name: 'Enter First Name' }).fill('FirstName');
    await this.page.getByRole('textbox', { name: 'Enter Middle Name' }).fill('Middle');
    await this.page.getByRole('textbox', { name: 'Enter Last Name' }).fill(LAST_NAME);
    await this.page.getByRole('textbox', { name: 'Enter Email Address' }).fill(EMAIL);
    await this.page.getByRole('textbox', { name: 'eg.8000011111' }).fill('08001111111');
    await this.page.getByPlaceholder('mm/dd/yy').fill('2000-11-19');
    await this.page.getByRole('textbox', { name: 'Select Gender' }).click();
    await this.page.getByRole('treeitem', { name: 'Male', exact: true }).click();
  }

  public async mainInformation() {
    await this.page.locator('input[name="client_preferred_name"]').fill('Testname');
    await this.page.locator('input[name="client_first_name"]').fill('FirstName');
    await this.page.locator('input[name="client_middle_name"]').fill('MidName');
    await this.page.locator('input[name="client_last_name"]').fill('LastName');
    await this.page.locator('#dob').fill('2000-11-17');
    await this.page.getByRole('textbox', { name: 'Select Gender' }).first().click();
    await this.page.getByRole('treeitem', { name: 'Male', exact: true }).click();
    await this.page.getByRole('textbox', { name: 'Select Source' }).click();
    await this.page.getByRole('treeitem', { name: 'Virtuoso.com' }).click();
    await this.page.locator('#client_phone').fill('(800) 001-1111');
    await this.page.locator('#client_email').fill('test@email.com');
    await this.page.locator('#airport_container').getByLabel('', { exact: true }).click();
    await this.page.locator('input[type="search"]').fill('eze');
    await this.page.getByRole('treeitem', { name: 'EZE - Buenos Aires, Ezeiza' }).click();
  }
  public async emergencyContact() {
    await this.page
      .getByRole('textbox', { name: 'Enter emergency contact name' })
      .fill('EmergencyContact');
    await this.page.getByRole('textbox', { name: 'Select Relationship' }).first().click();
    await this.page.getByRole('treeitem', { name: 'Sibling', exact: true }).click();
    await this.page.locator('#emergency_contact_phone').fill('(800) 000-1111');
    await this.page
      .getByRole('textbox', { name: 'Enter Email', exact: true })
      .fill('testEmergency@contact.com');
  }

  public async mailingAddress() {
    await this.page.locator('#client_mailing_address').fill('Fake');
    await this.page.locator('#client_mailing_address_line_2').fill('Fake Adress');
    await this.page.locator('#mailing_country').fill('United States');
    await this.page
      .getByRole('textbox', { name: 'State/Province State/Province' })
      .fill('California');
    await this.page.getByRole('textbox', { name: 'City City' }).fill('Los Angeles');
    await this.page.getByRole('textbox', { name: 'Zip Code Zip Code' }).fill('90001');
  }
  public async relatedTravelers() {
    await this.page.locator('#rt_preferred_name').fill('RelatedName');
    await this.page.locator('#qa_first_name').fill('RelatedName');
    await this.page.locator('#rt_middle_name').fill('MiddleRelated');
    await this.page.locator('#rt_last_name').fill('LastRelated');
    await this.page.locator('#qa_date_of_birth').fill('2000-11-12');
    await this.page.getByRole('textbox', { name: 'Select Gender' }).click();
    await this.page.getByRole('treeitem', { name: 'Female' }).click();
    await this.page.getByRole('textbox', { name: 'Select Relationship' }).click();
    await this.page.getByRole('treeitem', { name: 'Sibling', exact: true }).click();
    await this.page.locator('#rt_email').fill('related@contact.com');
    await this.page.locator('#mobile_code').fill('(800) 001-1111');
  }

  public async importantTravelData() {
    await this.page.getByRole('textbox', { name: 'Global Entry Number' }).fill('123345456');
    await this.page.getByPlaceholder('Global Entry Expiry Date').fill('2028-11-19');
    await this.page.getByRole('textbox', { name: 'Known Traveler Number' }).fill('123345456');
    await this.page.getByPlaceholder('Expiry date', { exact: true }).fill('2028-11-20');
    await this.page.getByRole('textbox', { name: 'Please Select' }).click();
    await this.page.getByRole('treeitem', { name: 'Yes' }).click();
    await this.page.getByPlaceholder('Clear Membership Expiry Date').fill('2028-11-21');
  }
  public async selectAgentAndContinue() {
    await this.page
      .locator('div')
      .filter({ hasText: /^Select an agent$/ })
      .nth(1)
      .click();
    await this.page.locator(`(//div[contains(@id,'listbox')]/div/p)[1]`).click();
    await this.page.getByRole('button', { name: 'Continue' }).click();
  }
  public async startFromScrath() {
    await this.page.getByRole('button', { name: 'Start from scratch' }).click();
  }
  public async clickAirRequest() {
    await this.page.getByRole('button', { name: 'Air Request' }).click();
  }
  public async clickRelatedTravelers() {
    await this.page.getByRole('button', { name: 'Related Travelers' }).click();
  }
  public async clickDatesAndNumbers() {
    await this.page.getByRole('button', { name: 'DATES & NUMBERS' }).click();
  }
  public async deleteLoyaltyProgram() {
    await this.page
      .locator(`//a[contains(@class,'delete-item') and contains(@message_title,'Loyalty')]`)
      .click();
  }
  public async loyaltyProgramsFill(program: string, number: string) {
    await this.page
      .locator(`(//div[@id="loyalty_programs_list"]//span[contains(@id,'select')]/../span)[2]`)
      .click();
    await this.page
      .locator(`//ul//li[contains(@class,'option') and contains(.,'${program}')]`)
      .click({ delay: 500 });
    await this.page.waitForTimeout(200);
    await this.page
      .locator(`(//div[@id="loyalty_programs_list"]//input[@placeholder="Enter Number"])`)
      .fill(number);
  }
  public async loyaltyProgramsAdd() {
    await this.page.locator(`//h4[contains(.,'Loyalty programs')]/..//a`).click();
  }
  public async clickFirstResult() {
    await this.page.locator(this.ALL_ACTIVE_CLIENTS).first().click();
  }
  public async goToCreditCard() {
    await this.page.getByRole('tab', { name: 'credit card' }).click();
  }
  public async searchClient(client: string) {
    await this.page.getByRole('textbox', { name: 'Search' }).fill(client);
    await this.page.getByRole('textbox', { name: 'Search' }).press('Enter');
    await this.page.getByText('Candice & Ben (Conway)').first().click();
  }
  public async searchClientAndClick(client: string) {
    await this.page.getByRole('textbox', { name: 'Search' }).fill(client);
    await this.page.getByRole('textbox', { name: 'Search' }).press('Enter');
    await this.page.getByText(client).click();
  }

  public async deleteAddedTraveler(traveler: string) {
    await this.page.locator(this.TRAVELER_ADDED(traveler)).first().click();
    await this.page.locator(this.REMOVE_TRAVELER_BY_NAME(traveler)).first().click();
  }
  public async confirmDelete() {
    await this.page.locator(this.CONFIRM_DELETE).click();
  }
  public async confirmDeleteFF() {
    await this.page.locator(this.CONFIRM_DELETE_FF).click();
  }
  public async clickOkPopUp() {
    await this.page.getByRole('button', { name: 'OK' }).click();
  }
  public async addPassportIfNotFull(passport_name: string) {
    const passportsAdded = await this.page.locator(this.PASSPORTS_ADDED).count();
    if (passportsAdded < 3) {
      await this.addNewPassport(passport_name);
    } else {
      await this.page.locator(this.DELETE_PASSPORT_BUTTONS).last().click();
      await this.page.locator(this.PASSPORT_MODAL).waitFor({ state: 'visible', timeout: 5000 });
      await this.page.locator(this.CONFIRM_DELETE_PASSPORT).click();
      await this.addNewPassport(passport_name);
    }
  }

  public async clickExit() {
    await this.page.locator('//button[text()="Exit"]').click();
  }
  public async editClientDetails() {
    await this.page.locator(this.EDIT_CLIENT_DETAILS).click();
  }
  public async expandMainPassenger() {
    await this.page.locator(this.MAIN_PASSENGER_TAB).click();
  }
  public async addNewPassport(passport_name: string) {
    await this.page.locator(this.ADD_NEW_PASSPORT).click();
    await this.page.locator(this.INPUT_PASSPORT).setInputFiles('./data/images/testImage.jpg');
    await this.page.locator(this.CONFIRM_UPLOAD).click();
    await this.page.waitForTimeout(3000);
    await this.page.locator(this.EDIT_PASSPORT_BUTTONS).first().click();
    await this.fillRequiredData(passport_name);
  }
  public async fillRequiredData(passport_name: string) {
    await this.page.locator(this.PASSPORT_MODAL).waitFor({ state: 'visible', timeout: 5000 });
    await this.page.locator(this.PASSPORT_NAME).fill(passport_name);
    await this.page.locator(this.PASSPORT_NUMBER).fill('123123123');
    await this.page.locator(this.PASSPORT_ISSUE_COUNTRY).click();
    await this.page.locator(this.PASSPORT_ISSUE_COUNTRY_OPTION('United States')).click();
    await this.page.waitForTimeout(100);
    await this.page.locator(this.PASSPORT_DATE_OF_ISSUE).click();
    await this.page.locator(`//div[@class="react-datepicker__week"][1]/div[1]`).click();
    await this.page.locator(`//button[text()="Confirm"]`).click();
    await this.page.locator(this.PASSPORT_DATE_OF_EXPIRY).click();
    await this.page.locator(`//div[@class="react-datepicker__week"][4]/div[6]`).click();
    await this.page.locator(`//button[text()="Confirm"]`).click();
    await this.page.locator(this.SAVE_MODAL).click();
  }
  public async saveModal() {
    const waitForCreate = this.page.waitForResponse(
      (res) =>
        res.ok() && res.request().method() === 'POST' && res.url().includes('add-client-passport'),
    );
    await this.page.locator(this.SAVE_MODAL).click();
    const response = await waitForCreate;
    const responseData = await response.json();
    await this.page.waitForTimeout(3000);
    return {
      status: response.status(),
      responseData,
    };
  }
  public async fillFirstName(value: string) {
    await this.page.locator(this.PRIMARY_PASSENGER_FIRST_NAME).fill(value);
  }

  public async fillLastName(value: string) {
    await this.page.locator(this.PRIMARY_PASSENGER_LAST_NAME).fill(value);
  }

  public async fillDateOfBirth() {
    await this.page.locator(this.PRIMARY_PASSENGER_DATE_OF_BIRTH).click();
    await this.page.locator(`//select[@aria-label="Select year"]`).selectOption('1990');
    await this.page.locator(`//select[@aria-label="Select year"]`).selectOption('1990');
    await this.page.waitForTimeout(300);
    await this.page.locator(`(//div[contains(@class,"datepicker__week")]/div[1])[3]`).click();
  }

  public async selectGender() {
    await this.page.locator(this.PRIMARY_PASSENGER_GENDER).click();
    await this.page.locator(`//p[text()='Male']`).click();
  }

  public async fillEmail(value: string) {
    await this.page.locator(this.PRIMARY_PASSENGER_EMAIL).fill(value);
  }

  public async fillPhoneNumber(value: string) {
    await this.page.locator(this.PRIMARY_PASSENGER_PHONE_NUMBER).fill(value);
  }

  public async fillAddressLine1(value: string) {
    await this.page.getByRole('textbox', { name: 'Street address' }).fill(value);
  }

  public async selectCountry(value: string) {
    await this.page.locator(`//div[text()='Select country']/../following-sibling::div`).click();
    await this.page.locator(`//div[@role="listbox"]/div/p[text()='${value}']`).click();
  }

  public async fillCity(value: string) {
    await this.page.getByRole('textbox', { name: 'Enter city' }).fill(value);
  }

  public async fillZipCode(value: string) {
    await this.page.getByRole('textbox', { name: 'Enter ZIP or postal code' }).fill(value);
  }

  public async fillPassport(value: string) {
    await this.page.getByRole('textbox', { name: 'Passport' }).fill(value);
  }
  public async checkCertify() {
    await this.page.locator(`//span[contains(.,'I certify the information')]`).click();
  }
  public async uploadProfilePicture() {
    await this.page
      .locator(`//h5[text()='Profile Photo (Optional)']/../following-sibling::div//input`)
      .setInputFiles('./data/images/agent_profile.jpg');
    const crop = this.page.locator('.ReactCrop__crop-selection');

    const box = await crop.boundingBox();

    if (box) {
      await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
      await this.page.mouse.down();
      await this.page.mouse.move(box.x + box.width / 2 + 55, box.y + box.height / 2);
      await this.page.mouse.up();
    }
    await this.page.getByRole('button', { name: 'Save' }).click();
  }
}
export const clients = (page: Page) => new Clients({ page });
