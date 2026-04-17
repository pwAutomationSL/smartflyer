import { defineConfig, devices } from '@playwright/test';
import { USERS } from './fixtures/users';
import type { MyOptions } from './fixtures/PlaywrightFixtures';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const chromiumBase = {
  actionTimeout: 10_000,
  launchOptions: {
    slowMo: 380,
  },
  ...devices['Desktop Chrome'],
  viewport: { width: 1280, height: 800 },
};
export default defineConfig<MyOptions>({
  timeout: 120_000,
  expect: {
    timeout: 15_000,
  },
  testDir: './tests',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 1,
  reporter: [['allure-playwright']],
  use: {
    baseURL: 'https://crm.test.smartflyer.com/',
    trace: 'off',
    timezoneId: 'America/New_York',
    screenshot: 'only-on-failure',
  },
  fullyParallel: false,
  workers: 1,
  projects: [
    {
      name: 'chromium-air-request',
      testDir: './tests/regression/AirRequest',
      use: {
        ...chromiumBase,
        username: USERS.ADMIN_MAIN.username,
        password: USERS.ADMIN_MAIN.password,
      },
    },
    {
      name: 'chromium-client',
      testMatch: ['**/tests/regression/Client/**/*.spec.ts'],
      use: {
        ...chromiumBase,
        username: USERS.ADMIN_SECONDARY.username,
        password: USERS.ADMIN_SECONDARY.password,
      },
    },
    {
      name: 'chromium-FAQs-GlobalSearch-PartnerForm',
      testMatch: [
        // '**/tests/regression/Gallery/**/*.spec.ts',
        // '**/tests/regression/GlobalSearch/**/*.spec.ts',
        // '**/tests/regression/PartnerForm/**/*.spec.ts',
        // '**/tests/regression/FAQs/**/*.spec.ts',
        '**/tests/api/**/*.spec.ts',
      ],
      use: {
        ...chromiumBase,
        username: USERS.ADMIN_TERTIARY.username,
        password: USERS.ADMIN_TERTIARY.password,
      },
    },
    {
      name: 'chromium-RolesAndPermissions-Trainings-Toolkit-Tasks-SV-1-Bugs-Login',
      testMatch: [
        '**/tests/regression/RolesAndPermissions/**/*.spec.ts',
        '**/tests/regression/Trainings/**/*.spec.ts',
        '**/tests/regression/Toolkit/**/*.spec.ts',
        '**/tests/regression/Tasks/**/*.spec.ts',
        '**/tests/regression/SV-1-Bugs/**/*.spec.ts',
        '**/tests/regression/Login/**/*.spec.ts',
      ],
      use: {
        ...chromiumBase,
        username: USERS.ADMIN_FOURTH.username,
        password: USERS.ADMIN_FOURTH.password,
      },
    },
  ],
});
