import { test, expect } from '../../../fixtures/PlaywrightFixtures';
import { USERS } from '../../../fixtures/users';
import { uniqueId } from '../../../page-objects';

const unique = uniqueId();
const LAST_NAME = `LastName${unique}`;
const EMAIL = `${LAST_NAME}@asd.com`;

test.describe('CLI-008 - Client v3 - Status Change From Client Home Page', () => {
  test('Login to app qa2 and change client status from home page tabs', async ({
    loginPage,
    page,
    clients,
    sidebar,
  }) => {
    await test.step('1 - Login at Society, go to clients and quick add a client', async () => {
      await loginPage.login({
        username: USERS.ADMIN_MAIN.username,
        password: USERS.ADMIN_MAIN.password,
      });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
      await sidebar.goToModule('Clients');
      await expect(page.locator(clients.SPINNER_LOADER)).toBeHidden();
      await page.waitForLoadState('networkidle');
      await clients.quickAddNew();
      await clients.mainInformationQuickAdd(LAST_NAME, EMAIL);
      await clients.saveQuickAdd();
      await expect(page.locator(clients.HEADER).first()).toContainText(LAST_NAME, {
        timeout: 25000,
      });
    });

    await test.step('2 - Return to clients home page, search in Active tab and verify the client is visible there', async () => {
      await sidebar.goToModuleAPP('Clients');
      await clients.searchClientByName('FirstName ' + LAST_NAME);
      await expect(page.locator(clients.CLIENT_ROW(LAST_NAME))).toBeVisible();
      await expect(page.locator(clients.CLIENT_STATUS_BUTTON(LAST_NAME)).first()).toContainText(
        'Active',
      );
    });

    await test.step('3 - Archive the client from the Active tab using the Actions column', async () => {
      await page.locator(clients.CLIENT_STATUS_BUTTON(LAST_NAME)).last().click();
      await page.locator(clients.CLIENT_STATUS_ARCHIVED).click();
      await page.waitForLoadState('networkidle');
      await expect(page.locator(clients.CLIENT_STATUS_BUTTON(LAST_NAME)).first()).toContainText(
        'Archived',
      );
    });

    await test.step('4 -Wait for reload, activate the client from status column and verify it returns to Active', async () => {
      await page.locator(clients.CLIENT_STATUS_BUTTON(LAST_NAME)).last().click();
      await page.locator(clients.CLIENT_STATUS_ACTIVE).click();
      await page.waitForLoadState('networkidle');
      await expect(page.locator(clients.CLIENT_STATUS_BUTTON(LAST_NAME)).first()).toContainText(
        'Active',
      );
    });

    await test.step('5 - Archive the client again from Active tab', async () => {
      await page.locator(clients.CLIENT_STATUS_BUTTON(LAST_NAME)).last().click();
      await page.locator(clients.CLIENT_STATUS_ARCHIVED).click();
      await page.waitForLoadState('networkidle');
      await expect(page.locator(clients.CLIENT_STATUS_BUTTON(LAST_NAME)).first()).toContainText(
        'Archived',
      );
    });

    await test.step('6 - Go to Archive tab and verify the available actions before deleting the client', async () => {
      await page.locator(clients.CLIENT_ACTIONS_BUTTON(LAST_NAME)).last().click();
      await page.locator(clients.CLIENT_DELETE_OPTION).click();
      await page.locator(clients.CONFIRM_DELETE).click();
      await page.waitForLoadState('networkidle');
      await clients.searchClientByName('FirstName ' + LAST_NAME);
      await expect(page.locator(clients.CLIENT_NOT_FOUND)).toBeVisible();
    });
  });
});
