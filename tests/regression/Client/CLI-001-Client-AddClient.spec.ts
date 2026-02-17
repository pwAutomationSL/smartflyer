import { test, expect } from '../../../fixtures/PlaywrightFixtures';

test.describe('CLI-001 - Client - Add Client', () => {
  test('Login at Society (env) as an Admin', async ({ loginPage, page, sidebar, clients }) => {
    await test.step('1 - Login at Society as an Admin', async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
    });
    await test.step('2 - Go to “Clients” under the main navigation menu of Society', async () => {
      await sidebar.goToModule('Clients');
      await clients.clickAddClient();
      await clients.startFromScratch();
      await expect(page.locator(clients.PRIMARY_PASSENGER)).toBeVisible();
      await expect(page.locator(clients.RELATED_PASSENGERS)).toBeVisible();
    });
  });
});
