import { createReadStream, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { expect, type APIRequestContext } from '@playwright/test';

type Credentials = {
  username: string;
  password: string;
};

type LoginResponse = {
  data?: {
    token?: string;
  };
};

type MediaUploadResponse = {
  data?: Array<{
    uuid?: string;
  }>;
};

type ImportResponse = {
  status?: string;
  data?: {
    valid_count?: number | string;
  };
};

export const importPrimaryClient = async (
  request: APIRequestContext,
  credentials: Credentials,
  lastName: string,
  email: string,
) => {
  const env = process.env.ENVIRONMENT ?? 'stage';
  const apiBaseUrl = `https://api.${env}.smartflyer.com/api`;
  const loginResponse = await request.post(`${apiBaseUrl}/login`, {
    data: {
      email: credentials.username,
      password: credentials.password,
    },
  });
  expect(loginResponse.status()).toBe(200);

  const loginBody = (await loginResponse.json()) as LoginResponse;
  const token = loginBody.data?.token;
  expect(token).toBeTruthy();

  const tempDirectory = mkdtempSync(path.join(os.tmpdir(), 'primary-client-import-'));
  const csvPath = path.join(tempDirectory, 'client.csv');

  try {
    writeFileSync(
      csvPath,
      `first_name,last_name,email,agent_id,agency_id\nFirstName,${lastName},${email},1,1\n`,
    );

    const mediaResponse = await request.post(`${apiBaseUrl}/media`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        'X-Upload-Context': 'GENERAL',
      },
      multipart: {
        'files[]': createReadStream(csvPath),
      },
    });
    expect(mediaResponse.ok()).toBeTruthy();

    const mediaBody = (await mediaResponse.json()) as MediaUploadResponse;
    const mediaUuid = mediaBody.data?.[0]?.uuid;
    expect(mediaUuid).toBeTruthy();

    const importResponse = await request.post(`${apiBaseUrl}/clients/import/primary`, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: {
        media_uuid: mediaUuid,
      },
    });
    expect(importResponse.ok()).toBeTruthy();

    const importBody = (await importResponse.json()) as ImportResponse;
    expect(importBody.status).toBe('success');
    expect(Number(importBody.data?.valid_count)).toBe(1);
  } finally {
    rmSync(tempDirectory, { recursive: true, force: true });
  }
};
