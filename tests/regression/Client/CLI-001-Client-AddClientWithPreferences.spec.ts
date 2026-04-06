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
const PREFERENCES_AIRPORTS = ['IOM - Isle of Man', 'JAA - Jalalabad - Afghanistan'];
const emergencyContact = {
  name: 'John Doe',
  email: 'john.doe@test.com',
  phone: '14155552671',
  relationship: 'Assistant',
};
const normalizePhoneNumber = (str: string | null | undefined): string => {
  if (!str) return '';
  return str.replace(/\D/g, '');
};

test.use({
  launchOptions: { slowMo: 700 },
});

test.describe('CLI-001 - Client - Add Client', () => {
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
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
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
    await test.step('4 - Add Profile picture', async () => {
      await clients.uploadProfilePicture();
      await expect(page.locator(toast.TOAST_MESSAGE_APP)).toContainText(
        'Image cropped successfully',
      );
      await expect(page.locator(clients.CONFIRM_SUBMISSION)).toBeEnabled();
    });
    await test.step('5 - Fill Preferences and Confirm Submission', async () => {
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
    });
    await test.step('6 -Verify app redirects to the client profile page', async () => {
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
    await test.step('7 -Go to preferences tab and verify', async () => {
      await clients.goToPreferencesTab();
      await expect(page.locator(clients.FLIGHT_PREFERENCES)).toContainText('Commercial');
      await expect(page.locator(clients.FLIGHT_PREFERENCES)).toContainText('Aisle');
      await expect(page.locator(clients.FLIGHT_PREFERENCES)).toContainText('First Class');
      await expect(page.locator(clients.ALLERGIES_RESTRICTIONS)).toContainText(
        'Peanut allergy, tree nut allergy, lactose intolerance, gluten intolerance, shellfish allergy, sesame allergy, soy allergy, egg allergy, dairy-free, gluten-free, vegetarian, vegan.',
      );
      await expect(page.locator(clients.BEVERAGE_PREFERENCES_SECTION)).toContainText('Red Wine');
      await expect(page.locator(clients.PILLOW_PREFERENCES_SECTION)).toContainText('Foam Pillows');
      await expect(page.locator(clients.ROOM_CONFIGURATION_SECTION)).toContainText('King Beds');
      await expect(page.locator(clients.SPA_PREFERENCES_SECTION).first()).toContainText(
        'Female Therapist',
      );
      await expect(page.locator(clients.SPA_PREFERENCES_SECTION).last()).toContainText(
        'Ad litora torquent per conubia nostra inceptos himenaeos.',
      );
      await expect(page.locator(clients.GENERAL_LIKES_DISLIKES_SECTION)).toContainText(
        'Ad litora torquent per conubia nostra inceptos himenaeos.',
      );
      await expect(page.locator(clients.COMFORT_RELATED_DETAILS_HEIGHT_SECTION)).toContainText(
        '180 cm',
      );
      await expect(page.locator(clients.COMFORT_RELATED_DETAILS_WHEIGHT_SECTION)).toContainText(
        '80 kg',
      );
      await expect(page.locator(clients.COMFORT_RELATED_DETAILS_SECTION)).toContainText(
        'Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis.',
      );
    });
    await test.step('8 -Go to clients tab and search for new client and verify is was added', async () => {
      await sidebar.goToModuleAPP('Clients');
      await clients.searchClientByName(MAIN_PASSENGER_LAST_NAME);
      await expect(page.locator(clients.CLIENT_NAME_SEARCH_RESULT)).toContainText(
        MAIN_PASSENGER_LAST_NAME,
      );
      await expect(page.locator(clients.CLIENT_EMAIL_SEARCH_RESULT)).toContainText(
        MAIN_PASSENGER_EMAIL,
      );
      const phoneUISearch = await page.locator(clients.CLIENT_PHONE_SEARCH_RESULT).textContent();
      expect(normalizePhoneNumber(phoneUISearch)).toEqual(PHONE);
      await expect(page.locator(clients.CLIENT_STATUS_SEARCH_RESULT)).toContainText('Active');
    });
  });
});
