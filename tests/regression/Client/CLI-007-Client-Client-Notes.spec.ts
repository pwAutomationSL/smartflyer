import { test, expect } from '../../../fixtures/PlaywrightFixtures';
import type { Page } from '@playwright/test';
import { USERS } from '../../../fixtures/users';
import { uniqueId } from '../../../page-objects';
import type { Clients } from '../../../page-objects/pages/Clients';
import { importPrimaryClient } from '../../../utils/importPrimaryClient';

const unique = uniqueId();
const LAST_NAME = `ClientNotes${unique}`;
const EMAIL = `clientnotes${unique}@asd.com`;
const NOTE_TITLE = `Auto Note ${unique}`;
const NOTE_DESCRIPTION = `Auto description ${unique}`;
const UPDATED_NOTE_TITLE = `Auto Note ${unique} Updated`;
const UPDATED_NOTE_DESCRIPTION = `Auto description ${unique} updated`;
let TAGGED_AGENTS: string[] = [];

const expectTaggedAgentsToMatch = async (
  page: Page,
  clients: Clients,
  noteTitle: string,
  taggedAgents: string[],
) => {
  await expect(page.locator(clients.NOTE_ROW_TAGGED_AGENTS(noteTitle))).not.toHaveText(
    /^\s*[—-]\s*$/,
  );
  const previewAgent = await clients.getNoteTaggedAgentPreview(noteTitle);
  expect(taggedAgents).toContain(previewAgent);

  const hiddenAgents = taggedAgents.filter((agentName) => agentName !== previewAgent);
  await expect(
    page.locator(clients.NOTE_ROW_TAGGED_AGENTS_MORE(noteTitle, hiddenAgents.length)).last(),
  ).toBeVisible();
  await clients.hoverNoteTaggedAgentsMore(noteTitle, hiddenAgents.length);

  for (const agentName of hiddenAgents) {
    await expect(page.getByText(agentName, { exact: true })).toBeVisible();
  }
};

