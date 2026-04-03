import { test, expect } from '../../../fixtures/PlaywrightFixtures';

const CLIENT_NAME = 'FirstName';

const normalizePhoneNumber = (str: string | null | undefined): string => {
  if (!str) return '';
  return str.replace(/\D/g, '');
};

test.use({
  launchOptions: { slowMo: 500 },
});

test.describe('CLI-001 - Client - Add Client - Edits by section and Finally check Logs', () => {
  test('Edit Created Client- verify individual popup for Basic Information Edit', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    clients,
    toast,
  }) => {
    const section = 'Basic Information';
    await test.step('1 - Login at Society as an Admin and search for the created client', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 25000 });
      await sidebar.goToModule('Clients');
      await clients.searchClientAndClick(CLIENT_NAME);
    });
  });
});
