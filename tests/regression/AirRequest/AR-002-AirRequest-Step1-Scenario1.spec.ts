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
    await test.step("Go to the Client tab", async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
      await sidebar.goToModule("Clients");
      await test.step("Search the client and go to the client page", async () => {
        await clients.searchClient("Candice & Ben (Conway) Winikoff Primary");
      });
      await test.step("Go to the New credit card tab and Click on Air request button", async () => {
        await airRequest.goToCreditCard();
        await airRequest.clickAirRequest();
      });
      await test.step("Click on Start from scratch", async () => {
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
      });
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeEnabled();
      await test.step("Click on Continue", async () => {
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
  });
  test("Scenario 1 - Admin → Start From Scratch and Cancel", async ({
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
      await test.step("Search the client and go to the client page", async () => {
        await clients.searchClient("Candice & Ben (Conway) Winikoff Primary");
      });
      await test.step("Go to the New credit card tab and Click on Air request button", async () => {
        await airRequest.goToCreditCard();
        await airRequest.clickAirRequest();
      });
      await test.step("Click on Start from scratch", async () => {
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
        await test.step("Click on Cancel", async () => {
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
          const cleaned = firstDraftTime?.replace("Last edited on ", "");
          expect(cleaned).toContain(expectedSubstring);
        });
      });
    });
  });
});
