import { createReadStream, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { test, expect } from '../../fixtures/PlaywrightFixtures';
import { uniqueId } from '../../page-objects';

const env = process.env.ENVIRONMENT ?? 'qa2';

const API_BASE_URL = `https://api.${env}.smartflyer.com/api`;
const LOGIN_URL = `${API_BASE_URL}/login`;
const MEDIA_URL = `${API_BASE_URL}/media`;
const IMPORT_RELATED_URL = `${API_BASE_URL}/clients/import/related`;

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

type ImportResponse = {
  status?: string;
  valid_count?: number;
  invalid_count?: number;
  data?: {
    valid: unknown[];
    invalid: Array<{
      row: number;
      errors: Record<string, string[]>;
    }>;
    valid_count?: number;
    invalid_count?: number;
  };
};

const createCsvWithUniqueEmails = (fileName: string): string => {
  const sourcePath = path.resolve(process.cwd(), 'data/api', fileName);
  const tempDir = mkdtempSync(path.join(os.tmpdir(), 'related-passenger-import-'));
  const tempFilePath = path.join(tempDir, fileName);
  const unique = uniqueId();
  const fileContent = readFileSync(sourcePath, 'utf8');
  const updatedContent = fileContent.replace(
    /([a-z]+)\.test(\d+)@example\.com/gi,
    (_match, name: string) => `${name}.test${unique}@example.com`,
  );

  writeFileSync(tempFilePath, updatedContent, 'utf8');

  return tempFilePath;
};

test.describe('API-001 - Related Passenger Import', () => {
  test('TC-001 - valid one row', async ({ request }) => {
    let authorizationHeader = '';
    let mediaUuid = '';

    await test.step('1 - Login and get token', async () => {
      const loginResponse = await request.post(LOGIN_URL, {
        data: {
          email: 'rodrigo.santone@scrumlaunch.com',
          password: 'Testing33!',
        },
      });

      expect(loginResponse.status()).toBe(200);

      const loginBody = (await loginResponse.json()) as LoginResponse;
      expect(loginBody.data.token.startsWith('ey')).toBeTruthy();
      authorizationHeader = `Bearer ${loginBody.data.token}`;
    });

    await test.step('2 - Upload TC-001_valid_one_row.csv and get media uuid', async () => {
      const filePath = createCsvWithUniqueEmails('TC-001_valid_one_row.csv');
      const uploadResponse = await request.post(MEDIA_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
          'X-Upload-Context': 'GENERAL',
        },
        multipart: {
          'files[]': createReadStream(filePath),
        },
      });

      expect(uploadResponse.ok()).toBeTruthy();

      const uploadBody = (await uploadResponse.json()) as MediaUploadResponse;
      expect(uploadBody.success).toBeTruthy();
      expect(uploadBody.data[0].uuid).toBeTruthy();
      mediaUuid = uploadBody.data[0].uuid;
      const importResponse = await request.post(IMPORT_RELATED_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
        },
        data: {
          media_uuid: mediaUuid,
        },
      });

      expect(importResponse.ok()).toBeTruthy();

      const importBody = (await importResponse.json()) as ImportResponse;
      expect(importBody.status).toBe('success');
      expect(importBody.valid_count ?? importBody.data?.valid_count).toBe(1);
      expect(importBody.invalid_count ?? importBody.data?.invalid_count).toBe(0);
    });
  });

  test('TC-002 - valid multiple rows', async ({ request }) => {
    let authorizationHeader = '';
    let mediaUuid = '';

    await test.step('1 - Login and get token', async () => {
      const loginResponse = await request.post(LOGIN_URL, {
        data: {
          email: 'rodrigo.santone@scrumlaunch.com',
          password: 'Testing33!',
        },
      });

      expect(loginResponse.status()).toBe(200);

      const loginBody = (await loginResponse.json()) as LoginResponse;
      expect(loginBody.data.token.startsWith('ey')).toBeTruthy();
      authorizationHeader = `Bearer ${loginBody.data.token}`;
    });

    await test.step('2 - Upload TC-002_valid_multiple_rows.csv and get media uuid', async () => {
      const filePath = createCsvWithUniqueEmails('TC-002_valid_multiple_rows.csv');
      const uploadResponse = await request.post(MEDIA_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
          'X-Upload-Context': 'GENERAL',
        },
        multipart: {
          'files[]': createReadStream(filePath),
        },
      });

      expect(uploadResponse.ok()).toBeTruthy();

      const uploadBody = (await uploadResponse.json()) as MediaUploadResponse;
      expect(uploadBody.success).toBeTruthy();
      expect(uploadBody.data[0].uuid).toBeTruthy();
      mediaUuid = uploadBody.data[0].uuid;
      const importResponse = await request.post(IMPORT_RELATED_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
        },
        data: {
          media_uuid: mediaUuid,
        },
      });

      expect(importResponse.ok()).toBeTruthy();

      const importBody = (await importResponse.json()) as ImportResponse;
      expect(importBody.status).toBe('success');
      expect(importBody.valid_count ?? importBody.data?.valid_count).toBe(3);
      expect(importBody.invalid_count ?? importBody.data?.invalid_count).toBe(0);
    });
  });

  test('TC-003 - missing client identity header', async ({ request }) => {
    let authorizationHeader = '';
    let mediaUuid = '';

    await test.step('1 - Login and get token', async () => {
      const loginResponse = await request.post(LOGIN_URL, {
        data: {
          email: 'rodrigo.santone@scrumlaunch.com',
          password: 'Testing33!',
        },
      });

      expect(loginResponse.status()).toBe(200);

      const loginBody = (await loginResponse.json()) as LoginResponse;
      expect(loginBody.data.token.startsWith('ey')).toBeTruthy();
      authorizationHeader = `Bearer ${loginBody.data.token}`;
    });

    await test.step('2 - Upload TC-003_missing_client_identity_header.csv and get media uuid', async () => {
      const uploadResponse = await request.post(MEDIA_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
          'X-Upload-Context': 'GENERAL',
        },
        multipart: {
          'files[]': createReadStream(
            path.resolve(process.cwd(), 'data/api/TC-003_missing_client_identity_header.csv'),
          ),
        },
      });

      expect(uploadResponse.ok()).toBeTruthy();

      const uploadBody = (await uploadResponse.json()) as MediaUploadResponse;
      expect(uploadBody.success).toBeTruthy();
      expect(uploadBody.data[0].uuid).toBeTruthy();
      mediaUuid = uploadBody.data[0].uuid;
      const importResponse = await request.post(IMPORT_RELATED_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
        },
        data: {
          media_uuid: mediaUuid,
        },
      });

      expect(importResponse.ok()).toBeTruthy();

      const importBody = (await importResponse.json()) as ImportResponse;
      expect(importBody.data?.valid).toEqual([]);
      expect(importBody.data?.invalid[0].row).toBe(2);
      expect(importBody.data?.invalid[0].errors.identity).toContain(
        'The identity field is required.',
      );
      expect(importBody.invalid_count ?? importBody.data?.invalid_count).toBe(1);
    });
  });

  test('TC-004 - missing client relationship header', async ({ request }) => {
    let authorizationHeader = '';
    let mediaUuid = '';

    await test.step('1 - Login and get token', async () => {
      const loginResponse = await request.post(LOGIN_URL, {
        data: {
          email: 'rodrigo.santone@scrumlaunch.com',
          password: 'Testing33!',
        },
      });

      expect(loginResponse.status()).toBe(200);

      const loginBody = (await loginResponse.json()) as LoginResponse;
      expect(loginBody.data.token.startsWith('ey')).toBeTruthy();
      authorizationHeader = `Bearer ${loginBody.data.token}`;
    });

    await test.step('2 - Upload TC-004_missing_client_relationship_header.csv and get media uuid', async () => {
      const uploadResponse = await request.post(MEDIA_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
          'X-Upload-Context': 'GENERAL',
        },
        multipart: {
          'files[]': createReadStream(
            path.resolve(process.cwd(), 'data/api/TC-004_missing_client_relationship_header.csv'),
          ),
        },
      });

      expect(uploadResponse.ok()).toBeTruthy();

      const uploadBody = (await uploadResponse.json()) as MediaUploadResponse;
      expect(uploadBody.success).toBeTruthy();
      expect(uploadBody.data[0].uuid).toBeTruthy();
      mediaUuid = uploadBody.data[0].uuid;
      const importResponse = await request.post(IMPORT_RELATED_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
        },
        data: {
          media_uuid: mediaUuid,
        },
      });

      expect(importResponse.ok()).toBeTruthy();

      const importBody = (await importResponse.json()) as ImportResponse;
      expect(importBody.data?.invalid[0].row).toBe(2);
      expect(importBody.data?.invalid[0].errors.relationship).toContain(
        'The relationship field is required.',
      );
      expect(importBody.invalid_count ?? importBody.data?.invalid_count).toBe(1);
    });
  });

  test('TC-005 - mixed valid and invalid', async ({ request }) => {
    let authorizationHeader = '';
    let mediaUuid = '';

    await test.step('1 - Login and get token', async () => {
      const loginResponse = await request.post(LOGIN_URL, {
        data: {
          email: 'rodrigo.santone@scrumlaunch.com',
          password: 'Testing33!',
        },
      });

      expect(loginResponse.status()).toBe(200);

      const loginBody = (await loginResponse.json()) as LoginResponse;
      expect(loginBody.data.token.startsWith('ey')).toBeTruthy();
      authorizationHeader = `Bearer ${loginBody.data.token}`;
    });

    await test.step('2 - Upload TC-005_mixed_valid_invalid.csv and get media uuid', async () => {
      const filePath = createCsvWithUniqueEmails('TC-005_mixed_valid_invalid.csv');
      const uploadResponse = await request.post(MEDIA_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
          'X-Upload-Context': 'GENERAL',
        },
        multipart: {
          'files[]': createReadStream(filePath),
        },
      });

      expect(uploadResponse.ok()).toBeTruthy();

      const uploadBody = (await uploadResponse.json()) as MediaUploadResponse;
      expect(uploadBody.success).toBeTruthy();
      expect(uploadBody.data[0].uuid).toBeTruthy();
      mediaUuid = uploadBody.data[0].uuid;
      const importResponse = await request.post(IMPORT_RELATED_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
        },
        data: {
          media_uuid: mediaUuid,
        },
      });

      expect(importResponse.ok()).toBeTruthy();

      const importBody = (await importResponse.json()) as ImportResponse;
      expect(importBody.valid_count ?? importBody.data?.valid_count).toBe(1);
      expect(importBody.invalid_count ?? importBody.data?.invalid_count).toBe(1);
    });
  });

  test('TC-006 - invalid email', async ({ request }) => {
    let authorizationHeader = '';
    let mediaUuid = '';

    await test.step('1 - Login and get token', async () => {
      const loginResponse = await request.post(LOGIN_URL, {
        data: {
          email: 'rodrigo.santone@scrumlaunch.com',
          password: 'Testing33!',
        },
      });

      expect(loginResponse.status()).toBe(200);

      const loginBody = (await loginResponse.json()) as LoginResponse;
      expect(loginBody.data.token.startsWith('ey')).toBeTruthy();
      authorizationHeader = `Bearer ${loginBody.data.token}`;
    });

    await test.step('2 - Upload TC-006_row_level_validation_invalid_email.csv and get media uuid', async () => {
      const uploadResponse = await request.post(MEDIA_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
          'X-Upload-Context': 'GENERAL',
        },
        multipart: {
          'files[]': createReadStream(
            path.resolve(process.cwd(), 'data/api/TC-006_row_level_validation_invalid_email.csv'),
          ),
        },
      });

      expect(uploadResponse.ok()).toBeTruthy();

      const uploadBody = (await uploadResponse.json()) as MediaUploadResponse;
      expect(uploadBody.success).toBeTruthy();
      expect(uploadBody.data[0].uuid).toBeTruthy();
      mediaUuid = uploadBody.data[0].uuid;
      const importResponse = await request.post(IMPORT_RELATED_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
        },
        data: {
          media_uuid: mediaUuid,
        },
      });

      expect(importResponse.ok()).toBeTruthy();

      const importBody = (await importResponse.json()) as ImportResponse;
      expect(importBody.data?.invalid[0].row).toBe(2);
      expect(importBody.data?.invalid[0].errors.email).toContain(
        'The email field must be a valid email address.',
      );
      expect(importBody.invalid_count ?? importBody.data?.invalid_count).toBe(1);
    });
  });

  test('TC-007 - invalid data with row errors', async ({ request }) => {
    let authorizationHeader = '';
    let mediaUuid = '';

    await test.step('1 - Login and get token', async () => {
      const loginResponse = await request.post(LOGIN_URL, {
        data: {
          email: 'rodrigo.santone@scrumlaunch.com',
          password: 'Testing33!',
        },
      });

      expect(loginResponse.status()).toBe(200);

      const loginBody = (await loginResponse.json()) as LoginResponse;
      expect(loginBody.data.token.startsWith('ey')).toBeTruthy();
      authorizationHeader = `Bearer ${loginBody.data.token}`;
    });

    await test.step('2 - Upload TC-007_invalid_data_with_row_errors.csv and get media uuid', async () => {
      const uploadResponse = await request.post(MEDIA_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
          'X-Upload-Context': 'GENERAL',
        },
        multipart: {
          'files[]': createReadStream(
            path.resolve(process.cwd(), 'data/api/TC-007_invalid_data_with_row_errors.csv'),
          ),
        },
      });

      expect(uploadResponse.ok()).toBeTruthy();

      const uploadBody = (await uploadResponse.json()) as MediaUploadResponse;
      expect(uploadBody.success).toBeTruthy();
      expect(uploadBody.data[0].uuid).toBeTruthy();
      mediaUuid = uploadBody.data[0].uuid;
      const importResponse = await request.post(IMPORT_RELATED_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
        },
        data: {
          media_uuid: mediaUuid,
        },
      });

      expect(importResponse.ok()).toBeTruthy();

      const importBody = (await importResponse.json()) as ImportResponse;
      expect(importBody.data?.invalid[0].row).toBe(2);
      expect(importBody.data?.invalid[0].errors.first_name).toContain(
        'The first name field is required.',
      );
      expect(importBody.data?.invalid[0].errors.identity).toContain(
        'The identity field is required.',
      );
      expect(importBody.invalid_count ?? importBody.data?.invalid_count).toBe(1);
    });
  });
});
