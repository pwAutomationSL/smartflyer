import { Page } from "@playwright/test";

export class Toolkit {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }

  public readonly INPUT_FILE = `//input[@id="file"]`;
  public readonly UPLOAD_FILES = `//button[contains(.,'Upload Files')]`;
  public readonly CONFIRM_UPLOAD_FILES = `//dialog//button[contains(.,'Upload Files')]`;
  public readonly CLOSE_UPLOAD = `//button[contains(.,'Close')]`;
  public readonly ADD_TOOLKIT = `//a[contains(.,'add toolkit')]`;
  public readonly SAVE = `//button[@id="submit_btn"]`;
  public readonly OK_POPUP = `//button[text()='OK']`;
  public readonly HEADER_H2 = `//h2`;
  public readonly HEADER_H1 = `//h1`;
  public readonly TOOLKIT_TABLE = `//div[@id="toolkitTable_wrapper"]`;
  public readonly CLOSE_POPUP = `//header/button`;
  public readonly LOAD_SPINNER = `//*[contains(@class,'animate-spin')]`;
  public readonly SUCCESS_POPUP = `//h2`;
  public readonly EDIT_TOOLKIT = `//table[@id="toolkitTable"]//tbody//td[5]/a[1]`;
  public readonly DELETE_TOOLKIT = `//table[@id="toolkitTable"]//tbody//td[5]/a[2]`;
  public readonly CONFIRM_DELETE = `//button[contains(.,'Yes, delete it!')]`;
  public readonly SHORT_DESCRIPTION = `//label[text()='Short Description']/following-sibling::textarea`;
  public readonly COLUMNS_BY_INDEX = (index: number) =>
    `//table[@id="toolkitTable"]//tbody/tr[1]/td[${index}]`;

  public async uploadFile() {
    await this.page
      .locator(this.INPUT_FILE)
      .setInputFiles("./data/images/testImage.jpg");
  }
  public async closeUpload() {
    await this.page.locator(this.CLOSE_UPLOAD).last().click();
  }
  public async closePopUp() {
    await this.page.locator(this.CLOSE_POPUP).click();
  }
  public async addToolkit() {
    await this.page.locator(this.ADD_TOOLKIT).click();
  }
  public async enterTitle(name: string) {
    await this.page.getByRole("textbox", { name: "Enter title" }).fill(name);
  }
  public async selectCategory() {
    await this.page
      .locator(
        `//span[text()='Please select category']/following-sibling::span/b`
      )
      .click();
    await this.page
      .locator(`//ul[@id="select2-toolkit_category_id-results"]/li[2]`)
      .click();
  }
  public async enterURL() {
    await this.page
      .getByRole("textbox", { name: "Enter url" })
      .fill("www.test.com");
    await this.page.getByRole("radio", { name: "Internal" }).click();
  }
  public async enterShortDescription(description: string) {
    await this.page.locator(this.SHORT_DESCRIPTION).fill(description);
  }
  public async enterDescription(description: string) {
    await this.page
      .locator('iframe[title="Rich Text Area"]')
      .contentFrame()
      .locator("html")
      .click();
    await this.page
      .locator('iframe[title="Rich Text Area"]')
      .contentFrame()
      .getByLabel("Rich Text Area. Press ALT-0")
      .fill(description);
  }
  public async clickSave() {
    await this.page.locator(this.SAVE).click();
  }
  public async clickOK() {
    await this.page.locator(this.OK_POPUP).click();
  }
  public async searchToolkit(toolkitName: string) {
    await this.page
      .locator(`//label[text()='Search:']/input`)
      .fill(toolkitName);
  }
  public async editSearchedToolkit() {
    await this.page.locator(this.EDIT_TOOLKIT).click();
  }
  public async changeURLType() {
    await this.page.getByRole("radio", { name: "External" }).click();
  }

  public async deleteSearchedToolkit() {
    await this.page.locator(this.DELETE_TOOLKIT).click();
  }
  public async confirmDeleteToolkit() {
    await this.page.locator(this.CONFIRM_DELETE).click();
  }
}
export const toolkit = (page: Page) => new Toolkit({ page });
