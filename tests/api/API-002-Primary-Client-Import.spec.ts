import { createReadStream, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { test, expect } from '../../fixtures/PlaywrightFixtures';
import { uniqueId } from '../../page-objects';

const env = process.env.ENVIRONMENT ?? 'qa2';

const API_BASE_URL = `https://api.${env}.smartflyer.com/api`;
const LOGIN_URL = `${API_BASE_URL}/login`;
const MEDIA_URL = `${API_BASE_URL}/media`;
const IMPORT_PRIMARY_URL = `${API_BASE_URL}/clients/import/primary`;

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
  message?: string;
  data?: {
    valid: unknown[] | string;
    invalid:
      | Array<{
          row: number;
          errors: Record<string, string[]>;
        }>
      | string;
    valid_count?: number | string;
    invalid_count?: number | string;
  };
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

const getNumericCount = (value: number | string | undefined): number | undefined => {
  if (value === undefined) {
    return undefined;
  }

  return Number(value);
};

const createCsvWithUniqueEmails = (fileName: string): string => {
  const sourcePath = path.resolve(process.cwd(), 'data/api', fileName);
  const tempDir = mkdtempSync(path.join(os.tmpdir(), 'primary-client-import-'));
  const tempFilePath = path.join(tempDir, fileName);
  const unique = uniqueId();
  const fileContent = readFileSync(sourcePath, 'utf8');
  const updatedContent = fileContent.replace(
    /([a-z]+)\.primary(\d+)@example\.com/gi,
    (_match, name: string) => `${name}.primary${unique}@example.com`,
  );

  writeFileSync(tempFilePath, updatedContent, 'utf8');

  return tempFilePath;
};

test.describe('API-001 - Primary Client Import', () => {
  test('PRI_TC-001 - one valid row', async ({ request }) => {
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
      try {
        expect(loginBody.data.token.startsWith('ey')).toBeTruthy();
        authorizationHeader = `Bearer ${loginBody.data.token}`;
      } catch (error) {
        await dumpResponseOnFailure('PRI_TC-001-login', loginBody, error);
      }
    });

    await test.step('2 - Upload PRI_TC-001_valid_one_row.csv and get media uuid', async () => {
      const filePath = createCsvWithUniqueEmails('PRI_TC-001_valid_one_row.csv');
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
      try {
        expect(uploadBody.success).toBeTruthy();
        expect(uploadBody.data[0].uuid).toBeTruthy();
        mediaUuid = uploadBody.data[0].uuid;
      } catch (error) {
        await dumpResponseOnFailure('PRI_TC-001-upload', uploadBody, error);
      }
    });

    await test.step('3 - Import primary clients and validate success counts', async () => {
      const importResponse = await request.post(IMPORT_PRIMARY_URL, {
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
      try {
        expect(importBody.status).toBe('success');
        expect(importBody.message).toBe('Client import processed');
        expect(getNumericCount(importBody.data?.valid_count)).toBe(1);
        expect(getNumericCount(importBody.data?.invalid_count)).toBe(0);
      } catch (error) {
        await dumpResponseOnFailure('PRI_TC-001-import', importBody, error);
      }
    });
  });

  test('PRI_TC-002 - multiple valid rows', async ({ request }) => {
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
      try {
        expect(loginBody.data.token.startsWith('ey')).toBeTruthy();
        authorizationHeader = `Bearer ${loginBody.data.token}`;
      } catch (error) {
        await dumpResponseOnFailure('PRI_TC-002-login', loginBody, error);
      }
    });

    await test.step('2 - Upload PRI_TC-002_valid_multiple_rows.csv and get media uuid', async () => {
      const filePath = createCsvWithUniqueEmails('PRI_TC-002_valid_multiple_rows.csv');
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
      try {
        expect(uploadBody.success).toBeTruthy();
        expect(uploadBody.data[0].uuid).toBeTruthy();
        mediaUuid = uploadBody.data[0].uuid;
      } catch (error) {
        await dumpResponseOnFailure('PRI_TC-002-upload', uploadBody, error);
      }
    });

    await test.step('3 - Import primary clients and validate success counts', async () => {
      const importResponse = await request.post(IMPORT_PRIMARY_URL, {
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
      try {
        expect(importBody.status).toBe('success');
        expect(importBody.message).toBe('Client import processed');
        expect(getNumericCount(importBody.data?.valid_count)).toBe(3);
        expect(getNumericCount(importBody.data?.invalid_count)).toBe(0);
      } catch (error) {
        await dumpResponseOnFailure('PRI_TC-002-import', importBody, error);
      }
    });
  });

  test('PRI_TC-003 - missing first_name', async ({ request }) => {
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
      try {
        expect(loginBody.data.token.startsWith('ey')).toBeTruthy();
        authorizationHeader = `Bearer ${loginBody.data.token}`;
      } catch (error) {
        await dumpResponseOnFailure('PRI_TC-003-login', loginBody, error);
      }
    });

    await test.step('2 - Upload PRI_TC-003_missing_client_first_name.csv and get media uuid', async () => {
      const uploadResponse = await request.post(MEDIA_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
          'X-Upload-Context': 'GENERAL',
        },
        multipart: {
          'files[]': createReadStream(
            path.resolve(process.cwd(), 'data/api/PRI_TC-003_missing_client_first_name.csv'),
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
        await dumpResponseOnFailure('PRI_TC-003-upload', uploadBody, error);
      }
    });

    await test.step('3 - Import primary clients and validate missing first_name error', async () => {
      const importResponse = await request.post(IMPORT_PRIMARY_URL, {
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
      try {
        expect(getNumericCount(importBody.data?.invalid_count)).toBe(1);
        expect(
          Array.isArray(importBody.data?.invalid)
            ? importBody.data.invalid[0].errors.first_name
            : [],
        ).toContain('The first name field is required.');
      } catch (error) {
        await dumpResponseOnFailure('PRI_TC-003-import', importBody, error);
      }
    });
  });

  test('PRI_TC-004 - missing last_name', async ({ request }) => {
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
      try {
        expect(loginBody.data.token.startsWith('ey')).toBeTruthy();
        authorizationHeader = `Bearer ${loginBody.data.token}`;
      } catch (error) {
        await dumpResponseOnFailure('PRI_TC-004-login', loginBody, error);
      }
    });

    await test.step('2 - Upload PRI_TC-004_missing_client_last_name.csv and get media uuid', async () => {
      const uploadResponse = await request.post(MEDIA_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
          'X-Upload-Context': 'GENERAL',
        },
        multipart: {
          'files[]': createReadStream(
            path.resolve(process.cwd(), 'data/api/PRI_TC-004_missing_client_last_name.csv'),
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
        await dumpResponseOnFailure('PRI_TC-004-upload', uploadBody, error);
      }
    });

    await test.step('3 - Import primary clients and validate missing last_name error', async () => {
      const importResponse = await request.post(IMPORT_PRIMARY_URL, {
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
      try {
        expect(getNumericCount(importBody.data?.invalid_count)).toBe(1);
        expect(
          Array.isArray(importBody.data?.invalid)
            ? importBody.data.invalid[0].errors.last_name
            : [],
        ).toContain('The last name field is required.');
      } catch (error) {
        await dumpResponseOnFailure('PRI_TC-004-import', importBody, error);
      }
    });
  });

  test('PRI_TC-005 - missing email', async ({ request }) => {
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
      try {
        expect(loginBody.data.token.startsWith('ey')).toBeTruthy();
        authorizationHeader = `Bearer ${loginBody.data.token}`;
      } catch (error) {
        await dumpResponseOnFailure('PRI_TC-005-login', loginBody, error);
      }
    });

    await test.step('2 - Upload PRI_TC-005_missing_email.csv and get media uuid', async () => {
      const uploadResponse = await request.post(MEDIA_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
          'X-Upload-Context': 'GENERAL',
        },
        multipart: {
          'files[]': createReadStream(
            path.resolve(process.cwd(), 'data/api/PRI_TC-005_missing_email.csv'),
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
        await dumpResponseOnFailure('PRI_TC-005-upload', uploadBody, error);
      }
    });

    await test.step('3 - Import primary clients and validate missing email error', async () => {
      const importResponse = await request.post(IMPORT_PRIMARY_URL, {
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
      try {
        expect(getNumericCount(importBody.data?.invalid_count)).toBe(1);
        expect(
          Array.isArray(importBody.data?.invalid) ? importBody.data.invalid[0].errors.email : [],
        ).toContain('The email field is required.');
      } catch (error) {
        await dumpResponseOnFailure('PRI_TC-005-import', importBody, error);
      }
    });
  });

  test('PRI_TC-006 - missing agent_id', async ({ request }) => {
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
      try {
        expect(loginBody.data.token.startsWith('ey')).toBeTruthy();
        authorizationHeader = `Bearer ${loginBody.data.token}`;
      } catch (error) {
        await dumpResponseOnFailure('PRI_TC-006-login', loginBody, error);
      }
    });

    await test.step('2 - Upload PRI_TC-006_missing_agent_id.csv and get media uuid', async () => {
      const uploadResponse = await request.post(MEDIA_URL, {
        headers: {
          Accept: 'application/json',
          Authorization: authorizationHeader,
          'X-Upload-Context': 'GENERAL',
        },
        multipart: {
          'files[]': createReadStream(
            path.resolve(process.cwd(), 'data/api/PRI_TC-006_missing_agent_id.csv'),
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
        await dumpResponseOnFailure('PRI_TC-006-upload', uploadBody, error);
      }
    });

    await test.step('3 - Import primary clients and validate missing agent_id error', async () => {
      const importResponse = await request.post(IMPORT_PRIMARY_URL, {
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
      try {
        expect(getNumericCount(importBody.data?.invalid_count)).toBe(1);
        expect(
          Array.isArray(importBody.data?.invalid) ? importBody.data.invalid[0].errors.agent_id : [],
        ).toContain('The agent id field is required.');
      } catch (error) {
        await dumpResponseOnFailure('PRI_TC-006-import', importBody, error);
      }
    });
  });

  test('PRI_TC-007 - mixed valid + invalid rows', async ({ request }) => {
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
      try {
        expect(loginBody.data.token.startsWith('ey')).toBeTruthy();
        authorizationHeader = `Bearer ${loginBody.data.token}`;
      } catch (error) {
        await dumpResponseOnFailure('PRI_TC-007-login', loginBody, error);
      }
    });

    await test.step('2 - Upload PRI_TC-007_mixed_invalid_valid.csv and get media uuid', async () => {
      const filePath = createCsvWithUniqueEmails('PRI_TC-007_mixed_invalid_valid.csv');
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
      try {
        expect(uploadBody.success).toBeTruthy();
        expect(uploadBody.data[0].uuid).toBeTruthy();
        mediaUuid = uploadBody.data[0].uuid;
      } catch (error) {
        await dumpResponseOnFailure('PRI_TC-007-upload', uploadBody, error);
      }
      const importResponse = await request.post(IMPORT_PRIMARY_URL, {
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
      try {
        expect(importBody.status).toBe('success');
        expect(importBody.message).toBe('Client import processed');
        expect(getNumericCount(importBody.data?.valid_count)).toBe(2);
        expect(getNumericCount(importBody.data?.invalid_count)).toBe(2);
      } catch (error) {
        await dumpResponseOnFailure('PRI_TC-007-import', importBody, error);
      }
    });
  });
});