test.describe.serial('CLI-007 - Client - Client Notes', () => {
  test('Admin can see Notes empty state, open Add Note modal, and create a note successfully', async ({
    loginPage,
    page,
    sidebar,
    clients,
    request,
  }) => {
    await test.step('1 - Login as Admin, create a client, and open the client profile', async () => {
      await importPrimaryClient(request, USERS.ADMIN_MAIN, LAST_NAME, EMAIL);
      await loginPage.login({
        username: USERS.ADMIN_MAIN.username,
        password: USERS.ADMIN_MAIN.password,
      });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 25000 });
      await sidebar.goToModule('Clients');
      await clients.openClientFromSearch(`FirstName ${LAST_NAME}`);
      await expect(page.locator(clients.HEADER).first()).toContainText(LAST_NAME, {
        timeout: 25000,
      });
    });

    await test.step('2 - Open Notes tab in v3 and verify empty state with Add Note CTA', async () => {
      await expect(page.locator(clients.CLIENT_PROFILE_TAB('Notes'))).toBeVisible();
      await clients.openClientProfileTab('Notes');
      await expect(page.locator(clients.CLIENT_PROFILE_TAB('Notes'))).toBeVisible();
      await expect(page.locator(clients.NOTES_EMPTY_STATE_TITLE)).toBeVisible();
      await expect(page.locator(clients.NOTES_EMPTY_STATE_TITLE)).toContainText('No notes yet');
      await expect(page.locator(clients.NOTES_EMPTY_STATE_DESCRIPTION)).toBeVisible();
      await expect(page.locator(clients.ADD_NOTE_BUTTON)).toBeVisible();
    });

    await test.step('3 - Open Add Note modal and verify note fields are present', async () => {
      await clients.openAddNoteModal();
      await expect(page.locator(clients.NOTE_MODAL_TITLE('New note'))).toBeVisible();
      await expect(page.locator(clients.NOTE_TITLE_INPUT)).toBeVisible();
      await expect(page.locator(clients.NOTE_TAGGED_AGENTS)).toBeVisible();
      await expect(page.locator(clients.NOTE_TAGGED_AGENTS_COMBOBOX)).toBeVisible();
      await expect(page.locator(clients.NOTE_DESCRIPTION_INPUT)).toBeVisible();
      await expect(page.locator(clients.NOTE_CHARACTER_COUNT)).toContainText('0/1000');
      await expect(page.locator(clients.NOTE_SAVE)).toBeDisabled();
    });

    await test.step('4 - Create a valid note with the first 3 tagged agents and verify they appear in the notes list', async () => {
      TAGGED_AGENTS = await clients.createNoteWithFirstTaggedAgents(
        NOTE_TITLE,
        NOTE_DESCRIPTION,
        3,
      );

      await expect(page.locator(clients.NOTES_HEADER)).toContainText('Notes');
      await expect(page.locator(clients.NOTE_ROW(NOTE_TITLE))).toBeVisible();
      await expect(page.locator(clients.NOTE_ROW_DETAILS(NOTE_TITLE))).toContainText(
        NOTE_DESCRIPTION,
      );
      await expect(page.locator(clients.NOTE_ROW_DATE(NOTE_TITLE))).toBeVisible();
      await expectTaggedAgentsToMatch(page, clients, NOTE_TITLE, TAGGED_AGENTS);
    });
  });

  test('Admin can see notes list and edit an existing note successfully', async ({
    loginPage,
    page,
    sidebar,
    clients,
  }) => {
    await test.step('1 - Login as Admin and open the existing client notes in v3', async () => {
      await loginPage.login({
        username: USERS.ADMIN_MAIN.username,
        password: USERS.ADMIN_MAIN.password,
      });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 25000 });
      await sidebar.goToModule('Clients');
      await clients.searchClientByName('FirstName ' + LAST_NAME);
      await clients.clickFirstResult();
      await expect(page.locator(clients.HEADER)).toContainText(LAST_NAME, { timeout: 25000 });
      await expect(page.locator(clients.CLIENT_PROFILE_TAB('Notes'))).toBeVisible();
      await clients.openClientProfileTab('Notes');
    });

    await test.step('2 - Verify the notes list is displayed when notes exist', async () => {
      await expect(page.locator(clients.NOTES_HEADER)).toContainText('Notes');
      await expect(page.locator(clients.NOTE_TABLE_HEADER('Title'))).toBeVisible();
      await expect(page.locator(clients.NOTE_TABLE_HEADER('Details'))).toBeVisible();
      await expect(page.locator(clients.NOTE_TABLE_HEADER('Date created'))).toBeVisible();
      await expect(page.locator(clients.NOTE_TABLE_HEADER('Tagged agents'))).toBeVisible();
      await expect(page.locator(clients.NOTE_TABLE_HEADER('Actions'))).toBeVisible();
      await expect(page.locator(clients.NOTE_ROW(NOTE_TITLE))).toBeVisible();
      await expectTaggedAgentsToMatch(page, clients, NOTE_TITLE, TAGGED_AGENTS);
    });

    await test.step('3 - Edit the note and verify the updated content is shown in the list', async () => {
      await clients.clickNoteEditButton(NOTE_TITLE);
      await expect(page.locator(clients.NOTE_MODAL_TITLE('Edit note'))).toBeVisible();
      await expect(page.locator(clients.NOTE_TITLE_INPUT)).toHaveValue(NOTE_TITLE);
      await expect(page.locator(clients.NOTE_DESCRIPTION_INPUT)).toHaveValue(NOTE_DESCRIPTION);
      await clients.fillNoteTitle(UPDATED_NOTE_TITLE);
      await clients.fillNoteDescription(UPDATED_NOTE_DESCRIPTION);
      await clients.saveNoteChanges();

      await expect(page.locator(clients.NOTE_ROW(UPDATED_NOTE_TITLE))).toBeVisible();
      await expect(page.locator(clients.NOTE_ROW_DETAILS(UPDATED_NOTE_TITLE))).toContainText(
        UPDATED_NOTE_DESCRIPTION,
      );
      await expectTaggedAgentsToMatch(page, clients, UPDATED_NOTE_TITLE, TAGGED_AGENTS);
      await expect(page.locator(clients.NOTE_ROW(NOTE_TITLE))).toBeHidden();
    });
  });

  test('Admin can delete a note after confirmation', async ({
    loginPage,
    page,
    sidebar,
    clients,
  }) => {
    await test.step('1 - Login as Admin and open the existing client notes in v3', async () => {
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
      await expect(page.locator(clients.CLIENT_PROFILE_TAB('Notes'))).toBeVisible();
      await clients.openClientProfileTab('Notes');
    });

    await test.step('2 - Delete the note with confirmation and verify it is removed', async () => {
      await clients.clickNoteDeleteButton(UPDATED_NOTE_TITLE);
      await expect(page.locator(clients.NOTE_DELETE_CONFIRMATION_TITLE)).toBeVisible();
      await expect(page.locator(clients.NOTE_DELETE_CONFIRMATION_DESCRIPTION)).toBeVisible();
      await clients.confirmNoteDelete();
      await expect(page.locator(clients.NOTE_ROW(UPDATED_NOTE_TITLE))).toBeHidden();
      await expect(page.locator(clients.NOTE_DELETE_BUTTON(UPDATED_NOTE_TITLE))).toBeHidden();
    });
  });
});
