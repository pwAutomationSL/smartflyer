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
const normalizePhoneNumber = (str: string | null | undefined): string => {
  if (!str) return '';
  return str.replace(/\D/g, '');
};

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
    await test.step('4 - Add Profile picture and Confirm Submission', async () => {
      await clients.uploadProfilePicture();
      await expect(page.locator(toast.TOAST_MESSAGE_APP)).toContainText(
        'Image cropped successfully',
        { timeout: 20000 },
      );
      await expect(page.locator(clients.CONFIRM_SUBMISSION)).toBeEnabled();
      await clients.confirmSubmission();
    });
    await test.step('5 -Verify app redirects to the client profile page', async () => {
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
    await test.step('6 -Go to clients tab and search for new client and verify is was added', async () => {
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
