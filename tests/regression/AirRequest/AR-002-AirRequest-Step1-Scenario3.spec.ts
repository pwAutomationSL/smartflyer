import { test, expect } from "../../../fixtures/PlaywrightFixtures";

import {
  getPresentDate,
  getPresentTime,
  convertToUiDateFormat,
} from "../../../utils/helpers";
const CLIENT_NAME = "Candice & Ben (Conway) Winikoff";
function getDate(): string {
  const presentDate = getPresentDate({ month: "2-digit", day: "2-digit" });
  const presentTime = getPresentTime({ hour: "numeric", minute: "2-digit" });
  return `${presentDate} ${presentTime}`;
}
test.describe("AR-002 - Air Request - Step 1", () => {
  test("Scenario 3 - Admin → Continue from Draft", async ({
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

    await test.step("Search the client and go to the client page, create data to use from Draft", async () => {
      await clients.searchClient(CLIENT_NAME);
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
      const getPrefilledData = await airRequest.getPrefilledData();
      const TimeForDraft = getDate();
      await airRequest.clickCancel();
      await expect(page.locator(airRequest.HEADER).first()).toBeVisible();
      const [datePart, timePart] = TimeForDraft.split(" ");
      const uiDate = convertToUiDateFormat(datePart);
      const expectedSubstring = `${uiDate}, ${timePart}`;
      await airRequest.clickAirRequest();
      await airRequest.startFromDraft();
      const firstDraftTime = await airRequest.returnFirstDraftTime();
      const cleaned = firstDraftTime?.replace("Last edited on ", "");
      expect(cleaned).toContain(expectedSubstring);
      await airRequest.clickFirstDraftTime();
      await airRequest.clickContinue();
      await expect(
        page.locator(airRequest.PHONE_INPUT).inputValue()
      ).resolves.toBe(getPrefilledData.phone);
      await expect(page.locator(airRequest.AGENT_SELECT)).toContainText(
        getPrefilledData.agent
      );
      await expect(
        page.locator(airRequest.EMAIL_INPUT(1)).inputValue()
      ).resolves.toBe(getPrefilledData.email);
    });
  });
});
