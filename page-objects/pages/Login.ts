import { Page } from '@playwright/test';

import { getEnvConfig } from '../../utils/envConfig';
type LoginOptions = {
  username: string;
  password: string;
  host?: string;
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
  async login({ username, password, host = getEnvConfig().BASE_URL }: LoginOptions): Promise<void> {
    await this.page.goto(host);
    await this.page.locator(this.EMAIL_INPUT).fill(username);
    await this.page.locator(this.PASSWORD_INPUT).fill(password);
    await this.page.locator(this.LOGIN_BUTTON).click();
  }
  async logout() {
    await this.page.locator(this.USER_DROPDOWN_BUTTON).click({ force: true });
    await this.page.locator(this.LOGOUT).click();
  }
}
export const loginPage = (page: Page) => new LoginPage({ page });
