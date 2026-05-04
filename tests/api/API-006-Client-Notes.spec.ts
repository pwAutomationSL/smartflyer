import type { APIRequestContext } from '@playwright/test';

import { test, expect } from '../../fixtures/PlaywrightFixtures';
import { USERS } from '../../fixtures/users';

const env = process.env.ENVIRONMENT ?? 'qa2';
const API_BASE_URL = `https://api.${env}.smartflyer.com/api`;
const LOGIN_URL = `${API_BASE_URL}/login`;
const NOTES_URL = `${API_BASE_URL}/notes`;
const NOTES_X_AGENTS_URL = `${API_BASE_URL}/notes-x-agents`;
const TEST_CLIENT_ID = 106179;
const TEST_AGENT_ID = 1849;
const NOTE_TITLE = 'When traveling with children (food)';
const NOTE_BODY =
  'No consumables in rooms (welcome baskets, turn-down chocolates, etc.), only sparkling water and Coke zero in mini bars, the family will likely send a package of safe snacks and foods to the hotel';
const UPDATED_NOTE_TITLE = 'When traveling with children (food) EDITED';
const UPDATED_NOTE_BODY =
  'No consumables in rooms (welcome baskets, turn-down chocolates, etc.), only sparkling water and Coke zero in mini bars, the family will likely send a package of safe snacks and foods to the hotel EDITED';

type LoginResponse = {
  data: {
    token: string;
  };
};

type Agent = {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  profile_picture_url?: string | null;
  email?: string;
};

type Note = {
  id: number;
  title: string;
  note: string;
  client_id: number;
  agents?: Agent[];
};

type NoteAgentRelationship = {
  uuid?: string;
  note_id: number;
  agent_id: number;
  note?: {
    title?: string;
    note?: string;
  };
  agent?: Agent;
  created_at?: string;
  updated_at?: string;
};

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const login = async (request: APIRequestContext) => {
  const response = await request.post(LOGIN_URL, {
    data: {
      email: USERS.ADMIN_MAIN.username,
      password: USERS.ADMIN_MAIN.password,
    },
  });

  expect(response.status()).toBe(200);

  const body = (await response.json()) as LoginResponse;
  return `Bearer ${body.data.token}`;
};

