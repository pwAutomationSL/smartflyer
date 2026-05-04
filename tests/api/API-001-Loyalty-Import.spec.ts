import { createReadStream } from 'node:fs';
import path from 'node:path';

import { test, expect } from '../../fixtures/PlaywrightFixtures';
import { USERS } from '../../fixtures/users';

const env = process.env.ENVIRONMENT ?? 'qa2';

const API_BASE_URL = `https://api.${env}.smartflyer.com/api`;
const LOGIN_URL = `${API_BASE_URL}/login`;
const MEDIA_URL = `${API_BASE_URL}/media`;
const IMPORT_LOYALTY_URL = `${API_BASE_URL}/clients/import/loyalty-numbers`;

type LoginResponse = {
  data: {
    token: string;
  };
};

type MediaUploadResponse = {
  success: boolean;
  data: Array<{
    uuid: string;
  }>;
};

type LoyaltyImportInvalidRow = {
  row: number;
  errors: Record<string, string[]>;
};

type LoyaltyImportResponse = {
  status?: string;
  message?: string;
  data?: {
    valid: unknown[] | string;
    invalid: LoyaltyImportInvalidRow[] | string;
    valid_count?: number | string;
    invalid_count?: number | string;
  };
};

const getNumericCount = (value: number | string | undefined): number | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return Number(value);
};

const dumpResponseOnFailure = async (
  label: string,
  payload: unknown,
  error: unknown,
): Promise<never> => {
  const serializedPayload = JSON.stringify(payload, null, 2);
  console.error(`[${label}] response dump\n${serializedPayload}`);
  await test.info().attach(`${label}.json`, {
    body: serializedPayload,
    contentType: 'application/json',
  });
  throw error;
};

