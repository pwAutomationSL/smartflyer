import { test, expect } from '../../../fixtures/PlaywrightFixtures';

import { uniqueId } from '../../../page-objects';
const MAIN_PASSENGER_NAME = 'FirstName';
const MAIN_PASSENGER_LAST_NAME = 'LastName' + uniqueId();
const MAIN_PASSENGER_EMAIL = 'LastName' + uniqueId() + '@gmail.com';
const PHONE = '18333333333';
const ADDRESS_LINE_1 = '5th Avenue';
const ZIP_CODE = '12312';
const COUNTRY = 'United States';
const CITY = 'New York';
const MAIN_PASSENGER_NAME_EDITED = 'FirstNameEdited';
const MAIN_PASSENGER_LAST_NAME_EDITED = 'LastNameEdited' + uniqueId();
const MAIN_PASSENGER_EMAIL_EDITED = 'LastNameEdited' + uniqueId() + '@gmail.com';
const PHONE_EDITED = '18444444444';
const ADDRESS_LINE_1_EDITED = 'Madison Avenue';
const ZIP_CODE_EDITED = '10001';
const COUNTRY_EDITED = 'Barbados';
const CITY_EDITED = 'Boston';
const PREFERENCES_AIRPORTS = ['IOM - Isle of Man', 'JAA - Jalalabad - Afghanistan'];
const emergencyContact = {
  name: 'John Doe',
  email: 'john.doe@test.com',
  phone: '14155552671',
  relationship: 'Assistant',
};
const emergencyContactEdited = {
  name: 'John DoeEdited',
  email: 'john.doeEdited@test.com',
  phone: '14155552675',
};

const normalizePhoneNumber = (str: string | null | undefined): string => {
  if (!str) return '';
  return str.replace(/\D/g, '');
};

test.use({
  launchOptions: { slowMo: 700 },
});

