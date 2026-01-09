import { test, expect } from "../../../fixtures/PlaywrightFixtures";
test.describe("AR-002 - Air Request - Step 1", () => {
  test("Scenario 1 - Admin → Start From Scratch and Continue", async ({
    loginPage,
    page,
  }) => {
    await test.step("Go to the Client tab", async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
    });
  });
});
