import { test, expect } from '../../../fixtures/PlaywrightFixtures';
import { USERS } from '../../../fixtures/users';
import { uniqueId } from '../../../page-objects';

const unique = uniqueId();
const LAST_NAME = `ClientTasks${unique}`;
const EMAIL = `clienttasks${unique}@asd.com`;
const TASK_NAME = `Auto Task ${unique}`;
const TASK_DETAILS = `Auto task details ${unique}`;
const TASK_DEADLINE = '11/11/2026';
const TASK_DEADLINE_UPDATED = '12/12/2026';
const TASK_DEADLINE_DISPLAY = '11/11/26';
const TASK_DEADLINE_UPDATED_DISPLAY = '12/12/26';
const TASK_STATUS = 'Open';

test.use({
  launchOptions: { slowMo: 500 },
});

test.describe.serial('CLI-010 - Client - Client Tasks', () => {
  test('Admin can see Tasks empty state, open Add Task modal, and create a task successfully', async ({
    loginPage,
    page,
    sidebar,
    clients,
  }) => {
    await test.step('1 - Login as Admin, create a client, and open the client profile', async () => {
      await loginPage.login({
        username: USERS.ADMIN_MAIN.username,
        password: USERS.ADMIN_MAIN.password,
      });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 25000 });
      await sidebar.goToModule('Clients');
      await page.waitForLoadState('networkidle');
      await clients.quickAddNew();
      await clients.mainInformationQuickAdd(LAST_NAME, EMAIL);
      await clients.saveQuickAdd();
      await expect(page.locator(clients.HEADER).first()).toContainText(LAST_NAME, {
        timeout: 25000,
      });
    });

    await test.step('2 - Open Tasks tab in v3 and verify empty state with Add Task CTA', async () => {
      await page.waitForLoadState('networkidle');
      await clients.openClientProfileTab('Tasks');
      await expect(page.locator(clients.CLIENT_PROFILE_TAB('Tasks'))).toBeVisible();
      await expect(page.locator(clients.TASKS_HEADER)).toContainText('Tasks');
      await expect(page.locator(clients.TASKS_EMPTY_STATE_TITLE)).toBeVisible();
      await expect(page.locator(clients.TASKS_EMPTY_STATE_TITLE)).toContainText('No tasks yet');
      await expect(page.locator(clients.TASKS_EMPTY_STATE_DESCRIPTION)).toBeVisible();
      await expect(page.locator(clients.ADD_TASK_BUTTON)).toBeVisible();
    });

    await test.step('3 - Open Add Task modal and verify task fields are present', async () => {
      await clients.openAddTaskModal();
      await expect(page.locator(clients.TASK_MODAL_TITLE('New task'))).toBeVisible();
      await expect(page.locator(clients.TASK_NAME_INPUT)).toBeVisible();
      await expect(page.locator(clients.TASK_DEADLINE_INPUT)).toBeVisible();
      await expect(page.locator(clients.TASK_DETAILS_INPUT)).toBeVisible();
      await expect(page.locator(clients.TASK_ASSIGNED_TO)).toBeVisible();
      await expect(page.locator(clients.TASK_STATUS)).toBeVisible();
      await expect(page.locator(clients.TASK_SAVE)).toBeDisabled();
    });

    await test.step('4 - Create a valid task and verify it appears in the tasks list', async () => {
      await clients.createClientTask(TASK_NAME, TASK_DEADLINE, TASK_DETAILS, TASK_STATUS);

      await expect(page.locator(clients.TASKS_HEADER)).toContainText('Tasks');
      await expect(page.locator(clients.TASK_TABLE_HEADER('Name'))).toBeVisible();
      await expect(page.locator(clients.TASK_TABLE_HEADER('Deadline'))).toBeVisible();
      await expect(page.locator(clients.TASK_TABLE_HEADER('Status'))).toBeVisible();
      await expect(page.locator(clients.TASK_TABLE_HEADER('Assigned to'))).toBeVisible();
      await expect(page.locator(clients.TASK_ROW(TASK_NAME))).toBeVisible();
      await expect(page.locator(clients.TASK_ROW_DEADLINE(TASK_NAME))).toContainText(
        TASK_DEADLINE_DISPLAY,
      );
      await expect(page.locator(clients.TASK_ROW_STATUS(TASK_NAME))).toContainText(TASK_STATUS);
    });
  });

  test('Admin can see tasks list and edit an existing task successfully', async ({
    loginPage,
    page,
    sidebar,
    clients,
  }) => {
    await test.step('1 - Login as Admin and open the existing client tasks in v3', async () => {
      await loginPage.login({
        username: USERS.ADMIN_MAIN.username,
        password: USERS.ADMIN_MAIN.password,
      });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 25000 });
      await sidebar.goToModule('Clients');
      await clients.searchClientByName('FirstName ' + LAST_NAME);
      await clients.clickFirstResult();
      await expect(page.locator(clients.HEADER)).toContainText(LAST_NAME, { timeout: 25000 });
      await page.waitForLoadState('networkidle');
      await clients.openClientProfileTab('Tasks');
    });

    await test.step('2 - Verify the tasks list is displayed when tasks exist', async () => {
      await expect(page.locator(clients.TASKS_HEADER)).toContainText('Tasks');
      await expect(page.locator(clients.TASK_TABLE_HEADER('Name'))).toBeVisible();
      await expect(page.locator(clients.TASK_TABLE_HEADER('Deadline'))).toBeVisible();
      await expect(page.locator(clients.TASK_TABLE_HEADER('Status'))).toBeVisible();
      await expect(page.locator(clients.TASK_TABLE_HEADER('Assigned to'))).toBeVisible();
      await expect(page.locator(clients.TASK_ROW(TASK_NAME))).toBeVisible();
    });

    await test.step('3 - Edit the task deadline and verify the updated content is shown in the list', async () => {
      await clients.clickTaskEditButton(TASK_NAME);
      await expect(page.locator(clients.TASK_MODAL_TITLE('Edit task'))).toBeVisible();
      await expect(page.locator(clients.TASK_NAME_INPUT)).toHaveValue(TASK_NAME);
      await clients.fillTaskDeadline(TASK_DEADLINE_UPDATED);
      await clients.saveTaskChanges();

      await expect(page.locator(clients.TASK_ROW(TASK_NAME))).toBeVisible();
      await expect(page.locator(clients.TASK_ROW_DEADLINE(TASK_NAME))).toContainText(
        TASK_DEADLINE_UPDATED_DISPLAY,
      );
      await expect(page.locator(clients.TASK_ROW_STATUS(TASK_NAME))).toContainText(TASK_STATUS);
    });
  });

  test('Admin can delete a task after confirmation', async ({
    loginPage,
    page,
    sidebar,
    clients,
  }) => {
    await test.step('1 - Login as Admin and open the existing client tasks in v3', async () => {
      await loginPage.login({
        username: USERS.ADMIN_MAIN.username,
        password: USERS.ADMIN_MAIN.password,
      });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 25000 });
      await sidebar.goToModule('Clients');
      await clients.searchClientByName('FirstName ' + LAST_NAME);
      await clients.clickFirstResult();
      await expect(page.locator(clients.HEADER)).toContainText(LAST_NAME, {
        timeout: 25000,
      });
      await page.waitForLoadState('networkidle');
      await clients.openClientProfileTab('Tasks');
    });

    await test.step('2 - Delete the task with confirmation and verify it is removed', async () => {
      await clients.clickTaskDeleteButton(TASK_NAME);
      await expect(page.locator(clients.TASK_DELETE_CONFIRMATION_TITLE)).toBeVisible();
      await expect(page.locator(clients.TASK_DELETE_CONFIRMATION_DESCRIPTION)).toBeVisible();
      await clients.confirmTaskDelete();
      await expect(page.locator(clients.TASK_ROW(TASK_NAME))).toBeHidden();
      await expect(page.locator(clients.TASK_DELETE_BUTTON(TASK_NAME))).toBeHidden();
    });
  });
});
