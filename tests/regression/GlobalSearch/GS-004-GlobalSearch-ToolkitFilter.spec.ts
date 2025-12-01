import { test, expect } from "../../../fixtures/PlaywrightFixtures";

test.describe("GS-004 - Search - Toolkit filter", () => {
  test("Login at Society (env) as an Admin", async ({
    loginPage,
    page,
    sidebar,
    searchPage,
  }) => {
    await test.step("1 - Login at Society as an Admin", async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
    });
    await test.step("4 - Go to Search - Toolkit filter", async () => {
      await sidebar.goToModule("Search");
      await searchPage.clickToolkitFilter();
      await searchPage.textToSearch("Virtuoso");
      await expect(page.locator(searchPage.SPINNER_LOADER)).toBeHidden();
      await expect(
        page.locator(searchPage.SEARCH_RESULT_MATCHES_A).first()
      ).toBeVisible();
    });
    await test.step("5 - Assert result is at least 1, title and details are correct", async () => {
      const count = await page.locator(searchPage.SEARCH_RESULT_LINKS).count();
      expect(count).toBeGreaterThanOrEqual(1);
    });
    await test.step("5 - Assert result is at least 1, title and details are correct", async () => {
      const toolkitName = await searchPage.getFirstName();
      await searchPage.clickFirstToolkit();
      await expect(page.locator(searchPage.HEADER)).toBeVisible();
      await expect(page.locator(searchPage.HEADER)).toContainText(
        "Toolkit | Resources"
      );
      await expect(page.locator(searchPage.SUBHEADER)).toContainText(
        toolkitName.toUpperCase()
      );
    });
  });
});
