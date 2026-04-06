import { test, expect } from '../../../fixtures/PlaywrightFixtures';
const CLIENT_NAME = 'Candice & Ben (Conway) Winikoff';
const EMAIL = 'fake_candiceconway84@gmail.com';
const PHONE = '18333333333';
const DEPARTURESHORT = 'JFK';
const DEPARTURE = 'John F Kennedy International';
const ARRIVAL_SHORT = 'LAX';
const ARRIVAL_F2 = 'San Francisco International Airport';
const ARRIVAL_SHORT_F2 = 'SFO';
const ARRIVAL = 'Los Angeles International Airport';
const DEPARTURE_F2 = 'Chicago Rockford Airport';
const DEPARTURE_SHORT_F2 = 'RFD';
test.use({
  launchOptions: {
    slowMo: 800,
  },
});
test.setTimeout(250000);
test.describe('AR-004 - Air Request - Step 3', () => {
  test('Air Request - Step 3 -  7# Scenario - Multi-city trip, multiple passengers, different itineraries', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    clients,
    airRequest,
  }) => {
    await test.step('1 - Go to the Client tab', async () => {
      await loginPage.login({ username, password });
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
    await test.step('9 - Add additional passenger', async () => {
      await airRequest.addAdditionalPassenger();
      await expect(page.locator(airRequest.POP_UP_DIALOG)).toBeVisible();
      await airRequest.selectFirstPassenger();
      await airRequest.addPassenger();
      await airRequest.clickGenderDropdown(2);
      await airRequest.selectMale();
      await expect(page.locator(airRequest.PHONE_FLAG).last()).toBeVisible();
      await airRequest.fillPassengerPhone(PHONE, 1);
      await airRequest.clickLabel();
      await airRequest.fillDayOfBirth('15', 2);
      await airRequest.fillMonth(2);
      await airRequest.fillYearOfBirth('2000', 2);
      await airRequest.fillPassengerEmail(EMAIL, 2);
      await airRequest.checkCertifySecondPassenger();
    });
    await test.step('10 - Click on Continue', async () => {
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER)).toContainText('Trip overview');
      await expect(page.locator(airRequest.PASSENGERS_SUCCESS)).toHaveCSS(
        'background-color',
        'rgb(46, 139, 87)',
      );
    });
    await test.step('11 - Click on the “Are all travelers on the same itinerary?” toggle to deactivate it', async () => {
      await airRequest.sameItinerary();
    });
    await test.step('12 - Click on the “Multi-city” radio button', async () => {
      await airRequest.selectMultiCityTrip();
      await airRequest.selectMultiCityTripPassenger2();
      await page.waitForLoadState('networkidle');
    });
    await test.step('13 -Select Departure airport for Primary passenger for each Flight ', async () => {
      await expect(page.locator(airRequest.DEPARTURE_FLIGHT2).first()).toBeEnabled();
      await airRequest.selectDepartureAirportFlight1Passenger1(DEPARTURE_F2, DEPARTURE_SHORT_F2);
      await airRequest.selectDepartureAirportFlight2Passenger1(DEPARTURE_F2, DEPARTURE_SHORT_F2);
      await airRequest.selectArrivalAirportFlight2(ARRIVAL_F2, ARRIVAL_SHORT_F2);
      await airRequest.selectTravelDateFlight2();
      await airRequest.confirmDates();
      await airRequest.selectDepartureTimeFlight2('Morning');
    });
    await test.step('14 -Select Arrival airport for Primary passenger for each Flight', async () => {
      await airRequest.selectArrivalAirportFlight1(ARRIVAL, ARRIVAL_SHORT);
      await airRequest.selectArrivalAirportFlight2(ARRIVAL_F2, ARRIVAL_SHORT_F2);
    });
    await test.step('15 -Select the Departure Date for each Flight for Primary passenger ', async () => {
      await airRequest.selectTravelDateFlight1();
      await airRequest.confirmDates();
      await airRequest.selectTravelDateFlight2Passenger1();
      await airRequest.confirmDates();
    });
    await test.step('16 -Select Departure time for each Flight for Primary passengerr', async () => {
      await airRequest.selectDepartureTimeFlight1('Morning');
      await airRequest.selectDepartureTimeFlight2('Morning');
    });
    await test.step('17 - Select Preferred cabin class for each Flight for Primary passenger', async () => {
      await airRequest.selectCabinClassMultiF1('Economy');
    });
    await test.step('18 - Select Preferred cabin class for Primary passenger', async () => {
      await airRequest.selectCabinClassMultiF1('Economy');
    });
    await test.step('19 -Select Departure airport for Additional passenger', async () => {
      await airRequest.selectDepartureAirportFlight1Passenger2(DEPARTURE_F2, DEPARTURE_SHORT_F2);
      await airRequest.selectDepartureAirportFlight2(DEPARTURE, DEPARTURESHORT);
      await airRequest.selectArrivalAirportFlight1(ARRIVAL, ARRIVAL_SHORT);
      await expect(page.locator(airRequest.ARRIVAL_INPUT_PASSENGER_2_FLIGHT2)).toBeDisabled();
      await airRequest.selectTravelDateFlight2();
      await airRequest.confirmDates();
    });
    await test.step('20 -Select the Travel Dates for Additional passenger', async () => {
      await airRequest.selectTravelDateFlight1Passenger2();
      await airRequest.confirmDates();
      await airRequest.selectTravelDateFlight2();
      await airRequest.confirmDates();
    });
    await test.step('23 - Select Preferred cabin class for Additional passenger', async () => {
      await airRequest.selectCabinClassMultiF1('Economy');
      await airRequest.selectCabinClassMultiF1('Economy');
    });
    await test.step('ER - Include any Additional Trip Notes ', async () => {
      await airRequest.addAdditionalTripNotes('Window seat preferred');
      let airportF1 = await airRequest.getArrivalAirportFligh2(0);
      let airportF2 = await airRequest.getArrivalAirportFligh2(1);
      expect(airportF1).toEqual(airportF2);
      await expect(page.locator(airRequest.ARRIVAL_INPUT_PASSENGER_2_FLIGHT2)).toBeDisabled();
      await airRequest.overWriteArrivalAirportFlight2(ARRIVAL_F2, ARRIVAL_SHORT_F2);
      airportF1 = await airRequest.getArrivalAirportFligh2(0);
      airportF2 = await airRequest.getArrivalAirportFligh2(1);
      expect(airportF1).toEqual(airportF2);
    });
    await test.step('24 - Click Continue', async () => {
      await airRequest.clickContinue();
    });
  });
});
