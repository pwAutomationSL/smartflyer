import { Page } from "@playwright/test";
export class Forum {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }
  public readonly HEADER = `//h1`;
  public readonly ADD_NEW_POST = `//button[contains(.,'ADD NEW POST')]`;
  public readonly TITLE_NEW_POST = `//div[@id="global_posts"]//div[@class="form-post-body"]/h4`;
  public readonly DETAILS_POST = `//div[@id="global_posts"]//div[@class="form-post-body"]/p[2]`;
  public async clickCreate() {
    await this.page.locator(this.HEADER).click();
  }
  public async clickAddNewpost() {
    await this.page.waitForTimeout(1000);
    await this.page.locator(this.ADD_NEW_POST).click();
  }
  public async newForumPostawait(title: string, details: string) {
    await this.page.locator(`//input[@id="post_title"]`).fill(title);

    await this.page
      .getByRole("textbox", { name: "Select a Forum Channel" })
      .click();
    await this.page.getByRole("treeitem", { name: "Announcement" }).click();
    await this.page.getByRole("textbox", { name: "Select a Category" }).click();
    await this.page.getByRole("treeitem", { name: "North America" }).click();
    await this.page.waitForTimeout(1000);
    await this.page
      .locator('iframe[title="Rich Text Area"]')
      .contentFrame()
      .getByLabel("Rich Text Area")
      .fill(details);
    await this.page
      .getByRole("checkbox", { name: "Show on Dashboard" })
      .check();
  }
  public async saveNewForumPost() {
    await this.page.getByRole("button", { name: "Save" }).click();
  }
}
export const forum = (page: Page) => new Forum({ page });
