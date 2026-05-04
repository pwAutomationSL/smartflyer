import { test, expect } from '../../../fixtures/PlaywrightFixtures';
import { USERS } from '../../../fixtures/users';
import { uniqueId } from '../../../page-objects';

const env = process.env.ENVIRONMENT ?? 'qa2';
const HOST = `https://crm.${env}.smartflyer.com/`;
const unique = uniqueId();
const LAST_NAME = `LastName` + unique;
const EMAIL = `${LAST_NAME}@smart.com`;
test.describe('CLI-009 - Client v3 - New Quick Add', () => {
  test('Login to app and verify Change status modal in client profile', async ({
    loginPage,
    page,
    clients,
    sidebar,
  }) => {
    await test.step('1 - Login at Society , go to clients and quick add', async () => {
      await loginPage.login({
        username: USERS.ADMIN_MAIN.username,
        password: USERS.ADMIN_MAIN.password,
        host: HOST,
      });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
      await sidebar.goToModule('Search');
      await page.goto(`https://app.${env}.smartflyer.com/clients/`);
      await expect(page.locator(clients.SPINNER_LOADER)).toBeHidden();
      await expect(page.locator(clients.HEADER)).toBeEnabled();
      await expect(page.locator(clients.ADD_CLIENT)).toBeVisible({ timeout: 15000 });
      await page.waitForLoadState('networkidle');
      await clients.quickAddNew();
      await clients.mainInformationQuickAdd(LAST_NAME, EMAIL);
      await clients.saveQuickAdd();
    });
  });
});
