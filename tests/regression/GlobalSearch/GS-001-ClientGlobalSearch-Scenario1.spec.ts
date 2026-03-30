import { test, expect } from '../../../fixtures/PlaywrightFixtures';

const TEXT_TO_SEARCH = 'Fairmont';
test.describe('GS-001 - Client Global Search - Scenario 1', () => {
  test('Login at Society (env) as an Admin', async ({ loginPage, page, sidebar, searchPage }) => {
    await test.step('1 - Login at Society as an Admin', async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
    });
    await test.step('2 - Go to “Search” under the main navigation menu of Society', async () => {
      await sidebar.goToModule('Search');
      await expect(page.locator(searchPage.SEARCH_INPUT)).toBeVisible();
    });
    await test.step('3 - Click the “Client” filter', async () => {
      await searchPage.clickClientFilter();
    });
    await test.step.skip('4 - Type the client First name at the search text box', async () => {
      await searchPage.textToSearch(TEXT_TO_SEARCH);
      await expect(page.locator(searchPage.SEARCH_RESULT_LINKS).first()).toBeVisible();
      const resultsCount = await searchPage.getResultsCount();
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES)).toHaveCount(resultsCount);
    });
  });
});
