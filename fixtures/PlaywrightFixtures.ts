import { test as base } from "@playwright/test";

import { CommonActions } from "../page-objects/common/CommonActions";
import { SideBar } from "../page-objects/common/components/Sidebar";
import { LoginPage } from "../page-objects/pages/Login";
import { SearchPage } from "../page-objects/pages/Search";
import { Forum } from "../page-objects/pages/Forum";
import { Partners } from "../page-objects/pages/Partners";
import { Clients } from "../page-objects/pages/Clients";
import { PartnersHotel } from "../page-objects/pages/PartnersHotel";
import { PartnersOnsite } from "../page-objects/pages/PartnersOnsite";
import { Toast } from "../page-objects/pages/Toast";
export interface PlaywrightFixtures {
  commonActions: CommonActions;
  loginPage: LoginPage;
  searchPage: SearchPage;
  sidebar: SideBar;
  partners: Partners;
  clients: Clients;
  forum: Forum;
  partnersHotel: PartnersHotel;
  partnersOnsite: PartnersOnsite;
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
  forum: async ({ page }, use) => {
    await use(new Forum({ page }));
  },
  partners: async ({ page }, use) => {
    await use(new Partners({ page }));
  },
  clients: async ({ page }, use) => {
    await use(new Clients({ page }));
  },
  partnersOnsite: async ({ page }, use) => {
    await use(new PartnersOnsite({ page }));
  },
  partnersHotel: async ({ page }, use) => {
    await use(new PartnersHotel({ page }));
  },
  toast: async ({ page }, use) => {
    await use(new Toast({ page }));
  },
});

export const expect = base.expect;
