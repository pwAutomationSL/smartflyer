import { test, expect } from "../../../fixtures/PlaywrightFixtures";
test.describe("SL-003 - Login - Incorrect Login", () => {
  test("Scenario 1 - Wrong username", async ({ loginPage, page }) => {
    await test.step("Go to the Client tab", async () => {
      await loginPage.login({ username: "rodrigo.santone@nonexistant.com" });
      await expect(page.locator(loginPage.ERROR_MESSAGE)).toContainText(
        "These credentials do not match our records."
      );
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeVisible();
    });
  });
  test("Scenario 2 - Wrong password", async ({ loginPage, page }) => {
    await test.step("Go to the Client tab", async () => {
      await loginPage.login({ password: "12345" });
      await expect(page.locator(loginPage.ERROR_MESSAGE)).toContainText(
        "The provided password is incorrect."
      );
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeVisible();
    });
  });
});
