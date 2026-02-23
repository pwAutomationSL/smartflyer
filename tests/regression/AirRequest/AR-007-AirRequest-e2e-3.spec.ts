import { test, expect } from '../../../fixtures/PlaywrightFixtures';
const CLIENT_NAME = 'Candice & Ben (Conway) Winikoff';
const AGENT_NAME = 'Jillian Mason';
const EMAIL = 'fake_candiceconway84@gmail.com';
const AGENCY = 'Lauren Machowsky, LLC';
const AGENT_EMAIL = 'fake_jillian.mason@smartflyer.com';
const PHONE = '18333333333';
const DEPARTURESHORT = 'JFK';
const DEPARTURE = 'John F Kennedy International';
const ARRIVAL_SHORT = 'LAX';
const CLIENT_ID = 'SQ4715';
const ARRIVAL = 'Los Angeles International Airport';
const SPECIAL_REQUEST = `Lorem ipsum do`;
const DEPARTURE_TIME = 'Morning';
const RETURN_TIME = 'Afternoon';
const CABIN_CLASS = 'Business';
const CABIN_CLASS_2 = 'Economy';
const DATE_OF_BIRTH = 'Jan 15, 1990';
const GENDER = 'Male';
const DEPARTURE_F2 = 'Chicago Rockford Airport';
const ARRIVAL_F2 = 'San Francisco International Airport';
const DEPARTURE_SHORT_F2 = 'RFD';
const ARRIVAL_SHORT_F2 = 'SFO';
test.use({
  launchOptions: { slowMo: 800 },
});
test.describe('AR-007 - Air Request - E2E - 3 - One Passenger, Multi City flight', () => {
  test('Air Request - 3 -One Passenger, Multi City flight', async ({
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
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER)).toContainText('Passenger details');
      await expect(page.locator(airRequest.AGENT_SUCCESS)).toHaveCSS(
        'background-color',
        'rgb(46, 139, 87)',
      );
    });
    await test.step('7 - Passengers', async () => {
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
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER)).toContainText('Trip overview');
      await expect(page.locator(airRequest.PASSENGERS_SUCCESS)).toHaveCSS(
        'background-color',
        'rgb(46, 139, 87)',
      );
    });
    await test.step('8 - Trip Overview', async () => {
      await expect(page.locator(airRequest.ROUND_TRIP_RADIO)).toBeChecked();
      await airRequest.selectMultiCityTrip();
      await airRequest.selectDepartureAirportFlight1(DEPARTURE, DEPARTURESHORT);
      await airRequest.selectArrivalAirportFlight1(ARRIVAL, ARRIVAL_SHORT);
      await airRequest.selectTravelDateFlight1();
      await airRequest.confirmDates();
      await airRequest.selectDepartureTimeFlight1(DEPARTURE_TIME);
      await airRequest.selectDepartureAirportFlight2(DEPARTURE_F2, DEPARTURE_SHORT_F2);
      await airRequest.selectArrivalAirportFlight2(ARRIVAL_F2, ARRIVAL_SHORT_F2);
      await airRequest.selectTravelDateFlight2();
      await airRequest.confirmDates();
      await airRequest.selectDepartureTimeFlight2(RETURN_TIME);
      await airRequest.selectCabinClassMultiF1(CABIN_CLASS);
      await airRequest.selectCabinClassMultiF2(CABIN_CLASS_2);
      await airRequest.addAdditionalTripNotes('Window seat preferred');
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER)).toContainText('Travel preferences');
      await expect(page.locator(airRequest.PASSENGERS_SUCCESS)).toHaveCSS(
        'background-color',
        'rgb(46, 139, 87)',
      );
    });
    await test.step('9 - Travel preferences', async () => {
      await expect(page.locator(airRequest.REFUNDABLE_NON_REFUNDABLE_RADIO)).toBeChecked();
      await airRequest.checkNonRefundableRadio();
      await airRequest.addPreferredAirlines();
      await airRequest.addPreferredAircrafts();
      await airRequest.selectPreferences();
      await airRequest.selectSeatsAndSpecialRequest(SPECIAL_REQUEST);
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER)).toContainText('Review air request');
      await expect(page.locator(airRequest.PASSENGERS_SUCCESS)).toHaveCSS(
        'background-color',
        'rgb(46, 139, 87)',
      );
    });
    await test.step('10 - Review', async () => {
      await airRequest.expandFlights();
      await expect(page.locator(airRequest.EDIT_PASSENGER_INFORMATION)).toBeEnabled();
      await expect(page.locator(airRequest.FULL_NAME)).toContainText(CLIENT_NAME);
      await expect(page.locator(airRequest.PHONE_NUMBER).first()).toContainText(PHONE);
      await expect(page.locator(airRequest.GENDER)).toContainText(GENDER);
      await expect(page.locator(airRequest.EMAIL).first()).toContainText(EMAIL);
      await expect(page.locator(airRequest.DATE_OF_BIRTH)).toContainText(DATE_OF_BIRTH);
      await expect(page.locator(airRequest.CLIENT_ID_5)).toContainText(CLIENT_ID);
      await expect(page.locator(airRequest.UPDATE_TRIP_INFORMATION)).toBeEnabled();
      await expect(page.locator(airRequest.DEPARTURE_FROM).first()).toContainText(DEPARTURE);
      await expect(page.locator(airRequest.DEPARTURE_FROM).last()).toContainText(DEPARTURE_F2);
      await expect(page.locator(airRequest.ARRIVE_AT).first()).toContainText(ARRIVAL);
      await expect(page.locator(airRequest.ARRIVE_AT).last()).toContainText(ARRIVAL_F2);
      await expect(page.locator(airRequest.TRAVEL_DATE).first()).toContainText('15, 2026');
      await expect(page.locator(airRequest.TRAVEL_DATE).last()).toContainText('15, 2026');
      await expect(page.locator(airRequest.DEPARTURE_TIME).first()).toContainText(DEPARTURE_TIME);
      await expect(page.locator(airRequest.DEPARTURE_TIME).last()).toContainText(RETURN_TIME);
      await expect(page.locator(airRequest.CABIN_CLASS).first()).toContainText(CABIN_CLASS);
      await expect(page.locator(airRequest.CABIN_CLASS).last()).toContainText(CABIN_CLASS_2);
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
      await expect(requests.filter({ hasText: 'No red-eye flights' })).toBeVisible();
      await expect(requests.filter({ hasText: 'Price sensitive' })).toBeVisible();
      await expect(requests.filter({ hasText: 'Seating preference' })).toBeVisible();
      await expect(requests.filter({ hasText: 'Traveling with infant / child' })).toBeVisible();
      await expect(page.locator(airRequest.AGENT_NAME)).toContainText(AGENT_NAME);
      await expect(page.locator(airRequest.PHONE_NUMBER).last()).toContainText('N/A');
      await expect(page.locator(airRequest.EMAIL).last()).toContainText(AGENT_EMAIL);
      await expect(page.locator(airRequest.AGENCY).last()).toContainText(AGENCY);
      await expect(page.locator(airRequest.CONFIRMATION_STEP_5).first()).toBeEnabled();
      await expect(page.locator(airRequest.CONFIRMATION_STEP_5).last()).toContainText(
        `I confirm that all passenger information, including passport details, is accurate and matches government documents`,
      );
      await page.locator(airRequest.CONFIRMATION_STEP_5).first().click();
      await expect(page.locator(airRequest.SUBMIT_REQUEST)).toBeEnabled();
    });
  });
});
