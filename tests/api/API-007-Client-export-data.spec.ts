import type { APIRequestContext } from '@playwright/test';

import { test, expect } from '../../fixtures/PlaywrightFixtures';
import { USERS } from '../../fixtures/users';

const env = process.env.ENVIRONMENT ?? 'qa2';

const API_BASE_URL = `https://api.${env}.smartflyer.com/api`;
const LOGIN_URL = `${API_BASE_URL}/login`;
const EXPORT_SETTINGS_URL = `${API_BASE_URL}/user/export/settings`;

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

type ExportSettingsPayload = {
  type: string;
  include_basic_information: IncludeBasicInformation;
  include_address: IncludeAddress;
  include_important_dates: IncludeImportantDates;
  include_important_travel_data: IncludeImportantTravelData;
  include_travel_preferences_by_category: IncludeTravelPreferencesByCategory;
  include_related_contacts: boolean;
  include_notes: boolean;
  include_tasks: boolean;
  include_client_documents: boolean;
};

type ExportSettingsResponse = ExportSettingsPayload & {
  type?: string;
};

type ExportSettingsRequest = {
  settings: Record<string, unknown>;
};

type ExportSettingsWithMissingAddressToggle = Omit<ExportSettingsPayload, 'include_address'> & {
  include_address: {
    mailing: boolean;
    billing: boolean;
  };
};

type ExportSettingsWithInvalidAddressType = Omit<ExportSettingsPayload, 'include_address'> & {
  include_address: {
    toggle: boolean;
    mailing: string;
    billing: boolean;
  };
};