test.describe('CLI-001 - Client - Add Client - Edits by section and Finally check Logs', () => {
  test('Login at Society (env) as an Admin and add a client ', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    clients,
    toast,
  }) => {
    await test.step('1 - Login at Society as an Admin', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 25000 });
    });
    await test.step('2 - Go to “Clients” under the main navigation menu of Society', async () => {
      await sidebar.goToModule('Clients');
      await clients.clickAddClient();
      await clients.startFromScratch();
      await expect(page.locator(clients.PRIMARY_PASSENGER)).toBeVisible();
      await expect(page.locator(clients.RELATED_PASSENGERS)).toBeVisible();
    });
    await test.step('3 - Fill Mandatory information for Main Passenger and check if green icon is visible', async () => {
      await clients.expandMainPassenger();
      await clients.fillFirstName(MAIN_PASSENGER_NAME);
      await clients.fillLastName(MAIN_PASSENGER_LAST_NAME);
      await clients.fillDateOfBirth();
      await clients.selectGender();
      await clients.fillEmail(MAIN_PASSENGER_EMAIL);
      await clients.fillPhoneNumber(PHONE);
      await clients.fillAddressLine1(ADDRESS_LINE_1);
      await clients.selectCountry(COUNTRY);
      await clients.fillCity(CITY);
      await clients.fillZipCode(ZIP_CODE);
      await clients.checkCertify();
      await expect(page.locator(clients.PRIMARY_PASSENGER_GREEN_CHECK)).toBeVisible();
      await expect(page.locator(clients.PRIMARY_PASSENGER_GREEN_CHECK)).toHaveCSS(
        'fill',
        'rgb(7, 188, 12)',
      );
    });
    await test.step('4 - Add Profile picture and Confirm Submission', async () => {
      await clients.uploadProfilePicture();
      await expect(page.locator(toast.TOAST_MESSAGE_APP)).toContainText(
        'Image cropped successfully',
      );
      await expect(page.locator(clients.CONFIRM_SUBMISSION)).toBeEnabled();
      await clients.expandTravelProfileAndPreferences();
      await clients.selectAirports(PREFERENCES_AIRPORTS);
      await clients.fillEmergencyContact(emergencyContact);
      await clients.fillBillingAdress();
      await clients.fillTravelData('234234234', '345345345');
      await clients.fillLoyaltyProgram();
      await expect(page.locator(clients.TRASH_ICON_LOYALTY)).toBeEnabled();
      await clients.fillAllergiesAndDietaryRestrictions();
      await clients.fillFlightPreferences();
      await clients.fillTravelPreferencesByCategory();
      await clients.confirmSubmission();
      await expect(page.locator(clients.HEADER)).toContainText(MAIN_PASSENGER_NAME, {
        timeout: 10000,
      });
      await expect(page.locator(clients.HEADER)).toContainText(MAIN_PASSENGER_LAST_NAME);
    });
  });
  test('Edit Created Client- verify individual popup for Basic Information Edit', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    clients,
    toast,
  }) => {
    const section = 'Basic Information';
    await test.step('1 - Login at Society as an Admin and search for the created client', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 25000 });
      await sidebar.goToModule('Clients');
      await clients.searchClientAndClick(MAIN_PASSENGER_LAST_NAME);
    });
    await test.step('2 -Go to clients tab and search for new client and verify is was added correctly', async () => {
      await expect(page.locator(clients.HEADER)).toContainText(MAIN_PASSENGER_NAME);
      await expect(page.locator(clients.HEADER)).toContainText(MAIN_PASSENGER_LAST_NAME);
      const phoneUI = await page.locator(clients.CLIENT_PROFILE_PHONE).textContent();
      expect(normalizePhoneNumber(phoneUI)).toEqual(PHONE);
      await expect(page.locator(clients.CLIENT_PROFILE_DOB)).toContainText('1990');
      await expect(page.locator(clients.CLIENT_PROFILE_EMAIL)).toContainText(MAIN_PASSENGER_EMAIL);
      await expect(page.locator(clients.CLIENT_PROFILE_EMAIL_BI)).toContainText(
        MAIN_PASSENGER_EMAIL,
      );
      const phoneUIBI = await page.locator(clients.CLIENT_PROFILE_PHONE_BI).textContent();
      expect(normalizePhoneNumber(phoneUIBI)).toEqual(PHONE);
      await expect(page.locator(clients.CLIENT_PROFILE_DOB_BI)).toContainText('1990');
      await expect(page.locator(clients.CLIENT_PROFILE_GENDER_BI)).toContainText('Male');
    });
    await test.step('2 -Edit Basic Information', async () => {
      await clients.editClientBySection(section);
      await expect(page.locator(clients.POPUP_EDIT_HEADER)).toContainText('Basic information');
      await expect(page.locator(clients.POPUP_EDIT_HEADER_INFO)).toContainText(
        'Core client details used for identification and communication.',
      );
      await clients.editBasicInfoFirstName(MAIN_PASSENGER_NAME_EDITED);
      await clients.editBasicInfoLastName(MAIN_PASSENGER_LAST_NAME_EDITED);
      await clients.editBasicInfoEmail(MAIN_PASSENGER_EMAIL_EDITED);
      await clients.editBasicInfoPhoneNumber(PHONE_EDITED);
      await clients.saveChanges();
      await expect(page.locator(toast.TOAST_MESSAGE_APP)).toContainText(
        'Client updated successfully',
      );
      await expect(page.locator(clients.HEADER)).toContainText(MAIN_PASSENGER_NAME_EDITED);
      await expect(page.locator(clients.HEADER)).toContainText(MAIN_PASSENGER_LAST_NAME_EDITED);
      await expect(page.locator(clients.CLIENT_PROFILE_EMAIL)).toContainText(
        MAIN_PASSENGER_EMAIL_EDITED,
      );
      await expect(page.locator(clients.CLIENT_PROFILE_EMAIL_BI)).toContainText(
        MAIN_PASSENGER_EMAIL_EDITED,
      );
      const phoneUIBI = await page.locator(clients.CLIENT_PROFILE_PHONE_BI).textContent();
      expect(normalizePhoneNumber(phoneUIBI)).toEqual(PHONE_EDITED);
    });
  });
  test('Edit Created Client- verify individual popup for Address Edit', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    clients,
    toast,
  }) => {
    const section = 'Address';
    await test.step('1 - Login at Society as an Admin and search for the created client', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 25000 });
      await sidebar.goToModule('Clients');
      await clients.searchClientAndClick(MAIN_PASSENGER_LAST_NAME_EDITED);
    });
    await test.step('2 -Edit Address', async () => {
      await clients.editClientBySection(section);
      await expect(page.locator(clients.POPUP_EDIT_HEADER)).toContainText(section);
      await expect(page.locator(clients.POPUP_EDIT_HEADER_INFO)).toContainText(
        'Client mailing and billing addresses on record.',
      );
      await clients.editAddressLine1(ADDRESS_LINE_1_EDITED);
      await clients.editSelectCountry(COUNTRY_EDITED);
      await clients.fillCity(CITY_EDITED);
      await clients.fillZipCode(ZIP_CODE_EDITED);
      await clients.saveChanges();
      await expect(page.locator(toast.TOAST_MESSAGE_APP)).toContainText(
        'Client updated successfully',
      );
      await expect(page.locator(clients.CLIENT_PROFILE_STREET_ADRESS)).toContainText(
        ADDRESS_LINE_1_EDITED,
      );
      await expect(page.locator(clients.CLIENT_PROFILE_ZIP_CODE_ADRESS)).toContainText(
        ZIP_CODE_EDITED,
      );
      await expect(page.locator(clients.CLIENT_PROFILE_COUNTRY_CITY_ADRESS)).toContainText(
        CITY_EDITED,
      );
      await expect(page.locator(clients.CLIENT_PROFILE_COUNTRY_CITY_ADRESS)).toContainText(
        COUNTRY_EDITED,
      );
    });
  });
  test('Edit Created Client- verify individual popup for Emergency Contact Edit', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    clients,
    toast,
  }) => {
    const section = 'Emergency Contact';
    await test.step('1 - Login at Society as an Admin and search for the created client', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 25000 });
      await sidebar.goToModule('Clients');
      await clients.searchClientAndClick(MAIN_PASSENGER_LAST_NAME_EDITED);
    });
    await test.step('2 -Edit Address', async () => {
      await clients.editClientBySection(section);
      await expect(page.locator(clients.POPUP_EDIT_HEADER)).toContainText('Emergency contact');
      await expect(page.locator(clients.POPUP_EDIT_HEADER_INFO)).toContainText(
        'Designated contact to reach in case of an emergency involving the client.',
      );
      await clients.editEmergencyContact(emergencyContactEdited);
      await clients.saveChanges();
      await expect(page.locator(toast.TOAST_MESSAGE_APP)).toContainText(
        'Client updated successfully',
      );
      await expect(page.locator(clients.CLIENT_PROFILE_EMERGENCY_CONTACT_NAME)).toContainText(
        emergencyContactEdited.name,
      );
      await expect(page.locator(clients.CLIENT_PROFILE_EMERGENCY_CONTACT_EMAIL)).toContainText(
        emergencyContactEdited.email,
      );
      const phoneUIBI = await page
        .locator(clients.CLIENT_PROFILE_EMERGENCY_CONTACT_PHONE)
        .textContent();
      expect(normalizePhoneNumber(phoneUIBI)).toEqual(emergencyContactEdited.phone);
    });
  });
  test('Edit Created Client- verify individual popup for Important Dates Edit', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    clients,
    toast,
  }) => {
    const section = 'Important Dates';
    await test.step('1 - Login at Society as an Admin and search for the created client', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 25000 });
      await sidebar.goToModule('Clients');
      await clients.searchClientAndClick(MAIN_PASSENGER_LAST_NAME_EDITED);
    });
    await test.step('2 -Edit Important Dates', async () => {
      await clients.clickDatesAndNumbers();
      await clients.editClientBySection(section);
      await expect(page.locator(clients.SAVE_CHANGES)).toBeDisabled();
      await expect(page.locator(clients.POPUP_EDIT_HEADER)).toContainText('Important dates');
      await expect(page.locator(clients.POPUP_EDIT_HEADER_INFO)).toContainText(
        'Manage important client travel dates and recurring events.',
      );
      await clients.editNameEvent('Special Event');
      await clients.addDate();
      await clients.addFrequency();
      await expect(page.locator(clients.SAVE_CHANGES)).toBeEnabled();
      await clients.saveChanges();
      await expect(page.locator(toast.TOAST_MESSAGE_APP)).toContainText(
        'Important dates updated successfully',
      );
      await expect(page.locator(clients.IMPORTANT_DATES(1))).toContainText('Special Event');
      await expect(page.locator(clients.IMPORTANT_DATES(2))).toContainText('Monthly');
    });
  });
  test('Edit Created Client- verify individual popup for Loyalty Programs Edit', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    clients,
    toast,
  }) => {
    const section = 'Loyalty Programs';
    const newLoyaltyProgram = 'Marriott Bonvoy';
    const newNumber = '99999999';
    await test.step('1 - Login at Society as an Admin and search for the created client', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 25000 });
      await sidebar.goToModule('Clients');
      await clients.searchClientAndClick(MAIN_PASSENGER_LAST_NAME_EDITED);
    });
    await test.step('2 -Edit Loyalty Programs', async () => {
      await clients.clickDatesAndNumbers();
      await clients.editClientBySection(section);
      await expect(page.locator(clients.SAVE_CHANGES)).toBeEnabled();
      await expect(page.locator(clients.POPUP_EDIT_HEADER)).toContainText('Loyalty programs');
      await expect(page.locator(clients.POPUP_EDIT_HEADER_INFO)).toContainText(
        'Airline and hotel loyalty memberships associated with the client.',
      );
      await clients.editLoyaltyProgram(newLoyaltyProgram);
      await clients.editLoyaltyProgramNumber(newNumber);
      await clients.saveChanges();
      await expect(page.locator(toast.TOAST_MESSAGE_APP)).toContainText(
        'Client updated successfully',
      );
      await expect(page.locator(clients.LOYALTY_PROGRAM(1))).toContainText(newLoyaltyProgram);
      await expect(page.locator(clients.LOYALTY_PROGRAM(2))).toContainText(newNumber);
    });
  });
  test('Edit Created Client- verify individual popup for Important Travel Data Edit', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    clients,
    toast,
  }) => {
    const section = 'Important Travel Data';
    const program1 = 'Global entry number';
    const program2 = 'Known traveler number (KTN)';
    const program3 = 'Passport';
    const editedNumber1 = '11111111';
    const editedNumber2 = '22222222';
    const editedNumber3 = '33333333';
    const editedDate = '03/03/2033';
    await test.step('1 - Login at Society as an Admin and search for the created client', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 25000 });
      await sidebar.goToModule('Clients');
      await clients.searchClientAndClick(MAIN_PASSENGER_LAST_NAME_EDITED);
    });
    await test.step('2 -Edit Loyalty Programs', async () => {
      await clients.clickDatesAndNumbers();
      await clients.editClientBySection(section);
      await expect(page.locator(clients.SAVE_CHANGES)).toBeEnabled();
      await expect(page.locator(clients.POPUP_EDIT_HEADER)).toContainText('Important travel data');
      await expect(page.locator(clients.POPUP_EDIT_HEADER_INFO)).toContainText(
        'Client travel identification numbers and related expiration dates.',
      );
      await clients.editNumberByType(program1, editedNumber1);
      await clients.editDate('Global entry expiry date', editedDate);
      await clients.editNumberByType(program2, editedNumber2);
      await clients.editDate('KTN expiry date', editedDate);
      await clients.editNumberByType('Passport number', editedNumber3);
      await clients.editDate('Passport expiry date', editedDate);
      await clients.saveChanges();
      await expect(page.locator(toast.TOAST_MESSAGE_APP)).toContainText(
        'Client updated successfully',
      );
      await expect(page.locator(clients.TRAVEL_DATA_NUMBER_BY_PROGRAM(program1))).toContainText(
        editedNumber1,
      );
      await expect(page.locator(clients.TRAVEL_DATA_NUMBER_BY_PROGRAM(program2))).toContainText(
        editedNumber2,
      );
      await expect(page.locator(clients.TRAVEL_DATA_NUMBER_BY_PROGRAM(program3))).toContainText(
        editedNumber3,
      );
      await expect(page.locator(clients.TRAVEL_DATA_DATE_BY_PROGRAM(program1))).toContainText(
        editedDate,
      );
      await expect(page.locator(clients.TRAVEL_DATA_DATE_BY_PROGRAM(program2))).toContainText(
        editedDate,
      );
      await expect(page.locator(clients.TRAVEL_DATA_DATE_BY_PROGRAM(program3))).toContainText(
        editedDate,
      );
    });
  });

  test('Review Created Client- verify Logs were added in main tab', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    clients,
  }) => {
    await test.step('1 - Login at Society as an Admin and search for the created client', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 25000 });
      await sidebar.goToModule('Clients');
      await clients.searchClientAndClick(MAIN_PASSENGER_LAST_NAME_EDITED);
    });
    await test.step('2 -Review Logs', async () => {
      await clients.clickAuditLogs();
      await expect(page.locator(clients.CLIENT_LOGS)).toBeVisible();
    });
  });
});
