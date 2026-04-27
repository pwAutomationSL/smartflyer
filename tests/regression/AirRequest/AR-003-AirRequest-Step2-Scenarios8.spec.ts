import { test, expect } from '../../../fixtures/PlaywrightFixtures';
const CLIENT_NAME = 'Candice & Ben (Conway) Winikoff';
test.describe('AR-003 - Air Request - Step 2', () => {
  test('Air Request - Step 2 - 8# Scenario', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    clients,
    airRequest,
  }) => {
    await test.step('1 - Go to the Client tab', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
      await sidebar.goToModule('Clients');
    });
    await test.step('2 - Search the client and go to the client page', async () => {
      await clients.searchClient(CLIENT_NAME);
      await page.waitForLoadState('networkidle');
    });
    await test.step('3 - 4 - Go to the New credit card tab and Click on Air request button', async () => {
      await airRequest.clickAirRequest();
      await expect(page.locator(airRequest.POP_UP_HEADER)).toBeVisible();
    });
    await test.step('5 - Click on Start from scratch', async () => {
      await airRequest.startFromScrath();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeDisabled();
      await expect(page.locator(airRequest.AGENT_SELECT)).toContainText('Select an agent');
    });
    await test.step('6 - Select the Agent and Click on Continue button', async () => {
      await airRequest.selectAgent();
      await airRequest.selectFirstAgent();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeEnabled();
    });
    await test.step('7 - Click on Continue', async () => {
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER_H2)).toContainText('Passenger details');
      await expect(page.locator(airRequest.AGENT_SUCCESS)).toHaveCSS(
        'background-color',
        'rgb(46, 139, 87)',
      );
      await test.step('ER - check validation for incorrect file', async () => {
        await airRequest.removeFilesIfPresent();
        try {
          await airRequest.addPassportInformation();
          await airRequest.addIncorrectFile();
          await expect(page.locator(airRequest.UPLOAD_FILE_BUTTON)).toBeVisible();
          await expect(page.locator(airRequest.UPLOAD_FILE_P).last()).toContainText(
            'File type(s) not supported',
          );
        } catch (err) {
          console.error('Check validation for incorrect file');
          test.info().errors.push({
            message: String(err),
          });
        }
      });
      await test.step('08# - ER  - Verify if user try to upload the 1 file more than 25 MB the validation appear', async () => {
        try {
          await airRequest.addLargeSizeFile();
          await expect(page.locator(airRequest.UPLOAD_FILE_P).last()).toContainText(
            'File size limits',
          );
          await airRequest.clickCancel();
        } catch (err) {
          console.error(
            'Verify if user try to upload the 1 file more than 25 MB the validation appear',
          );
          test.info().errors.push({
            message: String(err),
          });
        }
      });
      await test.step('ER - add 2 files and validate they were added ', async () => {
        await expect(page.locator(airRequest.UPLOAD_FILE_BUTTON).first()).toBeVisible();
        await expect(page.locator(airRequest.UPLOAD_FILE_P).first()).toContainText(
          'Drag your file(s) to start uploading',
        );
        await expect(page.locator(airRequest.UPLOAD_FILE_P).nth(1)).toContainText(
          'PDF, HEIC, JPG or PNG (max 50MB per file)',
        );
        await airRequest.addFilePassport('testImage.jpg');
        await expect(page.locator(airRequest.INPUT_FILE)).toBeEnabled();
        await airRequest.addFilePassport('testImage2.png');
        await expect(page.locator(airRequest.FILES_UPLOAD_POPUP_UPLOAD_FILES)).toBeVisible();
        await expect(page.locator(airRequest.FILES_UPLOAD_POPUP_CANCEL)).toBeVisible();
        const txt = (await page.locator(airRequest.FILES_UPLOAD_POPUP_TITLE).innerText())
          .replace(/\s+/g, ' ')
          .trim();
        expect(txt).toBe('Passenger 1 - Uploads (2)');
        const imgCount = await page.locator(airRequest.FILES_UPLOAD_POPUP_IMG).count();
        expect(imgCount).toBe(2);
        await airRequest.uploadAddedFiles();
        await expect(page.locator(airRequest.UPLOADED_IMAGES).first()).toBeVisible();
        const uploadedImgCount = await page.locator(airRequest.UPLOADED_IMAGES).count();
        expect(uploadedImgCount).toBe(2);
      });
      await test.step('ER -Add more files and validate toast message with warning ', async () => {
        await airRequest.closePopUp();
        await expect(page.locator(airRequest.FILES_UPLOAD_POPUP_IMG)).not.toBeVisible();
        await expect(page.locator(airRequest.UPLOAD_MORE_FILES)).toBeDisabled();
      });
    });
  });
});
