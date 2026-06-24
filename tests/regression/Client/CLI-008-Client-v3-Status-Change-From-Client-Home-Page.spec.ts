import { test, expect } from '../../../fixtures/PlaywrightFixtures';
import { USERS } from '../../../fixtures/users';
import { uniqueId } from '../../../page-objects';
import { importPrimaryClient } from '../../../utils/importPrimaryClient';

const unique = uniqueId();
const LAST_NAME = `LastName${unique}`;
const EMAIL = `${LAST_NAME}@asd.com`;

test.describe('CLI-008 - Client v3 - Status Change From Client Home Page', () => {
  test('Login to app qa2 and change client status from home page tabs', async ({
    loginPage,
    page,
    clients,
    sidebar,
    request,
  }) => {
    const clientStatusButton = () =>
      page.getByRole('button', { name: new RegExp(`Status for .*${LAST_NAME}`) }).first();

    await test.step('1 - Login at Society, import a client, and open the client profile', async () => {
      await importPrimaryClient(request, USERS.ADMIN_MAIN, LAST_NAME, EMAIL);
      await loginPage.login({
        username: USERS.ADMIN_MAIN.username,
        password: USERS.ADMIN_MAIN.password,
      });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
      await sidebar.goToModule('Clients');
      await expect(page.locator(clients.SPINNER_LOADER)).toBeHidden();
      await clients.openClientFromSearch(`FirstName ${LAST_NAME}`);
      await expect(page.locator(clients.HEADER).first()).toContainText(LAST_NAME, {
        timeout: 25000,
      });
    });

    await test.step('2 - Return to clients home page, activate the imported client, and verify it is visible', async () => {
      await sidebar.goToModuleAPP('Clients');
      await clients.searchClientByName('FirstName ' + LAST_NAME);
      await expect(page.locator(clients.CLIENT_ROW(LAST_NAME))).toBeVisible();
      await clientStatusButton().click();
      await page.locator(clients.CLIENT_STATUS_ACTIVE).click();
      await expect(clientStatusButton()).toContainText('Active');
    });

    await test.step('3 - Archive the client from the Active tab using the Actions column', async () => {
      await clientStatusButton().click();
      await page.locator(clients.CLIENT_STATUS_ARCHIVED).click();
      await page.waitForLoadState('networkidle');
      await expect(clientStatusButton()).toContainText('Archived');
    });

    await test.step('4 -Wait for reload, activate the client from status column and verify it returns to Active', async () => {
      await clientStatusButton().click();
      await page.locator(clients.CLIENT_STATUS_ACTIVE).click();
      await page.waitForLoadState('networkidle');
      await expect(clientStatusButton()).toContainText('Active');
    });

    await test.step('5 - Archive the client again from Active tab', async () => {
      await clientStatusButton().click();
      await page.locator(clients.CLIENT_STATUS_ARCHIVED).click();
      await page.waitForLoadState('networkidle');
      await expect(clientStatusButton()).toContainText('Archived');
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
