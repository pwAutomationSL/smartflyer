import { Page } from '@playwright/test';
import { text } from 'node:stream/consumers';

export class Clients {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }
  public readonly HEADER = `//h1`;
  public readonly HEADER_H2 = `//h2`;
  public readonly POPUP_HEADER_H2 = `//dialog//h2`;
  public readonly POPUP_EDIT_HEADER = `(//dialog//header/following-sibling::div/div/p)[1]`;
  public readonly POPUP_EDIT_HEADER_INFO = `(//dialog//header/following-sibling::div/div/p)[2]`;
  public readonly QUICK_ADD = `//button[contains(.,'Quick Add')]`;
  public readonly SPINNER_LOADER = `//div[@id="ClientTable_processing"]`;
  public readonly USERNAME_HEADER = `//div[contains(@class,'user-data')]//h4`;
  public readonly ALL_ACTIVE_CLIENTS = `//tbody/tr//p`;
  public readonly ALL_RELATED_TRAVELERS = `//tbody[@id="related_travellers_list"]/tr/td[2]/span`;
  public readonly ALL_RELATED_TRAVELERS_APP = `//div[@aria-label="Expand"]//a`;
  public readonly CONFIRM_DELETE = `//dialog//button[contains(.,'Delete')]`;
  public readonly CONFIRM_DELETE_FF = `//button[contains(.,'Yes, delete it!')]`;
  public readonly CONFIRM_DELETE_PASSPORT = `//div[@id="modal-content"]//button[contains(.,'Delete')]`;
  public readonly LOYALTY_PROGRAMS_POPUP = `//form[@id="add-important-number-single"]`;
  public readonly PASSPORTS_ADDED = `//div[contains(.,'Passport and Travel Document Uploads')]//td/button[1]`;
  public readonly EDIT_PASSPORT_BUTTONS = `//div[contains(.,'Passport and Travel Document Uploads')]//td/button[1]`;
  public readonly DELETE_PASSPORT_BUTTONS = `//div[contains(.,'Passport and Travel Document Uploads')]//td/button[2]`;
  public readonly PASSPORTS_ADDED_DROPDOWN = `//tbody/tr[contains(@id,'passport')]//button`;
  public readonly ADD_NEW_PASSPORT = `//p[contains(.,'Passport and Travel Document Uploads')]/following-sibling::button`;
  public readonly ADDED_RELATED_PASSENGER_NAME = `//div[@role="button" and @aria-label="Expand"]/div[1]`;
  public readonly EDIT_PASSPORT = `//ul[contains(@class,'show')]//a[contains(.,'Edit')]`;
  public readonly PASSPORT_MODAL = `//div[@id="modal-content"]`;
  public readonly PASSPORT_NAME = `//input[contains(@name,"document_name")]`;
  public readonly DELETE_PASSPORT_ICON = `//form[contains(@id,'passport')]//i`;
  public readonly UPLOADED_DOCUMENTS = `//form//div[@id="uploadedFileList"]`;
  public readonly UPLOAD_DOCUMENTS = `//form//a[contains(.,'Upload Documents')]`;
  public readonly INPUT_PASSPORT = `//input[@id="fileInput"]`;
  public readonly SAVE_MODAL = `//button[text()='Save Changes']`;
  public readonly PASSPORT_NUMBER = `//input[contains(@name,"passport_number")]`;
  public readonly PASSPORT_DATE_OF_ISSUE = `//*[contains(.,'Date of Issue')]/following-sibling::div/div/div/input`;
  public readonly PASSPORT_DATE_OF_EXPIRY = `//*[contains(.,'Date of Expiration')]/following-sibling::div/div/div/input`;
  public readonly PASSENGER_DOB = `//form//input[@id="passport_dob"]`;
  public readonly SUCCESS_MODAL = `//h2[contains(.,'Success')]`;
  public readonly PRIMARY_PASSENGER = `//button[contains(.,'Primary Passenger')]`;
  public readonly RELATED_PASSENGERS = `//button[contains(.,'Related Passengers')]`;
  public readonly RELATED_PASSENGERS_TAB = `//button[text()="RELATED TRAVELERS"]`;
  public readonly PREFERENCES_TAB = `//button[text()="PREFERENCES"]`;
  public readonly SHARE_BUTTON = `//button[text()="Share"]`;
  public readonly SEND_FORMS = `//button[text()="Send Forms"]`;
  public readonly PROFILE_FORM_CARD = `//button/h5[text()="Profile Form"]`;
  public readonly PROFILE_FORM_CARD_RADIO = `//button/h5[text()="Profile Form"]/preceding-sibling::span`;
  public readonly CREDIT_CARD_FORM = `//button/h5[text()="Credit Card Form"]`;
  public readonly CREDIT_CARD_FORM_RADIO = `//button/h5[text()="Credit Card Form"]/preceding-sibling::span`;
  public readonly SHARE_EMAIL = `//label[@for="email"]`;
  public readonly SHARE_EMAIL_CC = `//label[@for="cc_email"]`;
  public readonly SHARE_EMAIL_BCC = `//label[@for="bcc_email"]`;
  public readonly SHARE_EMAIL_MESSAGE = `//textarea[@id="clientMessage"]`;
  public readonly SHARE_EMAIL_MESSAGE_LIMIT = `//label[@for="message"]/../following-sibling::div//span`;
  public readonly SHARE_CANCEL = `//button[text()="Cancel"]`;
  public readonly SHARE_SEND_FORM = `//button[text()="Send form"]`;
  public readonly RELATED_PASSENGER_ADDED_NAME = `(//button[contains(.,'Related Passengers')]/following-sibling::div//button)[1]//h4`;
  public readonly EDIT_CLIENT_DETAILS = `//button[text()='Edit']`;
  public readonly ADD_DOCUMENT_BUTTON = `//button[text()='Add Document']`;
  public readonly ADD_DOCUMENT = `//span[text()='Add Document']`;
  public readonly CONFIRM_UPLOAD = `//button[contains(.,'Upload Files')]`;
  public readonly PASSPORT_ISSUE_COUNTRY = `//p[text()='Passport issuing country']/following-sibling::div/div/div[2]`;
  public readonly DATES_NUMNBERS_PASSPORT_NAME = `(//h5[text()="Passport Details"]/following-sibling::div/div[2]/div/div)[1]`;
  public readonly DATES_NUMNBERS_PASSPORT_NUMBER = `(//h5[text()="Uploads"]/../following-sibling::div//tbody/tr/td[3])`;
  public readonly PRIMARY_PASSENGER_FIRST_NAME = `//input[@name="primary_passenger.client.first_name"]`;
  public readonly PRIMARY_PASSENGER_LAST_NAME = `//input[@name="primary_passenger.client.last_name"]`;
  public readonly PRIMARY_PASSENGER_DATE_OF_BIRTH = `//*[contains(@for,'primary_passenger.client.date_of_birth')]/following-sibling::div//input`;
  public readonly PRIMARY_PASSENGER_GENDER = `//div[contains(text(),'Select gender')]/../following-sibling::div`;
  public readonly PRIMARY_PASSENGER_EMAIL = `//input[@name="primary_passenger.client.email"]`;
  public readonly PRIMARY_PASSENGER_PHONE_NUMBER = `//input[@name="primary_passenger.client.phone"]`;
  public readonly PRIMARY_PASSENGER_ADDRESS_LINE_1 = `//input[@name="primary_passenger.client.address_line_1"]`;
  public readonly PRIMARY_PASSENGER_COUNTRY = `//select[@name="primary_passenger.client.country"]`;
  public readonly PRIMARY_PASSENGER_CITY = `//input[@name="primary_passenger.client.city"]`;
  public readonly PRIMARY_PASSENGER_ZIP_CODE = `//input[@name="primary_passenger.client.zip_code"]`;
  public readonly PRIMARY_PASSENGER_PASSPORT = `//input[@name="primary_passenger.client.passport_number"]`;
  public readonly PRIMARY_PASSENGER_GREEN_CHECK = `(//h4[text()='1']/../following-sibling::div/*/*[@width="24"])[1]`;
  public readonly RELATED_PASSENGER_GREEN_CHECK = (index: number) =>
    `(//h4[text()='${index}']/../following-sibling::div/*/*[@width="24"])[1]`;
  public readonly CONFIRM_SUBMISSION = `//button[text()="Confirm Submission"]`;
  public readonly CREATE_CLIENT = `//button[text()="Create Client"]`;
  public readonly CLIENT_PROFILE_DOB = `(//h1/../following-sibling::div//span)[1]`;
  public readonly CLIENT_PROFILE_PHONE = `(//h1/../following-sibling::div//span)[2]`;
  public readonly CLIENT_PROFILE_EMAIL = `(//h1/../following-sibling::div//span)[3]`;
  public readonly CLIENT_PROFILE_NAME_BI = `(//h5[text()="Basic Information"]/../following-sibling::div//p)[1]`;
  public readonly CLIENT_PROFILE_DOB_BI = `(//h5[text()="Basic Information"]/../following-sibling::div//p)[3]`;
  public readonly CLIENT_PROFILE_GENDER_BI = `(//h5[text()="Basic Information"]/../following-sibling::div//p)[4]`;
  public readonly CLIENT_PROFILE_EMAIL_BI = `(//h5[text()="Basic Information"]/../following-sibling::div//p)[5]`;
  public readonly CLIENT_PROFILE_PHONE_BI = `(//h5[text()="Basic Information"]/../following-sibling::div//p)[6]`;
  public readonly RELATED_PASSENGER_NAME_BI = `(//h5[text()="Basic Information"]/../following-sibling::div//span)[1]`;
  public readonly RELATED_PASSENGER_DOB_BI = `(//h5[text()="Basic Information"]/../following-sibling::div//span)[2]`;
  public readonly RELATED_PASSENGER_GENDER_BI = `(//h5[text()="Basic Information"]/../following-sibling::div//span)[3]`;
  public readonly RELATED_PASSENGER_EMAIL_BI = `(//h5[text()="Basic Information"]/../following-sibling::div//span)[5]`;
  public readonly RELATED_PASSENGER_PHONE_BI = `(//h5[text()="Basic Information"]/../following-sibling::div//span)[8]`;
  public readonly CLIENT_PROFILE_STREET_ADRESS = `(//h5[text()="Address"]/../following-sibling::div//p)[2]`;
  public readonly CLIENT_PROFILE_ZIP_CODE_ADRESS = `(//h5[text()="Address"]/../following-sibling::div//p)[3]`;
  public readonly CLIENT_PROFILE_COUNTRY_CITY_ADRESS = `(//h5[text()="Address"]/../following-sibling::div//p)[4]`;
  public readonly CLIENT_PROFILE_EMERGENCY_CONTACT_NAME = `(//h5[text()="Emergency Contact"]/../following-sibling::div//p)[1]`;
  public readonly CLIENT_PROFILE_EMERGENCY_CONTACT_EMAIL = `(//h5[text()="Emergency Contact"]/../following-sibling::div//p)[2]`;
  public readonly CLIENT_PROFILE_EMERGENCY_CONTACT_PHONE = `(//h5[text()="Emergency Contact"]/../following-sibling::div//p)[3]`;
  public readonly CLIENT_NAME_SEARCH_RESULT = `(//table[@id="ClientTable"]//tr[1]/td)[1]`;
  public readonly CLIENT_EMAIL_SEARCH_RESULT = `(//table[@id="ClientTable"]//tr[1]/td)[2]`;
  public readonly CLIENT_PHONE_SEARCH_RESULT = `(//table[@id="ClientTable"]//tr[1]/td)[3]`;
  public readonly CLIENT_STATUS_SEARCH_RESULT = `(//table[@id="ClientTable"]//tr[1]/td)[6]`;
  public readonly ADD_PASSENGER = `//button[text()="Add Passenger"]`;
  public readonly RELATED_PASSENGER_EXPAND = `(//button[contains(.,'Related Passengers')]/following-sibling::div//button)[1]`;
  public readonly RELATED_PASSENGER_EXPAND_FROM_TAB = `//div[@role="button" and @aria-label="Expand"]`;
  public readonly RELATED_PASSENGERS_EXPAND = `(//button[contains(.,'Related Passengers')])[1]`;
  public readonly TRASH_ICON_LOYALTY = `//h5[text()='Loyalty Program']/../../following-sibling::div//button[contains(@class,'text-red-500')]`;
  public readonly GENERAL_INTEREST_SECTION = `//h5[text()='General Interests']/following-sibling::div/div`;
  public readonly FLIGHT_PREFERENCES = `//h5[text()='Flight Preferences']/../../following-sibling::div`;
  public readonly ALLERGIES_RESTRICTIONS = `//h5[text()='Allergies & Dietary Restrictions']/../../following-sibling::div`;
  public readonly BEVERAGE_PREFERENCES_SECTION = `//h5[text()='Beverage Preferences']/following-sibling::div/div`;
  public readonly PILLOW_PREFERENCES_SECTION = `//h5[text()='Pillow Preferences']/following-sibling::div/div`;
  public readonly ROOM_CONFIGURATION_SECTION = `//h5[text()='Room Configuration Preferences']/following-sibling::div/div`;
  public readonly SPA_PREFERENCES_SECTION = `//h5[text()='Spa Preferences']/following-sibling::div/div`;
  public readonly GENERAL_LIKES_DISLIKES_SECTION = `//h5[text()='General Likes & Dislikes']/following-sibling::div/div`;
  public readonly COMFORT_RELATED_DETAILS_HEIGHT_SECTION = `//h5[text()='Comfort-related Details']/../../following-sibling::div/div/div[1]/div[2]`;
  public readonly COMFORT_RELATED_DETAILS_WHEIGHT_SECTION = `//h5[text()='Comfort-related Details']/../../following-sibling::div/div/div[2]/div[2]`;
  public readonly COMFORT_RELATED_DETAILS_SECTION = `//h5[text()='Comfort-related Details']/../../following-sibling::div/div[2]`;
  public readonly RELATED_PASSENGER_NAMES = `//a[contains(@href,'client-detail')]`;
  public readonly RELATED_PASSENGER_NAMES_STEP2 = `//div[@id="modal-content"]//label/span[2]`;
  public readonly CLIENT_LOGS = `(//span[text()='Client profile form updated by '])[1]`;
  public readonly AUDIT_LOGS = `//span[contains(.,'Audit Logs')]`;
  public readonly PASSPORT_ISSUE_COUNTRY_OPTION = (country: string) =>
    `//div[@role="listbox"]//p[text()='${country}']`;
  public readonly MAIN_PASSENGER_TAB = `(//div[contains(@class,"Layout_content")]//button[@aria-expanded="false"])[1]`;
  public readonly TRAVELER_ADDED = (traveler: string) =>
    `//tbody[@id="related_travellers_list"]/tr/td[2]/span[contains(.,'${traveler}')]//../../td//button[contains(@id,'dropdown')]`;
  public readonly REMOVE_TRAVELER_BY_NAME = (traveler: string) =>
    `//div[@aria-label="Expand"]//a[contains(.,'${traveler}')]/../../following-sibling::button`;
  public readonly RELATED_PASSENGER_FIRST_NAME = (index: number) =>
    `//input[@name="related_passengers.${index}.client.first_name"]`;

  public readonly RELATED_PASSENGER_LAST_NAME = (index: number) =>
    `//input[@name="related_passengers.${index}.client.last_name"]`;

  public readonly RELATED_PASSENGER_DATE_OF_BIRTH = (index: number) =>
    `//*[contains(@for,'related_passengers.${index}.client.date_of_birth')]/following-sibling::div`;

  public readonly RELATED_PASSENGER_GENDER = (index: number) =>
    `//input[@name="related_passengers.${index}.client.gender"]`;

  public readonly RELATED_PASSENGER_EMAIL = (index: number) =>
    `//input[@name="related_passengers.${index}.client.email"]`;

  public readonly RELATED_PASSENGER_PHONE_NUMBER = (index: number) =>
    `//input[@name="related_passengers.${index}.client.phone"]`;

  public readonly RELATED_PASSENGER_ADDRESS_LINE_1 = (index: number) =>
    `//input[@name="related_passengers.${index}.client.client_mailing_address"]`;
  public readonly RELATED_PASSENGER_COUNTRY = (index: number) =>
    `//select[@name="related_passengers.${index}.client.country"]`;

  public readonly RELATED_PASSENGER_CITY = (index: number) =>
    `//input[@name="related_passengers.${index}.client.client_mailing_city"]`;

  public readonly RELATED_PASSENGER_ZIP_CODE = (index: number) =>
    `//input[@name="related_passengers.${index}.client.zip_code"]`;

  public readonly RELATED_PASSENGER_PASSPORT = (index: number) =>
    `//input[@name="related_passengers.${index}.client.passport_number"]`;
  public readonly SAME_AS_PRIMARY_ADDRESS_TOGGLE = `//label[text()="Same as primary passenger"]/preceding-sibling::button`;
  public readonly EMERGENCY_CONTACT_FIELD = (variable: string) =>
    `//input[@name="primary_passenger.client.emergency_contact_${variable}"]`;
  public readonly TRAVEL_DATA_GLOBAL_ENTRY = `//input[@name="primary_passenger.tsa.global_entry"]`;
  public readonly TRAVEL_DATA_KTN = `//input[@name="primary_passenger.tsa.tsa_pre_check_number"]`;
  public readonly PASSPORT_NUMBER_TD = `//input[@name="primary_passenger.passport.passport_number"]`;
  public readonly SAVE_CHANGES = `//button[text()="Save changes"]`;
  public readonly NAME_EVENT = `//input[@name="important_dates.0.name"]`;
  public readonly IMPORTANT_DATES = (index: number) =>
    `//h5[text()="Important Dates"]/../following-sibling::div//tbody//td[${index}]`;

  public readonly LOYALTY_PROGRAM = (index: number) =>
    `//h5[text()="Loyalty Programs"]/../following-sibling::div//tbody//td[${index}]`;

  public readonly TRAVEL_DATA_NUMBER_BY_PROGRAM = (text: string) =>
    `//table//tr[contains(.,'${text}')]/td[2]//p`;
  public readonly TRAVEL_DATA_DATE_BY_PROGRAM = (text: string) =>
    `//table//tr[contains(.,'${text}')]/td[3]//p`;

  public readonly EDIT_DATE_BY_FIELD = (field: string) =>
    `//label[text()='${field}']/following-sibling::div//input`;

  public async clickCreate() {
    await this.page.locator(this.HEADER).click();
  }
  public async clickAddClient() {
    await this.page.getByRole('link', { name: 'Add Client' }).click();
  }
  public async quickAdd() {
    await this.page.locator(this.QUICK_ADD).click({ force: true });
  }
  public async saveQuickAdd() {
    await this.page.getByRole('button', { name: 'Save' }).click();
  }
  public async startFromScratch() {
    await this.page.getByRole('button', { name: 'Start from scratch' }).click();
  }
  public async mainInformationQuickAdd(LAST_NAME: string, email: string) {
    const emailInput = this.page.locator('#qa_email');
    await emailInput.evaluate((el, value) => {
      const input = el as HTMLInputElement;
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      )?.set;

      setter?.call(input, value);
      input.dispatchEvent(new InputEvent('input', { bubbles: true, data: value as string }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
      input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));
    }, email);
    await this.page.waitForTimeout(500);
    await this.page.getByRole('textbox', { name: 'Enter Preferred name' }).fill('TestName');
    await this.page.getByRole('textbox', { name: 'Enter First Name' }).fill('FirstName');
    await this.page.getByRole('textbox', { name: 'Enter Last Name' }).fill(LAST_NAME);
    await this.page.getByRole('textbox', { name: 'Enter Middle Name' }).fill('Middle');
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
  public async searchClientByName(client: string) {
    await this.page.getByRole('textbox', { name: 'Search' }).waitFor({ state: 'visible' });
    await this.page.getByRole('textbox', { name: 'Search' }).fill(client);
    await this.page.getByRole('textbox', { name: 'Search' }).press('Enter');
    await this.page.waitForTimeout(1500);
  }

  public async deleteAddedTraveler(traveler: string) {
    await this.page.locator(this.REMOVE_TRAVELER_BY_NAME(traveler)).first().click();
  }
  public async confirmDelete() {
    await this.page.locator(this.CONFIRM_DELETE).click();
    await this.page.waitForTimeout(3000);
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
    await this.page.getByRole('textbox', { name: 'Street address' }).first().fill(value);
  }

  public async selectCountry(value: string) {
    await this.page.locator(`//div[text()='Select country']/../following-sibling::div`).click();
    await this.page.locator(`//div[@role="listbox"]/div/p[text()='${value}']`).click();
  }

  public async fillCity(value: string) {
    await this.page.getByRole('textbox', { name: 'Enter city' }).first().fill(value);
  }

  public async fillZipCode(value: string) {
    await this.page.getByRole('textbox', { name: 'Enter ZIP or postal code' }).first().fill(value);
  }

  public async fillPassport(value: string) {
    await this.page.getByRole('textbox', { name: 'Passport' }).fill(value);
  }
  public async checkCertify() {
    await this.page.locator(`//span[contains(.,'I certify the information')]`).last().click();
  }
  public async confirmSubmission() {
    await this.page.locator(this.CONFIRM_SUBMISSION).click();
    await this.page.locator(this.CREATE_CLIENT).click();
  }
  public async addPassenger() {
    await this.page.locator(this.ADD_PASSENGER).click();
  }
  public async expandRelatedPassengers() {
    await this.page.locator(this.RELATED_PASSENGERS_EXPAND).click();
  }
  public async expandRelatedPassenger() {
    await this.page.locator(this.RELATED_PASSENGER_EXPAND).click();
  }
  public async expandRelatedPassengerFromTab() {
    await this.page.locator(this.RELATED_PASSENGER_EXPAND_FROM_TAB).click();
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
  public async fillRelatedFirstName(value: string, index: number = 0) {
    await this.page.locator(this.RELATED_PASSENGER_FIRST_NAME(index)).fill(value);
  }

  public async fillRelatedLastName(value: string, index: number = 0) {
    await this.page.locator(this.RELATED_PASSENGER_LAST_NAME(index)).fill(value);
  }

  public async fillRelatedDateOfBirth(index: number = 0) {
    await this.page.locator(this.RELATED_PASSENGER_DATE_OF_BIRTH(index)).click();
    await this.page.locator(`//select[@aria-label="Select year"]`).selectOption('1990');
    await this.page.locator(`//select[@aria-label="Select year"]`).selectOption('1990');
    await this.page.waitForTimeout(300);
    await this.page.locator(`(//div[contains(@class,"datepicker__week")]/div[1])[3]`).click();
  }

  public async selectRelatedGender() {
    await this.page.locator(this.PRIMARY_PASSENGER_GENDER).click();
    await this.page.locator(`//p[text()='Male']`).click();
  }

  public async fillRelatedEmail(value: string, index: number = 0) {
    await this.page.locator(this.RELATED_PASSENGER_EMAIL(index)).fill(value);
  }

  public async fillRelatedPhoneNumber(value: string, index: number = 0) {
    await this.page.locator(this.RELATED_PASSENGER_PHONE_NUMBER(index)).fill(value);
  }

  public async fillRelatedAddressLine1(value: string, index: number = 0) {
    await this.page.locator(this.RELATED_PASSENGER_ADDRESS_LINE_1(index)).fill(value);
  }

  public async selectRelatedCountry(value: string) {
    await this.page.locator(`//div[text()='Select country']/../following-sibling::div`).click();
    await this.page.locator(`//div[@role="listbox"]/div/p[text()='${value}']`).click();
  }

  public async fillRelatedCity(value: string, index: number = 0) {
    await this.page.locator(this.RELATED_PASSENGER_CITY(index)).fill(value);
  }

  public async fillRelatedZipCode(value: string, index: number = 0) {
    await this.page.locator(this.RELATED_PASSENGER_ZIP_CODE(index)).fill(value);
  }

  public async fillRelatedPassport(value: string, index: number = 0) {
    await this.page.locator(this.RELATED_PASSENGER_PASSPORT(index)).fill(value);
  }
  public async goToRelatedTravelersTab() {
    await this.page.locator(this.RELATED_PASSENGERS_TAB).click({ force: true });
    await this.page.waitForLoadState('networkidle');
  }
  public async goToPreferencesTab() {
    await this.page.locator(this.PREFERENCES_TAB).click();
  }
  public async clickShare() {
    await this.page.locator(this.SHARE_BUTTON).click();
  }
  public async clickSendForms() {
    await this.page.locator(this.SEND_FORMS).click();
  }
  public async checkCCForm() {
    await this.page.locator(this.CREDIT_CARD_FORM_RADIO).click();
  }
  public async checkProfileForm() {
    await this.page.locator(this.PROFILE_FORM_CARD_RADIO).click();
  }
  public async fillShareEmail(email: string) {
    await this.page.locator(`//input[@id="clientEmail"]`).fill(email);
  }
  public async fillShareEmailCC(email: string) {
    await this.page.locator(`//input[@id="cc"]`).fill(email);
  }
  public async fillShareEmailBCC(email: string) {
    await this.page.locator(`//input[@id="bcc"]`).fill(email);
  }
  public async fillShareEMessage(message: string) {
    await this.page.locator(`//textarea[@id="clientMessage"]`).fill(message);
  }
  public async sendForm() {
    await this.page.locator(this.SHARE_SEND_FORM).click();
  }

  public async expandTravelProfileAndPreferences() {
    await this.page.locator(`//h4[text()="Travel Profile & Preferences"]/../..`).click();
  }
  public async fillEmergencyContact(data: {
    name: string;
    email: string;
    phone: string;
    relationship: string;
  }) {
    await this.page.locator(`//h5[text()="Emergency Contact"]/../..`).click();
    await this.page.locator(this.EMERGENCY_CONTACT_FIELD('name')).fill(data.name);
    await this.page.locator(this.EMERGENCY_CONTACT_FIELD('email')).fill(data.email);
    await this.page.locator(this.EMERGENCY_CONTACT_FIELD('phone')).fill(data.phone);
    await this.page
      .locator(`//div[text()='Select relationship']/../following-sibling::div`)
      .click();
    await this.page.locator(`//div[@role="option"]/p[text()='${data.relationship}']`).click();
  }

  public async fillBillingAdress() {
    await this.page.locator(`//h5[text()="Billing Address"]/../..`).click();
    await this.page
      .locator(`//label[text()='Same as Mailing Address']/preceding-sibling::button`)
      .click();
  }

  public async fillTravelData(global_entry: string, ktn: string) {
    await this.page.locator(`//h5[text()="Travel Data"]/../..`).click();
    await this.page.locator(this.TRAVEL_DATA_GLOBAL_ENTRY).fill(global_entry);
    await this.page
      .locator(`//label[text()='Global entry expiry date']/following-sibling::div//input`)
      .click();
    await this.page.locator(`//select[@aria-label="Select year"]`).selectOption('2030');
    await this.page.waitForTimeout(200);
    await this.page
      .locator(
        `//div[@class="react-datepicker__week"][3]//div[@role="option" and @aria-disabled="false"]`,
      )
      .last()
      .click();
    await this.page.locator(this.TRAVEL_DATA_KTN).fill(ktn);
    await this.page
      .locator(`//label[text()='KTN expiry date']/following-sibling::div//input`)
      .click();
    await this.page.locator(`//select[@aria-label="Select year"]`).selectOption('2030');
    await this.page.waitForTimeout(200);
    await this.page
      .locator(
        `//div[@class="react-datepicker__week"][3]//div[@role="option" and @aria-disabled="false"]`,
      )
      .last()
      .click();
    await this.page.locator(this.PASSPORT_NUMBER_TD).fill('44444444');
    await this.page
      .locator(`//label[text()='Passport expiry date']/following-sibling::div//input`)
      .click();
    await this.page.waitForTimeout(200);
    await this.page.locator(`//select[@aria-label="Select year"]`).selectOption('2030');
    await this.page
      .locator(
        `//div[@class="react-datepicker__week"][3]//div[@role="option" and @aria-disabled="false"]`,
      )
      .last()
      .click();
  }

  public async fillLoyaltyProgram() {
    await this.page.locator(`//h5[text()="Loyalty Program"]/../..`).click();
    await this.page.locator(`//button[text()='Add New Loyalty Program']`).click();
    await this.page
      .locator(`//div[text()='Select loyalty program']/../following-sibling::div`)
      .click();
    await this.page
      .locator(`//div[@role="option"]/p[text()='American Airlines: AAdvantage']`)
      .click();
    await this.page.waitForTimeout(300);
    await this.page
      .locator(`//input[@name="primary_passenger.loyalty_numbers.0.number"]`)
      .fill('23423412');
  }

  public async fillAllergiesAndDietaryRestrictions() {
    await this.page.locator(`//h5[text()="Allergies & Dietary Restrictions"]/../..`).click();
    await this.page
      .locator(`//textarea[@name="primary_passenger.preference_data.allergies"]`)
      .fill(
        'Peanut allergy, tree nut allergy, lactose intolerance, gluten intolerance, shellfish allergy, sesame allergy, soy allergy, egg allergy, dairy-free, gluten-free, vegetarian, vegan.',
      );
  }

  public async fillFlightPreferences() {
    await this.page.locator(`//h5[text()="Flight Preferences"]/../..`).click();
    await this.page.getByRole('radio', { name: 'Commercial' }).check();
    await this.page.getByRole('radio', { name: 'Aisle' }).check();
    await this.page.getByRole('button', { name: 'First Class' }).click();
  }

  public async fillTravelPreferencesByCategory() {
    await this.page.getByRole('button', { name: 'Travel Preferences by Category' }).click();
    await this.page
      .getByRole('textbox', { name: 'Please let us know any flight' })
      .fill(
        'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.',
      );
    await this.page.getByRole('button', { name: 'Stay' }).click();
    await this.page.getByRole('button', { name: 'Boutique Hotels' }).click();
    await this.page.getByRole('button', { name: 'Design-Focused Hotels' }).click();
    await this.page
      .getByRole('textbox', { name: 'What else should we know?' })
      .fill(
        'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.',
      );
    await this.page.getByRole('button', { name: 'Lifestyle' }).click();
    await this.page.getByRole('button', { name: 'Adventure' }).click();
    await this.page.getByRole('button', { name: 'Red Wine' }).click();
    await this.page.getByRole('button', { name: 'Foam Pillows' }).click();
    await this.page.getByRole('button', { name: 'King Beds' }).click();
    await this.page.getByRole('button', { name: 'Female Therapist' }).click();
    await this.page
      .getByRole('textbox', { name: "If you're an spa enthusiast," })
      .fill('Ad litora torquent per conubia nostra inceptos himenaeos.');
    await this.page
      .getByRole('textbox', { name: 'As we craft your trip, any' })
      .fill('Ad litora torquent per conubia nostra inceptos himenaeos.');
    await this.page.getByRole('button', { name: 'Personal' }).click();
    await this.page.getByRole('button', { name: 'Metric' }).click();
    await this.page
      .locator(
        'input[name="primary_passenger.preference_data.personal.comfort_related.metric.height"]',
      )
      .fill('180');
    await this.page
      .locator(
        'input[name="primary_passenger.preference_data.personal.comfort_related.metric.weight"]',
      )
      .fill('80');
    await this.page
      .getByRole('textbox', { name: 'Please provide any personal' })
      .fill(
        'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. ',
      );
  }
  public async selectAirports(airports: string[]) {
    await this.page
      .locator(
        `//div[contains(.,'Select airports') and contains(@id,'select')]/../following-sibling::div`,
      )
      .click();
    for (const airport of airports) {
      await this.page
        .locator(`//div[contains(@id,'listbox')]/div[contains(.,'${airport}')]`)
        .click();
    }
    await this.page.locator(`//h5[text()='Preferred Home Airport(s)']`).click();
  }

  public async editClientBySection(section: string) {
    await this.page.locator(`//h5[text()='${section}']/following-sibling::button`).click();
  }
  public async editBasicInfoFirstName(value: string) {
    await this.page.locator(this.PRIMARY_PASSENGER_FIRST_NAME).fill(value);
  }

  public async editBasicInfoLastName(value: string) {
    await this.page.locator(this.PRIMARY_PASSENGER_LAST_NAME).fill(value);
  }

  public async editBasicInfoEmail(value: string) {
    await this.page.locator(this.PRIMARY_PASSENGER_EMAIL).fill(value);
  }

  public async editBasicInfoDOB(value: string) {
    await this.page.locator(this.PRIMARY_PASSENGER_DATE_OF_BIRTH).fill(value);
  }

  public async editBasicInfoGender(value: string) {
    await this.page.locator(this.PRIMARY_PASSENGER_GENDER).click();
    await this.page.locator(`//p[text()='${value}']`).click();
  }

  public async editBasicInfoPhoneNumber(value: string) {
    await this.page.locator(this.PRIMARY_PASSENGER_PHONE_NUMBER).fill(value);
  }

  public async editBasicInfoPreferredAirport(value: string) {
    await this.page.locator('#airport_container').getByLabel('', { exact: true }).click();
    await this.page.locator('input[type="search"]').fill(value);
    await this.page.getByRole('treeitem', { name: value, exact: true }).click();
  }
  public async saveChanges() {
    await this.page.locator(this.SAVE_CHANGES).click();
  }
  public async editSelectCountry(value: string) {
    await this.page.locator(`(//p[text()='Country'])[1]/following-sibling::div/div/div[2]`).click();
    await this.page.locator(`//div[@role="listbox"]/div/p[text()='${value}']`).click();
  }
  public async editEmergencyContact(data: { name: string; email: string; phone: string }) {
    await this.page.locator(this.EMERGENCY_CONTACT_FIELD('name')).fill(data.name);
    await this.page.locator(this.EMERGENCY_CONTACT_FIELD('email')).fill(data.email);
    await this.page.locator(this.EMERGENCY_CONTACT_FIELD('phone')).fill(data.phone);
  }
  public async editAddressLine1(value: string) {
    await this.page.getByRole('textbox', { name: 'Street address' }).first().fill(value);
    await this.page.locator(`//label[text()='Address Line 2']`).first().click();
  }
  public async addDocument() {
    await this.page.locator(this.ADD_DOCUMENT).click();
  }
  public async thisIsAPassport() {
    await this.page
      .locator(`//label[text()='This is a passport']/preceding-sibling::button`)
      .click();
  }
  public async addNewPassportv2(passport_name: string) {
    await this.page.locator(this.INPUT_PASSPORT).setInputFiles('./data/images/testImage.jpg');
    await this.page.locator(this.PASSPORT_NUMBER).fill(passport_name);
    await this.page.locator(this.PASSPORT_ISSUE_COUNTRY).click();
    await this.page.locator(this.PASSPORT_ISSUE_COUNTRY_OPTION('United States')).click();
    await this.page.waitForTimeout(100);
    await this.page.locator(this.PASSPORT_DATE_OF_ISSUE).click();
    await this.page.locator(`//div[@class="react-datepicker__week"][3]/div[3]`).click();
    await this.page.locator(this.PASSPORT_DATE_OF_EXPIRY).click();
    await this.page.locator(`//div[@class="react-datepicker__week"][4]/div[6]`).click();
    await this.page.locator(this.ADD_DOCUMENT_BUTTON).click();
    await this.page.waitForTimeout(2500);
  }
  public async editNameEvent(name: string) {
    await this.page.locator(this.NAME_EVENT).fill(name);
  }
  public async addDate() {
    await this.page.getByRole('textbox', { name: 'MM/DD/YYYY' }).press('Enter');
    await this.page.getByRole('textbox', { name: 'MM/DD/YYYY' }).fill('03/03/2030');
  }
  public async addFrequency() {
    await this.page.locator(`//p[text()='Frequency']/following-sibling::div/div/div[2]`).click();
    await this.page.locator(`//div[@role="option"]/p[text()='Monthly']`).click();
  }
  public async editLoyaltyProgram(name: string) {
    await this.page.waitForTimeout(1000);
    await this.page
      .locator(`//p[text()='Loyalty program']/following-sibling::div/div/div[2]`)
      .click();
    await this.page.locator(`//div[@role="option"]/p[text()='${name}']`).click();
  }
  public async editLoyaltyProgramNumber(number: string) {
    await this.page
      .locator(`//input[@name="primary_passenger.loyalty_numbers.0.number"]`)
      .fill(number);
  }
  public async editNumberByType(name: string, number: string) {
    await this.page.locator(`//label[text()='${name}']/following-sibling::div/input`).fill(number);
  }
  public async editDate(name: string, date: string) {
    await this.page.locator(this.EDIT_DATE_BY_FIELD(name)).press('Enter');
    await this.page.locator(this.EDIT_DATE_BY_FIELD(name)).fill(date);
  }
  public async clickAuditLogs() {
    await this.page.locator(this.AUDIT_LOGS).click();
  }
}
export const clients = (page: Page) => new Clients({ page });