type SettingsApiResponse = {
  success?: boolean;
  message?: string;
  data?: {
    settings?: ExportSettingsResponse;
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

const getSettings = async (request: APIRequestContext, token: string) => {
  const response = await request.get(EXPORT_SETTINGS_URL, {
    headers: {
      Accept: 'application/json',
      Authorization: token,
    },
  });

  expect(response.status()).toBe(200);

  return (await response.json()) as SettingsApiResponse;
};

const postSettings = async (
  request: APIRequestContext,
  token: string,
  payload: ExportSettingsRequest,
) => {
  const response = await request.post(EXPORT_SETTINGS_URL, {
    headers: {
      Accept: 'application/json',
      Authorization: token,
    },
    data: payload,
  });

  const body = (await response.json()) as SettingsApiResponse;

  return {
    status: response.status(),
    ok: response.ok(),
    body,
  };
};

const createGoldenPayload = (): ExportSettingsPayload => ({
  type: 'PDF',
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
  include_travel_preferences_by_category: {
    toggle: true,
    travel: true,
    lifestyle: true,
    stay: true,
    personal: true,
  },
  include_related_contacts: false,
  include_notes: true,
  include_tasks: true,
  include_client_documents: false,
});

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const createRequestBody = (settings: Record<string, unknown>): ExportSettingsRequest => ({
  settings,
});

test.describe.serial('API-007 - Client Export Data', () => {
  let token = '';
  let originalSettings: ExportSettingsResponse | null = null;

  test.beforeAll(async ({ request }) => {
    token = await login(request);

    const response = await getSettings(request, token);
    originalSettings = response.data?.settings ? clone(response.data.settings) : null;
  });

  test.afterAll(async ({ request }) => {
    if (!originalSettings) {
      return;
    }

    await postSettings(request, token, createRequestBody(originalSettings));
  });

  test('EXPORT_TC-001 - POST saves the new nested structure', async ({ request }) => {
    const payload = createGoldenPayload();

    const postResponse = await postSettings(request, token, createRequestBody(payload));
    expect(postResponse.status).toBe(200);

    const getResponse = await getSettings(request, token);
    const settings = getResponse.data?.settings;

    expect(settings?.include_basic_information.full_name).toBe(true);
    expect(settings?.include_basic_information.primary_email).toBe(true);
    expect(settings?.include_basic_information.phone).toBe(true);
    expect(settings?.include_basic_information.home_airports).toBe(true);
  });

  test('EXPORT_TC-002 - POST saves mixed payload with nested objects and root booleans', async ({
    request,
  }) => {
    const payload = createGoldenPayload();
    payload.include_related_contacts = true;
    payload.include_notes = false;
    payload.include_tasks = true;
    payload.include_client_documents = true;

    const postResponse = await postSettings(request, token, createRequestBody(payload));
    expect(postResponse.status).toBe(200);

    const getResponse = await getSettings(request, token);
    const settings = getResponse.data?.settings;

    expect(settings?.include_related_contacts).toBe(true);
    expect(settings?.include_notes).toBe(false);
    expect(settings?.include_tasks).toBe(true);
    expect(settings?.include_client_documents).toBe(true);
  });

  test('EXPORT_TC-003 - POST rejects nested object without toggle', async ({ request }) => {
    const settings: ExportSettingsWithMissingAddressToggle = {
      ...createGoldenPayload(),
      include_address: {
        mailing: true,
        billing: false,
      },
    };

    const response = await postSettings(request, token, createRequestBody(settings));

    expect([400, 422]).toContain(response.status);
  });

  test('EXPORT_TC-004 - GET returns the saved nested structure', async ({ request }) => {
    const payload = createGoldenPayload();

    await postSettings(request, token, createRequestBody(payload));

    const response = await getSettings(request, token);
    const settings = response.data?.settings;

    expect(settings?.include_basic_information).toEqual(payload.include_basic_information);
    expect(settings?.include_address).toEqual(payload.include_address);
    expect(settings?.include_important_dates).toEqual(payload.include_important_dates);
    expect(settings?.include_important_travel_data).toEqual(payload.include_important_travel_data);
    expect(settings?.include_travel_preferences_by_category).toEqual(
      payload.include_travel_preferences_by_category,
    );
  });

  test('EXPORT_TC-005 - GET keeps unmapped flags as root booleans', async ({ request }) => {
    const payload = createGoldenPayload();

    await postSettings(request, token, createRequestBody(payload));

    const response = await getSettings(request, token);
    const settings = response.data?.settings;

    expect(settings?.include_related_contacts).toBe(false);
    expect(settings?.include_notes).toBe(true);
    expect(settings?.include_tasks).toBe(true);
    expect(settings?.include_client_documents).toBe(false);
  });

  test('EXPORT_TC-006 - GET returns all travel preference category keys', async ({ request }) => {
    const payload = createGoldenPayload();

    await postSettings(request, token, createRequestBody(payload));

    const response = await getSettings(request, token);
    const travelPreferences = response.data?.settings?.include_travel_preferences_by_category;

    expect(Object.keys(travelPreferences ?? {}).sort()).toEqual(
      ['lifestyle', 'personal', 'stay', 'toggle', 'travel'].sort(),
    );
  });

  test('EXPORT_TC-007 - POST update changes only include_address.billing', async ({ request }) => {
    const payload = createGoldenPayload();
    payload.include_address.billing = true;

    await postSettings(request, token, createRequestBody(payload));

    const updatedPayload = createGoldenPayload();
    updatedPayload.include_address.billing = false;

    const postResponse = await postSettings(request, token, createRequestBody(updatedPayload));
    expect(postResponse.status).toBe(200);

    const getResponse = await getSettings(request, token);
    const settings = getResponse.data?.settings;

    expect(settings?.include_address.toggle).toBe(true);
    expect(settings?.include_address.mailing).toBe(true);
    expect(settings?.include_address.billing).toBe(false);
  });

  test('EXPORT_TC-008 - POST rejects invalid data type inside nested object', async ({
    request,
  }) => {
    const settings: ExportSettingsWithInvalidAddressType = {
      ...createGoldenPayload(),
      include_address: {
        toggle: true,
        mailing: 'yes',
        billing: false,
      },
    };

    const response = await postSettings(request, token, createRequestBody(settings));

    expect([400, 422]).toContain(response.status);
  });
});
