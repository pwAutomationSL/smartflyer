import { test, expect } from "../../../fixtures/PlaywrightFixtures";
test.describe("LOG-002 - Login", () => {
  test("Scenario 1 -Successful login", async ({ loginPage, page }) => {
    await test.step("Succesful login", async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
    });
  });
});
