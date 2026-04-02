import { Page } from '@playwright/test';

export class AirRequest {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }
  public readonly AGENT_SELECT = `(//p[contains(.,'Agent name')]//..//div)[2]/div/div[1]`;
  public readonly EMAIL_INPUT = (index: number) => `(//input[@type='email'])[${index}]`;
  public readonly PHONE_INPUT = `//input[@name="phoneNumber"]`;
  public readonly CONTINUE_BUTTON = `//button[contains(.,'Continue')]`;
  public readonly CANCEL_BUTTON = `//button[contains(.,'Cancel')]`;
  public readonly AGENT_SUCCESS = `//span[contains(.,'Agent information')]//..//div`;
  public readonly PASSENGERS_SUCCESS = `//span[contains(.,'Passengers')]//..//div`;
  public readonly TRAVEL_PREFERENCES = `//span[contains(.,'Travel preferences')]//..//div`;
  public readonly TRIP_OVERVIEW_SUCCESS = `//span[contains(.,'Trip overview')]//..//div`;
  public readonly AGENTS_OPTIONS = `(//div[contains(@id,'listbox')]/div/p)`;
  public readonly DRAFTS_ELEMENTS = `//div[@id="modal-content"]/div/div/div[2]/div`;
  public readonly DRAFTS_ELEMENTS_TIME_ONLY = `//div[@id="modal-content"]/div/div/div[2]/div/div[2]/p[2]`;
  public readonly DRAFTS_ELEMENTS_ID_ONLY = `//div[@id="modal-content"]/div/div/div[2]/div/div[2]/p[1]`;
  public readonly HEADER = `//h2`;
  public readonly HEADER_H4 = `//h4`;
  public readonly USERNAME_HEADER = `//div[contains(@class,"flex items-center gap-6")]//p[2]`;
  public readonly DELETE_DRAFTS = `//div[@id="modal-content"]/div/div/div[2]/div/button`;
  public readonly CONFIRM_DELETE_DRAFTS = `//dialog//button[contains(.,'Delete Draft')]`;
  public readonly SEARCH_DRAFT = `//dialog//input[@name="search"]`;
  public readonly POP_UP_DIALOG = `//dialog`;
  public readonly POP_UP_HEADER = `//dialog//h2`;
  public readonly POP_UP_TEXT = `//dialog//p`;
  public readonly POP_UP_CANCEL = `//dialog//button[contains(.,'Cancel')]`;
  public readonly POP_UP_ADD_PASSENGERS = `//dialog//button[contains(.,'Add Passengers')]`;
  public readonly SPINNER_LOADER = `(//div[contains(@class,'Spinner')])[1]`;
  public readonly DOMESTIC_RADIO = `//label[contains(.,'Domestic')]//../input`;
  public readonly AIRPORTS_VALID_RESULTS = `//div/div/../label/span`;
  public readonly FIRST_NAME_PASSENGER = (index: number) =>
    `//input[contains(@name,'${index}.first_name')]`;
  public readonly MIDDLE_NAME_PASSENGER = (index: number) =>
    `//input[contains(@name,'${index}.middle_name')]`;
  public readonly LAST_NAME_PASSENGER = (index: number) =>
    `//input[contains(@name,'${index}.last_name')]`;
  public readonly PASSENGER_EMAIL = (index: number) => `//input[contains(@name,'${index}.email')]`;
  public readonly CLIENT_ID = `//input[contains(@name,'client_identity')]`;
  public readonly GENDER_RED_ASTERISK = `//input[contains(@name,'gender')]//..//p[contains(@class,'after:text-red-500')]`;
  public readonly GENDER_DROPDOWN = (index: number = 1) =>
    `(//p[text()='Gender']/following-sibling::div/div/div[2])[${index}]`;
  public readonly GENDER_DROPDOWN_POPUP = `//dialog//div[contains(.,'Select...') and contains(@id,'select')]/../../div[2]`;
  public readonly MALE_DROPDOWN = `//div[@role="listbox"]//p[contains(.,'Male')]`;
  public readonly FEMALE_DROPDOWN = `//div[@role="listbox"]//p[contains(.,'Female')]`;
  public readonly ADD_PASSPORT_INFORMATION = (index: number = 1) =>
    `(//label[contains(.,'Add passport information')]//..//button)[${index}]`;
  public readonly ADD_ADDITIONAL_PASSENGER = `//button[contains(.,'Add Additional Passenger')]`;
  public readonly CERTIFY_CHECKBOX = `//span[contains(.,'I certify the information')]//..//span`;
  public readonly DELETE_TRAVELER_BUTTON = `//button[contains(.,'Delete traveler')]`;
  public readonly KNOW_TRAVELER_LABEL = `//label[contains(.,'Known traveler number')]`;
  public readonly WARNING_EMAIL = `//label[contains(.,'Email')]//../p`;
  public readonly WARNING_EMAIL_INPUT = `//label[contains(.,'Email')]//..//input`;
  public readonly WARNING_PHONE = `//label[contains(.,'Phone')]//../p`;
  public readonly WARNING_NAME = `//label[contains(@for,'first_name')]//../p`;
  public readonly WARNING_MIDDLE_NAME = `//label[contains(@for,'middle_name')]//../p`;
  public readonly WARNING_LAST_NAME = `//label[contains(@for,'last_name')]//../p`;
  public readonly WARNING_DOB = `//label[contains(@for,'date-day')]//../p`;
  public readonly PHONE_FLAG = `//button//img[contains(@src,'/icons/flags')]`;
  public readonly PHONE_INPUT_PASSENGER = (index: number = 0) =>
    `//input[contains(@name,'${index}.phone')]`;
  public readonly PHONE_INPUT_PASSENGER_DIV = (index: number = 0) =>
    `//input[contains(@name,'${index}.phone')]/..`;
  public readonly DOB_DAY = (index: number = 1) => `(//input[contains(@id,'dob-day')])[${index}]`;
  public readonly DOB_YEAR = (index: number = 1) => `(//input[@name="year"])[${index}]`;
  public readonly DOB_MONTH = (index: number = 1) =>
    `(//label[@for="date-day"]/following-sibling::div//span[contains(@id,"live-region")]/following-sibling::div/div[2])[${index}]`;
  public readonly JANUARY_OPTION = `//div[contains(@id,'option') and contains(.,'January')]`;
  public readonly MONTH_OPTION = (month: string) =>
    `//div[contains(@id,'option') and contains(.,'${month}')]`;
  public readonly UPLOAD_FILE_BUTTON = `//button[contains(.,'Upload Files')]`;
  public readonly UPLOAD_MORE_FILE_BUTTON = `//button[contains(.,'Upload More Files')]`;
  public readonly UPLOAD_FILE_P = `//button[contains(.,'Upload Files')]//../../p`;
  public readonly INPUT_FILE = `//input[contains(@id,'passportFileInput')]`;
  public readonly FILES_UPLOAD_POPUP = `//form[@id="passenger-form"]/../div`;
  public readonly FILES_UPLOAD_POPUP_TITLE = `//form[@id="passenger-form"]/../div//p`;
  public readonly FILES_UPLOAD_POPUP_IMG = `//form[@id="passenger-form"]/../div//img`;
  public readonly FILES_UPLOAD_POPUP_CANCEL = `//form[@id="passenger-form"]/../div//button[contains(.,'Cancel')]`;
  public readonly FILES_UPLOAD_POPUP_CLOSE = `//form[@id="passenger-form"]/../div//button[contains(.,'Close')]`;
  public readonly FILES_UPLOAD_POPUP_UPLOAD_FILES = `//form[@id="passenger-form"]/../div//button[contains(.,'Upload Files')]`;
  public readonly FILES_UPLOAD_POPUP_SUCCESS_BAR = `(//form[@id="passenger-form"]/../div//div[contains(@style,'width: 100%')])[1]`;
  public readonly FILES_UPLOAD_POPUP_SUCCESS_BAR_2 = `(//form[@id="passenger-form"]/../div//div[contains(@style,'width: 100%')])[2]`;
  public readonly UPLOADED_IMAGES = `//form[@id="passenger-form"]/..//button//../div/img[contains(@src,'https')]`;
  public readonly AVAILABLE_CHECKBOXES = `//dialog//input[contains(@type,"checkbox")]/../span[1]`;
  public readonly NAMES_FOR_AVAILABLE_CHECKBOXES = `//dialog//input[contains(@type,"checkbox")]/../span[2]`;
  public readonly SELECTED_PASSENGER_IN_INPUT = `//dialog/div/div/div/div/span`;
  public readonly UPLOAD_MORE_FILES = `//button[contains(.,'Upload More Files')]`;
  public readonly ADD_NEW_TRAVELER = `//button[contains(.,'Add New Traveler')]`;
  public readonly GO_BACK_TO_THE_LIST = `//button[contains(.,'Go Back to the List')]`;
  public readonly NT_FIRST_NAME = `//dialog//input[@name="first_name"]`;
  public readonly NT_LAST_NAME = `//dialog//input[@name="last_name"]`;
  public readonly NT_EMAIL = `//dialog//input[@name="email"]`;
  public readonly NT_PHONE = `//dialog//input[@name="phone"]`;
  public readonly FLIGHT_2_X = `//div/p[contains(.,'Flight 2')]//../div/div[1]/div[5]/button`;
  public readonly FLIGHT_3_X = `//div/p[contains(.,'Flight 3')]//../div/div[1]/div[5]/button`;
  public readonly SAVE_TO_CLIENTS_PROFILE = `//span[contains(.,"Save to client's profile")]//../span[1]`;
  public readonly GROUP_OR_FAMILY_MEMBER = `//span[contains(.,"Group or family member")]//../span[1]`;
  public readonly RELATIONSHIP = `//dialog//div[contains(.,'Relationship') and contains(@id,'select')]/../../div[2]`;
  public readonly STEP_BACK = `//button[contains(.,'Step Back')]`;
  public readonly RELATIONSHIP_OPTION = (relationship: string) =>
    `//div[contains(@id,'option') and contains(.,'${relationship}')]`;
  public readonly P_BY_TEXT = (text: string) => `//p[contains(.,'${text}')]`;
  public readonly LABEL_BY_TEXT = (text: string) => `//label[contains(.,'${text}')]`;
  public readonly PROGRAM_NUMBER = (index: number = 1) =>
    `(//input[contains(@name,'0.program_number')])[${index}]`;
  public readonly SEARCH_TRAVELERS = `//dialog//input[@placeholder="Search travelers"]`;
  public readonly FREQUENT_FLYER_PROGRAM = `//button[contains(.,'Add Frequent Flyer Program')]`;
  public readonly FREQUENT_FLYER_PROGRAM_SELECT = `(//p[contains(.,'Airline program')]/../div/div/div[2])`;
  public readonly FREQUENT_FLYER_PROGRAM_SELECTED = `(//p[contains(.,'Airline program')]/../div/div/div[1]/div)[1]`;
  public readonly AIRLINE_PROGRAMS = `//div[contains(@id,'listbox')]//div`;
  public readonly DELETE_FF_PROGRAM = `//p[contains(.,'Frequent flyer program')]/../div//button`;
  public readonly TRIP_NOTES = `//label[contains(.,'Additional trip notes')]/../following-sibling::div//textarea`;
  public readonly CITY_COUNTRY_RESULT = `//div/div/../../../li/div/div/div/p[2]`;
  public readonly EMPTY_RESULTS = `//div/div/div/ul/li/div`;
  public readonly PREVIOUS_MONTH = `(//button[@aria-label="Previous Month"])[1]`;
  public readonly ROUND_TRIP_RADIO = `//*[@id="radio-round-trip-0"]`;
  public readonly ADDED_IMAGE_TRIP_OVERVIEW = `//form//img`;
  public readonly ARRIVAL_INPUT_PASSENGER_2 = `//input[@name="passengerTrips.1.flights.0.arrival"]`;
  public readonly ARRIVAL_INPUT_PASSENGER_2_FLIGHT2 = `//input[@name="passengerTrips.1.flights.1.arrival"]`;
  public readonly DEPARTURE_DATE_INPUT_PASSENGER_1 = `//input[@name="passengerTrips.0.flights.0.departure_date"]`;
  public readonly DEPARTURE_DATE_INPUT_PASSENGER_2 = `//input[@name="passengerTrips.1.flights.0.departure_date"]`;
  public readonly REFUNDABLE_NON_REFUNDABLE_RADIO = `(//input[@name="price_quote_type"])[1]`;
  public readonly REFUNDABLE_RADIO = `(//input[@name="price_quote_type"])[2]`;
  public readonly NON_REFUNDABLE_RADIO = `(//input[@name="price_quote_type"])[3]`;
  public readonly SPECIAL_REQUEST_TEXTAREA = `//textarea[@name="special_request"]`;
  public readonly EDIT_PASSENGER_INFORMATION = `//button[contains(.,'Edit Passengers Information')]`;
  public readonly UPDATE_TRIP_INFORMATION = `//button[contains(.,'Update Trip Information')]`;
  public readonly UPDATE_TRAVEL_PREFERENCES = `//button[contains(.,'Update Travel Preferences')]`;
  public readonly FULL_NAME = `//p[contains(normalize-space(.), 'Full name')]/following-sibling::p[1]`;
  public readonly GENDER = `//p[contains(normalize-space(.), 'Gender')]/following-sibling::p[1]`;
  public readonly EMAIL = `//p[contains(normalize-space(.), 'Email')]/following-sibling::p[1]`;
  public readonly DATE_OF_BIRTH = `//p[contains(normalize-space(.), 'Date of birth')]/following-sibling::p[1]`;
  public readonly CLIENT_ID_5 = `//p[contains(normalize-space(.), "Client's ID")]/following-sibling::p[1]`;
  public readonly PHONE_NUMBER = `//p[contains(normalize-space(.), 'Phone number')]/following-sibling::p[1]`;
  public readonly DEPARTURE_FROM = `//p[contains(normalize-space(.), 'Departure from')]/following-sibling::div//span`;
  public readonly ARRIVE_AT = `//p[contains(normalize-space(.), 'Arrive at')]/following-sibling::div//span`;
  public readonly TRAVEL_DATES = `//p[contains(normalize-space(.), 'Travel dates')]/following-sibling::p`;
  public readonly TRAVEL_DATE = `//p[contains(normalize-space(.), 'Travel date')]/following-sibling::p`;
  public readonly DEPARTURE_TIME = `//p[contains(normalize-space(.), 'Preferred departure time')]/following-sibling::div//p`;
  public readonly ARRIVAL_TIME = `//p[contains(normalize-space(.), 'Preferred arrival time')]/following-sibling::div//p`;
  public readonly CABIN_CLASS = `//p[contains(normalize-space(.), 'Preferred cabin class')]/following-sibling::div//p`;
  public readonly AIRLINES = `//p[contains(normalize-space(.), 'Airlines')]/following-sibling::div//p`;
  public readonly AIRCRAFT = `//p[contains(normalize-space(.), 'Aircraft')]/following-sibling::div//p`;
  public readonly SEATS = `//p[contains(normalize-space(.), 'Seats')]/following-sibling::p`;
  public readonly REQUESTS = `//p[contains(normalize-space(.), 'Requests')]/following-sibling::div//p`;
  public readonly AGENT_NAME = `//p[contains(normalize-space(.), 'Agent name')]/following-sibling::p`;
  public readonly AGENCY = `//p[contains(normalize-space(.), 'Agency')]/following-sibling::p`;
  public readonly DEPARTURE_FLIGHT1 = `//p[contains(.,'Flight 1')]/following-sibling::div/div//input[@placeholder="Departing from"]`;
  public readonly DEPARTURE_FLIGHT2 = `//p[contains(.,'Flight 2')]/following-sibling::div/div//input[@placeholder="Departing from"]`;
  public readonly DEPARTURE_FLIGHT1_PASSENGER2 = `//p[contains(.,'Flight 1')]/following-sibling::div/div//input[@placeholder="Departing from"]`;
  public readonly DEPARTURE_FLIGHT2_DIV = `//p[contains(.,'Flight 2')]/following-sibling::div/div//input[@placeholder="Departing from"]/following-sibling::div`;
  public readonly CONFIRMATION_STEP_5 = `//input[contains(@id,'checkbox')]/following-sibling::span`;
  public readonly SUBMIT_REQUEST = `//button[contains(.,'Submit Request')]`;
  public readonly AIRLINE_PROGRAM_BY_NAME = (text: string) =>
    `//div[contains(@id,'listbox')]//div/p[contains(.,'${text}')]`;
  public readonly REMOVE_FILE_BUTTON = `//div/following-sibling::button[contains(@class,'bg-red-500')]`;

  public async clickCancel() {
    await this.page.locator(this.CANCEL_BUTTON).click();
  }
  public async clickCancelAndWait() {
    await this.page.locator(this.CANCEL_BUTTON).click();
    await this.page.waitForTimeout(1800);
  }
  public async clickContinue() {
    await this.page.waitForLoadState('networkidle');
    await this.page.locator(this.CONTINUE_BUTTON).waitFor({ state: 'attached' });
    await this.page.locator(this.CONTINUE_BUTTON).click({ force: true });
  }
  public async searchDraftByID(draftID: string) {
    await this.page.locator(this.SEARCH_DRAFT).fill(draftID);
  }
  public async waitLong() {
    await this.page.waitForTimeout(4000);
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
  public async getPrefilledData(index: number = 1) {
    const phone = await this.page.locator(this.PHONE_INPUT).inputValue();
    const email = await this.page.locator(this.EMAIL_INPUT(index)).inputValue();
    const agentRaw = await this.page.locator(this.AGENT_SELECT).textContent();
    const agent = agentRaw?.trim() ?? '';
    return { agent, phone, email };
  }
  public async getLoggedUsername() {
    const username = await this.page.locator(this.USERNAME_HEADER).textContent();
    return username ? username : 'not found';
  }
  public async selectAgent() {
    await this.page
      .locator('div')
      .filter({ hasText: /^Select an agent$/ })
      .nth(1)
      .click();
  }
  public async selectFirstAgent() {
    await this.page.locator(`(//div[contains(@id,'listbox')]/div/p)[2]`).click();
  }
  public async startFromScrath() {
    await this.page.getByRole('button', { name: 'Start from scratch' }).click({ force: true });
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForTimeout(800);
  }
  public async startFromScrathAndGetUserData() {
    const waitForCreate = this.page.waitForResponse(
      (res) =>
        res.ok() && res.request().method() === 'GET' && res.url().includes('/api/air-request/'),
    );
    await this.page.getByRole('button', { name: 'Start from scratch' }).click();
    const response = await waitForCreate;
    const responseData = await response.json();
    await this.page.waitForTimeout(3000);
    return { responseData };
  }
  public async startFromDraft() {
    await this.page.getByRole('button', { name: 'Choose from Draft' }).click({ delay: 400 });
  }
  public async returnFirstDraftTime() {
    return await this.page.locator(this.DRAFTS_ELEMENTS_TIME_ONLY).first().textContent();
  }
  public async returnFirstDraftName() {
    return (
      (await this.page.locator(this.DRAFTS_ELEMENTS_ID_ONLY).first().textContent()) ?? 'Not Found'
    );
  }
  public async clickFirstDraftTime() {
    await this.page.locator(this.DRAFTS_ELEMENTS_TIME_ONLY).first().click();
  }
  public async clickAirRequest() {
    await this.page.locator(`//button[contains(.,'Air Request')]`).click();
  }
  public async goToCreditCard() {
    await this.page.getByRole('tab', { name: 'credit card' }).click();
  }
  public async searchClient(client: string) {
    await this.page.getByRole('textbox', { name: 'Search' }).fill(client);
    await this.page.getByRole('textbox', { name: 'Search' }).press('Enter');
    await this.page.getByText('Candice & Ben (Conway)').click();
  }
  public async waitForSpinner() {
    const spinner = this.page.locator(this.SPINNER_LOADER);
    await spinner.waitFor({ state: 'visible', timeout: 200 }).catch(() => {});
    await spinner.waitFor({ state: 'hidden', timeout: 5000 });
  }

  public async clickGenderDropdown(index: number = 1) {
    await this.page.locator(this.GENDER_DROPDOWN(index)).click();
  }
  public async selectMale() {
    await this.page.locator(this.MALE_DROPDOWN).click();
  }
  public async fillPassengerEmail(email: string, index: number = 1) {
    await this.page.locator(this.EMAIL_INPUT(index)).fill(email);
  }
  public async fillPassengerFirstName(name: string, index: number = 0) {
    await this.page.locator(this.FIRST_NAME_PASSENGER(index)).fill(name);
  }
  public async fillPassengerMiddleName(name: string, index: number = 0) {
    await this.page.locator(this.MIDDLE_NAME_PASSENGER(index)).fill(name);
  }
  public async fillPassengerLastName(name: string, index: number = 0) {
    await this.page.locator(this.LAST_NAME_PASSENGER(index)).fill(name);
  }
  public async clearPassengerLastName(index: number = 0) {
    await this.page.waitForTimeout(500);
    await this.page.locator(this.LAST_NAME_PASSENGER(index)).clear();
    await this.page.locator(this.LAST_NAME_PASSENGER(index)).press('Tab');
    await this.page.waitForTimeout(500);
  }
  public async clickLabel() {
    await this.page.locator(this.KNOW_TRAVELER_LABEL).last().click();
    await this.page.waitForTimeout(300);
  }
  public async fillPassengerPhone(phone: string, index: number = 0) {
    await this.page.locator(this.PHONE_INPUT_PASSENGER(index)).fill(phone);
    await this.page.locator(this.PHONE_INPUT_PASSENGER(index)).press('Tab');
    await this.page.waitForTimeout(1000);
  }
  public async checkCertify() {
    await this.page.locator(this.CERTIFY_CHECKBOX).first().click();
  }
  public async checkCertifySecondPassenger() {
    await this.page
      .locator("(//span[contains(.,'I certify the information')]//..//span)[4]")
      .first()
      .click();
  }
  public async fillDateOfBirth(index: number = 1) {
    await this.page.locator(this.DOB_DAY(index)).fill('15');
    await this.page.locator(this.DOB_YEAR(index)).fill('1990');
    await this.page.locator(this.DOB_MONTH(index)).click();
    await this.page.locator(this.JANUARY_OPTION).click();
  }
  public async fillDayOfBirth(day: string, index: number = 1) {
    await this.page.locator(this.DOB_DAY(index)).fill(day);
  }
  public async clearDayOfBirth(index: number = 1) {
    await this.page.waitForTimeout(500);
    await this.page.locator(this.DOB_DAY(index)).clear();
    await this.page.locator(this.DOB_DAY(index)).press('Tab');
  }
  public async fillYearOfBirth(year: string, index: number = 1) {
    await this.page.locator(this.DOB_YEAR(index)).fill(year);
  }
  public async clearYearOfBirth(index: number = 1) {
    await this.page.locator(this.DOB_YEAR(index)).clear();
  }
  public async fillMonth(index: number = 1) {
    await this.page.waitForTimeout(400);
    await this.page.locator(this.DOB_MONTH(index)).click();
    await this.page.locator(this.JANUARY_OPTION).click();
  }
  public async addPassportInformation(index: number = 1) {
    const passportButton = this.page.locator(this.ADD_PASSPORT_INFORMATION(index));
    const ariaChecked = await passportButton.getAttribute('aria-checked');
    if (ariaChecked === 'false') {
      await passportButton.click();
    }
  }
  public async addAdditionalPassenger() {
    await this.page.locator(this.ADD_ADDITIONAL_PASSENGER).click();
    await this.page.waitForTimeout(2000);
  }
  public async addIncorrectFile() {
    await this.page.locator(this.INPUT_FILE).setInputFiles('./data/docs/testDoc.txt');
  }
  public async addLargeSizeFile() {
    const largeBuffer = Buffer.alloc(26 * 1024 * 1024); // 26 MB

    await this.page.setInputFiles(this.INPUT_FILE, {
      name: 'fake-large.pdf',
      mimeType: 'application/pdf',
      buffer: largeBuffer,
    });
  }
  public async addFilePassport(image: string) {
    await this.page.locator(this.INPUT_FILE).setInputFiles(`./data/images/${image}`);
    await this.page.waitForTimeout(1500);
  }
  public async removeFilesIfPresent() {
    const removeButton = this.page.locator(this.REMOVE_FILE_BUTTON);
    while ((await removeButton.count()) > 0) {
      await removeButton.first().click();
      await this.page.waitForTimeout(500);
    }

    await this.page
      .locator(this.UPLOAD_FILE_P, { hasText: 'Drag your file(s) to start uploading' })
      .first()
      .waitFor({ state: 'visible' });

    await this.page.waitForTimeout(1500);
  }
  public async uploadAddedFiles() {
    await this.page.waitForTimeout(1000);
    await this.page.locator(this.FILES_UPLOAD_POPUP_UPLOAD_FILES).click({ delay: 500 });
    await this.page.waitForTimeout(4500);
  }
  public async closePopUp() {
    await this.page.locator(this.FILES_UPLOAD_POPUP_CLOSE).click();
  }
  public async selectFirstPassenger() {
    await this.page.locator(this.AVAILABLE_CHECKBOXES).first().click();
  }
  public async deleteTraveler() {
    await this.page.locator(this.DELETE_TRAVELER_BUTTON).click();
  }
  public async addPassenger() {
    const waitForCreate = this.page.waitForResponse(
      (res) =>
        res.ok() && res.request().method() === 'POST' && res.url().includes('/api/air-request/'),
    );
    await this.page.locator(this.POP_UP_ADD_PASSENGERS).click({ delay: 200 });
    const response = await waitForCreate;
    const json = await response.json();
    const passenger = json.data?.[0];
    return {
      email: passenger.email ?? '',
      phone: passenger.phone ?? '',
      firstName: passenger.first_name ?? '',
      lastName: passenger.last_name ?? '',
    };
  }

  public async newTravelerDOB(month: string, day: string, year: string, index: number = 2) {
    await this.page.locator(this.DOB_DAY(index)).fill(day);
    await this.page.locator(this.DOB_YEAR(index)).fill(year);
    await this.page.locator(this.DOB_MONTH(index)).click();
    await this.page.locator(this.MONTH_OPTION(month)).click();
  }
  public async addNewTraveler() {
    await this.page.locator(this.ADD_NEW_TRAVELER).click();
  }
  public async goBackToTheList() {
    await this.page.locator(this.GO_BACK_TO_THE_LIST).click();
  }
  public async newTravelerName(name: string) {
    await this.page.locator(this.NT_FIRST_NAME).fill(name);
  }
  public async newTravelerLastName(lastName: string) {
    await this.page.locator(this.NT_LAST_NAME).fill(lastName);
  }
  public async newTravelerEmail(email: string) {
    await this.page.locator(this.NT_EMAIL).fill(email);
  }
  public async newTravelerPhone(phone: string) {
    await this.page.locator(this.NT_PHONE).fill(phone);
  }
  public async newTravelerGender() {
    await this.page.locator(this.GENDER_DROPDOWN_POPUP).click();
  }
  public async checkFamilyMember() {
    await this.page.locator(this.GROUP_OR_FAMILY_MEMBER).click();
  }
  public async saveToClientsProfile() {
    await this.page.locator(this.SAVE_TO_CLIENTS_PROFILE).click();
  }
  public async goBack() {
    await this.page.locator(this.STEP_BACK).click();
  }
  public async selectRelationship(relationship: string) {
    await this.page.locator(this.RELATIONSHIP).click();
    await this.page.locator(this.RELATIONSHIP_OPTION(relationship)).click();
  }
  public async searchTraveler(traveler: string) {
    await this.page.locator(this.SEARCH_TRAVELERS).fill(traveler);
    await this.page.waitForTimeout(1500);
  }
  public async addFrequentFlyerProgram() {
    await this.page.waitForTimeout(300);
    await this.page.locator(this.FREQUENT_FLYER_PROGRAM).last().click();
  }
  public async selectFrequentFlyerProgram() {
    await this.page.locator(this.FREQUENT_FLYER_PROGRAM_SELECT).last().click();
  }
  public async deleteLastFrequentFlyerProgram() {
    await this.page.locator(this.DELETE_FF_PROGRAM).last().click();
  }
  public async selectoptionGGProgram(option: string) {
    await this.page.locator(this.AIRLINE_PROGRAM_BY_NAME(option)).last().click({ delay: 400 });
  }
  public async fillProgramNumber(number: string, index: number = 1) {
    await this.page.waitForTimeout(400);
    const input = this.page.locator(this.PROGRAM_NUMBER(index));
    await input.click();
    await input.clear();
    await input.fill(number);
    await this.page.waitForTimeout(400);
  }
  public async selectOneWayTrip() {
    await this.page.getByRole('radio', { name: 'One-way' }).first().click();
    await this.page.waitForTimeout(400);
  }
  public async selectOneWayTripPassenger2() {
    await this.page.getByRole('radio', { name: 'One-way' }).last().click();
    await this.page.waitForTimeout(400);
  }
  public async selectRoundTrip() {
    await this.page.getByRole('radio', { name: 'Round-trip' }).first().click();
    await this.page.waitForTimeout(400);
  }
  public async selectRoundTripPassenger2() {
    await this.page.getByRole('radio', { name: 'Round-trip' }).last().click();
    await this.page.waitForTimeout(400);
  }

  public async selectMultiCityTrip() {
    await this.page.getByRole('radio', { name: 'Multi-city' }).first().click();
    await this.page.waitForTimeout(400);
  }
  public async selectMultiCityTripPassenger2() {
    await this.page.getByRole('radio', { name: 'Multi-city' }).last().click();
    await this.page.waitForTimeout(400);
  }
  public async selectSpecificFlight() {
    await this.page
      .locator(`//label[text()='Client requested a specific flight?']/preceding-sibling::button`)
      .first()
      .click();
    await this.page.waitForTimeout(800);
  }
  public async selectSpecificFlightPassenger2() {
    await this.page.getByRole('switch', { name: 'Client requested a specific' }).last().click();
    await this.page.waitForTimeout(400);
  }
  public async enterFlightDetails(flightDetails: string) {
    await this.page.locator(`//textarea[contains(@name,"flight_details")]`).fill(flightDetails);
  }
  public async selectDepartureAirport(airport: string, airportShort: string) {
    await this.page.getByRole('textbox', { name: 'Departing from' }).click();
    await this.page.getByRole('textbox', { name: 'Departing from' }).clear();
    await this.page.getByRole('textbox', { name: 'Departing from' }).click();
    await this.page.getByRole('textbox', { name: 'Departing from' }).fill(airportShort);
    await this.page.waitForTimeout(400);
    await this.page.locator(`//div[contains(.,'${airport}')]/../label/span`).first().click();
    await this.page.waitForTimeout(400);
  }

  public async selectDepartureAirportFlight1(airport: string, airportShort: string) {
    await this.page.waitForTimeout(300);
    await this.page.getByRole('textbox', { name: 'Departing from' }).first().click({ force: true });
    await this.page.getByRole('textbox', { name: 'Departing from' }).first().fill(airportShort);
    await this.page.waitForTimeout(300);
    await this.page.locator(`//div[contains(.,'${airport}')]/../label/span`).first().click();
  }
  public async selectDepartureAirportFlight2(airport: string, airportShort: string) {
    await this.page.waitForTimeout(700);
    await this.page.getByRole('textbox', { name: 'Departing from' }).last().click({ force: true });
    await this.page.getByRole('textbox', { name: 'Departing from' }).last().fill(airportShort);
    await this.page.waitForTimeout(600);
    await this.page.locator(`//div[contains(.,'${airport}')]/../label/span`).first().click();
  }
  public async selectDepartureAirportFlight1Passenger1(airport: string, airportShort: string) {
    await this.page.waitForTimeout(500);
    await this.page.locator(this.DEPARTURE_FLIGHT1).first().click({ force: true });
    await this.page.locator(this.DEPARTURE_FLIGHT1).first().fill(airportShort);
    await this.page.waitForSelector(`//div[contains(.,'${airport}')]/../label/span`);
    await this.page.locator(`//div[contains(.,'${airport}')]/../label/span`).first().click();
    await this.clickGeneric();
  }
  public async selectDepartureAirportFlight2Passenger1(airport: string, airportShort: string) {
    await this.page.waitForTimeout(500);
    await this.page.locator(this.DEPARTURE_FLIGHT2).first().click({ force: true });
    await this.page.locator(this.DEPARTURE_FLIGHT2).first().fill(airportShort);
    await this.page.waitForSelector(`//div[contains(.,'${airport}')]/../label/span`);
    await this.page.locator(`//div[contains(.,'${airport}')]/../label/span`).first().click();
  }
  public async selectDepartureAirportFlight1Passenger2(airport: string, airportShort: string) {
    await this.page.waitForTimeout(500);
    await this.page.locator(this.DEPARTURE_FLIGHT1_PASSENGER2).last().click({ force: true });
    await this.page.locator(this.DEPARTURE_FLIGHT1_PASSENGER2).last().fill(airportShort);
    await this.page.waitForSelector(`//div[contains(.,'${airport}')]/../label/span`);
    await this.page.locator(`//div[contains(.,'${airport}')]/../label/span`).first().click();
    await this.clickGeneric();
  }
  public async selectDepartureAirport2Letters(airportShort: string) {
    await this.page.getByRole('textbox', { name: 'Departing from' }).click();
    await this.page.getByRole('textbox', { name: 'Departing from' }).clear();
    await this.page.getByRole('textbox', { name: 'Departing from' }).click();
    await this.page.waitForTimeout(700);
    await this.page.getByRole('textbox', { name: 'Departing from' }).fill(airportShort);
    await this.page.waitForTimeout(700);
  }
  public async selectDepartureAirport2LettersFlight1(airportShort: string) {
    await this.page.getByRole('textbox', { name: 'Departing from' }).first().click();
    await this.page.getByRole('textbox', { name: 'Departing from' }).first().clear();
    await this.page.getByRole('textbox', { name: 'Departing from' }).first().click();
    await this.page.waitForTimeout(700);
    await this.page.getByRole('textbox', { name: 'Departing from' }).first().fill(airportShort);
    await this.page.waitForTimeout(700);
  }
  public async selectDepartureAirport2LettersFlight2(airportShort: string) {
    await this.page.getByRole('textbox', { name: 'Departing from' }).last().click();
    await this.page.getByRole('textbox', { name: 'Departing from' }).last().clear();
    await this.page.getByRole('textbox', { name: 'Departing from' }).last().click();
    await this.page.waitForTimeout(700);
    await this.page.getByRole('textbox', { name: 'Departing from' }).last().fill(airportShort);
    await this.page.waitForTimeout(700);
  }
  public async selectArrivalAirport2Letters(airportShort: string) {
    await this.page.getByRole('textbox', { name: 'Arriving at' }).click();
    await this.page.getByRole('textbox', { name: 'Arriving at' }).clear();
    await this.page.getByRole('textbox', { name: 'Arriving at' }).click();
    await this.page.waitForTimeout(700);
    await this.page.getByRole('textbox', { name: 'Arriving at' }).fill(airportShort);
    await this.page.waitForTimeout(700);
  }
  public async selectArrivalAirport2LettersFligh1(airportShort: string) {
    await this.page.getByRole('textbox', { name: 'Arriving at' }).first().click();
    await this.page.getByRole('textbox', { name: 'Arriving at' }).first().clear();
    await this.page.waitForTimeout(700);
    await this.page.getByRole('textbox', { name: 'Arriving at' }).first().fill(airportShort);
    await this.page.waitForTimeout(700);
  }
  public async selectArrivalAirport2LettersFligh2(airportShort: string) {
    await this.page.getByRole('textbox', { name: 'Arriving at' }).last().click();
    await this.page.getByRole('textbox', { name: 'Arriving at' }).last().clear();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('textbox', { name: 'Arriving at' }).last().fill(airportShort);
    await this.page.waitForTimeout(500);
  }
  public async selectArrivalAirport(airport: string, airportShort: string) {
    await this.page.getByRole('textbox', { name: 'Arriving at' }).click();
    await this.page.getByRole('textbox', { name: 'Arriving at' }).clear();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('textbox', { name: 'Arriving at' }).fill(airportShort);
    await this.page.waitForTimeout(500);
    await this.page
      // .locator(`//div[contains(.,'${airport}')]/../label/span`)
      .locator(`(//p[contains(.,'${airport}')]/../../../../div)`)
      .first()
      .click();
  }

  public async overWriteArrivalAirportFlight1(airport: string, airportShort: string) {
    await this.page.waitForTimeout(500);
    await this.page.locator(`//input[@name="passengerTrips.0.flights.0.arrival"]`).first().click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('button').filter({ hasText: /^$/ }).nth(1).first().click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('textbox', { name: 'Arriving at' }).first().click();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('textbox', { name: 'Arriving at' }).first().fill(airportShort);
    await this.page.waitForTimeout(500);
    await this.page.locator(`//p[contains(.,'${airport}')]`).first().click();
    await this.page.waitForTimeout(400);
  }
  public async overWriteArrivalAirportFlight2(airport: string, airportShort: string) {
    await this.page.waitForTimeout(700);
    await this.page
      .locator(`//input[@name="passengerTrips.0.flights.1.arrival"]`)
      .first()
      .click({ delay: 200 });
    await this.page.waitForTimeout(700);
    await this.page.locator(`//input[@name="passengerTrips.0.flights.1.arrival"]`).first().clear();
    await this.page.locator(`//input[@name="passengerTrips.0.flights.1.arrival"]`).first().click();
    await this.page
      .locator(`//input[@name="passengerTrips.0.flights.1.arrival"]`)
      .first()
      .fill(airportShort);
    await this.page.waitForTimeout(700);
    await this.page.locator(`//div[contains(.,'${airport}')]/../label/span`).first().click();
    await this.page.waitForTimeout(400);
  }
  public async selectArrivalAirportFlight1(airport: string, airportShort: string) {
    await this.page.waitForTimeout(700);
    await this.page.getByRole('textbox', { name: 'Arriving at' }).first().click();
    await this.page.getByRole('textbox', { name: 'Arriving at' }).first().clear();
    await this.page.waitForTimeout(700);
    await this.page.getByRole('textbox', { name: 'Arriving at' }).first().fill(airportShort);
    await this.page.waitForTimeout(700);
    await this.page.locator(`//p[contains(.,'${airport}')]`).first().click();
  }
  public async selectArrivalAirportFlight2(airport: string, airportShort: string) {
    await this.page.waitForTimeout(700);
    await this.page.getByRole('textbox', { name: 'Arriving at' }).last().click();
    await this.page.getByRole('textbox', { name: 'Arriving at' }).last().clear();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('textbox', { name: 'Arriving at' }).last().fill(airportShort);
    await this.page.waitForTimeout(500);
    await this.page.locator(`//div[contains(.,'${airport}')]/../label/span`).last().click();
  }
  public async selectTravelDate() {
    await this.page.getByRole('textbox', { name: 'Departure date' }).click();
  }
  public async selectTravelDateFlight1() {
    await this.page.getByRole('textbox', { name: 'Departure date' }).first().click();
  }
  public async selectTravelDateFlight2Passenger1() {
    await this.page
      .locator('input[name="passengerTrips.0.flights.1.departure_date"]')
      .first()
      .click();
  }
  public async selectTravelDateFlight1Passenger2() {
    await this.page
      .locator('input[name="passengerTrips.1.flights.0.departure_date"]')
      .first()
      .click();
  }
  public async selectTravelDateFlight2() {
    await this.page.getByRole('textbox', { name: 'Departure date' }).last().click();
  }
  public async selectTravelDateRoundTrip() {
    await this.page.getByRole('textbox', { name: 'Travel dates' }).first().click();
  }
  public async selectTravelDateRoundTripPassenger2() {
    await this.page.getByRole('textbox', { name: 'Travel dates' }).last().click();
  }

  public async confirmDates(date: string = '15th') {
    await this.page
      .locator(`//div[contains(@aria-label,'${date}') and contains(@aria-disabled,"false")]`)
      .last()
      .click();
    await this.page.getByRole('button', { name: 'Confirm dates' }).click();
  }
  public async confirmDatesRoundTrip() {
    await this.page
      .locator(`//div[contains(@aria-label,'15th') and contains(@aria-disabled,"false")]`)
      .last()
      .click();
    await this.page
      .locator(`//div[contains(@aria-label,'25th') and contains(@aria-disabled,"false")]`)
      .last()
      .click();
    await this.page.getByRole('button', { name: 'Confirm dates' }).click();
  }
  public async selectDepartureTime(time: string) {
    await this.page.locator(`//input/..//div[contains(.,'Departure time')]`).click();
    await this.page.locator(`//div[contains(.,'${time}')]/../label/span`).first().click();
    await this.clickGeneric();
  }
  public async selectDepartureTimeFlight1(time: string) {
    await this.page.locator(`//input/..//div[contains(.,'Departure time')]`).first().click();
    await this.page.locator(`//div[contains(.,'${time}')]/../label/span`).first().click();
    await this.clickGeneric();
  }
  public async selectDepartureTimeFlight2(time: string) {
    await this.page.locator(`//input/..//div[contains(.,'Departure time')]`).last().click();
    await this.page.locator(`//div[contains(.,'${time}')]/../label/span`).first().click();
    await this.page.waitForTimeout(500);
    await this.clickGeneric();
  }
  public async selectOutboundTime(time: string, index: number = 1) {
    await this.page
      .locator(`(//input/..//div[contains(.,'Outbound flight')]/..//../div[2])[${index}]`)
      .click();
    await this.page.locator(`//div[contains(.,'${time}')]/../label/span`).first().click();
    await this.clickGeneric();
  }
  public async selectReturnTimeIndex(time: string, index: number = 1) {
    await this.page
      .locator(`(//input/..//div[contains(.,'Return flight')]/..//../div[2])[${index}]`)
      .click();
    await this.page.locator(`//div[contains(.,'${time}')]/../label/span`).first().click();
    await this.clickGeneric();
  }
  public async selectReturnTime(time: string) {
    await this.page.locator(`//input/..//div[contains(.,'Return flight')]`).click();
    await this.page.locator(`//div[contains(.,'${time}')]/../label/span`).first().click();
    await this.clickGeneric();
  }
  public async clickGeneric() {
    await this.page
      .locator(
        `//div[contains(@class,'Layout')]//p[text()='Complete the form below and our team will promptly work on finding the perfect flight options for your journey']`,
      )
      .first()
      .click();
  }
  public async sameItinerary() {
    await this.page
      .locator(
        `//label[text()='Are all travelers on the same itinerary?']/preceding-sibling::button`,
      )
      .click();
  }

  public async selectCabinClass(cabin: string) {
    await this.page.waitForTimeout(500);
    await this.page
      .locator(`//p[contains(.,'Preferred cabin class')]/../div/div/div/div[2]`)
      .click({ force: true });
    await this.page.locator(`//div[contains(.,'${cabin}')]/../label/span`).first().click();
    await this.clickGeneric();
  }

  public async selectCabinClassMultiF1(cabin: string) {
    await this.page.waitForTimeout(400);
    await this.page
      .locator(
        `//div[contains(.,'Select cabin class') and contains(@id,'select')]/../../div/following-sibling::div`,
      )
      .first()
      .click({ force: true });
    await this.page.waitForTimeout(400);
    await this.page.locator(`//div[contains(.,'${cabin}')]/../label/span`).first().click();
    await this.clickGeneric();
  }
  public async selectCabinClassMultiF2(cabin: string) {
    await this.page.waitForTimeout(200);
    await this.page
      .locator(
        `//div[contains(.,'Select cabin class') and contains(@id,'select')]/../../div/following-sibling::div`,
      )
      .last()
      .click({ force: true });
    await this.page.waitForTimeout(200);
    await this.page.locator(`//div[contains(.,'${cabin}')]/../label/span`).first().click();
    await this.clickGeneric();
  }
  public async addAdditionalTripNotes(notes: string) {
    await this.page.locator(this.TRIP_NOTES).last().fill(notes);
  }
  public async addAFlight() {
    await this.page.getByRole('button', { name: 'Add a Flight' }).click();
  }
  public async removeFlight3() {
    await this.page.locator(this.FLIGHT_3_X).click();
  }
  public async uploadFiles(image: string) {
    await this.page
      .locator('//input[@id="specific-flights"]')
      .setInputFiles(`./data/images/${image}`);
    await this.page.waitForTimeout(1500);
  }
  public async uploadAddedFilesTripOverview() {
    await this.page.waitForTimeout(1000);
    await this.page.getByRole('button', { name: 'Upload Files' }).nth(1).click();
  }
  public async closeAddedFilesTripOverview() {
    await this.page.getByRole('button', { name: 'Close' }).last().click();
  }
  public async getArrivalAirport(index: number) {
    const airport = await this.page
      .locator(`//input[@name="passengerTrips.${index}.flights.0.arrival"]`)
      .textContent();
    return airport;
  }
  public async getArrivalAirportFligh2(index: number) {
    const airport = await this.page
      .locator(`//input[@name="passengerTrips.${index}.flights.1.arrival"]`)
      .textContent();
    return airport;
  }
  public async getDepartureDate(index: number) {
    const airport = await this.page
      .locator(`//input[@name="passengerTrips.${index}.flights.0.departure_date"]`)
      .inputValue();
    return airport;
  }

  public async checkRefundableRadio() {
    await this.page.locator(this.REFUNDABLE_RADIO).check();
  }
  public async checkNonRefundableRadio() {
    await this.page.locator(this.NON_REFUNDABLE_RADIO).check();
  }
  public async addPreferredAirlines() {
    await this.page
      .locator(`(//div[contains(.,'No preference') and contains(@id,'select')]/../../div[2])[1]`)
      .first()
      .click();
    await this.page.getByRole('option', { name: 'American Airlines (AA)' }).click();
    await this.page.getByRole('option', { name: 'Delta (DL)' }).click();
  }
  public async addPreferredAircrafts() {
    await this.page
      .locator(`(//div[contains(.,'No preference') and contains(@id,'select')]/../../div[2])`)
      .last()
      .click();
    await this.page.getByRole('option', { name: 'Airbus 330-900' }).click();
    await this.page.getByRole('option', { name: 'Boeing Dreamliner' }).click();
  }
  public async selectPreferences() {
    await this.page.locator(`//span[contains(.,'Price sensitive')]//../span[1]`).first().click();
    await this.page
      .locator(`//span[contains(.,'Direct flights only')]//../span[1]`)
      .first()
      .click();
    await this.page
      .locator(`//span[contains(.,'Traveling with infant / child')]//../span[1]`)
      .first()
      .click();
    await this.page.locator(`//span[contains(.,'No red-eye flights')]//../span[1]`).first().click();
    await this.page
      .locator(`//span[contains(.,'Flexible dates for better fare')]//../span[1]`)
      .first()
      .click();
    await this.page.waitForLoadState('networkidle');
  }
  public async selectSeatsAndSpecialRequest(text: string = 'Test') {
    await this.page.locator(`//span[contains(.,'Window')]//../span[1]`).first().click();
    await this.page.locator(this.SPECIAL_REQUEST_TEXTAREA).fill(text);
  }
  public async getCharCountSpecialRequest() {
    const charCount = await this.page.locator(this.SPECIAL_REQUEST_TEXTAREA).textContent();
    return charCount;
  }
  public async expandLegFlights() {
    await this.page.getByRole('button', { name: 'Leg 1' }).click();
    await this.page.getByRole('button', { name: 'Leg 2' }).click();
  }
  public async expandFlights() {
    await this.page.getByRole('button', { name: 'Flight 1' }).click();
    await this.page.getByRole('button', { name: 'Flight 2' }).click();
  }
}
export const airRequest = (page: Page) => new AirRequest({ page });
