import { test, expect } from "../../../fixtures/PlaywrightFixtures";

test.describe("AR-002 - Air Request - Step 1", () => {
  test("Login at Society (env) as an Admin", async ({
    loginPage,
    page,
    sidebar,
    searchPage,
  }) => {
    await test.step("Scenario 1 - Admin → Start From Scratch", async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
      await sidebar.goToModule("Clients");
    });
    await test.step("4 - Go to Search - Toolkit filter", async () => {});
  });
});
