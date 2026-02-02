import { test, expect } from "../../../fixtures/PlaywrightFixtures";
const CLIENT_NAME = "Dr Ragan";
test.use({
  launchOptions: { slowMo: 350 },
});
test.describe("SFC-370 -  upload a passport file", () => {
  test("As an admin, when I try to upload a passport file, it should not return server error.", async ({
    loginPage,
    page,
    sidebar,
    clients,
    airRequest,
  }) => {
    await test.step("Go to the Client tab", async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
      await sidebar.goToModule("Clients");
      await clients.searchClientAndClick(CLIENT_NAME);
    });
    await test.step("Click on Start from scratch", async () => {
      await page.waitForLoadState("networkidle");
      await page.waitForLoadState("load");
      await clients.clickDatesAndNumbers();
      await page.waitForLoadState("networkidle");
      await page.waitForLoadState("load");
      await clients.addPassportIfNotFull();
      await expect(page.locator(clients.UPLOADED_DOCUMENTS)).toBeVisible();
      await expect(page.locator(clients.DELETE_PASSPORT_ICON)).toBeVisible();
      const apiResponse = await clients.saveModal();
      expect(apiResponse.status).toBe(200);
      expect(page.locator(clients.SUCCESS_MODAL)).toBeVisible();
    });
  });
});
