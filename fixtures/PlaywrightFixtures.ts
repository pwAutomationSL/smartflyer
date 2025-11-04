import { test as base } from "@playwright/test";

// NO ALIASES – use relative imports
import { CommonActions } from "../page-objects/common/CommonActions";
import { LoginPage } from "../page-objects/pages/LoginPage";

export interface PlaywrightFixtures {
  commonActions: CommonActions;
  loginPage: LoginPage;
}

export const test = base.extend<PlaywrightFixtures>({
  commonActions: async ({ page }, use) => {
    await use(new CommonActions({ page }));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage({ page }));
  },
});

export const expect = base.expect;
