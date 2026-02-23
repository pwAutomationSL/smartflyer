import { test, expect } from '../../../fixtures/PlaywrightFixtures';
const CLIENT_NAME = 'Candice & Ben (Conway) Winikoff';
const AGENT_NAME = 'Jillian Mason';
const EMAIL = 'fake_candiceconway84@gmail.com';
const AGENCY = 'Lauren Machowsky, LLC';
const AGENT_EMAIL = 'fake_jillian.mason@smartflyer.com';
const PHONE = '18333333333';
const DEPARTURESHORT = 'JFK';
const DEPARTURESHORT_2LETTERS = 'JF';
const DEPARTURE = 'John F Kennedy International';
const ARRIVAL_SHORT = 'LAX';
const CLIENT_ID = 'SQ4715';
const ARRIVAL = 'Los Angeles International Airport';
const SPECIAL_REQUEST = `Lorem ipsum do`;
const DEPARTURE_TIME = 'Morning';
const CABIN_CLASS = 'Business';
test.use({
  launchOptions: { slowMo: 450 },
});
test.describe('AR-005 - Air Request - Step 5', () => {
  test('Air Request - Step 5 - Review', async ({
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
      await airRequest.selectDepartureAirport2Letters(DEPARTURESHORT_2LETTERS);
      await airRequest.selectDepartureAirport(DEPARTURE, DEPARTURESHORT);
      await airRequest.selectArrivalAirport(ARRIVAL, ARRIVAL_SHORT);
      await airRequest.selectTravelDate();
      await expect(page.locator(airRequest.PREVIOUS_MONTH)).toBeDisabled();
      await airRequest.confirmDates();
      await airRequest.selectDepartureTime(DEPARTURE_TIME);
      await airRequest.selectCabinClass(CABIN_CLASS);
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
      await airRequest.checkNonRefundableRadio();
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
    });
    await test.step('17 - Continue', async () => {
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER)).toContainText('Review air request');
      await expect(page.locator(airRequest.PASSENGERS_SUCCESS)).toHaveCSS(
        'background-color',
        'rgb(46, 139, 87)',
      );
    });
    await test.step('18-Review Passenger Information', async () => {
      await expect(page.locator(airRequest.EDIT_PASSENGER_INFORMATION)).toBeEnabled();
      await expect(page.locator(airRequest.FULL_NAME)).toContainText(CLIENT_NAME);
      await expect(page.locator(airRequest.PHONE_NUMBER).first()).toContainText(PHONE);
      await expect(page.locator(airRequest.GENDER)).toContainText('Male');
      await expect(page.locator(airRequest.EMAIL).first()).toContainText(EMAIL);
      await expect(page.locator(airRequest.DATE_OF_BIRTH)).toContainText('Jan 15, 1990');
      await expect(page.locator(airRequest.CLIENT_ID_5)).toContainText(CLIENT_ID);
    });
    await test.step('19-Review Trip OverView', async () => {
      await expect(page.locator(airRequest.UPDATE_TRIP_INFORMATION)).toBeEnabled();
      await expect(page.locator(airRequest.DEPARTURE_FROM).first()).toContainText(DEPARTURE);
      await expect(page.locator(airRequest.ARRIVE_AT).first()).toContainText(ARRIVAL);
      await expect(page.locator(airRequest.TRAVEL_DATES).first()).toContainText('15, 2026');
      await expect(page.locator(airRequest.DEPARTURE_TIME).first()).toContainText(DEPARTURE_TIME);
      await expect(page.locator(airRequest.CABIN_CLASS).first()).toContainText(CABIN_CLASS);
    });
    await test.step('20-Review Traveler Preferences', async () => {
      await expect(page.locator(airRequest.UPDATE_TRAVEL_PREFERENCES)).toBeEnabled();
      const airlines = await page.locator(airRequest.AIRLINES);
      await expect(airlines).toHaveCount(2);
      await expect(airlines.filter({ hasText: 'American Airlines (AA)' })).toBeVisible();
      await expect(airlines.filter({ hasText: 'Delta (DL)' })).toBeVisible();
      const aircrafts = await page.locator(airRequest.AIRCRAFT);
      await expect(aircrafts).toHaveCount(2);
      await expect(aircrafts.filter({ hasText: 'Airbus 330-900 neo' })).toBeVisible();
      await expect(aircrafts.filter({ hasText: 'Boeing Dreamliner' })).toBeVisible();
      const requests = await page.locator(airRequest.REQUESTS);
      await expect(requests).toHaveCount(6);

      await expect(requests.filter({ hasText: 'Direct flights only' })).toBeVisible();
      await expect(requests.filter({ hasText: 'Flexible dates for better fare' })).toBeVisible();
      await expect(requests.filter({ hasText: 'Price sensitive' })).toBeVisible();
      await expect(requests.filter({ hasText: 'Seating preference' })).toBeVisible();
      await expect(requests.filter({ hasText: 'Traveling with infant / child' })).toBeVisible();
    });
    await test.step('21-Review Documents', async () => {});
    await test.step('22-Review Agent Information', async () => {
      await expect(page.locator(airRequest.AGENT_NAME)).toContainText(AGENT_NAME);
      await expect(page.locator(airRequest.PHONE_NUMBER).last()).toContainText('N/A');
      await expect(page.locator(airRequest.EMAIL).last()).toContainText(AGENT_EMAIL);
      await expect(page.locator(airRequest.AGENCY).last()).toContainText(AGENCY);
    });
  });
});
