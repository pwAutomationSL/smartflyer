import { test, expect } from '../../../fixtures/PlaywrightFixtures';
import { USERS } from '../../../fixtures/users';

test.describe('CLI-005 - Client - Verify tabs', () => {
  test('Login as an Admin and verify client tabs are visible', async ({
    loginPage,
    page,
    sidebar,
    clients,
  }) => {
    await test.step('1 - Login at Society as an Admin', async () => {
      await loginPage.login(USERS.ADMIN_MAIN);
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
    });

    await test.step('2 - Go to Clients from the main navigation menu', async () => {
      await sidebar.goToModule('Clients');
      await expect(page.locator(clients.HEADER)).toContainText('Clients');
    });

    await test.step('3 - Verify the four client tabs are visible', async () => {
      await expect(page.locator(clients.ALL_CLIENT_TABS)).toHaveCount(4);
      await expect(page.locator(clients.CLIENT_TAB('Active'))).toBeVisible();
      await expect(page.locator(clients.CLIENT_TAB('Inactive'))).toBeVisible();
      await expect(page.locator(clients.CLIENT_TAB('Archive'))).toBeVisible();
      await expect(page.locator(clients.CLIENT_TAB('Deleted'))).toBeVisible();
    });
  });
});
