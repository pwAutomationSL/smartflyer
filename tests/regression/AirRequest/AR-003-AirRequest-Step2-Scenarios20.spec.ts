import { test, expect } from '../../../fixtures/PlaywrightFixtures';

let allNamesBefore: string[];
let allNames: string[];
const CLIENT_NAME = 'Candice & Ben (Conway) Winikoff';
const USERNAME_NOT_SEARCHED = 'Nico Le Breton';
const LASTNAME_NOT_SEARCHED = 'Le Breton';
test.describe('AR-003 - Air Request - Step #20 ', () => {
  test.setTimeout(200_000);
  test('Air Request - Step 2 - 20# Scenario - Search for related traveler', async ({
    loginPage,
    page,
    sidebar,
    clients,
    airRequest,
  }) => {
    await test.step('1 - Go to the Client tab', async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
      await sidebar.goToModule('Clients');
    });

    await test.step('2 - Search the client and go to the client page', async () => {
      await clients.searchClient(CLIENT_NAME);
      await page.waitForLoadState('networkidle');
    });

    await test.step('3 - 4 - Go to the New credit card tab and Click on Air request button', async () => {
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
    });

    await test.step('7 - Click on Continue', async () => {
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER)).toContainText('Passenger details');
      await expect(page.locator(airRequest.AGENT_SUCCESS)).toHaveCSS(
        'background-color',
        'rgb(46, 139, 87)',
      );
    });

    await test.step('20# Add new traveler, save to client profile', async () => {
      await airRequest.addAdditionalPassenger();
      await expect(page.locator(airRequest.POP_UP_DIALOG)).toBeVisible();
      await expect(page.locator(airRequest.POP_UP_CANCEL)).toBeVisible();
      await expect(page.locator(airRequest.POP_UP_ADD_PASSENGERS)).toBeVisible();
      await expect(page.locator(airRequest.POP_UP_HEADER)).toContainText('Who is traveling?');
    });
    await test.step('20# Add client First name, Last name, Gender, Date of birth ', async () => {
      const firstCount = await page.locator(airRequest.NAMES_FOR_AVAILABLE_CHECKBOXES).count();
      allNamesBefore = await page
        .locator(airRequest.NAMES_FOR_AVAILABLE_CHECKBOXES)
        .allTextContents();
      await airRequest.searchTraveler('Mahiax');
      const secondCount = await page.locator(airRequest.NAMES_FOR_AVAILABLE_CHECKBOXES).count();
      expect(firstCount).toBeGreaterThan(secondCount);
      const allNames = await page
        .locator(airRequest.NAMES_FOR_AVAILABLE_CHECKBOXES)
        .allTextContents();
      for (const name of allNames) {
        expect(name).not.toContain(USERNAME_NOT_SEARCHED);
        expect(name).not.toContain(LASTNAME_NOT_SEARCHED);
      }
    });
    await test.step('20# Verify if clearing the search field shows the full traveler list again ', async () => {
      await airRequest.searchTraveler('');
      allNames = await page.locator(airRequest.NAMES_FOR_AVAILABLE_CHECKBOXES).allTextContents();
      expect(allNamesBefore).toEqual(allNames);
    });
  });
});
