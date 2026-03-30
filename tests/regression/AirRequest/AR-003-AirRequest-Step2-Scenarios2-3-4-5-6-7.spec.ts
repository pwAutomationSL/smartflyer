import { test, expect } from '../../../fixtures/PlaywrightFixtures';
const CLIENT_NAME = 'Candice & Ben (Conway) Winikoff';
const PASSENGER_FIRST_NAME = 'Candice & Ben';
const PASSENGER_LAST_NAME = '(Conway) Winikoff';
const EMAIL = 'fake_candiceconway84@gmail.com';
const PHONE = '18333333333';
const WRONG_EMAIL = 'fake_candiceconway84gmail.com';
test.describe('AR-003 - Air Request - Step 2', () => {
  test('Air Request - Step 2 - 2,3,4,5,6,7# Scenario', async ({
    loginPage,
    page,
    sidebar,
    clients,
    airRequest,
  }, testInfo) => {
    await test.step('1 - Go to the Client tab', async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
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
      await test.step('2# Scenario Edit Primary Passenger First Name', async () => {
        try {
          await airRequest.fillPassengerFirstName('');
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.WARNING_NAME)).toContainText(
            'First name is required',
          );
          await expect(page.locator(airRequest.FIRST_NAME_PASSENGER(0))).toHaveClass(/border-red/i);
          await airRequest.fillPassengerFirstName(PASSENGER_FIRST_NAME);
          await airRequest.clickLabel();
        } catch (err) {
          console.error('Edit Primary Passenger First Name failed');
          test.info().errors.push({
            message: String(err),
          });
        }
      });
      await test.step('3# Scenario - Edit Primary Passenger Middle Name', async () => {
        try {
          await airRequest.fillPassengerMiddleName('');
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.WARNING_MIDDLE_NAME)).toBeHidden();
          await airRequest.fillPassengerMiddleName('MiddleName');
          await airRequest.clickLabel();
        } catch (err) {
          console.error('Edit Primary Passenger Middle Name');
          test.info().errors.push({
            message: String(err),
          });
        }
      });
      await test.step('4# Scenario - Edit Primary Passenger Last Name', async () => {
        try {
          await airRequest.fillPassengerLastName('');
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.WARNING_LAST_NAME)).toContainText(
            'Last name is required',
          );
          await expect(page.locator(airRequest.LAST_NAME_PASSENGER(0))).toHaveClass(/border-red/i);
          await airRequest.fillPassengerLastName(PASSENGER_LAST_NAME);
          await airRequest.clickLabel();
        } catch (err) {
          console.error('Edit Primary Passenger Last Name');
          test.info().errors.push({
            message: String(err),
          });
        }
      });
      await test.step('5# Scenario - Edit Primary Passenger DoB', async () => {
        try {
          await airRequest.fillDayOfBirth('');
          await airRequest.fillMonth();
          await airRequest.fillYearOfBirth('');
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.WARNING_DOB)).toContainText(
            'Day, Year are required',
          );
          await expect(page.locator(airRequest.DOB_DAY(1))).toHaveClass(/border-red/i);
          await expect(page.locator(airRequest.DOB_YEAR(1))).toHaveClass(/border-red/i);
          await airRequest.fillDayOfBirth('15');
          await airRequest.fillYearOfBirth('2200');
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.WARNING_DOB)).toContainText(
            'Date of birth must be before today.',
          );
          await expect(page.locator(airRequest.DOB_DAY(1))).toHaveClass(/border-red/i);
          await expect(page.locator(airRequest.DOB_YEAR(1))).toHaveClass(/border-red/i);
          await airRequest.clickLabel();
          await airRequest.fillYearOfBirth('1900');
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.DOB_DAY(1))).not.toHaveClass(/border-red/i);
          await expect(page.locator(airRequest.DOB_YEAR(1))).not.toHaveClass(/border-red/i);
        } catch (err) {
          console.error('Edit Primary Passenger DoB');
          test.info().errors.push({
            message: String(err),
          });
        }
      });
      await test.step('6# Scenario - Edit Primary Passenger email', async () => {
        try {
          await airRequest.fillPassengerEmail(WRONG_EMAIL);
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.WARNING_EMAIL)).toContainText(
            'Email must be a valid email address.',
          );
          await expect(page.locator(airRequest.PASSENGER_EMAIL(0))).toHaveClass(/border-red/i);
          await airRequest.fillPassengerEmail('');
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.WARNING_EMAIL)).toContainText('Email is required');
          await expect(page.locator(airRequest.PASSENGER_EMAIL(0))).toHaveClass(/border-red/i);
          await airRequest.fillPassengerEmail(EMAIL);
        } catch (err) {
          console.error('Edit Primary Passenger email');
          test.info().errors.push({
            message: String(err),
          });
        }
      });
      await test.step('7# Scenario - Edit Primary Passenger phone number', async () => {
        try {
          await airRequest.fillPassengerPhone('1800');
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.WARNING_PHONE)).toContainText(
            'Invalid phone number',
          );
          await expect(page.locator(airRequest.PHONE_INPUT_PASSENGER_DIV(0))).toHaveClass(
            /border-red/i,
          );
          await airRequest.fillPassengerPhone(PHONE);
          await airRequest.clickLabel();
          await expect(page.locator(airRequest.PHONE_INPUT_PASSENGER_DIV(0))).not.toHaveClass(
            /border-red/i,
          );
        } catch (err) {
          console.error('Primary Passenger phone number');
          test.info().errors.push({
            message: String(err),
          });
        }
      });
    });
    if (testInfo.errors.length > 0) {
      throw new Error('One or more validation steps failed. Check report.');
    }
  });
});
