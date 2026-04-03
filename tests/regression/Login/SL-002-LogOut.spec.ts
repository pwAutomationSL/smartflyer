import { test, expect } from '../../../fixtures/PlaywrightFixtures';
test.describe('LOG-002 - Log Out', () => {
  test('Scenario 2 - Succesful logout', async ({ loginPage, page, username, password }) => {
    await test.step('Succesful logout', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
      await expect(page.locator(loginPage.HEADER)).toContainText('Welcome, Rodrigo!');
      await page.waitForLoadState('networkidle');
      await loginPage.logout();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeVisible();
      await page.waitForLoadState('networkidle');
      await expect(page.locator(loginPage.HEADER)).toContainText('Welcome!');
    });
  });
});
