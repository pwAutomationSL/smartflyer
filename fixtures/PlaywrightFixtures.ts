import { test as base } from "@playwright/test";

import { CommonActions } from "../page-objects/common/CommonActions";
import { SideBar } from "../page-objects/common/components/Sidebar";
import { LoginPage } from "../page-objects/pages/LoginPage";
import { SearchPage } from "../page-objects/pages/SearchPage";

export interface PlaywrightFixtures {
  commonActions: CommonActions;
  loginPage: LoginPage;
  searchPage: SearchPage;
  sidebar: SideBar;
}

export const test = base.extend<PlaywrightFixtures>({
  commonActions: async ({ page }, use) => {
    await use(new CommonActions({ page }));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage({ page }));
  },
  searchPage: async ({ page }, use) => {
    await use(new SearchPage({ page }));
  },
  sidebar: async ({ page }, use) => {
    await use(new SideBar({ page }));
  },
});

export const expect = base.expect;
