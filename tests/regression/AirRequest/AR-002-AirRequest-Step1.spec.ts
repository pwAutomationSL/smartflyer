import { test, expect } from "../../../fixtures/PlaywrightFixtures";

import {
  getPresentDate,
  getPresentTime,
  convertToUiDateFormat,
} from "../../../utils/helpers";

function getDate(): string {
  const presentDate = getPresentDate({ month: "2-digit", day: "2-digit" });
  const presentTime = getPresentTime({ hour: "numeric", minute: "2-digit" });
  return `${presentDate} ${presentTime}`;
}
test.describe("AR-002 - Air Request - Step 1", () => {
  test("Scenario 1 - Admin → Start From Scratch and Continue", async ({
    loginPage,
    page,
    sidebar,
    clients,
    airRequest,
  }) => {
    await test.step("Scenario 1 - Admin → Start From Scratch and Continue", async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
      await sidebar.goToModule("Clients");
      await clients.searchClient("Candice & Ben (Conway) Winikoff Primary");
      await airRequest.goToCreditCard();
      await airRequest.clickAirRequest();
      await airRequest.startFromScrath();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeDisabled();
      await expect(page.locator(airRequest.AGENT_SELECT)).toContainText(
        "Select an agent"
      );
      await airRequest.selectAgent();
      const agents = await airRequest.getAgentsNames();
      await airRequest.selectFirstAgent();
      expect(agents).toEqual(
        expect.arrayContaining([
          "Jillian Mason",
          "Lauren Saiger Machowsky",
          "Maryanna DeLine",
        ])
      );

      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeEnabled();
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER)).toContainText(
        "Passenger details"
      );
      await expect(page.locator(airRequest.AGENT_SUCCESS)).toHaveCSS(
        "background-color",
        "rgb(46, 139, 87)"
      );
    });
  });
  test("Scenario 1 - Admin → Start From Scratch and Cancel", async ({
    loginPage,
    page,
    sidebar,
    clients,
    airRequest,
  }) => {
    await test.step("Scenario 1 - Admin → Start From Scratch and Cancel", async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
      await sidebar.goToModule("Clients");
      await clients.searchClient("Candice & Ben (Conway) Winikoff Primary");
      await airRequest.goToCreditCard();
      await airRequest.clickAirRequest();
      await airRequest.startFromScrath();
      await expect(page.locator(airRequest.CANCEL_BUTTON)).toBeEnabled();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeDisabled();
      await expect(page.locator(airRequest.AGENT_SELECT)).toContainText(
        "Select an agent"
      );
      await airRequest.selectAgent();
      const agents = await airRequest.getAgentsNames();
      await airRequest.selectFirstAgent();
      expect(agents).toEqual(
        expect.arrayContaining([
          "Jillian Mason",
          "Lauren Saiger Machowsky",
          "Maryanna DeLine",
        ])
      );

      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeEnabled();
      const TimeForDraft = getDate();
      await airRequest.clickCancel();
      await expect(page.locator(airRequest.HEADER)).toContainText(
        "Add credit card"
      );
      const [datePart, timePart] = TimeForDraft.split(" ");
      const uiDate = convertToUiDateFormat(datePart);
      const expectedSubstring = `${uiDate}, ${timePart}`;
      await airRequest.clickAirRequest();
      await airRequest.startFromDraft();
      const firstDraftTime = await airRequest.returnFirstDraftTime();
      expect(firstDraftTime).toContain(expectedSubstring);
    });
  });
});
