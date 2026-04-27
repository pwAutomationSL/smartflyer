import { test, expect } from '../../../fixtures/PlaywrightFixtures';
import { USERS } from '../../../fixtures/users';
const CLIENT_NAME = 'Candice & Ben (Conway) Winikoff';
test.use({
  launchOptions: { slowMo: 500 },
});
let addedRelatedPassenger: string[];
let addedRelatedPassengerStep2AR: string[];
test.describe('SFC-749 Inconsistent related passengers name showing in Air Request', () => {
  test('Super Admin', async ({
    loginPage,
    page,
    sidebar,
    clients,
    airRequest,
    username,
    password,
  }) => {
    await test.step('1 - Go to the Client tab', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
      await sidebar.goToModule('Clients');
    });
    await test.step('2 - Search the client and go to the client page', async () => {
      await clients.searchClient(CLIENT_NAME);
      await page.waitForLoadState('networkidle');
    });
    await test.step('3 - 4 - Go to the Related Passengers tab', async () => {
      await clients.goToRelatedTravelersTab();
      await expect(page.locator(clients.RELATED_PASSENGER_NAMES).first()).toBeVisible();
      addedRelatedPassenger = await page.locator(clients.RELATED_PASSENGER_NAMES).allTextContents();
      await airRequest.clickAirRequest();
      await expect(page.locator(airRequest.POP_UP_HEADER)).toBeVisible();
    });
    await test.step('5 - Click on Start from scratch', async () => {
      await airRequest.startFromScrath();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeDisabled();
      await expect(page.locator(airRequest.AGENT_SELECT)).toContainText('Select an agent');
    });
    await test.step('6 - Select the Agent and Click on Continue button', async () => {
      await airRequest.selectAgent();
      await airRequest.selectFirstAgent();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeEnabled();
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER_H2)).toContainText('Passenger details');
      await expect(page.locator(airRequest.AGENT_SUCCESS)).toHaveCSS(
        'background-color',
        'rgb(46, 139, 87)',
      );
    });
    await test.step('7 - add related passenger and compare list', async () => {
      await airRequest.addAdditionalPassenger();
      addedRelatedPassengerStep2AR = await page
        .locator(clients.RELATED_PASSENGER_NAMES_STEP2)
        .allTextContents();
      expect(addedRelatedPassengerStep2AR).toEqual(addedRelatedPassenger);
    });
  });
  test('Agent', async ({ loginPage, page, sidebar, clients, airRequest }) => {
    await test.step('1 - Go to the Client tab', async () => {
      await loginPage.login(USERS.AGENT_USERNAME);
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
      await sidebar.goToModule('Clients');
    });
    await test.step('2 - Search the client and go to the client page', async () => {
      await clients.searchClientByName('Dr Ragan');
      await clients.clickFirstResult();
      await page.waitForLoadState('networkidle');
    });
    await test.step('3 - 4 - Go to the Related Passengers tab', async () => {
      await clients.goToRelatedTravelersTab();
      await expect(page.locator(clients.RELATED_PASSENGER_NAMES).first()).toBeVisible();
      addedRelatedPassenger = await page.locator(clients.RELATED_PASSENGER_NAMES).allTextContents();
      await airRequest.clickAirRequest();
      await expect(page.locator(airRequest.POP_UP_HEADER)).toBeVisible();
    });
    await test.step('5 - Click on Start from scratch', async () => {
      await airRequest.startFromScrath();
    });
    await test.step('6 - Select the Agent and Click on Continue button', async () => {
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeEnabled();
      await page.waitForTimeout(1500);
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER_H2)).toContainText('Passenger details');
      await expect(page.locator(airRequest.AGENT_SUCCESS)).toHaveCSS(
        'background-color',
        'rgb(46, 139, 87)',
      );
    });
    await test.step('7 - add related passenger and compare list', async () => {
      await airRequest.addAdditionalPassenger();
      addedRelatedPassengerStep2AR = await page
        .locator(clients.RELATED_PASSENGER_NAMES_STEP2)
        .allTextContents();
      expect(addedRelatedPassengerStep2AR).toEqual(addedRelatedPassenger);
    });
  });
  test('Brand', async ({ loginPage, page, sidebar, clients, airRequest }) => {
    await test.step('1 - Go to the Client tab', async () => {
      await loginPage.login(USERS.BRAND_USERNAME);
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
      await sidebar.goToModule('Clients');
    });
    await test.step('2 - Search the client and go to the client page', async () => {
      await clients.searchClient(CLIENT_NAME);
      await page.waitForLoadState('networkidle');
    });
    await test.step('3 - 4 - Go to the Related Passengers tab', async () => {
      await clients.goToRelatedTravelersTab();
      await expect(page.locator(clients.RELATED_PASSENGER_NAMES).first()).toBeVisible();
      addedRelatedPassenger = await page.locator(clients.RELATED_PASSENGER_NAMES).allTextContents();
      await airRequest.clickAirRequest();
      await expect(page.locator(airRequest.POP_UP_HEADER)).toBeVisible();
    });
    await test.step('5 - Click on Start from scratch', async () => {
      await airRequest.startFromScrath();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeDisabled();
      await expect(page.locator(airRequest.AGENT_SELECT)).toContainText('Select an agent');
    });
    await test.step('6 - Select the Agent and Click on Continue button', async () => {
      await airRequest.selectAgent();
      await airRequest.selectFirstAgent();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeEnabled();
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER_H2)).toContainText('Passenger details');
      await expect(page.locator(airRequest.AGENT_SUCCESS)).toHaveCSS(
        'background-color',
        'rgb(46, 139, 87)',
      );
    });
    await test.step('7 - add related passenger and compare list', async () => {
      await airRequest.addAdditionalPassenger();
      addedRelatedPassengerStep2AR = await page
        .locator(clients.RELATED_PASSENGER_NAMES_STEP2)
        .allTextContents();
      expect(addedRelatedPassengerStep2AR).toEqual(addedRelatedPassenger);
    });
  });
  test('Air Team', async ({ loginPage, page, sidebar, clients, airRequest }) => {
    await test.step('1 - Go to the Client tab', async () => {
      await loginPage.login(USERS.AIR_USERNAME);
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
      await sidebar.goToModule('Clients');
    });
    await test.step('2 - Search the client and go to the client page', async () => {
      await clients.searchClient(CLIENT_NAME);
      await page.waitForLoadState('networkidle');
    });
    await test.step('3 - 4 - Go to the Related Passengers tab', async () => {
      await clients.goToRelatedTravelersTab();
      await expect(page.locator(clients.RELATED_PASSENGER_NAMES).first()).toBeVisible();
      addedRelatedPassenger = await page.locator(clients.RELATED_PASSENGER_NAMES).allTextContents();
      await airRequest.clickAirRequest();
      await expect(page.locator(airRequest.POP_UP_HEADER)).toBeVisible();
    });
    await test.step('5 - Click on Start from scratch', async () => {
      await airRequest.startFromScrath();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeDisabled();
      await expect(page.locator(airRequest.AGENT_SELECT)).toContainText('Select an agent');
    });
    await test.step('6 - Select the Agent and Click on Continue button', async () => {
      await airRequest.selectAgent();
      await airRequest.selectFirstAgent();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeEnabled();
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER_H2)).toContainText('Passenger details');
      await expect(page.locator(airRequest.AGENT_SUCCESS)).toHaveCSS(
        'background-color',
        'rgb(46, 139, 87)',
      );
    });
    await test.step('7 - add related passenger and compare list', async () => {
      await airRequest.addAdditionalPassenger();
      addedRelatedPassengerStep2AR = await page
        .locator(clients.RELATED_PASSENGER_NAMES_STEP2)
        .allTextContents();
      expect(addedRelatedPassengerStep2AR).toEqual(addedRelatedPassenger);
    });
  });
  test('Commission', async ({ loginPage, page, sidebar, clients, airRequest }) => {
    await test.step('1 - Go to the Client tab', async () => {
      await loginPage.login(USERS.COMISSION_USERNAME);
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
      await sidebar.goToModule('Clients');
    });
    await test.step('2 - Search the client and go to the client page', async () => {
      await clients.searchClient(CLIENT_NAME);
      await page.waitForLoadState('networkidle');
    });
    await test.step('3 - 4 - Go to the Related Passengers tab', async () => {
      await clients.goToRelatedTravelersTab();
      await expect(page.locator(clients.RELATED_PASSENGER_NAMES).first()).toBeVisible();
      addedRelatedPassenger = await page.locator(clients.RELATED_PASSENGER_NAMES).allTextContents();
      await airRequest.clickAirRequest();
      await expect(page.locator(airRequest.POP_UP_HEADER)).toBeVisible();
    });
    await test.step('5 - Click on Start from scratch', async () => {
      await airRequest.startFromScrath();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeDisabled();
      await expect(page.locator(airRequest.AGENT_SELECT)).toContainText('Select an agent');
    });
    await test.step('6 - Select the Agent and Click on Continue button', async () => {
      await airRequest.selectAgent();
      await airRequest.selectFirstAgent();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeEnabled();
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER_H2)).toContainText('Passenger details');
      await expect(page.locator(airRequest.AGENT_SUCCESS)).toHaveCSS(
        'background-color',
        'rgb(46, 139, 87)',
      );
    });
    await test.step('7 - add related passenger and compare list', async () => {
      await airRequest.addAdditionalPassenger();
      addedRelatedPassengerStep2AR = await page
        .locator(clients.RELATED_PASSENGER_NAMES_STEP2)
        .allTextContents();
      expect(addedRelatedPassengerStep2AR).toEqual(addedRelatedPassenger);
    });
  });
});
