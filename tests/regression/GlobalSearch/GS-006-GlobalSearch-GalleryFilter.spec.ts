import { test, expect } from '../../../fixtures/PlaywrightFixtures';
const env = process.env.ENVIRONMENT ?? 'test';
const imageName = 'testImage';
let responseUpload: any;
let token: any;
test.describe('GS-006 - Search - Gallery filter', () => {
  test.setTimeout(120_000);
  test.afterAll(async ({ request }) => {
    const response = await request.delete(`https://api.${env}.smartflyer.com/api/gallery`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: { ids: [responseUpload.data.id] },
    });
    expect(response.ok()).toBeTruthy();
  });
  test('Login at Society (env) as an Admin', async ({
    loginPage,
    page,
    sidebar,
    searchPage,
    galleryPage,
  }) => {
    await test.step('1 - Login at Society as an Admin', async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
    });
    await test.step('2 - Go to Search - Gallery filter', async () => {
      await sidebar.openContentCRM('Gallery');
      await galleryPage.clickUploadFiles();
      await galleryPage.attachImage();
      ({ responseUpload } = await galleryPage.confirmUploadFile());
      await galleryPage.closeUpload();
      await expect(page.locator(galleryPage.LOAD_SPINNER).first()).toBeHidden({
        timeout: 20000,
      });
      token = await page.evaluate(() => localStorage.getItem('token'));
    });
    await test.step('3 - Go to Search - Gallery filter', async () => {
      await sidebar.goToSearchApp();
      await searchPage.clickGalleryFilter();
      await searchPage.textToSearch(imageName);
      await expect(page.locator(searchPage.SPINNER_LOADER)).toBeHidden({ timeout: 20000 });
      await expect(page.locator(searchPage.SEARCH_RESULT_IMAGES).first()).toBeVisible();
    });
    await test.step('4 - Assert result is at least 1, title and details are correct', async () => {
      const count = await page.locator(searchPage.SEARCH_RESULT_IMAGES).count();
      expect(count).toBeGreaterThanOrEqual(1);
    });
    await test.step('5 - Click on image and validate is ok, then delete', async () => {
      await searchPage.clickFirstImage();
      await expect(page.locator(galleryPage.HEADER_H2)).toBeVisible({
        timeout: 22000,
      });
      await expect(page.locator(galleryPage.HEADER_H2)).toContainText('Image information');
      const value = await page.locator(galleryPage.IMAGE_NAME).inputValue();
      expect(value).toContain(imageName);
      await galleryPage.closePopUp();
    });
  });
});
