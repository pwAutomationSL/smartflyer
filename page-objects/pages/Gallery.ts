import { Page } from '@playwright/test';

const env = process.env.ENVIRONMENT ?? 'stage';
export class GalleryPage {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }

  private shareEndpoint = `https://api.${env}.smartflyer.com/api/gallery`;
  public readonly INPUT_FILE = `//input[@id="fileInput"]`;
  public readonly INPUT_FILE_POPUP = `//dialog//input[@id="fileInput"]`;
  public readonly UPLOAD_FILES = `//button[contains(.,'Upload Files')]`;
  public readonly CONFIRM_UPLOAD_FILES = `//dialog//button[contains(.,'Upload Files')]`;
  public readonly CLOSE_UPLOAD = `//button[contains(.,'Close')]`;
  public readonly HEADER_H2 = `//h2`;
  public readonly IMAGE_NAME = `//input[@id="title"]`;
  public readonly CLOSE_POPUP = `//header/button`;
  public readonly LOAD_SPINNER = `//*[contains(@class,'animate-spin')]`;
  public readonly DELETE_IMAGE = `//button[@aria-label="Delete"]`;
  public readonly CONFIRM_DELETE_IMAGE = `//button[contains(.,'Delete Files')]`;
  public readonly SELECT_ALL_CHECKBOX = `//input[@type='checkbox' and (contains(@aria-label,'Select all') or contains(@name,'select'))] | //label[contains(normalize-space(.),'Select all')]//input[@type='checkbox']`;
  public readonly DELETE_SELECTED_ICON = `//button[contains(@class,'text-red-500')]`;
  public readonly FILES_TAB = `//button[normalize-space(.)='Files']`;
  public readonly FOLDERS_TAB = `//button[normalize-space(.)='Folders']`;
  public readonly GALLERY_BREADCRUMB = `//nav//*[normalize-space(.)='Gallery'] | //a[normalize-space(.)='Gallery']`;
  public readonly CREATE_FOLDER_BUTTON = `//button[normalize-space(.)='Create Folder']`;
  public readonly FOLDER_NAME_INPUT = `//input[@name='folderName' or @placeholder='Enter folder name']`;
  public readonly CONFIRM_CREATE_FOLDER = `//button[@type='submit' and normalize-space(.)='Create Folder']`;
  public readonly FOLDER_CARD = (folderName: string) =>
    `//*[self::p or self::span or self::div][normalize-space(.)='${folderName}']`;
  public readonly FOLDER_THREE_DOTS_MENU = (folderName: string) =>
    `//p[text()='${folderName}']/../preceding-sibling::div[1]`;
  public readonly DELETE_FOLDER_OPTION = `//button[normalize-space(.)='Delete'] | //li[normalize-space(.)='Delete'] | //p[normalize-space(.)='Delete']`;
  public readonly CONFIRM_DELETE_FOLDER = `//button[normalize-space(.)='Delete Folder']`;
  public readonly ALL_FILE_IMAGES = `//div[contains(@class,'Layout_content_')]/div/div[4]//img`;
  public readonly FIRST_IMAGE = `(//div[contains(@class,'Layout_content_')]/div/div[4]//img)[1]`;
  public readonly FIRST_IMAGE_CHECKBOX = `(//div[contains(@class,'Layout_content_')]/div/div[4]//img)[1]/following-sibling::div[2]/div`;
  public readonly MOVE_TO_FOLDER_ICON = `(//label[contains(@for,'checkbox')]/following-sibling::div/button[2])[1]`;
  public readonly THIS_FOLDER_IS_EMPTY = `//p[contains(normalize-space(.),'This folder is empty')]`;
  public readonly MOVE_FILES_BUTTON = `//button[normalize-space(.)='Move files']`;
  public readonly IMAGE_RESULT = (image: string) => `//img[contains(@alt,'${image}')]`;
  public async clickUploadFiles() {
    await this.page.locator(this.UPLOAD_FILES).click();
  }
  public async attachImage() {
    await this.page.locator(this.INPUT_FILE_POPUP).setInputFiles('./data/images/testImage.jpg');
  }
  public async confirmUploadFile() {
    const waitForCreate = this.page.waitForResponse(
      (res) => res.ok() && res.request().method() === 'POST' && res.url() === this.shareEndpoint,
      { timeout: 40000 },
    );
    await this.page.locator(this.CONFIRM_UPLOAD_FILES).last().click();
    const response = await waitForCreate;
    const responseUpload = await response.json();
    await this.page.waitForTimeout(3000);
    return { responseUpload };
  }
  public async closeUpload() {
    await this.page.locator(this.CLOSE_UPLOAD).last().click();
  }
  public async closePopUp() {
    await this.page.locator(this.CLOSE_POPUP).click();
  }
  public async searchImageAndDelete(name: string) {
    await this.page.getByRole('textbox', { name: 'Search files' }).fill(name);
    await this.page.waitForTimeout(3000);
    await this.deleteImage(name);
  }
  public async deleteImage(image: string) {
    await this.page.locator(this.IMAGE_RESULT(image)).hover({ force: true });
    await this.page.locator(this.DELETE_IMAGE).click();
    await this.page.locator(this.CONFIRM_DELETE_IMAGE).click();
  }
  public async selectAllFiles() {
    await this.page.waitForLoadState('networkidle');
    const checkbox = this.page.locator(`//span[text()='Select All']/preceding-sibling::span`);
    if ((await checkbox.count()) > 0) {
      await checkbox.check({ force: true });
      return;
    }
    await this.page.locator(this.SELECT_ALL_CHECKBOX).first().check({ force: true });
  }

  public async deleteSelectedFiles() {
    const waitForDelete = this.page.waitForResponse(
      (res) =>
        res.request().method() === 'DELETE' && res.url().includes('/api/gallery') && res.ok(),
      { timeout: 40000 },
    );
    await this.page.locator(this.DELETE_SELECTED_ICON).first().click({ force: true });
    await this.page.locator(this.CONFIRM_DELETE_IMAGE).click();
    await waitForDelete;
    await this.page.waitForTimeout(3000);
  }
  public async clickFoldersTab() {
    await this.page.locator(this.FOLDERS_TAB).click();
  }
  public async clickFilesTab() {
    await this.page.locator(this.FILES_TAB).click();
  }
  public async clickCreateFolder() {
    await this.page.locator(this.CREATE_FOLDER_BUTTON).first().click();
  }
  public async clickGalleryBreadcrumb() {
    await this.page.locator(this.GALLERY_BREADCRUMB).first().click();
  }
  public async fillFolderName(folderName: string) {
    await this.page.locator(this.FOLDER_NAME_INPUT).fill(folderName);
  }
  public async confirmCreateFolder() {
    const waitForCreateFolder = this.page.waitForResponse(
      (res) => res.request().method() === 'POST' && res.url().includes('/api/folders') && res.ok(),
      { timeout: 40000 },
    );
    await this.page.locator(this.CONFIRM_CREATE_FOLDER).click();
    await waitForCreateFolder;
  }
  public async hoverFirstImage() {
    await this.page.locator(this.FIRST_IMAGE).hover({ force: true });
  }
  public async selectFirstImageCheckbox() {
    await this.page.locator(this.FIRST_IMAGE_CHECKBOX).click({ force: true });
  }
  public async clickMoveToFolderIcon() {
    await this.page.locator(this.MOVE_TO_FOLDER_ICON).click({ force: true });
  }
  public async chooseFolderByName(folderName: string) {
    await this.page.locator(this.FOLDER_CARD(folderName)).first().click({ force: true });
  }
  public async openFolderByName(folderName: string) {
    await this.page.locator(this.FOLDER_CARD(folderName)).first().click({ force: true });
  }
  public async clickFolderThreeDotsMenu(folderName: string) {
    await this.page.locator(this.FOLDER_THREE_DOTS_MENU(folderName)).click({ force: true });
  }
  public async clickDeleteFolderOption() {
    await this.page.locator(this.DELETE_FOLDER_OPTION).first().click({ force: true });
  }
  public async confirmDeleteFolder() {
    const waitForDeleteFolder = this.page.waitForResponse(
      (res) =>
        res.request().method() === 'DELETE' &&
        res.url().includes('/api/folders') &&
        res.ok(),
      { timeout: 40000 },
    );
    await this.page.locator(this.CONFIRM_DELETE_FOLDER).click();
    await waitForDeleteFolder;
  }
  public async clickMoveFiles() {
    await this.page.locator(this.MOVE_FILES_BUTTON).click();
  }
}
export const galleryPage = (page: Page) => new GalleryPage({ page });
