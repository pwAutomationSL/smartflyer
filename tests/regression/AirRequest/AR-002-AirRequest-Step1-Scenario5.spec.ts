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
const CLIENT_NAME = "Candice & Ben (Conway) Winikoff";
test.describe("AR-002 - Air Request - Step 1", () => {
  test("Scenario 5 - Delete draft", async ({
    loginPage,
    page,
    sidebar,
    clients,
    toast,
    airRequest,
  }) => {
    await test.step("Go to the Client tab", async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
      await sidebar.goToModule("Clients");
    });

    await test.step("Search the client and go to the client page, create data to delete", async () => {
      await clients.searchClient(CLIENT_NAME);
      await airRequest.goToCreditCard();
      await airRequest.clickAirRequest();
      await airRequest.startFromScrath();
      await expect(page.locator(airRequest.CANCEL_BUTTON)).toBeEnabled();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeDisabled();
      await expect(page.locator(airRequest.AGENT_SELECT)).toContainText(
        "Select an agent"
      );
      await airRequest.selectAgent();
      await airRequest.selectFirstAgent();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeEnabled();
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
      //This only works if first draft matches
      const draftID = await airRequest.returnFirstDraftName();
      await airRequest.clickDeleteDraft();
      await airRequest.confirmDeleteDraft();
      await expect(page.locator(toast.TOAST_MESSAGE_APP)).toContainText(
        "Air request deleted successfully"
      );
      await expect(page.locator(toast.TOAST_MESSAGE_APP)).toBeHidden({
        timeout: 15000,
      });
      const draftIDfterDelete = await airRequest.returnFirstDraftName();
      expect(draftID).not.toBe(draftIDfterDelete);
    });
  });
});
