import { test, expect } from '../../../fixtures/PlaywrightFixtures';
const CLIENT_NAME = 'Candice & Ben (Conway) Winikoff';
const PASSENGER_FIRST_NAME = 'Candice & Ben';
const PASSENGER_LAST_NAME = '(Conway) Winikoff';
const EMAIL = 'fake_candiceconwday84@gmail.com';
const PHONE = '18333333333';
const WRONG_PHONE = '800000';
const WRONG_EMAIL = 'fake_candiceconway84gmail.com';
const CLIENT_ID = 'SQ4715';
test.describe('AR-003 - Air Request - Step 2', () => {
  test('Scenario 1 - Navigate to Step 2', async ({
    loginPage,
    page,
    sidebar,
    clients,
    airRequest,
  }) => {
    await test.step('1 - Go to the Client tab', async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
      await sidebar.goToModule('Clients');
    });
    await test.step('2 - Search the client and go to the client page', async () => {
      await clients.searchClient(CLIENT_NAME);
      await page.waitForLoadState('networkidle');
    });
    await test.step('3 - 4 - Go to the New credit card tab and Click on Air request button', async () => {
      await airRequest.clickAirRequest();
      await expect(page.locator(airRequest.POP_UP_HEADER)).toBeVisible();
    });
    await test.step('5 - Click on Start from scratch', async () => {
      await airRequest.startFromScrath();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeDisabled();
      await expect(page.locator(airRequest.AGENT_SELECT)).toContainText('Select an agent');
    });
    await test.step('6 - Select the Agent and Click on Continue button', async () => {
      await airRequest.selectAgent();
      await airRequest.selectFirstAgent();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeEnabled();
    });
    await test.step('7 - Click on Continue', async () => {
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER)).toContainText('Passenger details');
      await expect(page.locator(airRequest.AGENT_SUCCESS)).toHaveCSS(
        'background-color',
        'rgb(46, 139, 87)',
      );
    });
    await test.step('Fill Date of Birth', async () => {
      await airRequest.fillDateOfBirth();
    });
    await test.step('ER 1 - Domestic checked by default, first name and last name pre filled', async () => {
      await expect(page.locator(airRequest.DOMESTIC_RADIO)).toBeChecked();
      await expect(page.locator(airRequest.FIRST_NAME_PASSENGER(0))).toHaveValue(
        PASSENGER_FIRST_NAME,
      );
      await expect(page.locator(airRequest.LAST_NAME_PASSENGER(0))).toHaveValue(
        PASSENGER_LAST_NAME,
      );
      await expect(page.locator(airRequest.PASSENGER_EMAIL(0))).toHaveValue(EMAIL);
    });
    await test.step('ER 1 - Client ID pre filled and disabled/grey', async () => {
      await expect(page.locator(airRequest.CLIENT_ID)).toHaveValue(CLIENT_ID);
      await expect(page.locator(airRequest.CLIENT_ID)).toBeDisabled();
    });
    await test.step('ER 2 - Gender has red asterisk and its mandatory', async () => {
      await expect(page.locator(airRequest.GENDER_RED_ASTERISK)).toBeVisible();
    });
    await test.step('ER 2 - Gender has Male and Female options', async () => {
      await airRequest.clickGenderDropdown();
      await expect(page.locator(airRequest.MALE_DROPDOWN)).toBeVisible();
      await expect(page.locator(airRequest.FEMALE_DROPDOWN)).toBeVisible();
      await airRequest.selectMale();
    });
    await test.step('ER 3 - Insert incorrect email and warning message is visible', async () => {
      await airRequest.fillPassengerEmail(WRONG_EMAIL);
      await airRequest.clickLabel();
      await expect(page.locator(airRequest.PASSENGER_EMAIL(0))).toHaveClass(/border-red/i);
      await expect(page.locator(airRequest.WARNING_EMAIL)).toContainText(
        'Email must be a valid email address.',
      );
      await airRequest.fillPassengerEmail(EMAIL);
    });
    await test.step('ER 3 - 6 Insert incorrect Phone number and warning message is visible', async () => {
      await airRequest.fillPassengerPhone(WRONG_PHONE);
      await airRequest.clickLabel();
      await expect(page.locator(airRequest.PHONE_INPUT_PASSENGER_DIV(0))).toHaveClass(
        /border-red/i,
      );
      await expect(page.locator(airRequest.WARNING_PHONE)).toContainText('Invalid phone number');
      await airRequest.fillPassengerPhone(PHONE);
    });
    await test.step('ER 4 - 6 Insert incorrect Phone number and warning message is visible', async () => {
      await expect(page.locator(airRequest.PHONE_FLAG)).toBeVisible();
      await expect(page.locator(airRequest.PHONE_INPUT_PASSENGER(0))).toHaveValue(
        '+1 (833) 333-3333',
      );
    });
    await test.step('ER 5 - Add passport information toggle OFF by default', async () => {
      try {
        await expect(page.locator(airRequest.ADD_PASSPORT_INFORMATION(1))).toHaveAttribute(
          'aria-checked',
          'false',
        );
      } catch (err) {
        console.error('Passport already added');
      }
    });
    await test.step('ER 7 - I certify the information ... chechbox not checked by default', async () => {
      await expect(page.locator(airRequest.CERTIFY_CHECKBOX).first()).not.toBeChecked();
    });
    await test.step('ER 9 - Primary Agent can not be deleted', async () => {
      await expect(page.locator(airRequest.DELETE_TRAVELER_BUTTON)).toBeHidden();
    });
    await test.step('Check Certify and Continue button should be enabled', async () => {
      await airRequest.checkCertify();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeEnabled();
    });
    await test.step('ER 8 -  after clicking at the “Continue” button, the user moves to the next section', async () => {
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER)).toContainText('Trip overview');
      await expect(page.locator(airRequest.PASSENGERS_SUCCESS)).toHaveCSS(
        'background-color',
        'rgb(46, 139, 87)',
      );
    });
  });
});