test.describe('API-001 - Loyalty Import', () => {
  let authorizationHeader = '';

  test.beforeAll(async ({ request }) => {
    const loginResponse = await request.post(LOGIN_URL, {
      data: {
        email: USERS.ADMIN_MAIN.username,
        password: USERS.ADMIN_MAIN.password,
      },
    });

    expect(loginResponse.status()).toBe(200);

    const loginBody = (await loginResponse.json()) as LoginResponse;
    expect(loginBody.data.token.startsWith('ey')).toBeTruthy();
    authorizationHeader = `Bearer ${loginBody.data.token}`;
  });

  test('LOY_TC-001 - one valid row', async ({ request }) => {
    let mediaUuid = '';

    await test.step('1 - Upload LOY_TC-001_valid_one_row.csv and get media uuid', async () => {
      const uploadResponse = await request.post(MEDIA_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
          'X-Upload-Context': 'GENERAL',
        },
        multipart: {
          'files[]': createReadStream(
            path.resolve(process.cwd(), 'data/api/LOY_TC-001_valid_one_row.csv'),
          ),
        },
      });

      expect(uploadResponse.ok()).toBeTruthy();

      const uploadBody = (await uploadResponse.json()) as MediaUploadResponse;
      try {
        expect(uploadBody.success).toBeTruthy();
        expect(uploadBody.data[0].uuid).toBeTruthy();
        mediaUuid = uploadBody.data[0].uuid;
      } catch (error) {
        await dumpResponseOnFailure('LOY_TC-001-upload', uploadBody, error);
      }
    });

    await test.step('2 - Import loyalty numbers and validate one valid row', async () => {
      const importResponse = await request.post(IMPORT_LOYALTY_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
        },
        data: {
          media_uuid: mediaUuid,
        },
      });

      expect(importResponse.ok()).toBeTruthy();

      const importBody = (await importResponse.json()) as LoyaltyImportResponse;
      try {
        expect(importBody.status).toBe('success');
        expect(getNumericCount(importBody.data?.valid_count)).toBe(1);
        expect(getNumericCount(importBody.data?.invalid_count)).toBe(0);
      } catch (error) {
        await dumpResponseOnFailure('LOY_TC-001-import', importBody, error);
      }
    });
  });

  test('LOY_TC-002 - multiple valid rows', async ({ request }) => {
    let mediaUuid = '';

    await test.step('1 - Upload LOY_TC-002_valid_multiple_rows.csv and get media uuid', async () => {
      const uploadResponse = await request.post(MEDIA_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
          'X-Upload-Context': 'GENERAL',
        },
        multipart: {
          'files[]': createReadStream(
            path.resolve(process.cwd(), 'data/api/LOY_TC-002_valid_multiple_rows.csv'),
          ),
        },
      });

      expect(uploadResponse.ok()).toBeTruthy();

      const uploadBody = (await uploadResponse.json()) as MediaUploadResponse;
      try {
        expect(uploadBody.success).toBeTruthy();
        expect(uploadBody.data[0].uuid).toBeTruthy();
        mediaUuid = uploadBody.data[0].uuid;
      } catch (error) {
        await dumpResponseOnFailure('LOY_TC-002-upload', uploadBody, error);
      }
    });

    await test.step('2 - Import loyalty numbers and validate multiple valid rows', async () => {
      const importResponse = await request.post(IMPORT_LOYALTY_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
        },
        data: {
          media_uuid: mediaUuid,
        },
      });

      expect(importResponse.ok()).toBeTruthy();

      const importBody = (await importResponse.json()) as LoyaltyImportResponse;
      try {
        expect(importBody.status).toBe('success');
        expect(getNumericCount(importBody.data?.valid_count)).toBe(3);
        expect(getNumericCount(importBody.data?.invalid_count)).toBe(0);
      } catch (error) {
        await dumpResponseOnFailure('LOY_TC-002-import', importBody, error);
      }
    });
  });

  test('LOY_TC-003 - missing client.identity header', async ({ request }) => {
    let mediaUuid = '';

    await test.step('1 - Upload LOY_TC-003_missing_client_identity_header.csv and get media uuid', async () => {
      const uploadResponse = await request.post(MEDIA_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
          'X-Upload-Context': 'GENERAL',
        },
        multipart: {
          'files[]': createReadStream(
            path.resolve(process.cwd(), 'data/api/LOY_TC-003_missing_client_identity_header.csv'),
          ),
        },
      });

      expect(uploadResponse.ok()).toBeTruthy();

      const uploadBody = (await uploadResponse.json()) as MediaUploadResponse;
      try {
        expect(uploadBody.success).toBeTruthy();
        expect(uploadBody.data[0].uuid).toBeTruthy();
        mediaUuid = uploadBody.data[0].uuid;
      } catch (error) {
        await dumpResponseOnFailure('LOY_TC-003-upload', uploadBody, error);
      }
    });

    await test.step('2 - Import loyalty numbers and validate missing identity error', async () => {
      const importResponse = await request.post(IMPORT_LOYALTY_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
        },
        data: {
          media_uuid: mediaUuid,
        },
      });

      expect(importResponse.ok()).toBeTruthy();

      const importBody = (await importResponse.json()) as LoyaltyImportResponse;
      try {
        expect(getNumericCount(importBody.data?.valid_count)).toBe(0);
        expect(getNumericCount(importBody.data?.invalid_count)).toBe(1);
        expect(
          Array.isArray(importBody.data?.invalid)
            ? (importBody.data.invalid[0].errors['client.identity'] ??
                importBody.data.invalid[0].errors.client_id)
            : [],
        ).toBeTruthy();
      } catch (error) {
        await dumpResponseOnFailure('LOY_TC-003-import', importBody, error);
      }
    });
  });

  test('LOY_TC-004 - missing number header', async ({ request }) => {
    let mediaUuid = '';

    await test.step('1 - Upload LOY_TC-004_missing_number_header.csv and get media uuid', async () => {
      const uploadResponse = await request.post(MEDIA_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
          'X-Upload-Context': 'GENERAL',
        },
        multipart: {
          'files[]': createReadStream(
            path.resolve(process.cwd(), 'data/api/LOY_TC-004_missing_number_header.csv'),
          ),
        },
      });

      expect(uploadResponse.ok()).toBeTruthy();

      const uploadBody = (await uploadResponse.json()) as MediaUploadResponse;
      try {
        expect(uploadBody.success).toBeTruthy();
        expect(uploadBody.data[0].uuid).toBeTruthy();
        mediaUuid = uploadBody.data[0].uuid;
      } catch (error) {
        await dumpResponseOnFailure('LOY_TC-004-upload', uploadBody, error);
      }
    });

    await test.step('2 - Import loyalty numbers and validate missing number error', async () => {
      const importResponse = await request.post(IMPORT_LOYALTY_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
        },
        data: {
          media_uuid: mediaUuid,
        },
      });

      expect(importResponse.ok()).toBeTruthy();

      const importBody = (await importResponse.json()) as LoyaltyImportResponse;
      try {
        expect(getNumericCount(importBody.data?.valid_count)).toBe(0);
        expect(getNumericCount(importBody.data?.invalid_count)).toBe(1);
        expect(
          Array.isArray(importBody.data?.invalid) ? importBody.data.invalid[0].errors.number : [],
        ).toBeTruthy();
      } catch (error) {
        await dumpResponseOnFailure('LOY_TC-004-import', importBody, error);
      }
    });
  });

  test('LOY_TC-005 - invalid loyalty program slug', async ({ request }) => {
    let mediaUuid = '';

    await test.step('1 - Upload LOY_TC-005_invalid_loyalty_program_slug.csv and get media uuid', async () => {
      const uploadResponse = await request.post(MEDIA_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
          'X-Upload-Context': 'GENERAL',
        },
        multipart: {
          'files[]': createReadStream(
            path.resolve(process.cwd(), 'data/api/LOY_TC-005_invalid_loyalty_program_slug.csv'),
          ),
        },
      });

      expect(uploadResponse.ok()).toBeTruthy();

      const uploadBody = (await uploadResponse.json()) as MediaUploadResponse;
      try {
        expect(uploadBody.success).toBeTruthy();
        expect(uploadBody.data[0].uuid).toBeTruthy();
        mediaUuid = uploadBody.data[0].uuid;
      } catch (error) {
        await dumpResponseOnFailure('LOY_TC-005-upload', uploadBody, error);
      }
    });

    await test.step('2 - Import loyalty numbers and validate slug error', async () => {
      const importResponse = await request.post(IMPORT_LOYALTY_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
        },
        data: {
          media_uuid: mediaUuid,
        },
      });

      expect(importResponse.ok()).toBeTruthy();

      const importBody = (await importResponse.json()) as LoyaltyImportResponse;
      try {
        expect(getNumericCount(importBody.data?.valid_count)).toBe(0);
        expect(getNumericCount(importBody.data?.invalid_count)).toBe(1);
        expect(
          Array.isArray(importBody.data?.invalid)
            ? importBody.data.invalid[0].errors.loyalty_program
            : [],
        ).toBeTruthy();
      } catch (error) {
        await dumpResponseOnFailure('LOY_TC-005-import', importBody, error);
      }
    });
  });

  test('LOY_TC-006 - mixed valid + invalid', async ({ request }) => {
    let mediaUuid = '';

    await test.step('1 - Upload LOY_TC-006_mixed_valid_invalid.csv and get media uuid', async () => {
      const uploadResponse = await request.post(MEDIA_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
          'X-Upload-Context': 'GENERAL',
        },
        multipart: {
          'files[]': createReadStream(
            path.resolve(process.cwd(), 'data/api/LOY_TC-006_mixed_valid_invalid.csv'),
          ),
        },
      });

      expect(uploadResponse.ok()).toBeTruthy();

      const uploadBody = (await uploadResponse.json()) as MediaUploadResponse;
      try {
        expect(uploadBody.success).toBeTruthy();
        expect(uploadBody.data[0].uuid).toBeTruthy();
        mediaUuid = uploadBody.data[0].uuid;
      } catch (error) {
        await dumpResponseOnFailure('LOY_TC-006-upload', uploadBody, error);
      }
    });

    await test.step('2 - Import loyalty numbers and validate mixed counts', async () => {
      const importResponse = await request.post(IMPORT_LOYALTY_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
        },
        data: {
          media_uuid: mediaUuid,
        },
      });

      expect(importResponse.ok()).toBeTruthy();

      const importBody = (await importResponse.json()) as LoyaltyImportResponse;
      try {
        expect(importBody.status).toBe('success');
        expect(getNumericCount(importBody.data?.valid_count)).toBe(1);
        expect(getNumericCount(importBody.data?.invalid_count)).toBe(2);
      } catch (error) {
        await dumpResponseOnFailure('LOY_TC-006-import', importBody, error);
      }
    });
  });

  test('LOY_TC-007 - client.identity not found', async ({ request }) => {
    let mediaUuid = '';

    await test.step('1 - Upload LOY_TC-007_client_identity_not_found.csv and get media uuid', async () => {
      const uploadResponse = await request.post(MEDIA_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
          'X-Upload-Context': 'GENERAL',
        },
        multipart: {
          'files[]': createReadStream(
            path.resolve(process.cwd(), 'data/api/LOY_TC-007_client_identity_not_found.csv'),
          ),
        },
      });

      expect(uploadResponse.ok()).toBeTruthy();

      const uploadBody = (await uploadResponse.json()) as MediaUploadResponse;
      try {
        expect(uploadBody.success).toBeTruthy();
        expect(uploadBody.data[0].uuid).toBeTruthy();
        mediaUuid = uploadBody.data[0].uuid;
      } catch (error) {
        await dumpResponseOnFailure('LOY_TC-007-upload', uploadBody, error);
      }
    });

    await test.step('2 - Import loyalty numbers and validate identity not found error', async () => {
      const importResponse = await request.post(IMPORT_LOYALTY_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
        },
        data: {
          media_uuid: mediaUuid,
        },
      });

      expect(importResponse.ok()).toBeTruthy();

      const importBody = (await importResponse.json()) as LoyaltyImportResponse;
      try {
        expect(getNumericCount(importBody.data?.valid_count)).toBe(0);
        expect(getNumericCount(importBody.data?.invalid_count)).toBe(1);
        expect(
          Array.isArray(importBody.data?.invalid)
            ? (importBody.data.invalid[0].errors['client.identity'] ??
                importBody.data.invalid[0].errors.client_identity)
            : [],
        ).toBeTruthy();
      } catch (error) {
        await dumpResponseOnFailure('LOY_TC-007-import', importBody, error);
      }
    });
  });
});
