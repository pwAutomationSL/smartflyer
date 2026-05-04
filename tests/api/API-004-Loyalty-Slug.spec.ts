import type { APIRequestContext } from '@playwright/test';

import { test, expect } from '../../fixtures/PlaywrightFixtures';
import { USERS } from '../../fixtures/users';

const env = process.env.ENVIRONMENT ?? 'qa2';

const API_BASE_URL = `https://api.${env}.smartflyer.com/api`;
const LOGIN_URL = `${API_BASE_URL}/login`;
const LOYALTY_PROGRAM_SLUG_URL = `${API_BASE_URL}/loyalty-programs/slug`;

const EXPECTED_LOYALTY_PROGRAMS = [
  {
    title: 'American Airlines: AAdvantage',
    slug: 'AA',
  },
  {
    title: 'Delta: SkyMiles',
    slug: 'SKYMILES',
  },
  {
    title: 'Accor: ALL',
    slug: 'ACCOR',
  },
  {
    title: 'Air Canada: Aeroplan',
    slug: 'AEROPLAN',
  },
  {
    title: 'Alaska Airlines: Mileage Plan',
    slug: 'ALASKA',
  },
  {
    title: 'British Airways: Executive Club',
    slug: 'BA',
  },
  {
    title: 'Hilton Honors',
    slug: 'HILTON',
  },
  {
    title: 'Hyatt: World of Hyatt',
    slug: 'HYATT',
  },
  {
    title: 'IHG Rewards Club',
    slug: 'IHG',
  },
  {
    title: 'Marriott Bonvoy',
    slug: 'BONVOY',
  },
  {
    title: 'Qatar Airways: Privilege Club',
    slug: 'PRIVILEGE_CLUB',
  },
  {
    title: 'United: MileagePlus',
    slug: 'MILEAGEPLUS',
  },
  {
    title: 'Virgin Atlantic: Flying Club',
    slug: 'VIRGIN_ATLANTIC',
  },
  {
    title: 'Wyndham Rewards',
    slug: 'WYNDHAM',
  },
] as const;

type LoginResponse = {
  data: {
    token: string;
  };
};

type LoyaltyProgramSlug = {
  title: string;
  slug: string;
};

type LoyaltyProgramSlugResponse = {
  success: boolean;
  message: string;
  data: LoyaltyProgramSlug[];
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

const loginAndGetAuthorizationHeader = async (request: APIRequestContext): Promise<string> => {
  const loginResponse = await request.post(LOGIN_URL, {
    data: {
      email: USERS.ADMIN_MAIN.username,
      password: USERS.ADMIN_MAIN.password,
    },
  });

  expect(loginResponse.status()).toBe(200);

  const loginBody = (await loginResponse.json()) as LoginResponse;

  try {
    expect(loginBody.data.token.startsWith('ey')).toBeTruthy();
    return `Bearer ${loginBody.data.token}`;
  } catch (error) {
    await dumpResponseOnFailure('LOY_SLUG-login', loginBody, error);
  }

  throw new Error('Unable to get authorization header');
};

const getLoyaltyPrograms = async (
  request: APIRequestContext,
  authorizationHeader: string,
): Promise<{ status: number; body: LoyaltyProgramSlugResponse }> => {
  const response = await request.get(LOYALTY_PROGRAM_SLUG_URL, {
    headers: {
      Accept: 'application/json',
      Authorization: authorizationHeader,
    },
  });

  if (!response.ok()) {
    const errorPayload = {
      status: response.status(),
      statusText: response.statusText(),
      body: await response.text(),
    };

    try {
      expect(response.ok()).toBeTruthy();
    } catch (error) {
      await dumpResponseOnFailure('LOY_SLUG-get', errorPayload, error);
    }
  }

  const responseBody = (await response.json()) as LoyaltyProgramSlugResponse;

  return {
    status: response.status(),
    body: responseBody,
  };
};

test.describe('API-004 - Loyalty Program Slug', () => {
  let authorizationHeader = '';

  test.beforeAll(async ({ request }) => {
    authorizationHeader = await loginAndGetAuthorizationHeader(request);
  });

  test('LOY_SLUG_TC-001 - endpoint returns successful response', async ({ request }) => {
    await test.step('1 - Login and request loyalty program slugs', async () => {
      const response = await getLoyaltyPrograms(request, authorizationHeader);

      expect(response.status).toBe(200);
    });
  });

  test('LOY_SLUG_TC-002 - response returns loyalty programs as a list', async ({ request }) => {
    await test.step('1 - Request loyalty program slugs and validate response array', async () => {
      const response = await getLoyaltyPrograms(request, authorizationHeader);

      try {
        expect(typeof response.body).toBe('object');
        expect(response.body).not.toBeNull();
        expect(response.body.success).toBeTruthy();
        expect(typeof response.body.message).toBe('string');
        expect(response.body.message.trim().length).toBeGreaterThan(0);
        expect(Object.keys(response.body)).toContain('data');
        expect(Array.isArray(response.body.data)).toBeTruthy();
        expect(response.body.data.length).toBeGreaterThan(0);
      } catch (error) {
        await dumpResponseOnFailure('LOY_SLUG_TC-002-response', response.body, error);
      }
    });
  });

  test('LOY_SLUG_TC-003 - each object contains only title and slug', async ({ request }) => {
    await test.step('1 - Request loyalty program slugs and validate object shape', async () => {
      const response = await getLoyaltyPrograms(request, authorizationHeader);

      try {
        expect(Object.keys(response.body).sort()).toEqual(['data', 'message', 'success']);

        for (const program of response.body.data) {
          expect(Object.keys(program).sort()).toEqual(['slug', 'title']);
          expect(typeof program.title).toBe('string');
          expect(program.title.trim().length).toBeGreaterThan(0);
          expect(typeof program.slug).toBe('string');
          expect(program.slug.trim().length).toBeGreaterThan(0);
        }
      } catch (error) {
        await dumpResponseOnFailure('LOY_SLUG_TC-003-response', response.body, error);
      }
    });
  });

  test('LOY_SLUG_TC-004 - slug values are correct', async ({ request }) => {
    await test.step('1 - Request loyalty program slugs and validate known slug mappings', async () => {
      const response = await getLoyaltyPrograms(request, authorizationHeader);

      try {
        const programsBySlug = new Map(
          response.body.data.map((program) => [program.slug, program.title]),
        );

        for (const expectedProgram of EXPECTED_LOYALTY_PROGRAMS) {
          expect(programsBySlug.get(expectedProgram.slug)).toBe(expectedProgram.title);
        }
      } catch (error) {
        await dumpResponseOnFailure('LOY_SLUG_TC-004-response', response.body, error);
      }
    });
  });

  test('LOY_SLUG_TC-005 - all known loyalty programs with slugs are returned', async ({
    request,
  }) => {
    await test.step('1 - Request loyalty program slugs and validate expected programs are included', async () => {
      const response = await getLoyaltyPrograms(request, authorizationHeader);

      try {
        for (const expectedProgram of EXPECTED_LOYALTY_PROGRAMS) {
          expect(response.body.data).toContainEqual(expectedProgram);
        }
      } catch (error) {
        await dumpResponseOnFailure('LOY_SLUG_TC-005-response', response.body, error);
      }
    });
  });
});
