import { Page } from "@playwright/test";

export class Directories {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }
  public readonly HEADER = `//h1`;
  public async saveUser() {
    await this.page.getByRole("button", { name: "Save" }).click();
    await this.page.getByRole("button", { name: "OK" }).click();
  }
  public async FillUserInformation(lastName: string) {
    await this.page.getByRole("textbox", { name: "First Name" }).fill("Test");
    await this.page.getByRole("textbox", { name: "Last Name" }).fill(lastName);
    await this.page
      .getByRole("textbox", { name: "Email", exact: true })
      .fill(`test${lastName}@test.com`);
    await this.page.getByRole("textbox", { name: "Select Role" }).click();
    await this.page.getByRole("treeitem", { name: "Super Admin" }).click();
    await this.page.getByLabel("", { exact: true }).click();
    await this.page.locator('input[type="search"]').fill("test");
    await this.page
      .getByRole("checkbox", { name: "SmartFlyer", exact: true })
      .check();
  }
  public async approveUser() {
    await this.page.getByText("Draft", { exact: true }).click();
  }
  public async addNew() {
    await this.page.getByRole("button", { name: "Add New" }).click();
    await this.page.getByRole("textbox", { name: "First Name" }).click();
  }
  public async searchUser(email: string) {
    await this.page.getByRole("textbox", { name: "Name or Email" }).fill(email);
    await this.page
      .getByRole("textbox", { name: "Name or Email" })
      .press("Enter");
    await this.page.waitForTimeout(1000);
  }
}
export const directories = (page: Page) => new Directories({ page });
