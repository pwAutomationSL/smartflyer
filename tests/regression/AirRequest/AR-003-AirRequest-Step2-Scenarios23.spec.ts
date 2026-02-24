import { test, expect } from '../../../fixtures/PlaywrightFixtures';

const PHONE = '123123123';
const CLIENT_NAME = 'Candice & Ben (Conway) Winikoff';
test.describe('AR-003 - Air Request - Step #23 ', () => {
  test.setTimeout(200_000);
  test('Air Request - Step 2 - 23# Scenario - Add Frequent Flyer', async ({
    loginPage,
    page,
    sidebar,
    clients,
    airRequest,
  }) => {
    await test.step('1 - Go to the Client tab', async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
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

    await test.step('23# Scenario - Delete Frequent Flyer Program', async () => {
      await airRequest.addFrequentFlyerProgram();
      await expect(page.locator(airRequest.P_BY_TEXT('Airline program')).last()).toBeVisible();
      await expect(page.locator(airRequest.LABEL_BY_TEXT('Program number')).last()).toBeVisible();
      await airRequest.selectFrequentFlyerProgram();
      await expect(page.locator(airRequest.AIRLINE_PROGRAMS).first()).toBeVisible();
      await expect(page.locator(airRequest.PROGRAM_NUMBER(1))).toBeEnabled();
      // await expect(page.locator(airRequest.DELETE_FF_PROGRAM)).toBeDisabled();
      await airRequest.selectoptionGGProgram('American Airlines: AAdvantage');
      await airRequest.fillProgramNumber(PHONE);
      await expect(page.locator(airRequest.PROGRAM_NUMBER(1)).last()).toHaveValue(PHONE);
      await expect(page.locator(airRequest.DELETE_FF_PROGRAM).last()).toBeEnabled();
      await airRequest.deleteLastFrequentFlyerProgram();
    });
  });
});
