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
const RELATED_PASSENGER_NAME = 'Related';
const RELATED_PASSENGER_LAST_NAME = 'LastName' + uniqueId();
const RELATED_PASSENGER_EMAIL = 'Related' + uniqueId() + '@gmail.com';
const normalizePhoneNumber = (str: string | null | undefined): string => {
  if (!str) return '';
  return str.replace(/\D/g, '');
};

test.describe('CLI-002 - Client - Add Client with related passenger', () => {
  test('Login at Society (env) as an Admin and add a client with related passenger', async ({
    loginPage,
    page,
    sidebar,
    clients,
    toast,
  }) => {
    await test.step('1 - Login at Society as an Admin', async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
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
    });
    await test.step('5 - Add related passenger and confirm submission should be disabled', async () => {
      await clients.expandRelatedPassengers();
      await clients.addPassenger();
      await expect(page.locator(clients.RELATED_PASSENGER_ADDED_NAME)).toContainText(
        'Passenger name',
      );
      await clients.expandRelatedPassenger();
      // await expect(page.locator(clients.CONFIRM_SUBMISSION)).toBeDisabled();
      await clients.fillRelatedFirstName(RELATED_PASSENGER_NAME);
      await clients.fillRelatedLastName(RELATED_PASSENGER_LAST_NAME);
      await clients.fillRelatedDateOfBirth();
      await clients.selectRelatedGender();
      await clients.fillRelatedEmail(RELATED_PASSENGER_EMAIL);
      await clients.fillRelatedPhoneNumber(PHONE);
      await expect(page.locator(clients.SAME_AS_PRIMARY_ADDRESS_TOGGLE)).toHaveAttribute(
        'aria-checked',
        'true',
      );
      // await expect(page.locator(clients.RELATED_PASSENGER_ADDRESS_LINE_1(0))).toBeDisabled();
      // await expect(page.locator(clients.RELATED_PASSENGER_CITY(0))).toBeDisabled();
      // await expect(page.locator(clients.RELATED_PASSENGER_ZIP_CODE(0))).toBeDisabled();
      await clients.checkCertify();
      await expect(page.locator(clients.RELATED_PASSENGER_GREEN_CHECK(2))).toBeVisible();
      await expect(page.locator(clients.RELATED_PASSENGER_GREEN_CHECK(2))).toHaveCSS(
        'fill',
        'rgb(7, 188, 12)',
      );
      await expect(page.locator(clients.CONFIRM_SUBMISSION)).toBeEnabled();
      await clients.confirmSubmission();
    });
    await test.step('6 -Verify app redirects to the client profile page', async () => {
      await expect(page.locator(clients.HEADER)).toContainText(MAIN_PASSENGER_NAME, {
        timeout: 15000,
      });
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
    await test.step('7 -Go to clients tab and search for new client and verify is was added', async () => {
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
    await test.step('8 -Select the client and assert added passenger is added with basic information', async () => {
      await clients.clickFirstResult();
      await clients.goToRelatedTravelersTab();
      await expect(page.locator(clients.ADDED_RELATED_PASSENGER_NAME)).toContainText(
        RELATED_PASSENGER_NAME + ' ' + RELATED_PASSENGER_LAST_NAME,
      );
      await clients.expandRelatedPassengerFromTab();
      const phoneUI = await page.locator(clients.RELATED_PASSENGER_PHONE_BI).textContent();
      expect(normalizePhoneNumber(phoneUI)).toEqual(PHONE);
      await expect(page.locator(clients.RELATED_PASSENGER_DOB_BI)).toContainText('1990');
      await expect(page.locator(clients.RELATED_PASSENGER_EMAIL_BI)).toContainText(
        RELATED_PASSENGER_EMAIL,
      );
      const phoneUIBI = await page.locator(clients.RELATED_PASSENGER_PHONE_BI).textContent();
      expect(normalizePhoneNumber(phoneUIBI)).toEqual(PHONE);
    });
  });
});
