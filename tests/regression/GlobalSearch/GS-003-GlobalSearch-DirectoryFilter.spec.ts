import { test, expect } from '../../../fixtures/PlaywrightFixtures';
import { uniqueId } from '../../../page-objects';
const lastName = uniqueId();
const email = `test${lastName}@test.com`;

test.skip('GS-003 - Search - Directory Filter - New User', () => {
  test('Directory Filter- New User', async ({
    loginPage,
    page,
    sidebar,
    directories,
    searchPage,
    toast,
  }) => {
    await test.step('1 - Log in to Society with an Admin account.', async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
    });
    await test.step('2 - From the sidebar, navigate to Directories ', async () => {
      await sidebar.goToModule('Directories');
      await expect(page.locator(directories.HEADER)).toContainText('Directories');
    });
    await test.step('3 - Click add new and create a super admin.', async () => {
      await directories.addNew();
      await directories.FillUserInformation(String(lastName));
      await directories.saveUser();
      await directories.searchUser(email);
      await directories.approveUser();
    });
    await test.step('4 - Go to Search - Partner filter', async () => {
      await sidebar.goToModule('Search');
      await page.waitForLoadState('networkidle');
      await searchPage.clickDirectoriesFilter('Super Admin');
      await searchPage.textToSearch(email);
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_A)).toBeVisible({
        timeout: 10000,
      });
    });
    await test.step('5 - Assert result is 1, title and details are correct', async () => {
      const count = await page.locator(searchPage.SEARCH_RESULT_MATCHES_A).count();
      expect(count).toBe(1);
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_A)).toHaveText(email);
    });
  });
});
