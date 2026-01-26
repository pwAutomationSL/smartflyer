import { Page } from "@playwright/test";

export class TasksPage {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }

  public readonly INPUT_FILE = `//input[@id="task_file"]`;
  public readonly UPLOAD_FILES = `//button[contains(.,'Upload Files')]`;
  public readonly CONFIRM_UPLOAD_FILES = `//dialog//button[contains(.,'Upload Files')]`;
  public readonly CLOSE_UPLOAD = `//button[contains(.,'Close')]`;
  public readonly SAVE = `//form[@id="myForm"]//button[text()='Save']`;
  public readonly OK_POPUP = `//button[text()='OK']`;
  public readonly HEADER_H2 = `//h2`;
  public readonly CLOSE_POPUP = `//header/button`;
  public readonly LOAD_SPINNER = `//*[contains(@class,'animate-spin')]`;
  public readonly ADD_TASK = `//button[@id="task-modal-open"]`;
  public readonly TASK_FORM = `//form[@id="myForm"]`;
  public readonly SUCCESS_POPUP = `//h2`;
  public readonly EDIT_UNIQUE_TASK = `//table[@id="todoTable"]//tbody/tr[1]/td//button[contains(@id,'dropdown')]`;
  public readonly EDIT_DROPDOWN = `//a[contains(.,'Edit')]`;
  public readonly DELETE_DROPDOWN = `//a[contains(.,'Delete')]`;
  public readonly CONFIRM_DELETE = `//button[contains(.,'Yes, delete it!')]`;
  public readonly COLUMNS_BY_INDEX = (index: number) =>
    `//table[@id="todoTable"]//tbody/tr[1]/td[${index}]`;
  public readonly IMAGE_RESULT = (image: string) =>
    `//img[contains(@alt,'${image}')]`;
  public async clickUploadFiles() {
    await this.page.locator(this.UPLOAD_FILES).click();
  }
  public async attachImage() {
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
  public async addTask() {
    await this.page.locator(this.ADD_TASK).click();
  }
  public async fillTaskName(name: string) {
    await this.page.getByRole("textbox", { name: "Name" }).fill(name);
  }
  public async fillTaskDeadline(date: string) {
    await this.page.getByPlaceholder("Deadline").fill(date);
  }
  public async fillTaskReminder() {
    await this.page
      .locator(
        `//span[contains(@title,'Select Remind')]/following-sibling::span/b`
      )
      .click();
    await this.page
      .getByRole("treeitem", { name: "One day before due date" })
      .click();
  }
  public async fillTaskDetailsAndImage() {
    await this.page
      .getByRole("textbox", { name: "Enter task details" })
      .fill("Details");
    await this.page
      .locator(this.INPUT_FILE)
      .setInputFiles("./data/images/testImage.jpg");
  }
  public async fillTaskAssignedAndStatus(status: string) {
    await this.page
      .locator(
        `//span[contains(@title,'Select Team Member')]/following-sibling::span/b`
      )
      .first()
      .click();
    await this.page
      .locator(`//ul[@id="select2-agent_id-results"]/li[2]`)
      .click();
    await this.page
      .locator("//label[contains(.,'Status')]/following-sibling::span//b")
      .click();
    await this.page
      .locator(`//ul[@role="tree"]//li[contains(.,'${status}')]`)
      .click();
  }
  public async clickSave() {
    await this.page.locator(this.SAVE).click();
  }
  public async clickOK() {
    await this.page.locator(this.OK_POPUP).click();
  }
  public async searchTask(taskName: string) {
    await this.page.locator(`//label[text()='Search:']/input`).fill(taskName);
  }
  public async editSearchedTask() {
    await this.page.locator(this.EDIT_UNIQUE_TASK).click();
    await this.page.locator(this.EDIT_DROPDOWN).click();
  }
  public async deleteSearchedTask() {
    await this.page.locator(this.EDIT_UNIQUE_TASK).click();
    await this.page.locator(this.DELETE_DROPDOWN).click();
  }
  public async confirmDeleteTask() {
    await this.page.locator(this.CONFIRM_DELETE).click();
  }
}
export const tasks = (page: Page) => new TasksPage({ page });
