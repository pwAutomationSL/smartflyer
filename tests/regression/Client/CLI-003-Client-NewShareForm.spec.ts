import { test, expect } from '../../../fixtures/PlaywrightFixtures';

const CLIENT_NAME = 'Candice & Ben (Conway) Winikoff';
const message = `Lorem ipsum dolor sit amet consectetur adipiscing elit.`;
test.describe('CLI-003 - Client - Validate new share form', () => {
  test('Login as an Admin and verify Share Form Pop Up is updated ', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    clients,
  }) => {
    await test.step('1- Go to the Client tab', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
      await sidebar.goToModule('Clients');
    });
    await test.step('2- Search the client and go to the client page', async () => {
      await clients.searchClient(CLIENT_NAME);
    });
    await test.step('3- Click Share Button', async () => {
      await clients.clickShare();
      await expect(page.locator(clients.PROFILE_FORM_CARD)).toBeVisible();
      await expect(page.locator(clients.PROFILE_FORM_CARD_RADIO)).toBeVisible();
      await expect(page.locator(clients.CREDIT_CARD_FORM)).toBeVisible();
      await expect(page.locator(clients.CREDIT_CARD_FORM_RADIO)).toBeVisible();
      await expect(page.locator(clients.SHARE_EMAIL)).toBeVisible();
      await expect(page.locator(clients.SHARE_EMAIL_CC)).toBeVisible();
      await expect(page.locator(clients.SHARE_EMAIL_BCC)).toBeVisible();
      await expect(page.locator(clients.SHARE_EMAIL_MESSAGE)).toBeVisible();
      await expect(page.locator(clients.SHARE_EMAIL_MESSAGE_LIMIT)).toContainText('0/1000');
      await expect(page.locator(clients.SHARE_CANCEL)).toBeVisible();
      await expect(page.locator(clients.SHARE_SEND_FORM)).toBeVisible();
      await expect(page.locator(clients.SHARE_SEND_FORM)).toBeDisabled();
    });
  });
  test('Credit Card Form - Login as an Admin, click Share Form, fill data and send ', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    clients,
  }) => {
    await test.step('1- Go to the Client tab', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
      await sidebar.goToModule('Clients');
    });
    await test.step('2- Search the client and go to the client page', async () => {
      await clients.searchClient(CLIENT_NAME);
      await page.waitForLoadState('networkidle');
    });
    await test.step('3- Click Share Button', async () => {
      await clients.clickShare();
      await expect(page.locator(clients.PROFILE_FORM_CARD)).toBeVisible();
      await expect(page.locator(clients.CREDIT_CARD_FORM_RADIO)).toBeVisible();
    });
    await test.step('4- Check Credit Card Form and fill data', async () => {
      await clients.checkCCForm();
      await clients.fillShareEmail('fakeEmail@test.com');
      await clients.fillShareEmailCC('fakeEmailCC@test.com');
      await clients.fillShareEmailBCC('fakeEmailBCC@test.com');
      await clients.fillShareEMessage(message);
    });
    await test.step('5-  Send Form', async () => {
      await clients.sendForm();
      await expect(page.locator(clients.POPUP_HEADER_H2)).toContainText('Information Shared');
    });
  });
  test('Profile Form - Login as an Admin, click Share Form, fill data and send', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    clients,
  }) => {
    await test.step('1- Go to the Client tab', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
      await sidebar.goToModule('Clients');
    });
    await test.step('2- Search the client and go to the client page', async () => {
      await clients.searchClient(CLIENT_NAME);
      await page.waitForLoadState('networkidle');
    });
    await test.step('3- Click Share Button', async () => {
      await clients.clickShare();
      await expect(page.locator(clients.PROFILE_FORM_CARD)).toBeVisible();
      await expect(page.locator(clients.CREDIT_CARD_FORM_RADIO)).toBeVisible();
    });
    await test.step('4- Check Credit Card Form and fill data', async () => {
      await clients.checkProfileForm();
      await clients.fillShareEmail('fakeEmail@test.com');
      await clients.fillShareEmailCC('fakeEmailCC@test.com');
      await clients.fillShareEmailBCC('fakeEmailBCC@test.com');
      await clients.fillShareEMessage(message);
    });
    await test.step('5-  Send Form', async () => {
      await clients.sendForm();
      await expect(page.locator(clients.POPUP_HEADER_H2)).toContainText('Information Shared');
    });
  });
  test('Both Forms - Login as Admin click Share Form, fill data and send', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    clients,
  }) => {
    await test.step('1- Go to the Client tab', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
      await sidebar.goToModule('Clients');
    });
    await test.step('2- Search the client and go to the client page', async () => {
      await clients.searchClient(CLIENT_NAME);
      await page.waitForLoadState('networkidle');
    });
    await test.step('3- Click Share Button', async () => {
      await clients.clickShare();
      await expect(page.locator(clients.PROFILE_FORM_CARD)).toBeVisible();
      await expect(page.locator(clients.CREDIT_CARD_FORM_RADIO)).toBeVisible();
    });
    await test.step('4- Check Credit Card Form and fill data', async () => {
      await clients.checkCCForm();
      await clients.checkProfileForm();
      await clients.fillShareEmail('fakeEmail@test.com');
      await clients.fillShareEmailCC('fakeEmailCC@test.com');
      await clients.fillShareEmailBCC('fakeEmailBCC@test.com');
      await clients.fillShareEMessage(message);
    });
    await test.step('5-  Send Form', async () => {
      await clients.sendForm();
      await expect(page.locator(clients.POPUP_HEADER_H2)).toContainText('Information Shared');
    });
  });
});
