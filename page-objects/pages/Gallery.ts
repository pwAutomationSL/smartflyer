import { Page } from '@playwright/test';

const env = process.env.ENVIRONMENT ?? 'stage';
export class GalleryPage {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }

  private shareEndpoint = `https://api.${env}.smartflyer.com/api/gallery`;
  public readonly INPUT_FILE = `//input[@id="fileInput"]`;
  public readonly UPLOAD_FILES = `//button[contains(.,'Upload Files')]`;
  public readonly CONFIRM_UPLOAD_FILES = `//dialog//button[contains(.,'Upload Files')]`;
  public readonly CLOSE_UPLOAD = `//button[contains(.,'Close')]`;
  public readonly HEADER_H2 = `//h2`;
  public readonly IMAGE_NAME = `//input[@id="title"]`;
  public readonly CLOSE_POPUP = `//header/button`;
  public readonly LOAD_SPINNER = `//*[contains(@class,'animate-spin')]`;
  public readonly DELETE_IMAGE = `//button[@aria-label="Delete"]`;
  public readonly CONFIRM_DELETE_IMAGE = `//button[contains(.,'Delete File')]`;
  public readonly IMAGE_RESULT = (image: string) => `//img[contains(@alt,'${image}')]`;
  public async clickUploadFiles() {
    await this.page.locator(this.UPLOAD_FILES).click();
  }
  public async attachImage() {
    await this.page.locator(this.INPUT_FILE).setInputFiles('./data/images/testImage.jpg');
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
}
export const galleryPage = (page: Page) => new GalleryPage({ page });
