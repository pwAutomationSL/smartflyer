import { test, expect } from '../../../fixtures/PlaywrightFixtures';
import { uniqueId } from '../../../page-objects';
const unique = uniqueId();
const LAST_NAME = `LastName` + unique;
const EMAIL = `${LAST_NAME}@asd.com`;
test.describe('GS-001 - Search - Clients filter', () => {
  test('Login at Society (env) as an Admin Search by Last Name', async ({
    loginPage,
    page,
    sidebar,
    searchPage,
    clients,
  }) => {
    await test.step('1 - Login at Society as an Admin', async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
    });
    await test.step('2 - Go to Clients, Quick Add', async () => {
      await sidebar.goToModule('Clients');
      await expect(page.locator(clients.SPINNER_LOADER)).toBeHidden();
      await expect(page.locator(clients.HEADER)).toBeEnabled();
      await expect(page.locator(clients.QUICK_ADD)).toBeEnabled();
      await clients.quickAdd();
      await clients.mainInformationQuickAdd(LAST_NAME, EMAIL);
      await clients.saveQuickAdd();
    });
    await test.step('3 - Assert new client is visible', async () => {
      await expect(page.locator(clients.HEADER).first()).toContainText(LAST_NAME, {
        timeout: 15000,
      });
    });
    await test.step('4 - Go to Search - Clients filter', async () => {
      await sidebar.goToModuleAPP('Search');
      await searchPage.clickClientsFilter();
      await searchPage.textToSearch(LAST_NAME);
      await expect(page.locator(searchPage.SPINNER_LOADER)).toBeHidden();
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_A)).toBeVisible();
    });
    await test.step('5 - Assert result is 1, title and details are correct', async () => {
      const count = await page.locator(searchPage.SEARCH_RESULT_MATCHES_A).count();
      expect(count).toBe(1);
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_A)).toContainText(LAST_NAME);
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_DETAIL).last()).toContainText(
        EMAIL,
      );
    });
    await test.step('6 - Search Again by Email', async () => {
      await searchPage.textToSearch(EMAIL);
      await expect(page.locator(searchPage.SPINNER_LOADER)).toBeHidden();
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_A)).toBeVisible();
    });
    await test.step('7 - Assert result is 1, title and details are correct', async () => {
      const count = await page.locator(searchPage.SEARCH_RESULT_MATCHES_A).count();
      expect(count).toBe(1);
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_DETAIL).first()).toContainText(
        LAST_NAME,
      );
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_DETAIL).last()).toContainText(
        EMAIL,
      );
    });
  });
});
