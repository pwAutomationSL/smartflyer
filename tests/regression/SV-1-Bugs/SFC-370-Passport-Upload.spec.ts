import { test, expect } from '../../../fixtures/PlaywrightFixtures';
import { uniqueId } from '../../../page-objects';
const CLIENT_NAME = 'Dr Ragan';
test.use({
  launchOptions: { slowMo: 350 },
});
const PASSPORT = uniqueId();
const passPortName = `testImage.jpg`;
test.describe('SFC-370 -  upload a passport file', () => {
  test('As an admin, when I try to upload a passport file, it should not return server error.', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    clients,
  }) => {
    await test.step('Go to the Client tab', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
      await sidebar.goToModule('Clients');
      await clients.searchClientByName(CLIENT_NAME);
      await clients.clickFirstResult();
    });
    await test.step('Click on Start from scratch', async () => {
      await page.waitForLoadState('networkidle');
      await page.waitForLoadState('load');
      await clients.goToPreferencesTab();
      await page.waitForLoadState('networkidle');
      await page.waitForLoadState('load');
      await clients.addDocument();
      await clients.thisIsAPassport();
      await clients.addNewPassportv2(PASSPORT.toString());
      await page.waitForLoadState('networkidle');
      await page.waitForLoadState('load');
      await page.reload();
      await page.waitForLoadState('networkidle');
      await page.waitForLoadState('load');
      const values = await page.locator(clients.DATES_NUMNBERS_PASSPORT_NUMBER).allTextContents();
      expect(values.some((v) => v.includes(passPortName))).toBeTruthy();
    });
    await test.step('Verify it was uploaded correctly', async () => {
      await clients.editPassport(passPortName);
      await expect(page.locator(clients.POPUP_HEADER_H2)).toContainText('Document information');
      await expect(page.locator(clients.PASSPORT_NAME)).toHaveValue(passPortName);
      await expect(page.locator(clients.PASSPORT_NUMBER)).toHaveValue(PASSPORT.toString());
      await expect(page.locator(clients.PASSPORT_IMAGE)).toBeVisible();
      await clients.cancelPopUp();
    });
    await test.step('Delete added passport', async () => {
      await clients.deletePassport(passPortName);
    });
  });
});