test.describe.serial('API-006 - Client Notes', () => {
  let token = '';
  let noteId = 0;
  let clientId = 0;
  let noteTitle = '';
  let noteBody = '';
  let relationshipUuid = '';
  let firstRelationship: NoteAgentRelationship | undefined;

  test.afterEach(async () => {
    await sleep(2000);
  });

  test.beforeAll(async ({ request }) => {
    token = await login(request);

    const createNoteResponse = await request.post(NOTES_URL, {
      headers: {
        Accept: 'application/json',
        Authorization: token,
      },
      data: {
        title: NOTE_TITLE,
        note: NOTE_BODY,
        client_id: TEST_CLIENT_ID,
      },
    });
    expect(createNoteResponse.ok()).toBeTruthy();
    const createNoteBody = (await createNoteResponse.json()) as ApiResponse<Note>;
    const note = createNoteBody.data;
    expect(note).toBeDefined();
    expect(typeof note?.id).toBe('number');

    await sleep(500);

    const relationshipsResponse = await request.get(NOTES_X_AGENTS_URL, {
      headers: {
        Accept: 'application/json',
        Authorization: token,
      },
    });
    expect(relationshipsResponse.status()).toBe(200);
    const relationshipsBody = (await relationshipsResponse.json()) as ApiResponse<
      NoteAgentRelationship[]
    >;
    const relationships = Array.isArray(relationshipsBody.data) ? relationshipsBody.data : [];

    expect(relationships.length).toBeGreaterThan(0);

    firstRelationship = relationships[0];
    noteId = note!.id;
    clientId = note!.client_id;
    noteTitle = note!.title;
    noteBody = note!.note;
  });

  test('NOTES_TC-001 - list note x agent relationships', async () => {
    expect(firstRelationship).toBeDefined();
    expect(firstRelationship?.note_id).toBeDefined();
    expect(firstRelationship?.agent_id).toBeDefined();
  });

  test('NOTES_TC-002 - create note x agent relationship', async ({ request }) => {
    const response = await request.post(NOTES_X_AGENTS_URL, {
      headers: {
        Accept: 'application/json',
        Authorization: token,
      },
      data: {
        note_id: noteId,
        agent_id: TEST_AGENT_ID,
      },
    });

    expect(response.ok()).toBeTruthy();

    const body = (await response.json()) as ApiResponse<NoteAgentRelationship>;

    expect(body.success).toBeTruthy();
    expect(body.message).toBe('Note agent created successfully');
    expect(body.data?.note_id).toBe(noteId);
    expect(body.data?.note?.title).toBe(noteTitle);
    expect(body.data?.note?.note).toBe(noteBody);
    expect(body.data?.agent_id).toBe(TEST_AGENT_ID);
    expect(body.data?.agent?.email).toBeDefined();
    relationshipUuid = body.data?.uuid ?? '';
    expect(relationshipUuid).not.toBe('');
  });

  test('NOTES_TC-003 - update note', async ({ request }) => {
    const response = await request.put(`${NOTES_URL}/${noteId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: token,
      },
      data: {
        title: UPDATED_NOTE_TITLE,
        note: UPDATED_NOTE_BODY,
      },
    });

    expect(response.ok()).toBeTruthy();

    const body = (await response.json()) as ApiResponse<Note>;

    expect(body.data?.id).toBe(noteId);
    expect(body.data?.title).toBe(UPDATED_NOTE_TITLE);
    expect(body.data?.note).toBe(UPDATED_NOTE_BODY);

    noteTitle = UPDATED_NOTE_TITLE;
    noteBody = UPDATED_NOTE_BODY;
  });

  test('NOTES_TC-004 - notes endpoints include agents list', async ({ request }) => {
    const notesResponse = await request.get(NOTES_URL, {
      headers: {
        Accept: 'application/json',
        Authorization: token,
      },
    });
    expect(notesResponse.status()).toBe(200);
    const notesBody = (await notesResponse.json()) as ApiResponse<Note[]>;

    const filteredNotesResponse = await request.get(
      `${NOTES_URL}?title=${encodeURIComponent(noteTitle)}&note=${encodeURIComponent(noteBody)}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization: token,
        },
      },
    );
    expect(filteredNotesResponse.status()).toBe(200);
    const filteredNotesBody = (await filteredNotesResponse.json()) as ApiResponse<Note[]>;

    const clientNotesResponse = await request.get(`${NOTES_URL}/client/${clientId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: token,
      },
    });
    expect(clientNotesResponse.status()).toBe(200);
    const clientNotesBody = (await clientNotesResponse.json()) as ApiResponse<Note[]>;

    const noteResponse = await request.get(`${NOTES_URL}/${noteId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: token,
      },
    });
    expect(noteResponse.status()).toBe(200);
    const noteBodyResponse = (await noteResponse.json()) as ApiResponse<Note>;

    const noteFromList = (notesBody.data ?? []).find((item) => item.id === noteId);
    const noteFromFilter = (filteredNotesBody.data ?? []).find((item) => item.id === noteId);
    const noteFromClient = (clientNotesBody.data ?? []).find((item) => item.id === noteId);
    const noteDetails = noteBodyResponse.data;

    expect(Array.isArray(noteFromList?.agents)).toBeTruthy();
    expect(Array.isArray(noteFromFilter?.agents)).toBeTruthy();
    expect(Array.isArray(noteFromClient?.agents)).toBeTruthy();
    expect(Array.isArray(noteDetails?.agents)).toBeTruthy();

    expect(noteFromList?.id).toBe(noteId);
    expect(noteFromFilter?.title).toBe(UPDATED_NOTE_TITLE);
    expect(noteFromFilter?.note).toBe(UPDATED_NOTE_BODY);
    expect(noteFromClient?.id).toBe(noteId);
    expect(noteDetails?.id).toBe(noteId);
    expect(noteDetails?.title).toBe(UPDATED_NOTE_TITLE);
    expect(noteDetails?.note).toBe(UPDATED_NOTE_BODY);
    expect(noteDetails?.agents?.length).toBeGreaterThan(0);
  });

  test('NOTES_TC-005 - delete note x agent relationship', async ({ request }) => {
    const deleteResponse = await request.delete(`${NOTES_X_AGENTS_URL}/${relationshipUuid}`, {
      headers: {
        Accept: 'application/json',
        Authorization: token,
      },
    });

    expect(deleteResponse.status()).toBe(204);

    await sleep(500);

    const relationshipsResponse = await request.get(NOTES_X_AGENTS_URL, {
      headers: {
        Accept: 'application/json',
        Authorization: token,
      },
    });
    expect(relationshipsResponse.status()).toBe(200);
    const relationshipsBody = (await relationshipsResponse.json()) as ApiResponse<
      NoteAgentRelationship[]
    >;
    const relationships = Array.isArray(relationshipsBody.data) ? relationshipsBody.data : [];

    const deletedRelationship = relationships.find(
      (item) => item.note_id === noteId && item.agent_id === TEST_AGENT_ID,
    );

    expect(deletedRelationship).toBeUndefined();

    const deleteNoteResponse = await request.delete(`${NOTES_URL}/${noteId}`, {
      headers: {
        Accept: 'application/json',
        Authorization: token,
      },
    });

    expect(deleteNoteResponse.status()).toBe(204);
  });
});
