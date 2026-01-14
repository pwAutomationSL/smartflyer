import { test, expect } from "../../../fixtures/PlaywrightFixtures";

const PROGAM = "American Airlines: AAdvantage";
const PHONE = "123123123";
const CLIENT_NAME = "Candice & Ben (Conway) Winikoff";
test.describe("AR-003 - Air Request - Step #21 ", () => {
  test.setTimeout(200_000);
  test("Air Request - Step 2 - 21# Scenario - Verify Frequent Flyer programs", async ({
    loginPage,
    page,
    sidebar,
    clients,
    toast,
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

    await test.step("add Frequent Flyer program", async () => {
      await page.waitForLoadState("networkidle");
      await page.waitForLoadState("load");
      await clients.clickDatesAndNumbersAPP();
      await clients.loyaltyProgramsAdd();
      await expect(page.locator(clients.LOYALTY_PROGRAMS_POPUP)).toBeVisible();
      await clients.loyaltyProgramsFill(PROGAM, PHONE);
      await clients.saveQuickAdd();
      await expect(page.locator(toast.TOAST_MESSAGE)).toContainText(
        "Loyalty programs  has been saved successfully."
      );
      await toast.assertToastToGoAway();
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

    await test.step("21# Scenario - Add Frequent Flyer", async () => {
      await expect(
        page.locator(airRequest.PROGRAM_NUMBER(1)).last()
      ).toHaveValue(PHONE);
      const programUI = await page
        .locator(airRequest.FREQUENT_FLYER_PROGRAM_SELECTED)
        .textContent();
      expect(programUI).toBe(PROGAM);
    });
    await test.step("Delete FF Program added", async () => {
      await airRequest.goBack();
      await airRequest.clickCancel();
      await page.waitForLoadState("networkidle");
      await expect(
        page.getByRole("button", { name: "DATES & NUMBERS" })
      ).toBeVisible({ timeout: 10000 });
      await clients.clickDatesAndNumbersAPP();
      await page.waitForLoadState("networkidle");
      await clients.deleteLoyaltyProgram();
      await clients.confirmDeleteFF();
      await expect(page.locator(clients.HEADER_H2)).toContainText("Success");
      await clients.clickOkPopUp();
    });
  });
});
