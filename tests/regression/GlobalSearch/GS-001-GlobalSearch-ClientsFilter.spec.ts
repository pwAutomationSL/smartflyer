import { test, expect } from '../../../fixtures/PlaywrightFixtures';
const CLIENT_ID = 'SQ4715';
const CLIENT_RECORD_ID = '106179';
const CLIENT_NAME = 'Candice & Ben (Conway) Winikoff';
const EMAIL = 'fake_candiceconway84@gmail.com';
test.describe('GS-001 - Search - Clients filter', () => {
  test('Login at Society (env) as an Admin Search by client identity', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    searchPage,
  }) => {
    const clientResult = () =>
      page.locator(`//a[contains(@href,'/client-detail/${CLIENT_RECORD_ID}')]`);

    await test.step('1 - Login at Society as an Admin', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
    });
    await test.step('2 - Go to Search - Clients filter', async () => {
      await sidebar.goToModuleAPP('Search');
      await searchPage.clickClientsFilter();
      await searchPage.textToSearch(CLIENT_ID);
      await expect(page.locator(searchPage.SPINNER_LOADER)).toBeHidden();
      await expect(clientResult()).toBeVisible();
    });
    await test.step('3 - Assert result is 1, title and details are correct', async () => {
      await expect(clientResult()).toHaveCount(1);
      await expect(clientResult()).toContainText(CLIENT_NAME);
      await expect(clientResult()).toContainText(EMAIL);
    });
    await test.step('4 - Search Again by Email', async () => {
      await searchPage.textToSearch(EMAIL);
      await expect(page.locator(searchPage.SPINNER_LOADER)).toBeHidden();
      await expect(clientResult()).toBeVisible();
    });
    await test.step('5 - Assert result is 1, title and details are correct', async () => {
      await expect(clientResult()).toHaveCount(1);
      await expect(clientResult()).toContainText(CLIENT_NAME);
      await expect(clientResult()).toContainText(EMAIL);
    });
  });
});
