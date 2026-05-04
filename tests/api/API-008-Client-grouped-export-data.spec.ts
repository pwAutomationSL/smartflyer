import type { APIRequestContext } from '@playwright/test';

import { test, expect } from '../../fixtures/PlaywrightFixtures';
import { USERS } from '../../fixtures/users';

const env = process.env.ENVIRONMENT ?? 'qa2';

const API_BASE_URL = `https://api.${env}.smartflyer.com/api`;
const LOGIN_URL = `${API_BASE_URL}/login`;
const GROUPED_EXPORT_URL = `${API_BASE_URL}/clients/grouped/download`;
const TEST_CLIENT_ID = 38348;

type LoginResponse = {
  data: {
    token: string;
  };
};

type IncludeBasicInformation = {
  toggle: boolean;
  full_name: boolean;
  primary_email: boolean;
  date_of_birth: boolean;
  phone: boolean;
  gender: boolean;
  home_airports: boolean;
};

type IncludeAddress = {
  toggle: boolean;
  mailing: boolean;
  billing: boolean;
};

type IncludeImportantDates = {
  toggle: boolean;
  date_of_birth: boolean;
  confirmation_ceremony: boolean;
};

type IncludeImportantTravelData = {
  toggle: boolean;
  global_entry_number: boolean;
  known_traveler_number: boolean;
};

type IncludeTravelPreferencesByCategory = {
  toggle: boolean;
  travel: boolean;
  lifestyle: boolean;
  stay: boolean;
  personal: boolean;
};

type GroupedExportPayload = {
  clients_id: number[];
  format: string;
  include_all: boolean;
  include_passport_files_as_separate_pdfs: boolean;
  include_basic_information: IncludeBasicInformation;
  include_address: IncludeAddress;
  include_allergies_dietary_restrictions: boolean;
  include_loyalty_programs: boolean;
  include_important_dates: IncludeImportantDates;
  include_important_travel_data: IncludeImportantTravelData;
  include_emergency_contact: boolean;
  include_flight_preferences: boolean;
  include_travel_preferences_by_category: IncludeTravelPreferencesByCategory;
  include_related_contacts: boolean;
  include_notes: boolean;
  include_tasks: boolean;
  include_client_documents: boolean;
};

type GroupedExportResponse = {
  success?: boolean;
  message?: string;
  data?: {
    media_attachment_uuid?: string;
    media_uuid?: string;
    download?: {
      url?: string;
      expires_at?: string;
      mode?: string;
      ttl_minutes?: number;
    };
  };
};

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

const postGroupedExport = async (
  request: APIRequestContext,
  token: string,
  payload: GroupedExportPayload,
) => {
  const response = await request.post(GROUPED_EXPORT_URL, {
    headers: {
      Accept: 'application/json',
      Authorization: token,
    },
    data: payload,
  });

  const body = (await response.json()) as GroupedExportResponse;

  return {
    status: response.status(),
    body,
  };
};

const createPayload = (): GroupedExportPayload => ({
  clients_id: [TEST_CLIENT_ID],
  format: 'pdf',
  include_all: true,
  include_passport_files_as_separate_pdfs: true,
  include_basic_information: {
    toggle: true,
    full_name: true,
    primary_email: true,
    date_of_birth: true,
    phone: true,
    gender: true,
    home_airports: true,
  },
  include_address: {
    toggle: true,
    mailing: true,
    billing: true,
  },
  include_allergies_dietary_restrictions: true,
  include_loyalty_programs: true,
  include_important_dates: {
    toggle: true,
    date_of_birth: true,
    confirmation_ceremony: true,
  },
  include_important_travel_data: {
    toggle: true,
    global_entry_number: true,
    known_traveler_number: true,
  },
  include_emergency_contact: true,
  include_flight_preferences: true,
  include_travel_preferences_by_category: {
    toggle: true,
    travel: true,
    lifestyle: true,
    stay: true,
    personal: true,
  },
  include_related_contacts: true,
  include_notes: true,
  include_tasks: true,
  include_client_documents: true,
});

test.describe.serial('API-008 - Client Grouped Export Data', () => {
  let token = '';

  test.beforeAll(async ({ request }) => {
    token = await login(request);
  });

  test('GROUPED_EXPORT_TC-001 - POST returns success for grouped export', async ({ request }) => {
    const payload = createPayload();

    const response = await postGroupedExport(request, token, payload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
    expect(response.body.message).toBe(
      'Export ready. Use the download URL to retrieve the ZIP file.',
    );
  });

  test('GROUPED_EXPORT_TC-002 - POST accepts the new nested export objects', async ({
    request,
  }) => {
    const payload = createPayload();

    const response = await postGroupedExport(request, token, payload);

    expect(response.status).toBe(201);
    expect(response.body.data?.media_uuid).toBeDefined();
  });

  test('GROUPED_EXPORT_TC-003 - POST accepts root boolean flags', async ({ request }) => {
    const payload = createPayload();
    payload.include_related_contacts = false;
    payload.include_notes = true;
    payload.include_tasks = true;
    payload.include_client_documents = false;

    const response = await postGroupedExport(request, token, payload);

    expect(response.status).toBe(201);
    expect(response.body.success).toBeTruthy();
  });

  test('GROUPED_EXPORT_TC-004 - POST accepts grouped export options with mixed values', async ({
    request,
  }) => {
    const payload = createPayload();
    payload.include_passport_files_as_separate_pdfs = false;
    payload.include_all = false;
    payload.include_address.billing = false;
    payload.include_travel_preferences_by_category.stay = false;
    payload.include_client_documents = false;

    const response = await postGroupedExport(request, token, payload);

    expect(response.status).toBe(201);
    expect(response.body.data?.media_attachment_uuid).toBeDefined();
  });

  test('GROUPED_EXPORT_TC-005 - POST returns download metadata', async ({ request }) => {
    const payload = createPayload();

    const response = await postGroupedExport(request, token, payload);
    const download = response.body.data?.download;

    expect(response.status).toBe(201);
    expect(response.body.data?.media_attachment_uuid).toBeDefined();
    expect(response.body.data?.media_uuid).toBeDefined();
    expect(download?.mode).toBe('download');
    expect(download?.ttl_minutes).toBe(5);
    expect(download?.url).toContain('.zip');
    expect(download?.expires_at).toBeDefined();
  });
});
