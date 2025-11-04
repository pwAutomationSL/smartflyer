import { test, expect } from "../../fixtures/PlaywrightFixtures";

test.describe("GS-001 - Client Global Search - Scenario 1", () => {
  test("Login at Society (env) as an Admin", async ({ loginPage, page }) => {
    await test.step("1 - Login at Society as an Admin", async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
    });
    await test.step("2 - Go to “Search” under the main navigation menu of Society", async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
    });
  });
});
