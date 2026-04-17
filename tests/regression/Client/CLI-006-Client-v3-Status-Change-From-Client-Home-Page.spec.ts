import { test, expect } from '../../../fixtures/PlaywrightFixtures';
import { USERS } from '../../../fixtures/users';
import { uniqueId } from '../../../page-objects';

const unique = uniqueId();
const LAST_NAME = `LastName${unique}`;
const EMAIL = `${LAST_NAME}@asd.com`;

test.describe('CLI-006 - Client v3 - Status Change From Client Home Page', () => {
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
      await expect(page.locator(clients.HEADER)).toBeEnabled();
      await expect(page.locator(clients.QUICK_ADD)).toBeVisible({ timeout: 15000 });
      await page.waitForLoadState('networkidle');
      await clients.quickAdd();
      await clients.mainInformationQuickAdd(LAST_NAME, EMAIL);
      await clients.saveQuickAdd();
      await expect(page.locator(clients.HEADER).first()).toContainText(LAST_NAME, {
        timeout: 25000,
      });
    });

    await test.step('2 - Return to clients home page, search in Active tab and verify the client is visible there', async () => {
      await sidebar.goToModuleAPP('Clients');
      await expect(page.locator(clients.CLIENT_TAB('Active'))).toBeVisible();
      await page.locator(clients.CLIENT_TAB('Active')).click();
      await expect(page.locator(clients.SPINNER_LOADER)).toBeHidden();
      await clients.searchClientByName(LAST_NAME);
      await expect(page.locator(clients.CLIENT_ROW(LAST_NAME))).toBeVisible();
      await expect(page.locator(clients.CLIENT_STATUS_BUTTON(LAST_NAME))).toContainText('Active');
    });

    await test.step('3 - Archive the client from the Active tab using the Actions column', async () => {
      await page.locator(clients.CLIENT_ACTIONS_BUTTON(LAST_NAME)).click();
      await expect(page.locator(clients.CLIENT_ACTION_OPTION('Archive')).last()).toBeVisible();
      await page.locator(clients.CLIENT_ACTION_OPTION('Archive')).last().click();
      await expect(page.locator(clients.CLIENT_STATUS_CONFIRM_POPUP)).toBeVisible();
      await page.locator(clients.CLIENT_ARCHIVE_CONFIRM_BUTTON).click();
      await clients.clickOkPopUp();
    });

    await test.step('4 - Go to Archive tab, activate the client from status column and verify it returns to Active', async () => {
      await page.locator(clients.CLIENT_TAB('Archive')).click();
      await expect(page.locator(clients.SPINNER_LOADER)).toBeHidden();
      await clients.searchClientByName(LAST_NAME);
      await expect(page.locator(clients.CLIENT_ROW(LAST_NAME))).toBeVisible();
      await expect(page.locator(clients.CLIENT_STATUS_BUTTON(LAST_NAME))).toContainText('Archive');

      await page.locator(clients.CLIENT_STATUS_BUTTON(LAST_NAME)).click();
      await expect(page.locator(clients.CLIENT_STATUS_CONFIRM_POPUP)).toBeVisible();
      await page.locator(clients.CLIENT_STATUS_CONFIRM_YES).click();
      await clients.clickOkPopUp();

      await page.locator(clients.CLIENT_TAB('Active')).click();
      await expect(page.locator(clients.SPINNER_LOADER)).toBeHidden();
      await clients.searchClientByName(LAST_NAME);
      await expect(page.locator(clients.CLIENT_ROW(LAST_NAME))).toBeVisible();
      await expect(page.locator(clients.CLIENT_STATUS_BUTTON(LAST_NAME))).toContainText('Active');
    });

    await test.step('5 - Archive the client again from Active tab', async () => {
      await page.locator(clients.CLIENT_ACTIONS_BUTTON(LAST_NAME)).click();
      await expect(page.locator(clients.CLIENT_ACTION_OPTION('Archive')).last()).toBeVisible();
      await page.locator(clients.CLIENT_ACTION_OPTION('Archive')).last().click();
      await expect(page.locator(clients.CLIENT_STATUS_CONFIRM_POPUP)).toBeVisible();
      await page.locator(clients.CLIENT_ARCHIVE_CONFIRM_BUTTON).click();
      await clients.clickOkPopUp();
    });

    await test.step('6 - Go to Archive tab and verify the available actions before deleting the client', async () => {
      await page.locator(clients.CLIENT_TAB('Archive')).click();
      await expect(page.locator(clients.SPINNER_LOADER)).toBeHidden();
      await clients.searchClientByName(LAST_NAME);
      await expect(page.locator(clients.CLIENT_ROW(LAST_NAME))).toBeVisible();

      await page.locator(clients.CLIENT_ACTIONS_BUTTON(LAST_NAME)).click();
      await expect(page.locator(clients.CLIENT_ACTION_OPTION('Activate')).last()).toBeVisible();
      await expect(page.locator(clients.CLIENT_ACTION_OPTION('Inactivate')).last()).toBeVisible();
      await expect(page.locator(clients.CLIENT_ACTION_OPTION('Delete')).last()).toBeVisible();
    });

    await test.step('7 - Delete the client and verify it is visible in Deleted tab', async () => {
      await page.locator(clients.CLIENT_ACTION_OPTION('Delete')).last().click();
      await expect(page.locator(clients.CLIENT_STATUS_CONFIRM_POPUP)).toBeVisible();
      await page.locator(clients.CLIENT_DELETE_CONFIRM_BUTTON).click();
      await clients.clickOkPopUp();
      await page.locator(clients.CLIENT_TAB('Deleted')).click();
      await expect(page.locator(clients.SPINNER_LOADER)).toBeHidden();
      await clients.searchClientByName(LAST_NAME);
      await expect(page.locator(clients.CLIENT_ROW(LAST_NAME))).toBeVisible();
    });
  });
});
