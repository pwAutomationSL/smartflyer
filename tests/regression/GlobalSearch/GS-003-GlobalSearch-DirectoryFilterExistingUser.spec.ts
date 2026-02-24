import { test, expect } from '../../../fixtures/PlaywrightFixtures';
const agentUser = `Shari A Erasmus`;
const superAdminUser = `Brianna Ardila`;
const partnerUser = `Sophia Aitken`;
const brandUser = `Sydney Adler`;

test.describe('GS-003 - Search - Directory Filter ', () => {
  test('Existing User - Agents', async ({ loginPage, page, sidebar, searchPage }) => {
    await test.step('1 - Log in to Society with an Admin account.', async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
    });
    await test.step('4 - Go to Search - Directory - Agents filter', async () => {
      await sidebar.goToModule('Search');
      await page.waitForLoadState('networkidle');
      await searchPage.clickDirectoriesFilter('Agents');
      await searchPage.textToSearch(agentUser);
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_DIRECTORY_FIRSTONLY)).toBeVisible({
        timeout: 10000,
      });
    });
    await test.step('5 - Assert result is 1, title and details are correct', async () => {
      const count = await page
        .locator(searchPage.SEARCH_RESULT_MATCHES_DIRECTORY_FIRSTONLY)
        .count();
      expect(count).toBe(1);
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_DIRECTORY_FIRSTONLY)).toHaveText(
        agentUser,
      );
    });
  });
  test('Existing User - SuperAdmin', async ({ loginPage, page, sidebar, searchPage }) => {
    await test.step('1 - Log in to Society with an Admin account.', async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
    });
    await test.step('4 - Go to Search - Directory - Super Admin filter', async () => {
      await sidebar.goToModule('Search');
      await page.waitForLoadState('networkidle');
      await searchPage.clickDirectoriesFilter('Super Admin');
      await searchPage.textToSearch(superAdminUser);
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_DIRECTORY_FIRSTONLY)).toBeVisible({
        timeout: 10000,
      });
    });
    await test.step('5 - Assert result is 1, title and details are correct', async () => {
      const count = await page
        .locator(searchPage.SEARCH_RESULT_MATCHES_DIRECTORY_FIRSTONLY)
        .count();
      expect(count).toBe(1);
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_DIRECTORY_FIRSTONLY)).toHaveText(
        superAdminUser,
      );
    });
  });
  test('Existing User - Partners', async ({ loginPage, page, sidebar, searchPage }) => {
    await test.step('1 - Log in to Society with an Admin account.', async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
    });
    await test.step('4 - Go to Search - Directory - Super Admin filter', async () => {
      await sidebar.goToModule('Search');
      await page.waitForLoadState('networkidle');
      await searchPage.clickDirectoriesFilter('Partners');
      await searchPage.textToSearch(partnerUser);
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_DIRECTORY_FIRSTONLY)).toBeVisible({
        timeout: 10000,
      });
    });
    await test.step('5 - Assert result is 1, title and details are correct', async () => {
      const count = await page
        .locator(searchPage.SEARCH_RESULT_MATCHES_DIRECTORY_FIRSTONLY)
        .count();
      expect(count).toBe(1);
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_DIRECTORY_FIRSTONLY)).toHaveText(
        partnerUser,
      );
    });
  });
  test('Existing User - Brand', async ({ loginPage, page, sidebar, searchPage }) => {
    await test.step('1 - Log in to Society with an Admin account.', async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
    });
    await test.step('4 - Go to Search - Directory - Super Admin filter', async () => {
      await sidebar.goToModule('Search');
      await page.waitForLoadState('networkidle');
      await searchPage.clickDirectoriesFilter('Brand');
      await searchPage.textToSearch(brandUser);
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_DIRECTORY_FIRSTONLY)).toBeVisible({
        timeout: 10000,
      });
    });
    await test.step('5 - Assert result is 1, title and details are correct', async () => {
      const count = await page
        .locator(searchPage.SEARCH_RESULT_MATCHES_DIRECTORY_FIRSTONLY)
        .count();
      expect(count).toBe(1);
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_DIRECTORY_FIRSTONLY)).toHaveText(
        brandUser,
      );
    });
  });
});
