import { test, expect } from '../../../fixtures/PlaywrightFixtures';
import { USERS } from '../../../fixtures/users';
import { uniqueId } from '../../../page-objects';

const FOLDER_NAME = `GalleryFolder${uniqueId()}`;
const env = process.env.ENVIRONMENT ?? 'test';
type GalleryUploadResponse = {
  data: {
    id: string;
  };
};

let responseUpload: GalleryUploadResponse;
let token = '';
test.describe('GS-001 - Gallery - Folders', () => {
  test.setTimeout(600_000);
  test.afterEach(async ({ request }) => {
    const response = await request.delete(`https://api.${env}.smartflyer.com/api/gallery`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { ids: [responseUpload.data.id] },
    });
    expect(response.ok()).toBeTruthy();
  });
  test('Login as an Admin, go to Gallery, and create a folder', async ({
    loginPage,
    page,
    sidebar,
    galleryPage,
  }) => {
    await test.step('1 - Login at Society as an Admin', async () => {
      await loginPage.login(USERS.ADMIN_MAIN);
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
    });

    await test.step('2 - Go to Gallery under Content in Society CRM', async () => {
      await sidebar.openContentCRM('Gallery');
      await galleryPage.clickUploadFiles();
      await galleryPage.attachImage();
      ({ responseUpload } = await galleryPage.confirmUploadFile());
      await galleryPage.closeUpload();
      await expect(page.locator(galleryPage.LOAD_SPINNER).first()).toBeHidden({
        timeout: 20000,
      });
      token = (await page.evaluate(() => localStorage.getItem('token'))) ?? '';
    });

    await test.step('3 - Click the Folders tab, create a folder, and verify it was added', async () => {
      await galleryPage.clickFoldersTab();
      await galleryPage.clickCreateFolder();
      await galleryPage.fillFolderName(FOLDER_NAME);
      await galleryPage.confirmCreateFolder();
      await expect(
        page.locator(galleryPage.FOLDER_CARD(FOLDER_NAME.toLowerCase())).first(),
      ).toBeVisible({
        timeout: 20000,
      });
    });

    await test.step('4 - Go to Files, select the first image, move it to the folder, and wait for empty-folder text', async () => {
      await galleryPage.clickFilesTab();
      await galleryPage.hoverFirstImage();
      await galleryPage.selectFirstImageCheckbox();
      await galleryPage.clickMoveToFolderIcon();
      await galleryPage.chooseFolderByName(FOLDER_NAME.toLowerCase());
      await expect(page.locator(galleryPage.THIS_FOLDER_IS_EMPTY)).toBeVisible({
        timeout: 20000,
      });
      await galleryPage.clickMoveFiles();
    });

    await test.step('5 - Go to Folders, open the new folder, go to Files, and verify only one image is present', async () => {
      await galleryPage.clickFoldersTab();
      await galleryPage.openFolderByName(FOLDER_NAME.toLowerCase());
      await galleryPage.clickFilesTab();
      await expect(page.locator(galleryPage.ALL_FILE_IMAGES)).toHaveCount(1, {
        timeout: 20000,
      });
    });

    await test.step('6 - Click the Gallery breadcrumb, return to folder view, and delete the created folder', async () => {
      await galleryPage.clickGalleryBreadcrumb();
      await galleryPage.clickFoldersTab();
      await galleryPage.clickFolderThreeDotsMenu(FOLDER_NAME.toLowerCase());
      await galleryPage.clickDeleteFolderOption();
      await galleryPage.confirmDeleteFolder();
      await expect(
        page.locator(galleryPage.FOLDER_CARD(FOLDER_NAME.toLowerCase())).first(),
      ).toBeHidden({
        timeout: 20000,
      });
    });
  });
});
