import { test as base } from '@playwright/test';

import { CommonActions } from '../page-objects/common/CommonActions';
import { SideBar } from '../page-objects/common/components/Sidebar';
import { LoginPage } from '../page-objects/pages/Login';
import { SearchPage } from '../page-objects/pages/Search';
import { Forum } from '../page-objects/pages/Forum';
import { Partners } from '../page-objects/pages/Partners';
import { Clients } from '../page-objects/pages/Clients';
import { AirRequest } from '../page-objects/pages/AirRequest';
import { GalleryPage } from '../page-objects/pages/Gallery';
import { Directories } from '../page-objects/pages/Directories';
import { Faqs } from '../page-objects/pages/Faqs';
import { PartnersHotel } from '../page-objects/pages/PartnersHotel';
import { PartnersOnsite } from '../page-objects/pages/PartnersOnsite';
import { Toast } from '../page-objects/pages/Toast';
import { TasksPage } from '../page-objects/pages/Tasks';
import { Toolkit } from '../page-objects/pages/Toolkit';
import { Trainings } from '../page-objects/pages/Trainings';

export type MyOptions = {
  username: string;
  password: string;
};

export interface PlaywrightFixtures {
  commonActions: CommonActions;
  loginPage: LoginPage;
  searchPage: SearchPage;
  galleryPage: GalleryPage;
  faqs: Faqs;
  sidebar: SideBar;
  partners: Partners;
  directories: Directories;
  clients: Clients;
  airRequest: AirRequest;
  forum: Forum;
  partnersHotel: PartnersHotel;
  partnersOnsite: PartnersOnsite;
  toast: Toast;
  tasks: TasksPage;
  toolkit: Toolkit;
  trainings: Trainings;
}

export const test = base.extend<PlaywrightFixtures & MyOptions>({
  username: ['', { option: true }],
  password: ['', { option: true }],

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
  directories: async ({ page }, use) => {
    await use(new Directories({ page }));
  },
  clients: async ({ page }, use) => {
    await use(new Clients({ page }));
  },
  airRequest: async ({ page }, use) => {
    await use(new AirRequest({ page }));
  },
  faqs: async ({ page }, use) => {
    await use(new Faqs({ page }));
  },
  galleryPage: async ({ page }, use) => {
    await use(new GalleryPage({ page }));
  },
  tasks: async ({ page }, use) => {
    await use(new TasksPage({ page }));
  },
  trainings: async ({ page }, use) => {
    await use(new Trainings({ page }));
  },
  toolkit: async ({ page }, use) => {
    await use(new Toolkit({ page }));
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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

test.beforeEach(async ({}, testInfo) => {
  if (testInfo.retry > 0) {
    await sleep(5000);
  }
});

export const expect = base.expect;
