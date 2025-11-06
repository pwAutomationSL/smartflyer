import { test as base } from "@playwright/test";

import { CommonActions } from "../page-objects/common/CommonActions";
import { SideBar } from "../page-objects/common/components/Sidebar";
import { LoginPage } from "../page-objects/pages/Login";
import { SearchPage } from "../page-objects/pages/Search";
import { Partners } from "../page-objects/pages/Partners";
import { Toast } from "../page-objects/pages/Toast";
export interface PlaywrightFixtures {
  commonActions: CommonActions;
  loginPage: LoginPage;
  searchPage: SearchPage;
  sidebar: SideBar;
  partners: Partners;
  toast: Toast;
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
  partners: async ({ page }, use) => {
    await use(new Partners({ page }));
  },
  toast: async ({ page }, use) => {
    await use(new Toast({ page }));
  },
});

export const expect = base.expect;
