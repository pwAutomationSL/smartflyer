import { test, expect } from '../../../fixtures/PlaywrightFixtures';

const CLIENT_NAME = 'Candice & Ben (Conway) Winikoff';
test.describe('CLI-003 - Client - Validate new share form', () => {
  test('Login at Society (env) as an Admin and verify Share Form is updated ', async ({
    loginPage,
    page,
    sidebar,
    clients,
    toast,
  }) => {
    await test.step('1- Go to the Client tab', async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
      await sidebar.goToModule('Clients');
    });
    await test.step('2- Search the client and go to the client page', async () => {
      await clients.searchClient(CLIENT_NAME);
    });
    await test.step('3- Click Share Button', async () => {
      await clients.clickShare();
      await expect(page.locator(clients.PROFILE_FORM_CARD)).toBeVisible();
      await expect(page.locator(clients.CREDIT_CARD_FORM_RADIO)).toBeVisible();
      await expect(page.locator(clients.CREDIT_CARD_FORM)).toBeVisible();
      await expect(page.locator(clients.CREDIT_CARD_FORM_RADIO)).toBeVisible();
      await expect(page.locator(clients.SHARE_EMAIL)).toBeVisible();
      await expect(page.locator(clients.SHARE_EMAIL_CC)).toBeVisible();
      await expect(page.locator(clients.SHARE_EMAIL_BCC)).toBeVisible();
      await expect(page.locator(clients.SHARE_EMAIL_MESSAGE)).toBeVisible();
      await expect(page.locator(clients.SHARE_EMAIL_MESSAGE_LIMIT)).toContainText('0/280');
      await expect(page.locator(clients.SHARE_CANCEL)).toBeVisible();
      await expect(page.locator(clients.SHARE_SEND_FORM)).toBeVisible();
      await expect(page.locator(clients.SHARE_SEND_FORM)).toBeDisabled();
    });
  });
});
