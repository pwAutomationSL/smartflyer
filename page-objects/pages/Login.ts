import { Page } from '@playwright/test';

import { getEnvConfig } from '../../utils/envConfig';
type LoginOptions = {
  username: string;
  password: string;
  host?: string;
  waitForSuccess?: boolean;
};
export class LoginPage {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }
  public readonly EMAIL_INPUT = `//input[@type="email"]`;
  public readonly PASSWORD_INPUT = `//input[@type="password"]`;
  public readonly LOGIN_BUTTON = `//input[@type="submit"]`;
  public readonly ERROR_MESSAGE = `(//form//../div)[1]`;
  public readonly HEADER = `//h1`;
  public readonly USER_DROPDOWN_BUTTON = `//button[@id="dropdownMenuButton1"]`;
  public readonly LOGOUT = `//a[@href="/logout"]`;
  async login({
    username,
    password,
    host = getEnvConfig().BASE_URL,
    waitForSuccess = true,
  }: LoginOptions): Promise<void> {
    await this.page.goto(host);
    await this.page.locator(this.EMAIL_INPUT).fill(username);
    await this.page.locator(this.PASSWORD_INPUT).fill(password);
    await this.page.locator(this.LOGIN_BUTTON).click({ noWaitAfter: true });
    if (waitForSuccess) {
      await this.page.locator(this.EMAIL_INPUT).waitFor({ state: 'hidden', timeout: 15000 });
    }
  }
  async logout() {
    const legacyProfileMenu = this.page.locator(this.USER_DROPDOWN_BUTTON);
    if (await legacyProfileMenu.isVisible().catch(() => false)) {
      await legacyProfileMenu.hover();
      await this.page.locator(this.LOGOUT).waitFor({ state: 'visible' });
      await this.page.locator(this.LOGOUT).click();
      return;
    }

    const appProfileMenu = this.page.locator(`//p[contains(normalize-space(.),'@')]/../..`);
    await appProfileMenu.click();
    await this.page.getByRole('button', { name: 'Logout' }).click();
  }
}
export const loginPage = (page: Page) => new LoginPage({ page });
