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
test.describe('CLI-001 - Client - Add Client', () => {
  test('Login at Society (env) as an Admin', async ({
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
      );
    });
  });
});
