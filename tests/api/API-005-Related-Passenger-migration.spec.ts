import { readFileSync } from 'node:fs';
import path from 'node:path';

import type { APIRequestContext } from '@playwright/test';

import { test, expect } from '../../fixtures/PlaywrightFixtures';

const env = process.env.ENVIRONMENT ?? 'qa2';
const API_BASE_URL = `https://api.${env}.smartflyer.com/api`;
const LOGIN_URL = `${API_BASE_URL}/login`;
const CLIENT_SCAN_LIMIT = 150;

type LoginResponse = {
  data: {
    token: string;
  };
};

type RelatedPassenger = Record<string, unknown> & {
  id?: number;
  client_id?: number;
};

type RelatedPassengersResponse = {
  success?: boolean;
  message?: string;
  data?: RelatedPassenger[];
};

type ConnectedChain = {
  primaryClientId: number;
  relatedClientId: number;
  allClientIds: number[];
  primaryResponse: RelatedPassengersResponse;
  relatedResponse: RelatedPassengersResponse;
};

type OldRelatedPassenger = {
  relatedId: number;
  relatedFirstName: string;
  relatedLastName: string;
  relatedEmail: string;
  relatedRelationship: string;
};

type OldRelationshipRow = {
  primaryId: number;
  primaryFirstName: string;
  primaryLastName: string;
  primaryClientId: number;
  relatedPassengers: OldRelatedPassenger[];
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getClientId = (passenger: RelatedPassenger) => {
  if (typeof passenger.id === 'number') {
    return passenger.id;
  }

  if (typeof passenger.client_id === 'number') {
    return passenger.client_id;
  }

  return undefined;
};

const getPassengerList = (response: RelatedPassengersResponse) => {
  return Array.isArray(response.data) ? response.data : [];
};

const getAllIds = (clientId: number, response: RelatedPassengersResponse) => {
  const passengerIds = getPassengerList(response)
    .map(getClientId)
    .filter((id): id is number => id !== undefined);

  return [...new Set([clientId, ...passengerIds])].sort((a, b) => a - b);
};

const login = async (request: APIRequestContext) => {
  const response = await request.post(LOGIN_URL, {
    data: {
      email: 'rodrigo.santone@scrumlaunch.com',
      password: 'Testing33!',
    },
  });

  expect(response.status()).toBe(200);

  const body = (await response.json()) as LoginResponse;
  return `Bearer ${body.data.token}`;
};

const getRelatedPassengers = async (
  request: APIRequestContext,
  token: string,
  clientId: number,
) => {
  const response = await request.get(
    `${API_BASE_URL}/client-details/${clientId}/related-passengers`,
    {
      headers: {
        Accept: 'application/json',
        Authorization: token,
      },
    },
  );

  expect(response.status()).toBe(200);

  const body = (await response.json()) as RelatedPassengersResponse;

  expect(body.success).toBeTruthy();
  expect(typeof body.message).toBe('string');
  expect(Array.isArray(body.data)).toBeTruthy();

  return body;
};

const findConnectedChain = async (request: APIRequestContext, token: string) => {
  for (let primaryClientId = 1; primaryClientId <= CLIENT_SCAN_LIMIT; primaryClientId += 1) {
    const primaryResponse = await getRelatedPassengers(request, token, primaryClientId);
    const primaryPassengers = getPassengerList(primaryResponse);
    const allClientIds = getAllIds(primaryClientId, primaryResponse);

    if (allClientIds.length < 3) {
      continue;
    }

    for (const passenger of primaryPassengers) {
      const relatedClientId = getClientId(passenger);

      if (!relatedClientId) {
        continue;
      }

      const relatedResponse = await getRelatedPassengers(request, token, relatedClientId);
      const relatedIds = getAllIds(relatedClientId, relatedResponse);

      if (JSON.stringify(allClientIds) === JSON.stringify(relatedIds)) {
        return {
          primaryClientId,
          relatedClientId,
          allClientIds,
          primaryResponse,
          relatedResponse,
        } satisfies ConnectedChain;
      }
    }
  }

  throw new Error(`No connected relationship chain was found in ids 1-${CLIENT_SCAN_LIMIT}.`);
};

const oldRelationships = JSON.parse(
  readFileSync(
    path.resolve(process.cwd(), 'data/api/primary_related_client_relationships.json'),
    'utf8',
  ),
) as OldRelationshipRow[];

test.skip('API-005 - Related Passenger Migration', () => {
  let token = '';
  let chain: ConnectedChain;

  test.beforeAll(async ({ request }) => {
    token = await login(request);
    chain = await findConnectedChain(request, token);
  });

  test('REL_MIG_TC-001 - endpoint returns related passengers with required aviation fields', async ({}) => {
    const passengers = getPassengerList(chain.primaryResponse);

    expect(passengers.length).toBeGreaterThan(0);

    for (const passenger of passengers) {
      expect(passenger).toHaveProperty('class_preferences');
      expect(passenger).toHaveProperty('preferred_private_aviation_company');
      expect(passenger).toHaveProperty('fly_private_aviation');
    }
  });

  test('REL_MIG_TC-002 - endpoint uses the new relationship table as source of truth', async ({}) => {
    const primaryIds = getAllIds(chain.primaryClientId, chain.primaryResponse);
    const relatedIds = getAllIds(chain.relatedClientId, chain.relatedResponse);

    expect(primaryIds).toEqual(chain.allClientIds);
    expect(relatedIds).toEqual(chain.allClientIds);
  });

  test('REL_MIG_TC-003 - primary client returns the full connected relationship chain', async ({}) => {
    const returnedIds = getAllIds(chain.primaryClientId, chain.primaryResponse).filter(
      (id) => id !== chain.primaryClientId,
    );
    const expectedIds = chain.allClientIds.filter((id) => id !== chain.primaryClientId);

    expect(chain.allClientIds.length).toBeGreaterThanOrEqual(3);
    expect(returnedIds).toEqual(expectedIds);
  });

  test('REL_MIG_TC-004 - related client also returns the full connected relationship chain', async ({}) => {
    const returnedIds = getAllIds(chain.relatedClientId, chain.relatedResponse).filter(
      (id) => id !== chain.relatedClientId,
    );
    const expectedIds = chain.allClientIds.filter((id) => id !== chain.relatedClientId);

    expect(chain.allClientIds.length).toBeGreaterThanOrEqual(3);
    expect(returnedIds).toEqual(expectedIds);
  });

  test('REL_MIG_TC-005 - response uses consistent ClientDTO data structure', async ({}) => {
    const passengers = [
      ...getPassengerList(chain.primaryResponse),
      ...getPassengerList(chain.relatedResponse),
    ];

    expect(passengers.length).toBeGreaterThan(0);

    const expectedKeys = Object.keys(passengers[0]).sort();
    expect(expectedKeys).toContain('id');
    expect(expectedKeys).toContain('class_preferences');
    expect(expectedKeys).toContain('preferred_private_aviation_company');
    expect(expectedKeys).toContain('fly_private_aviation');

    for (const passenger of passengers) {
      expect(Object.keys(passenger).sort()).toEqual(expectedKeys);
    }
  });

  test('REL_MIG_TC-006 - migrated endpoint keeps previous DB relations and adds new fields', async ({
    request,
  }) => {
    const token = await login(request);

    const failures: Array<{
      primaryId: number;
      issue: string;
      expected?: unknown;
      actual?: unknown;
    }> = [];

    for (const row of oldRelationships) {
      const primaryId = row.primaryId;
      await sleep(900);
      const apiResponse = await request.get(
        `${API_BASE_URL}/client-details/${primaryId}/related-passengers`,
        {
          headers: {
            Accept: 'application/json',
            Authorization: token,
          },
        },
      );

      let response: RelatedPassengersResponse = {};

      try {
        response = (await apiResponse.json()) as RelatedPassengersResponse;
      } catch {
        response = {};
      }

      if (apiResponse.status() !== 200) {
        failures.push({
          primaryId,
          issue: 'Primary client from previous DB snapshot is not available in migrated endpoint',
          expected: 200,
          actual: apiResponse.status(),
        });
        continue;
      }

      const passengers = getPassengerList(response);
      const passengerIds = passengers
        .map(getClientId)
        .filter((id): id is number => id !== undefined);

      for (const oldPassenger of row.relatedPassengers) {
        const matchedPassenger = passengers.find(
          (passenger) => getClientId(passenger) === oldPassenger.relatedId,
        );

        if (!matchedPassenger) {
          failures.push({
            primaryId,
            issue: 'Missing related client from previous DB data',
            expected: oldPassenger.relatedId,
            actual: passengerIds,
          });
          continue;
        }

        if (!Object.prototype.hasOwnProperty.call(matchedPassenger, 'class_preferences')) {
          failures.push({
            primaryId,
            issue: 'Missing class_preferences in migrated response',
            expected: oldPassenger.relatedId,
            actual: matchedPassenger,
          });
        }

        if (
          !Object.prototype.hasOwnProperty.call(
            matchedPassenger,
            'preferred_private_aviation_company',
          )
        ) {
          failures.push({
            primaryId,
            issue: 'Missing preferred_private_aviation_company in migrated response',
            expected: oldPassenger.relatedId,
            actual: matchedPassenger,
          });
        }

        if (!Object.prototype.hasOwnProperty.call(matchedPassenger, 'fly_private_aviation')) {
          failures.push({
            primaryId,
            issue: 'Missing fly_private_aviation in migrated response',
            expected: oldPassenger.relatedId,
            actual: matchedPassenger,
          });
        }
      }
    }

    if (failures.length > 0) {
      console.error('REL_MIG_TC-006 mismatches');
      console.error(JSON.stringify(failures, null, 2));
      await test.info().attach('REL_MIG_TC-006-mismatches.json', {
        body: JSON.stringify(failures, null, 2),
        contentType: 'application/json',
      });
    }

    expect(failures).toEqual([]);
  });
});
