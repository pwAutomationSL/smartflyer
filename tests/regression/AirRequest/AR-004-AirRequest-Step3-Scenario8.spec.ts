import { test, expect } from "../../../fixtures/PlaywrightFixtures";
const CLIENT_NAME = "Candice & Ben (Conway) Winikoff";
const EMAIL = "fake_candiceconway84@gmail.com";
const PHONE = "18333333333";
const DEPARTURESHORT = "JFK";
const DEPARTURE = "John F Kennedy International";
const ARRIVAL_SHORT = "LAX";
const ARRIVAL_F2 = "San Francisco International Airport";
const ARRIVAL_SHORT_F2 = "SFO";
const ARRIVAL = "Los Angeles International Airport";
test.describe("AR-004 - Air Request - Step 3", () => {
  test("Air Request - Step 3 - 8# Scenario - Specific flight, multiple passengers, different itineraries", async ({
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
    });
    await test.step("3 - 4 - Go to the New credit card tab and Click on Air request button", async () => {
      await airRequest.clickAirRequest();
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
    await test.step("9 - Add additional passenger", async () => {
      await airRequest.addAdditionalPassenger();
      await expect(page.locator(airRequest.POP_UP_DIALOG)).toBeVisible();
      await airRequest.selectFirstPassenger();
      await airRequest.addPassenger();
      await airRequest.clickGenderDropdown(1);
      await expect(page.locator(airRequest.MALE_DROPDOWN)).toBeVisible();
      await expect(page.locator(airRequest.FEMALE_DROPDOWN)).toBeVisible();
      await airRequest.selectMale();
      await expect(page.locator(airRequest.PHONE_FLAG).last()).toBeVisible();
      await airRequest.fillPassengerPhone(PHONE, 1);
      await airRequest.clickLabel();
      await airRequest.fillDayOfBirth("15", 2);
      await airRequest.fillMonth(1);
      await airRequest.fillYearOfBirth("2000", 2);
      await airRequest.fillPassengerEmail(EMAIL, 2);
      await airRequest.checkCertifySecondPassenger();
    });
    await test.step("10 - Click on Continue", async () => {
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER)).toContainText(
        "Trip overview"
      );
      await expect(page.locator(airRequest.PASSENGERS_SUCCESS)).toHaveCSS(
        "background-color",
        "rgb(46, 139, 87)"
      );
    });
    await test.step('11 - Select "One-way" trip type', async () => {
      await airRequest.sameItinerary();
      await airRequest.selectSpecificFlight();
      await airRequest.enterFlightDetails(
        "American#456 on July 22, departing LAX at 9:10 AM"
      );
      await airRequest.uploadFiles("testImage.jpg");
      await airRequest.uploadAddedFilesTripOverview();
      await airRequest.closeAddedFilesTripOverview();
      await expect(
        page.locator(airRequest.ADDED_IMAGE_TRIP_OVERVIEW)
      ).toBeVisible();
      await airRequest.selectOneWayTripPassenger2();
    });

    await test.step("12 -Select Departure airport for Primary passenger", async () => {
      await airRequest.selectDepartureAirportFlight2(DEPARTURE, DEPARTURESHORT);
    });

    await test.step("13 -Select Arrival airport for Primary passenger", async () => {
      await airRequest.selectArrivalAirportFlight2(ARRIVAL, ARRIVAL_SHORT);
    });
    await test.step("14 - Select the Travel Date for Primary passenger", async () => {
      await airRequest.selectTravelDateFlight2();
      await expect(page.locator(airRequest.PREVIOUS_MONTH)).toBeDisabled();
      await airRequest.confirmDates();
      await airRequest.selectDepartureTimeFlight2("Morning");
      await airRequest.selectCabinClassMultiF2("Premium Economy");
    });
    await test.step("17 - Click Continue", async () => {
      await airRequest.clickContinue();
    });
  });
});
