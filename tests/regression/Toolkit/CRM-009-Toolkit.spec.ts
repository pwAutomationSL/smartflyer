import { test, expect } from '../../../fixtures/PlaywrightFixtures';
import { uniqueId } from '../../../page-objects';
const shortDescription = `Lorem ipsum dolor sit amet consectetur adipiscing elit.`;
const description = `Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.`;
test.use({
  launchOptions: { slowMo: 350 },
});
test.describe('CRM-009 - Toolkit', () => {
  const TOOLKIT_NAME = 'New Toolkit' + uniqueId();
  const UNEXISTING_TOOLKIT_NAME = 'New Toolkit foo' + uniqueId();
  test('As an admin, i want to create a new toolkit', async ({
    loginPage,
    page,
    sidebar,
    toolkit,
  }) => {
    await test.step('Go to the Toolkit tab', async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
      await sidebar.openContentCRM('Toolkit');
    });
    await test.step('Add new Toolkit', async () => {
      await page.waitForLoadState('load');
      await toolkit.addToolkit();
      await page.waitForLoadState('networkidle');
      await toolkit.enterTitle(TOOLKIT_NAME);
      await toolkit.selectCategory();
      await toolkit.uploadFile();
      await toolkit.enterURL();
      await toolkit.enterShortDescription(shortDescription);
      await toolkit.enterDescription(description);
      await toolkit.clickSave();
      await expect(page.locator(toolkit.TOOLKIT_TABLE)).toBeVisible();
    });
  });
  test('As an admin, i want to search the created toolkit and also search a non existant toolkit', async ({
    loginPage,
    page,
    sidebar,
    toolkit,
  }) => {
    await test.step('Go to the Toolkit tab', async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
      await sidebar.openContentCRM('Toolkit');
    });
    await test.step('Search Toolkit', async () => {
      await page.waitForLoadState('load');
      await page.waitForLoadState('networkidle');
      await toolkit.searchToolkit(TOOLKIT_NAME);
      await expect(page.locator(toolkit.COLUMNS_BY_INDEX(2))).toContainText(TOOLKIT_NAME);
      await expect(page.locator(toolkit.COLUMNS_BY_INDEX(3))).toContainText('internal');
      await expect(page.locator(toolkit.COLUMNS_BY_INDEX(4)).locator(`a`)).toHaveAttribute(
        'target',
        '_blank',
      );
      await expect(page.locator(toolkit.TOOLKIT_TABLE)).toBeVisible();
      await toolkit.searchToolkit(UNEXISTING_TOOLKIT_NAME);
      await expect(page.locator(toolkit.COLUMNS_BY_INDEX(1))).toContainText(
        'No matching records found',
      );
    });
  });
  test('As an admin, i want to edit the created toolkit', async ({
    loginPage,
    page,
    sidebar,
    toolkit,
  }) => {
    await test.step('Go to the Toolkit tab', async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
      await sidebar.openContentCRM('Toolkit');
    });
    await test.step('Add new Toolkit', async () => {
      await page.waitForLoadState('load');
      await page.waitForLoadState('networkidle');
      await toolkit.searchToolkit(TOOLKIT_NAME);
      await page.waitForLoadState('load');
      await page.waitForLoadState('networkidle');
      await toolkit.editSearchedToolkit();
      await expect(page.locator(toolkit.SAVE)).toBeVisible();
      await toolkit.changeURLType();
      await toolkit.clickSave();
      await toolkit.searchToolkit(TOOLKIT_NAME);
      await expect(page.locator(toolkit.TOOLKIT_TABLE)).toBeVisible();
      await expect(page.locator(toolkit.COLUMNS_BY_INDEX(2))).toContainText(TOOLKIT_NAME);
      await expect(page.locator(toolkit.COLUMNS_BY_INDEX(3))).toContainText('external');
      await expect(page.locator(toolkit.COLUMNS_BY_INDEX(4)).locator(`a`)).toHaveAttribute(
        'target',
        '_blank',
      );
    });
  });
  test('As an admin, i want to delete the created toolkit', async ({
    loginPage,
    page,
    sidebar,
    toolkit,
    toast,
  }) => {
    await test.step('Go to the Toolkit tab', async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
      await sidebar.openContentCRM('Toolkit');
    });
    await test.step('Delete new Toolkit', async () => {
      await page.waitForLoadState('load');
      await page.waitForLoadState('networkidle');
      await toolkit.searchToolkit(TOOLKIT_NAME);
      await page.waitForLoadState('load');
      await page.waitForLoadState('networkidle');
      await toolkit.deleteSearchedToolkit();
      await expect(page.locator(toolkit.CONFIRM_DELETE)).toBeVisible();
      await toolkit.confirmDeleteToolkit();
      await expect(page.locator(toast.TOAST_MESSAGE)).toContainText(`Data deleted`);
      await expect(page.locator(toolkit.COLUMNS_BY_INDEX(1))).toContainText(
        'No matching records found',
      );
    });
  });
});
