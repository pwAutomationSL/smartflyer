import { Page, expect } from "@playwright/test";

import { getEnvConfig } from "../../utils/envConfig";
export class Toast {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }
  public readonly TOAST_MESSAGE = `//div[contains(@class,'notyf__message')]`;
  public readonly TOAST_CLOSE_BUTTON = `//div[contains(@class,'notyf__wrapper')]//i`;

  public async closeToastMessage() {
    if (await this.page.locator(this.TOAST_CLOSE_BUTTON).isVisible) {
      await this.page.locator(this.TOAST_CLOSE_BUTTON).click();
      await this.assertToastToGoAway();
    }
  }

  public async assertToastToGoAway() {
    await this.page.locator(this.TOAST_CLOSE_BUTTON).isHidden();
  }
}
export const toast = (page: Page) => new Toast({ page });
