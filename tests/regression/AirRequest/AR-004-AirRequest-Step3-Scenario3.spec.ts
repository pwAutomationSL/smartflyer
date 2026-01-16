import { test, expect } from "../../../fixtures/PlaywrightFixtures";
const CLIENT_NAME = "Candice & Ben (Conway) Winikoff";
const EMAIL = "fake_candiceconway84@gmail.com";
const PHONE = "18333333333";
const DEPARTURESHORT = "JFK";
const DEPARTURESHORT_2LETTERS = "JF";
const DEPARTURE = "John F Kennedy International";
const ARRIVAL_SHORT = "LAX";
const ARRIVAL_SHORT_2LETTERS = "LA";
const ARRIVAL = "Los Angeles International Airport";
const DEPARTURE_F2 = "Chicago Rockford Airport";
const ARRIVAL_F2 = "San Francisco International Airport";
const DEPARTURE_SHORT_F2 = "RFD";
const ARRIVAL_SHORT_F2 = "SFO";
test.describe("AR-004 - Air Request - Step 3", () => {
  test("Air Request - Step 3 -3# Scenario - Multi-city trip type", async ({
    loginPage,
    page,
    sidebar,
    clients,
    airRequest,
  }) => {
    await test.step("1 - Go to the Client tab", async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
      await sidebar.goToModule("Clients");
    });
    await test.step("2 - Search the client and go to the client page", async () => {
      await clients.searchClient(CLIENT_NAME);
      await page.waitForLoadState("networkidle");
    });
    await test.step("3 - 4 - Go to the New credit card tab and Click on Air request button", async () => {
      await airRequest.clickAirRequest();
      await expect(page.locator(airRequest.POP_UP_HEADER)).toBeVisible();
    });
    await test.step("5 - Click on Start from scratch", async () => {
      await airRequest.startFromScrath();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeDisabled();
      await expect(page.locator(airRequest.AGENT_SELECT)).toContainText(
        "Select an agent"
      );
    });
    await test.step("6 - Select the Agent and Click on Continue button", async () => {
      await airRequest.selectAgent();
      await airRequest.selectFirstAgent();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeEnabled();
    });
    await test.step("7 - Click on Continue", async () => {
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER)).toContainText(
        "Passenger details"
      );
      await expect(page.locator(airRequest.AGENT_SUCCESS)).toHaveCSS(
        "background-color",
        "rgb(46, 139, 87)"
      );
    });
    await test.step("8 - Add Passenger information on Step 2", async () => {
      await airRequest.fillMonth();
      await airRequest.fillDayOfBirth("15");
      await airRequest.fillYearOfBirth("1990");
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
    await test.step("9 - Click on Continue", async () => {
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER)).toContainText(
        "Trip overview"
      );
      await expect(page.locator(airRequest.PASSENGERS_SUCCESS)).toHaveCSS(
        "background-color",
        "rgb(46, 139, 87)"
      );
    });
    await test.step("10 -Click on the “Multi-city” radio button; ", async () => {
      await airRequest.selectMultiCityTrip();
    });

    await test.step("11 - Add information for Flight 1: Departure airport, Arrival airport, Departure date, Departure time ", async () => {
      await airRequest.selectDepartureAirport2LettersFlight1(
        DEPARTURESHORT_2LETTERS
      );
      await expect(
        page.locator(airRequest.AIRPORTS_VALID_RESULTS).first()
      ).toBeVisible();
      await expect(page.locator(airRequest.FLIGHT_2_X).first()).toBeDisabled();
      const cityCountry = await page
        .locator(airRequest.CITY_COUNTRY_RESULT)
        .first()
        .textContent();
      expect(cityCountry).toBe("New York, United States");
      const searchResults = await page
        .locator(airRequest.AIRPORTS_VALID_RESULTS)
        .count();
      expect(searchResults).toBeGreaterThan(1);
      await airRequest.selectArrivalAirport2LettersFligh1(
        ARRIVAL_SHORT_2LETTERS
      );
      await expect(
        page.locator(airRequest.AIRPORTS_VALID_RESULTS).first()
      ).toBeVisible();
      const cityCountryArribal = await page
        .locator(airRequest.CITY_COUNTRY_RESULT)
        .first()
        .textContent();
      expect(cityCountryArribal).toBe("Lafayette, United States");
      const searchResultsArribal = await page
        .locator(airRequest.AIRPORTS_VALID_RESULTS)
        .count();
      expect(searchResultsArribal).toBeGreaterThan(1);
      await airRequest.selectDepartureAirportFlight1(DEPARTURE, DEPARTURESHORT);
      await airRequest.selectArrivalAirportFlight1(ARRIVAL, ARRIVAL_SHORT);
      await airRequest.selectTravelDateFlight1();
      await airRequest.confirmDates();
      await airRequest.selectDepartureTimeFlight1("Morning");
    });

    await test.step("12 - Add information for Flight 2: Departure airport, Arrival airport, Departure date, Departure time   ", async () => {
      await airRequest.selectDepartureAirport2LettersFlight2(
        DEPARTURESHORT_2LETTERS
      );

      await expect(
        page.locator(airRequest.AIRPORTS_VALID_RESULTS).first()
      ).toBeVisible();
      const cityCountry = await page
        .locator(airRequest.CITY_COUNTRY_RESULT)
        .first()
        .textContent();
      expect(cityCountry).toBe("New York, United States");
      const searchResults = await page
        .locator(airRequest.AIRPORTS_VALID_RESULTS)
        .count();
      expect(searchResults).toBeGreaterThan(1);
      await airRequest.selectArrivalAirport2LettersFligh2(
        ARRIVAL_SHORT_2LETTERS
      );
      await expect(
        page.locator(airRequest.AIRPORTS_VALID_RESULTS).first()
      ).toBeVisible();
      const cityCountryArribal = await page
        .locator(airRequest.CITY_COUNTRY_RESULT)
        .first()
        .textContent();
      expect(cityCountryArribal).toBe("Lafayette, United States");
      const searchResultsArribal = await page
        .locator(airRequest.AIRPORTS_VALID_RESULTS)
        .count();
      expect(searchResultsArribal).toBeGreaterThan(1);
      await airRequest.selectDepartureAirportFlight2(
        DEPARTURE_F2,
        DEPARTURE_SHORT_F2
      );
      await airRequest.selectArrivalAirportFlight2(
        ARRIVAL_F2,
        ARRIVAL_SHORT_F2
      );
      await airRequest.selectTravelDateFlight2();
      await airRequest.confirmDates();
      await airRequest.selectDepartureTimeFlight2("Morning");
    });

    await test.step("ER - Verify when more than two flights are shown: Clicking the X button will remove the entire flight block from the view.", async () => {
      await airRequest.addAFlight();
      await expect(page.locator(airRequest.FLIGHT_2_X).first()).toBeEnabled();
      await expect(page.locator(airRequest.FLIGHT_3_X).first()).toBeEnabled();
      await airRequest.removeFlight3();
      await expect(page.locator(airRequest.FLIGHT_2_X).first()).toBeDisabled();
      await expect(page.locator(airRequest.FLIGHT_3_X).first()).toBeHidden();
    });
    await test.step("15 - Select Preferred Cabin Class (optional)", async () => {
      await airRequest.selectCabinClassMultiF1("Economy");
      await airRequest.selectCabinClassMultiF2("Economy");
    });

    await test.step("16 - Add Additional Trip Notes (optional)", async () => {
      await airRequest.addAdditionalTripNotes("Window seat preferred");
    });

    await test.step("17 - Click Continue", async () => {
      await airRequest.clickContinue();
    });
  });
});
