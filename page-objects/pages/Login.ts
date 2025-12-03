import { Page } from "@playwright/test";

import { getEnvConfig } from "../../utils/envConfig";
export class LoginPage {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }
  public readonly EMAIL_INPUT = `//input[@type="email"]`;
  public readonly PASSWORD_INPUT = `//input[@type="password"]`;
  public readonly LOGIN_BUTTON = `//input[@type="submit"]`;

  async login({
    username = "rodrigo.santone@scrumlaunch.com",
    password = "12345678",
    host = getEnvConfig().BASE_URL,
  }: {
    username?: string;
    password?: string;
    host?: string;
  } = {}) {
    await this.page.goto(host);
    await this.page.locator(this.EMAIL_INPUT).fill(username);
    await this.page.locator(this.PASSWORD_INPUT).fill(password);
    await this.page.locator(this.LOGIN_BUTTON).click();
  }
}
export const loginPage = (page: Page) => new LoginPage({ page });
