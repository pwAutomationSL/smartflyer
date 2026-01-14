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
const normalizePhoneNumber = (str: string | null | undefined): string => {
  if (!str) return "";
  return str.replace(/[^\d+]/g, "");
};
test.describe("AR-002 - Air Request - Step 1", () => {
  test("Create from scratch (Agent) And Continue", async ({
    loginPage,
    page,
    sidebar,
    clients,
    airRequest,
  }) => {
    await test.step("Go to the Client tab", async () => {
      await loginPage.login({ username: "oksana.gorodiska+2@scrumlaunch.com" });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
      await sidebar.goToModule("Clients");
      await clients.clickFirstResult();
    });
    await test.step("Go to New Credit Card, Air Request and Start from Scratch and Continue", async () => {
      const loggedAgent = await airRequest.getLoggedUsername();
      const parts = loggedAgent.trim().split(" ");
      const loggedEmail = parts.pop() ?? "";
      const loggedUser = parts.join(" ").trim();
      await page.waitForLoadState("networkidle");
      await airRequest.clickAirRequest();
      await expect(page.locator(airRequest.POP_UP_HEADER)).toBeVisible();
      const userData = await airRequest.startFromScrathAndGetUserData();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeEnabled();
      await expect(page.locator(airRequest.AGENT_SELECT)).toContainText(
        loggedUser
      );
      await expect(page.locator(airRequest.EMAIL_INPUT(1))).toHaveValue(
        loggedEmail
      );
      await expect(page.locator(airRequest.EMAIL_INPUT(1))).toBeDisabled();

      await expect(page.locator(airRequest.PHONE_INPUT)).toBeDisabled();
      const phoneUI = await page.locator(airRequest.PHONE_INPUT).inputValue();
      expect(normalizePhoneNumber(phoneUI)).toContain(
        normalizePhoneNumber(userData.responseData.data.agent_phone)
      );
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
  test("Create from scratch (Agent) And Cancel", async ({
    loginPage,
    page,
    sidebar,
    clients,
    airRequest,
  }) => {
    await test.step("Scenario 2 - Agent → Start From Scratch and Cancel", async () => {
      await loginPage.login({ username: "oksana.gorodiska+2@scrumlaunch.com" });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
      await sidebar.goToModule("Clients");
      await clients.clickFirstResult();
    });
    await test.step("Go to New Credit Card, Air Request and Start from Scratch and Cancel", async () => {
      const loggedAgent = await airRequest.getLoggedUsername();
      const parts = loggedAgent.trim().split(" ");
      const loggedEmail = parts.pop() ?? "";
      const loggedUser = parts.join(" ").trim();
      await page.waitForLoadState("networkidle");
      await airRequest.clickAirRequest();
      const userData = await airRequest.startFromScrathAndGetUserData();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeEnabled();
      await expect(page.locator(airRequest.AGENT_SELECT)).toContainText(
        loggedUser
      );
      await expect(page.locator(airRequest.EMAIL_INPUT(1))).toHaveValue(
        loggedEmail
      );
      await expect(page.locator(airRequest.EMAIL_INPUT(1))).toBeDisabled();

      await expect(page.locator(airRequest.PHONE_INPUT)).toBeDisabled();
      const phoneUI = await page.locator(airRequest.PHONE_INPUT).inputValue();
      expect(normalizePhoneNumber(phoneUI)).toContain(
        normalizePhoneNumber(userData.responseData.data.agent_phone)
      );
      await airRequest.clickCancel();
      await expect(page.locator(airRequest.HEADER).first()).toBeVisible();
      const TimeForDraft = getDate();
      const [datePart, timePart] = TimeForDraft.split(" ");
      const uiDate = convertToUiDateFormat(datePart);
      const expectedSubstring = `${uiDate}, ${timePart}`;
      await airRequest.clickAirRequest();
      await airRequest.startFromDraft();
      const firstDraftTime = await airRequest.returnFirstDraftTime();
      const cleaned = firstDraftTime?.replace("Last edited on ", "");
      expect(cleaned).toContain(expectedSubstring.replace(/\s?(AM|PM)$/i, ""));
    });
  });
});
