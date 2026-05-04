import { test, expect } from '../../../fixtures/PlaywrightFixtures';
import { USERS } from '../../../fixtures/users';
import { uniqueId } from '../../../page-objects';

const unique = uniqueId();
const LAST_NAME = `LastName` + unique;
const EMAIL = `${LAST_NAME}@asd.com`;
test.describe('CLI-005 - Client v3 - Status Change', () => {
  test('Login to app and verify Change status modal in client profile', async ({
    loginPage,
    page,
    clients,
    sidebar,
  }) => {
    let savedStatus = '';

    await test.step('1 - Login at Society , go to clients and quick add', async () => {
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
      await clients.oldMainInformationQuickAdd(LAST_NAME, EMAIL);
      await clients.oldSaveQuickAdd();
      await expect(page.locator(clients.HEADER).first()).toContainText(LAST_NAME, {
        timeout: 25000,
      });
    });

    await test.step('2 - Open the client v3 profile in qa2', async () => {
      await page.goto(`${page.url()}&version=v3`);

      await expect(page.locator(clients.HEADER)).toContainText(LAST_NAME, {
        timeout: 20000,
      });
    });

    await test.step('3 - Hover the status icon and save the current status label', async () => {
      await page.locator(clients.CLIENT_V3_STATUS_ICON(LAST_NAME)).hover();
      savedStatus =
        (await page.locator(clients.CLIENT_V3_HOVER_STATUS(LAST_NAME)).textContent())?.trim() ?? '';
      expect(savedStatus).toEqual('Active');
    });

    await test.step('4 - Open Change status and verify Active can change to Pending or Archive', async () => {
      await page.locator(clients.CLIENT_V3_MENU).click();
      await page.locator(clients.CLIENT_V3_CHANGE_STATUS).click();

      await expect(page.locator(clients.CLIENT_V3_CURRENT_STATUS)).toContainText(savedStatus);
      await expect(page.locator(clients.CLIENT_V3_STATUS_OPTION('Pending')).first()).toBeVisible();
      await expect(page.locator(clients.CLIENT_V3_STATUS_OPTION('Archive')).first()).toBeVisible();
      await expect(page.locator(clients.CLIENT_V3_CANCEL)).toBeVisible();
      await expect(page.locator(clients.CLIENT_V3_UPDATE_STATUS)).toBeVisible();
      await expect(page.locator(clients.CLIENT_V3_UPDATE_STATUS)).toBeDisabled();
    });

    await test.step('5 - Select Active, update status, and verify tooltip changes to Active', async () => {
      await page.locator(clients.CLIENT_V3_STATUS_OPTION('Pending')).first().click();
      await expect(page.locator(clients.CLIENT_V3_UPDATE_STATUS)).toBeEnabled();
      await page.locator(clients.CLIENT_V3_UPDATE_STATUS).click();
      await expect(page.locator(clients.CLIENT_V3_CANCEL)).toBeHidden({ timeout: 20000 });
      await page.locator(clients.CLIENT_V3_STATUS_ICON(LAST_NAME)).hover();
      savedStatus =
        (await page.locator(clients.CLIENT_V3_HOVER_STATUS(LAST_NAME)).textContent())?.trim() ?? '';
      expect(savedStatus).toEqual('Pending');
    });

    await test.step('6 - Open Change status again and verify Pending can change to Active or Archive', async () => {
      await page.locator(clients.CLIENT_V3_MENU).click();
      await page.locator(clients.CLIENT_V3_CHANGE_STATUS).click();

      await expect(page.locator(clients.CLIENT_V3_CURRENT_STATUS)).toContainText(savedStatus);
      await expect(page.locator(clients.CLIENT_V3_STATUS_OPTION('Active')).first()).toBeVisible();
      await expect(page.locator(clients.CLIENT_V3_STATUS_OPTION('Archive')).first()).toBeVisible();
      await expect(page.locator(clients.CLIENT_V3_UPDATE_STATUS)).toBeDisabled();
    });

    await test.step('7 - Select Archive, update status, and verify tooltip changes to Archive', async () => {
      await page.locator(clients.CLIENT_V3_STATUS_OPTION('Archive')).first().click();
      await expect(page.locator(clients.CLIENT_V3_UPDATE_STATUS)).toBeEnabled();
      await page.locator(clients.CLIENT_V3_UPDATE_STATUS).click();
      await expect(page.locator(clients.CLIENT_V3_CANCEL)).toBeHidden({ timeout: 20000 });
      await page.locator(clients.CLIENT_V3_STATUS_ICON(LAST_NAME)).hover();
      savedStatus =
        (await page.locator(clients.CLIENT_V3_HOVER_STATUS(LAST_NAME)).textContent())?.trim() ?? '';
      expect(savedStatus).toEqual('Archived');
    });
  });
});
