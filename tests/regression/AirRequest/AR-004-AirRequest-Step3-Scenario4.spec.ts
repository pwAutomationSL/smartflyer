import { test, expect } from "../../../fixtures/PlaywrightFixtures";
const CLIENT_NAME = "Candice & Ben (Conway) Winikoff";
const EMAIL = "fake_candiceconway84@gmail.com";
const PHONE = "18333333333";
test.describe("AR-004 - Air Request - Step 3", () => {
  test("Air Request - Step 3 -4# Scenario - Specific Flight", async ({
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
      await airRequest.goToCreditCard();
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
    await test.step("10 -Enable the toggle Client request a specific flight", async () => {
      await airRequest.selectSpecificFlight();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeDisabled();
    });
    await test.step("11 -Enter flight details or paste itinerary information ", async () => {
      await airRequest.enterFlightDetails(
        "American#456 on July 22, departing LAX at 9:10 AM"
      );
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeEnabled();
      await airRequest.uploadFiles("testImage.jpg");
      await airRequest.uploadAddedFilesTripOverview();
      await airRequest.closeAddedFilesTripOverview();
      await expect(
        page.locator(airRequest.ADDED_IMAGE_TRIP_OVERVIEW)
      ).toBeVisible();
    });

    await test.step("17 - Click Continue", async () => {
      await airRequest.clickContinue();
    });
  });
});
