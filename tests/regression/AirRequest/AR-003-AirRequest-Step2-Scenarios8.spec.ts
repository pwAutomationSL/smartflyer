import { test, expect } from "../../../fixtures/PlaywrightFixtures";
const CLIENT_NAME = "Candice & Ben (Conway) Winikoff";
test.describe("AR-003 - Air Request - Step 2", () => {
  test("Air Request - Step 2 - 8# Scenario", async ({
    loginPage,
    page,
    sidebar,
    clients,
    toast,
    airRequest,
  }) => {
    await test.step("1 - Go to the Client tab", async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
      await sidebar.goToModule("Clients");
    });
    await test.step("2 - Search the client and go to the client page", async () => {
      await clients.searchClient(CLIENT_NAME);
    });
    await test.step("3 - 4 - Go to the New credit card tab and Click on Air request button", async () => {
      await airRequest.goToCreditCard();
      await airRequest.clickAirRequest();
    });
    await test.step("5 - Click on Start from scratch", async () => {
      await airRequest.startFromScrath();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeDisabled();
      await expect(page.locator(airRequest.AGENT_SELECT)).toContainText(
        "Select an agent"
      );
    });
    await test.step("6 - Select the Agent and Click on Continue button", async () => {
      await airRequest.selectAgent();
      await airRequest.selectFirstAgent();
      await expect(page.locator(airRequest.CONTINUE_BUTTON)).toBeEnabled();
    });
    await test.step("7 - Click on Continue", async () => {
      await airRequest.clickContinue();
      await expect(page.locator(airRequest.HEADER)).toContainText(
        "Passenger details"
      );
      await expect(page.locator(airRequest.AGENT_SUCCESS)).toHaveCSS(
        "background-color",
        "rgb(46, 139, 87)"
      );
      await test.step("ER - check validation for incorrect file  ", async () => {
        await airRequest.addPassportInformation();
        await airRequest.addIncorrectFile();
        await expect(page.locator(airRequest.UPLOAD_FILE_BUTTON)).toBeVisible();
        await expect(
          page.locator(airRequest.UPLOAD_FILE_P).last()
        ).toContainText("File type(s) not supported");
      });
      await test.step("ER - add 2 files and validate they were added ", async () => {
        await expect(page.locator(airRequest.UPLOAD_FILE_BUTTON)).toBeVisible();
        await expect(
          page.locator(airRequest.UPLOAD_FILE_P).first()
        ).toContainText("Drag your file(s) to start uploading");
        await expect(
          page.locator(airRequest.UPLOAD_FILE_P).nth(1)
        ).toContainText("PDF, JPG or PNG (max 25MB per file)");
        await airRequest.add2FilesPassport();
        await expect(
          page.locator(airRequest.FILES_UPLOAD_POPUP_UPLOAD_FILES)
        ).toBeVisible();
        await expect(
          page.locator(airRequest.FILES_UPLOAD_POPUP_CANCEL)
        ).toBeVisible();
        const txt = (
          await page.locator(airRequest.FILES_UPLOAD_POPUP_TITLE).innerText()
        )
          .replace(/\s+/g, " ")
          .trim();
        expect(txt).toBe("Passenger 1 - Uploads (2)");
        const imgCount = await page
          .locator(airRequest.FILES_UPLOAD_POPUP_IMG)
          .count();
        expect(imgCount).toBe(2);
        await airRequest.uploadAddedFiles();
        await expect(
          page.locator(airRequest.FILES_UPLOAD_POPUP_SUCCESS_BAR)
        ).toBeVisible({ timeout: 10000 });
        await expect(
          page.locator(airRequest.FILES_UPLOAD_POPUP_SUCCESS_BAR_2)
        ).toBeVisible();
        const uploadedImgCount = await page
          .locator(airRequest.UPLOADED_IMAGES)
          .count();
        expect(uploadedImgCount).toBe(2);
      });
      await test.step("ER -Add more files and validate toast message with warning ", async () => {
        await airRequest.closePopUp();
        await airRequest.add2FilesPassport();
        await expect(
          page.locator(airRequest.FILES_UPLOAD_POPUP_IMG)
        ).not.toBeVisible();
        await expect(page.locator(toast.TOAST_MESSAGE_APP)).toContainText(
          "You can only upload up to 1 files"
        );
      });
    });
  });
});
