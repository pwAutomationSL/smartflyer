import { test, expect } from "../../../fixtures/PlaywrightFixtures";

const PASSENGER_FIRST_NAME = "firstNameNT";
const PASSENGER_LAST_NAME = "LastNameNT";
const CLIENT_NAME = "Candice & Ben (Conway) Winikoff";
const MONTH = "June";
const DAY = "7";
const YEAR = "1993";
const EMAIL = "testEmail@scrumlaunch.com";
const PHONE = "18333333333";
test.describe("AR-003 - Air Request - Step #19 ", () => {
  test.setTimeout(200_000);
  test("Air Request - Step 2 - 19# Scenario - Add new traveler, save to client profile", async ({
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

      await test.step("19# Add new traveler, save to client profile", async () => {
        await airRequest.addAdditionalPassenger();
        await expect(page.locator(airRequest.POP_UP_DIALOG)).toBeVisible();
        await expect(page.locator(airRequest.POP_UP_CANCEL)).toBeVisible();
        await expect(
          page.locator(airRequest.POP_UP_ADD_PASSENGERS)
        ).toBeVisible();
        await expect(page.locator(airRequest.POP_UP_HEADER)).toContainText(
          "Who is traveling?"
        );
        await airRequest.addNewTraveler();
        await expect(page.locator(airRequest.POP_UP_HEADER)).toContainText(
          "Add new traveler"
        );
      });
      await test.step("19# Add client First name, Last name, Gender, Date of birth ", async () => {
        await expect(page.locator(airRequest.ADD_NEW_TRAVELER)).toBeDisabled();
        await airRequest.newTravelerName(PASSENGER_FIRST_NAME);
        await airRequest.newTravelerLastName(PASSENGER_LAST_NAME);
        await airRequest.newTravelerGender();
        await airRequest.selectMale();
        await airRequest.newTravelerDOB(MONTH, DAY, YEAR);
        await airRequest.saveToClientsProfile();
        await airRequest.newTravelerEmail(EMAIL);
        await airRequest.newTravelerPhone(PHONE);
        await airRequest.checkFamilyMember();
        await airRequest.selectRelationship("Co-Worker");
        await expect(page.locator(airRequest.ADD_NEW_TRAVELER)).toBeEnabled();
        await airRequest.addNewTraveler();
      });
      await test.step("19# validate passenger was added ", async () => {
        await expect(
          page.locator(airRequest.FIRST_NAME_PASSENGER(1))
        ).toHaveValue(PASSENGER_FIRST_NAME);
        await expect(
          page.locator(airRequest.LAST_NAME_PASSENGER(1))
        ).toHaveValue(PASSENGER_LAST_NAME);
        await expect(
          page
            .locator("div")
            .filter({ hasText: /^Male$/ })
            .nth(1)
        ).toBeVisible;
        await expect(page.locator(airRequest.DOB_DAY(2))).toHaveValue(DAY);
        await expect(page.locator(airRequest.DOB_YEAR(2))).toHaveValue(YEAR);
        await expect(
          page.locator(airRequest.DELETE_TRAVELER_BUTTON)
        ).toBeVisible();
        await airRequest.deleteTraveler();
        await airRequest.addAdditionalPassenger();
        await airRequest.searchTraveler(PASSENGER_FIRST_NAME);
        await expect(
          page.locator(airRequest.NAMES_FOR_AVAILABLE_CHECKBOXES).first()
        ).toBeVisible();
        const allNames = await page
          .locator(airRequest.NAMES_FOR_AVAILABLE_CHECKBOXES)
          .allTextContents();
        await expect(allNames).toContain(
          `${PASSENGER_FIRST_NAME} ${PASSENGER_LAST_NAME}`
        );
        expect(allNames.length).toBe(1);
        await airRequest.addNewTraveler();
        await airRequest.goBackToTheList();
        await expect(
          page.locator(airRequest.NAMES_FOR_AVAILABLE_CHECKBOXES).first()
        ).toBeVisible();
      });
      await test.step("19# Go back to clients page- related travelers ", async () => {
        await airRequest.clickCancel();
        await airRequest.goBack();
        await airRequest.clickCancel();
        await page.waitForLoadState("domcontentloaded");
        await page.waitForLoadState("networkidle");
        await expect(
          page.getByRole("button", { name: "Related Travelers" })
        ).toBeVisible({ timeout: 10000 });
        await clients.clickRelatedTravelers();
        await page.waitForLoadState("networkidle");
        const allTravelers = await page
          .locator(clients.ALL_RELATED_TRAVELERS)
          .allTextContents();
        await expect(allTravelers).toContain(
          `${PASSENGER_FIRST_NAME} ${PASSENGER_LAST_NAME}`
        );
      });
      await test.step("19# Delete added user ", async () => {
        await clients.deleteAddedTraveler(PASSENGER_FIRST_NAME);
        await expect(page.locator(clients.HEADER_H2)).toContainText(
          "Are you sure?"
        );
        await clients.confirmDelete();
        await expect(page.locator(clients.HEADER_H2)).toContainText("Success");
        await clients.clickOkPopUp();
      });
    });
  });
});
