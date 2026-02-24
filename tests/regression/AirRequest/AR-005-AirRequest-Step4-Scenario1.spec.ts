import { test, expect } from '../../../fixtures/PlaywrightFixtures';
const CLIENT_NAME = 'Candice & Ben (Conway) Winikoff';
const EMAIL = 'fake_candiceconway84@gmail.com';
const PHONE = '18333333333';
const DEPARTURESHORT = 'JFK';
const DEPARTURE = 'John F Kennedy International';
const ARRIVAL_SHORT = 'LAX';
const ARRIVAL = 'Los Angeles International Airport';
const SPECIAL_REQUEST = `Lorem ipsum do`;
test.describe('AR-005 - Air Request - Step 4', () => {
  test('Air Request - Step 4 - 1# Scenario - Refundable and non-refundableo', async ({
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
    await test.step('8 - Add Passenger information on Step 2', async () => {
      await airRequest.fillMonth();
      await airRequest.fillDayOfBirth('15');
      await airRequest.fillYearOfBirth('1990');
      await airRequest.clickLabel();
      await airRequest.fillPassengerEmail(EMAIL);
      await airRequest.fillPassengerPhone(PHONE);
      await airRequest.clickLabel();
      await airRequest.clickGenderDropdown();
      await expect(page.locator(airRequest.MALE_DROPDOWN)).toBeVisible();
      await expect(page.locator(airRequest.FEMALE_DROPDOWN)).toBeVisible();
      await airRequest.selectMale();
      await airRequest.checkCertify();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeEnabled();
    });
    await test.step('9 - Click on Continue', async () => {
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER)).toContainText('Trip overview');
      await expect(page.locator(airRequest.PASSENGERS_SUCCESS)).toHaveCSS(
        'background-color',
        'rgb(46, 139, 87)',
      );
    });
    await test.step('10 - Complete step 3', async () => {
      await airRequest.selectOneWayTrip();
      await airRequest.selectDepartureAirport(DEPARTURE, DEPARTURESHORT);
      await airRequest.selectArrivalAirport(ARRIVAL, ARRIVAL_SHORT);
      await airRequest.selectTravelDate();
      await expect(page.locator(airRequest.PREVIOUS_MONTH)).toBeDisabled();
      await airRequest.confirmDates();
      await airRequest.selectDepartureTime('Morning');
      await airRequest.selectCabinClass('Business');
      await airRequest.addAdditionalTripNotes('Window seat preferred');
    });

    await test.step('11 - Click Continue', async () => {
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER)).toContainText('Travel preferences');
      await expect(page.locator(airRequest.PASSENGERS_SUCCESS)).toHaveCSS(
        'background-color',
        'rgb(46, 139, 87)',
      );
    });
    await test.step('12 - Verify the radio button for “Refundable and non-refundable” is pre-selected', async () => {
      await expect(page.locator(airRequest.REFUNDABLE_NON_REFUNDABLE_RADIO)).toBeChecked();
    });
    await test.step('13 - Add the preferred Airlines', async () => {
      await airRequest.addPreferredAirlines();
    });
    await test.step('14 - Add the preferred Aircrafts', async () => {
      await airRequest.addPreferredAircrafts();
    });
    await test.step('15 - Using the checkboxes, select the preferences options ', async () => {
      await airRequest.selectPreferences();
    });
    await test.step('16 - Select Seat and Special requests', async () => {
      await airRequest.selectSeatsAndSpecialRequest(SPECIAL_REQUEST);
      await expect(page.locator(airRequest.SPECIAL_REQUEST_TEXTAREA)).toHaveAttribute(
        'maxlength',
        '500',
      );
    });
    await test.step('17 - Select Seat and Special requests', async () => {
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER)).toContainText('Review air request');
      await expect(page.locator(airRequest.PASSENGERS_SUCCESS)).toHaveCSS(
        'background-color',
        'rgb(46, 139, 87)',
      );
    });
  });
});
