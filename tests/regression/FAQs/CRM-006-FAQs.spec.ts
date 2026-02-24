import { test, expect } from '../../../fixtures/PlaywrightFixtures';
import { uniqueId } from '../../../page-objects';

const FAQ = `New FAQ ` + uniqueId();
const FAQ_UPDATE = `Updated FAQ ` + uniqueId();
test.describe('CRM-006 - FAQ', () => {
  test('The purpose of this test is to validate the action of adding a FAQ at the FAQs section at Society.', async ({
    loginPage,
    page,
    sidebar,
    searchPage,
    faqs,
  }) => {
    await test.step('As an admin, I want to create a new FAQ.', async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
      await sidebar.goToModule('FAQs');
      await expect(page.locator(faqs.FAQS_HEADER)).toContainText('FAQs');
      await expect(page.locator(faqs.ADD_FAQ)).toBeEnabled();
      await faqs.addFaq();
      await expect(page.locator(faqs.ADD_FAQ_POPUP)).toBeVisible();
      await faqs.fillQuestion(FAQ);
      await faqs.fillAnswer(FAQ);
      await faqs.confirmAdd();
      await expect(page.locator(faqs.MODAL)).toBeHidden();
      await expect(page.locator(faqs.SUCCESS_POPUP)).toContainText('Success');
      await faqs.clickOK();
    });
    await test.step('As an admin, I want to search and edit a FAQ.', async () => {
      await expect(page.locator(faqs.FAQS_HEADER)).toContainText('FAQs');
      await expect(page.locator(faqs.ADD_FAQ)).toBeEnabled();
      await faqs.searchFAQ(FAQ);
      await expect(page.locator(faqs.COLUMNS_BY_INDEX(2))).toContainText(FAQ);
      await faqs.editFAQ();
      await faqs.fillQuestion(FAQ_UPDATE);
      await faqs.confirmAdd();
      await expect(page.locator(faqs.MODAL)).toBeHidden();
      await expect(page.locator(faqs.SUCCESS_POPUP)).toContainText('Success');
      await faqs.clickOK();
      await faqs.searchFAQ(FAQ_UPDATE);
      await expect(page.locator(faqs.COLUMNS_BY_INDEX(2))).toContainText(FAQ_UPDATE);
      await faqs.searchFAQ(FAQ);
      await expect(page.locator(faqs.COLUMNS_BY_INDEX(1))).toContainText(
        'No matching records found',
      );
    });
    await test.step('As an admin, I want to search and delete a FAQ.', async () => {
      await expect(page.locator(faqs.FAQS_HEADER)).toContainText('FAQs');
      await expect(page.locator(faqs.ADD_FAQ)).toBeEnabled();
      await faqs.searchFAQ(FAQ_UPDATE);
      await expect(page.locator(faqs.COLUMNS_BY_INDEX(2))).toContainText(FAQ_UPDATE);
      await faqs.deleteFAQ();
      await faqs.confirmDeleteFAQ();
      await expect(page.locator(faqs.MODAL)).toBeHidden();
      await expect(page.locator(faqs.SUCCESS_POPUP)).toContainText('Success');
      await faqs.clickOK();
      await faqs.searchFAQ(FAQ_UPDATE);
      await expect(page.locator(faqs.COLUMNS_BY_INDEX(1))).toContainText(
        'No matching records found',
      );
    });
  });
});
