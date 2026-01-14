import { test, expect } from "../../../fixtures/PlaywrightFixtures";

const CLIENT_NAME = "Candice & Ben (Conway) Winikoff";
test.describe("AR-002 - Air Request - Step 1", () => {
  test("Scenario 7 - Search draft by ID", async ({
    loginPage,
    page,
    sidebar,
    clients,
    airRequest,
  }) => {
    await test.step("Go to the Client tab", async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
      await sidebar.goToModule("Clients");
    });

    await test.step("Search the client and go to the client page, create data to delete", async () => {
      await clients.searchClient(CLIENT_NAME);
      await page.waitForLoadState("networkidle");
      await airRequest.clickAirRequest();
      await expect(page.locator(airRequest.POP_UP_HEADER)).toBeVisible();
      await airRequest.startFromScrath();
      await expect(page.locator(airRequest.CANCEL_BUTTON)).toBeEnabled();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeDisabled();
      await expect(page.locator(airRequest.AGENT_SELECT)).toContainText(
        "Select an agent"
      );
      await airRequest.selectAgent();
      await airRequest.selectFirstAgent();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeEnabled();
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER)).toContainText(
        "Passenger details"
      );
      await airRequest.goBack();
      await airRequest.clickCancel();
      await page.waitForLoadState("networkidle");
      await expect(page.locator(airRequest.HEADER).first()).toBeVisible();
      await airRequest.clickAirRequest();
      await expect(page.locator(airRequest.POP_UP_HEADER)).toBeVisible();
      await expect(
        page.locator(airRequest.POP_UP_DIALOG).first()
      ).toBeVisible();
      await airRequest.startFromDraft();
      const draftID = await airRequest.returnFirstDraftName();
      await airRequest.searchDraftByID(draftID);
      await airRequest.waitForSpinner();
      const draftIDfterSearch = await airRequest.returnFirstDraftName();
      expect(draftID).toBe(draftIDfterSearch);
      await expect(
        page.locator(airRequest.DRAFTS_ELEMENTS_ID_ONLY)
      ).toHaveCount(1);
    });
  });
});
