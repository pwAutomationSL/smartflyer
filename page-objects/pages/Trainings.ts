import { Page } from "@playwright/test";

export class Trainings {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }

  public readonly INPUT_FILE = `//input[@id="training-file"]`;
  public readonly UPLOAD_FILES = `//button[contains(.,'Upload Files')]`;
  public readonly CONFIRM_UPLOAD_FILES = `//dialog//button[contains(.,'Upload Files')]`;
  public readonly CLOSE_UPLOAD = `//button[contains(.,'Close')]`;
  public readonly SAVE = `//form[@id="training-form"]//button[text()='Save']`;
  public readonly OK_POPUP = `//button[text()='OK']`;
  public readonly HEADER_H2 = `//h2`;
  public readonly CLOSE_POPUP = `//header/button`;
  public readonly LOAD_SPINNER = `//*[contains(@class,'animate-spin')]`;
  public readonly ADD_TASK = `//button[@id="task-modal-open"]`;
  public readonly TASK_FORM = `//form[@id="myForm"]`;
  public readonly SUCCESS_POPUP = `//h2`;
  public readonly ADD_TRAINING = `//button[contains(.,'Add Training')]`;
  public readonly EDIT_UNIQUE_TRAINING = `(//div[contains(@class,'tolkit-search-box')][1]//a)[1]`;
  public readonly EDIT_DROPDOWN = `//a[contains(.,'Edit')]`;
  public readonly DELETE_TRAINING = `(//div[contains(@class,'tolkit-search-box')][1]//a)[2]`;
  public readonly CONFIRM_DELETE = `//button[contains(.,'Yes, proceed')]`;
  public readonly SHORT_DESCRIPTION = `//textarea[contains(@id,'description')]`;
  public readonly PARTNER_SELECT = `//span[contains(.,'Select Partner')]/following-sibling::span/b`;
  public readonly CATEGORY_SELECT = `//span[contains(.,'Select Category')]/following-sibling::span/b`;
  public readonly FIRST_OPTION = `//ul[contains(@class,"results")]/li[2]`;
  public readonly RESULT_FIRST_TABLE = `//div[contains(@class,'tolkit-search-box')][1]`;
  public readonly RESULT_TITLE = `(//div[contains(@class,'tolkit-search-box')][1]//h5)[1]`;
  public readonly RESULT_VIDEO = `(//div[contains(@class,'tolkit-search-box')][1]//a[@id="play-video-btn"])[1]`;
  public readonly RESULT_DESCRIPTION = `(//div[contains(@class,'tolkit-search-box')][1]//p)[1]`;
  public readonly COLUMNS_BY_INDEX = (index: number) =>
    `//table[@id="todoTable"]//tbody/tr[1]/td[${index}]`;
  public readonly IMAGE_RESULT = (image: string) =>
    `//img[contains(@alt,'${image}')]`;

  public async clickUploadFiles() {
    await this.page.locator(this.UPLOAD_FILES).click();
  }
  public async uploadFile() {
    await this.page
      .locator(this.INPUT_FILE)
      .setInputFiles("./data/images/testImage.jpg");
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
  public async addTraining() {
    await this.page.locator(this.ADD_TRAINING).click();
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
  public async searchTraining(trainingName: string) {
    await this.page
      .locator(`//label[contains(text(),'SEARCH:')]//input`)
      .fill(trainingName);

    await this.page
      .locator(`//label[contains(text(),'SEARCH:')]//input`)
      .press("Enter");
  }
  public async enterTitle(name: string) {
    await this.page.getByRole("textbox", { name: "Enter title" }).fill(name);
  }
  public async editSearchedTraining() {
    await this.page.locator(this.EDIT_UNIQUE_TRAINING).click();
  }
  public async deleteSearchedTraining() {
    await this.page.locator(this.DELETE_TRAINING).click();
  }
  public async confirmDeleteTraining() {
    await this.page.locator(this.CONFIRM_DELETE).click();
  }
  public async enterShortDescription(description: string) {
    await this.page.locator(this.SHORT_DESCRIPTION).fill(description);
  }
  public async selectPartner() {
    await this.page.locator(this.PARTNER_SELECT).click();
    await this.page.locator(this.FIRST_OPTION).click();
  }
  public async selectCategory() {
    await this.page.locator(this.CATEGORY_SELECT).click();
    await this.page.locator(this.FIRST_OPTION).click();
  }
  public async fillDate(date: string) {
    await this.page.locator("#date").fill(date);
  }
  public async fillVideo(video: string) {
    await this.page.locator("#link").fill(video);
  }
}
export const trainings = (page: Page) => new Trainings({ page });
