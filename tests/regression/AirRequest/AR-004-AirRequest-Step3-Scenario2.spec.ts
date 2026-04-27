import { test, expect } from '../../../fixtures/PlaywrightFixtures';
const CLIENT_NAME = 'Candice & Ben (Conway) Winikoff';
const EMAIL = 'fake_candiceconway84@gmail.com';
const PHONE = '18333333333';
const DEPARTURESHORT = 'JFK';
const DEPARTURESHORT_2LETTERS = 'JF';
const DEPARTURE_NON_EXISTANT = 'nonExisting';
const DEPARTURE = 'John F Kennedy International';
const ARRIVAL_SHORT = 'LAX';
const ARRIVAL_SHORT_2LETTERS = 'LA';
const ARRIVAL = 'Los Angeles International Airport';
test.describe('AR-004 - Air Request - Step 3', () => {
  test('Air Request - Step 3 - 2# Scenario', async ({
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
      await expect(page.locator(airRequest.HEADER_H2)).toContainText('Passenger details');
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
      await expect(page.locator(airRequest.HEADER_H2)).toContainText('Trip overview', {
        timeout: 15000,
      });
      await expect(page.locator(airRequest.PASSENGERS_SUCCESS)).toHaveCSS(
        'background-color',
        'rgb(46, 139, 87)',
      );
    });
    await test.step('10 - Click on the “Round-trip” radio button ', async () => {
      await expect(page.locator(airRequest.ROUND_TRIP_RADIO)).toBeChecked();
      await airRequest.selectRoundTrip();
    });

    await test.step('11 - Verify autocomplete suggestions begin to appear after 2 characters are typed', async () => {
      await airRequest.selectDepartureAirport2Letters(DEPARTURESHORT_2LETTERS);

      await expect(page.locator(airRequest.AIRPORTS_VALID_RESULTS).first()).toBeVisible();
      const cityCountry = await page.locator(airRequest.CITY_COUNTRY_RESULT).first().textContent();
      expect(cityCountry).toBe('New York, United States');
      const searchResults = await page.locator(airRequest.AIRPORTS_VALID_RESULTS).count();
      expect(searchResults).toBeGreaterThan(1);
    });

    await test.step('ER - Verify autocomplete suggestions begin to appear after 2 characters are typed)', async () => {
      await airRequest.selectArrivalAirport2Letters(ARRIVAL_SHORT_2LETTERS);
      await expect(page.locator(airRequest.AIRPORTS_VALID_RESULTS).first()).toBeVisible();
      const cityCountry = await page.locator(airRequest.CITY_COUNTRY_RESULT).first().textContent();
      expect(cityCountry).toBe('Lafayette, United States');
      const searchResults = await page.locator(airRequest.AIRPORTS_VALID_RESULTS).count();
      expect(searchResults).toBeGreaterThan(1);
    });
    await test.step('ER - Verify if no city found the message appears “No airports found. Please check spelling or try another city.”', async () => {
      await airRequest.selectArrivalAirport2Letters(DEPARTURE_NON_EXISTANT);
      await expect(page.locator(airRequest.EMPTY_RESULTS).last()).toContainText(
        'No results found. Please check the spelling or try another city or airport.',
        { timeout: 5000 },
      );
    });
    await test.step('ER - Verify if no city found the message appears “No airports found. Please check spelling or try another city.”', async () => {
      await airRequest.selectDepartureAirport2Letters(DEPARTURE_NON_EXISTANT);
      await expect(page.locator(airRequest.EMPTY_RESULTS).first()).toContainText(
        'No results found. Please check the spelling or try another city or airport.',
        { timeout: 5000 },
      );
    });
    await test.step('11 - Select Departure city or airport - Verify that the Departure city or Airport search field supports both city names and airport codes (IATA)', async () => {
      await airRequest.selectDepartureAirport(DEPARTURE, DEPARTURESHORT);
    });
    await test.step('12 - Select Arrival city or airport (required) - Verify that the Arrival city or Airport field supports both city names and airport codes (IATA)', async () => {
      await airRequest.selectArrivalAirport(ARRIVAL, ARRIVAL_SHORT);
    });

    await test.step('13 - Select Travel Date (required)', async () => {
      await airRequest.selectTravelDateRoundTrip();
      await expect(page.locator(airRequest.PREVIOUS_MONTH)).toBeDisabled();
      await airRequest.confirmDatesRoundTrip();
    });

    await test.step('14 - Select Departure Time (Morning / Afternoon / Evening / Night) - optional', async () => {
      await airRequest.selectOutboundTime('Morning');
      await airRequest.selectReturnTime('Afternoon');
    });

    await test.step('15 - Select Preferred Cabin Class (optional)', async () => {
      await airRequest.selectCabinClass('Business');
    });

    await test.step('16 - Add Additional Trip Notes (optional)', async () => {
      await airRequest.addAdditionalTripNotes('Window seat preferred');
    });

    await test.step('17 - Click Continue', async () => {
      await airRequest.clickContinue();
    });
  });
});
