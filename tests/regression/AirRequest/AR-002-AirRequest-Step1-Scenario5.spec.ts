import { test, expect } from '../../../fixtures/PlaywrightFixtures';

import { convertToUiDateFormat } from '../../../utils/helpers';
const CLIENT_NAME = 'Candice & Ben';
test.describe('AR-002 - Air Request - Step 1', () => {
  test('Scenario 5 - Delete draft', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    clients,
    toast,
    airRequest,
  }) => {
    await test.step('Go to the Client tab', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
      await sidebar.goToModule('Clients');
    });

    await test.step('Search the client and go to the client page, create data to delete', async () => {
      await clients.searchClientAndClick(CLIENT_NAME);
      await page.waitForLoadState('networkidle');
      await airRequest.clickAirRequest();
      await airRequest.startFromScrath();
      await expect(page.locator(airRequest.CANCEL_BUTTON)).toBeEnabled();
      await airRequest.selectAgent();
      await airRequest.selectFirstAgent();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeEnabled();
      const draftCreatedAt = new Date();
      await airRequest.clickCancel();
      await expect(page.locator(airRequest.HEADER).first()).toBeVisible();
      const datePart = draftCreatedAt.toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });
      const uiDate = convertToUiDateFormat(datePart);
      await airRequest.clickAirRequest();
      await airRequest.startFromDraft();
      const firstDraftTime = await airRequest.returnFirstDraftTime();
      const cleaned = firstDraftTime?.replace('Last edited on ', '');
      expect(cleaned).toContain(uiDate);
      expect(cleaned).toMatch(/,\s*\d{1,2}:\d{2}\s*(AM|PM)$/);
      //This only works if first draft matches
      const draftID = await airRequest.returnFirstDraftName();
      await airRequest.clickDeleteDraft();
      await airRequest.confirmDeleteDraft();
      await expect(page.locator(toast.TOAST_MESSAGE_APP)).toContainText(
        'Air request deleted successfully',
      );
      await expect(page.locator(toast.TOAST_MESSAGE_APP)).toBeHidden({
        timeout: 15000,
      });
      const draftIDfterDelete = await airRequest.returnFirstDraftName();
      expect(draftID).not.toBe(draftIDfterDelete);
    });
  });
});
