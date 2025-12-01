import { test, expect } from "../../../fixtures/PlaywrightFixtures";
import { uniqueId } from "../../../page-objects";

const FAQ = `New FAQ ` + uniqueId();
test.describe("GS-007 - Search - FAQs filter", () => {
  test("Login at Society (env) as an Admin", async ({
    loginPage,
    page,
    sidebar,
    searchPage,
    faqs,
  }) => {
    await test.step("1 - Login at Society as an Admin", async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
    });
    await test.step("2 - Go to Search - FAQs filter", async () => {
      await sidebar.goToModule("FAQs");
      await expect(page.locator(faqs.FAQS_HEADER)).toContainText("FAQs");
      await expect(page.locator(faqs.ADD_FAQ)).toBeEnabled();
      await faqs.addFaq();
      await expect(page.locator(faqs.ADD_FAQ_POPUP)).toBeVisible();
      await faqs.fillQuestion(FAQ);
      await faqs.fillAnswer(FAQ);
      await faqs.confirmAdd();
      await expect(page.locator(faqs.MODAL)).toBeHidden();
    });
    await test.step("3 - Assert result is at least 1, title and details are correct", async () => {
      await sidebar.goToModule("Search");
      await searchPage.clickFaqFilter();
      await searchPage.textToSearch(FAQ);
    });
    await test.step("4 - Assert result is at least 1, title and details are correct", async () => {
      const faqName = await searchPage.getFirstName();
      expect(faqName).toEqual(FAQ);
      await searchPage.clickFirstResult();
      await expect(page.locator(faqs.FAQS_HEADER)).toContainText("FAQs");
    });
  });
});
