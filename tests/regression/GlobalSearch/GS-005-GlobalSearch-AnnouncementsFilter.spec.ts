import { test, expect } from "../../../fixtures/PlaywrightFixtures";
import { uniqueId } from "../../../page-objects";

const TITLE = `New forum post ` + uniqueId();
const DETAILS = `This is a description ` + uniqueId();
test.describe("GS-005 - Search - Announcements filter", () => {
  test("Login at Society (env) as an Admin", async ({
    loginPage,
    page,
    sidebar,
    searchPage,
    forum,
  }) => {
    await test.step("1 - Login at Society as an Admin", async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
    });
    await test.step("2 - Go to Forum, Add new Post", async () => {
      await sidebar.goToModule("Forum");
      await expect(page.locator(forum.ADD_NEW_POST)).toBeEnabled();
      await forum.clickAddNewpost();
      await forum.newForumPostawait(TITLE, DETAILS);
      await forum.saveNewForumPost();
    });
    await test.step("3 - Assert new post is visible in forum", async () => {
      await expect(page.locator(forum.TITLE_NEW_POST).first()).toContainText(
        TITLE
      );
      await expect(page.locator(forum.DETAILS_POST).first()).toContainText(
        DETAILS
      );
    });
    await test.step("4 - Go to Search - Announcements filter", async () => {
      await sidebar.goToModule("Search");
      await searchPage.clickAnnouncementsFilter();
      await searchPage.textToSearch(TITLE);
      await expect(page.locator(searchPage.SPINNER_LOADER)).toBeHidden();
      await expect(
        page.locator(searchPage.SEARCH_RESULT_MATCHES_A)
      ).toBeVisible();
    });
    await test.step("5 - Assert result is 1, title and details are correct", async () => {
      const count = await page
        .locator(searchPage.SEARCH_RESULT_MATCHES_A)
        .count();
      expect(count).toBe(1);
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_A)).toHaveText(
        TITLE
      );
      await expect(
        page.locator(searchPage.SEARCH_RESULT_MATCHES_DETAIL).last()
      ).toHaveText(DETAILS);
    });
  });
});
