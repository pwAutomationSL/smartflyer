import { test, expect } from '../../../fixtures/PlaywrightFixtures';
import { uniqueId, isoToUiDate } from '../../../page-objects';

const TASK_NAME = 'New Task' + uniqueId();
const TASK_DATE = '2026-11-11';
const TASK_DATE_UPDATE = '2026-12-12';
const STATUS = 'Open';
test.use({
  launchOptions: { slowMo: 200 },
});
test.describe('TSK-001 - Task', () => {
  test('As an admin,i want to be able to add a new task, search it, edit and finally delete it', async ({
    loginPage,
    page,
    sidebar,
    tasks,
  }) => {
    await test.step('Login and Go to the Task tab', async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
      await sidebar.goToModule('Tasks');
    });
    await test.step('Click on Add Task', async () => {
      await page.waitForLoadState('domcontentloaded');
      await tasks.addTask();
      await page.waitForLoadState('load');
      await expect(page.locator(tasks.TASK_FORM)).toBeVisible();
      await tasks.fillTaskName(TASK_NAME);
      await tasks.fillTaskDeadline(TASK_DATE);
      await tasks.fillTaskReminder();
      await tasks.fillTaskDetailsAndImage();
      await tasks.fillTaskAssignedAndStatus(STATUS);
      await tasks.clickSave();
      await expect(page.locator(tasks.SUCCESS_POPUP)).toContainText('Success');
      await tasks.clickOK();
    });
    await test.step('Search Added Task', async () => {
      await tasks.searchTask(TASK_NAME);
      await expect(page.locator(tasks.COLUMNS_BY_INDEX(1))).toContainText(TASK_NAME);
      await expect(page.locator(tasks.COLUMNS_BY_INDEX(2))).toContainText(isoToUiDate(TASK_DATE));
      await expect(page.locator(tasks.COLUMNS_BY_INDEX(3))).toContainText(' To Do ');
    });
    await test.step('Edit Added Task', async () => {
      await tasks.editSearchedTask();
      await tasks.fillTaskDeadline(TASK_DATE_UPDATE);
      await tasks.clickSave();
      await expect(page.locator(tasks.SUCCESS_POPUP)).toContainText('Success');
      await tasks.clickOK();
      await tasks.searchTask(TASK_NAME);
      await expect(page.locator(tasks.COLUMNS_BY_INDEX(2))).toContainText(
        isoToUiDate(TASK_DATE_UPDATE),
      );
    });
    await test.step('Delete Added Task', async () => {
      await tasks.deleteSearchedTask();
      await tasks.confirmDeleteTask();
      await expect(page.locator(tasks.SUCCESS_POPUP)).toContainText('Success');
      await tasks.clickOK();
      await tasks.searchTask(TASK_NAME);
      await expect(page.locator(tasks.COLUMNS_BY_INDEX(1))).toContainText(
        'No matching records found',
      );
    });
  });
});
