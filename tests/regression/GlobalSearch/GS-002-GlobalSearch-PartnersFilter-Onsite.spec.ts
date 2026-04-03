import { test, expect } from '../../../fixtures/PlaywrightFixtures';
import { uniqueId } from '../../../page-objects';
const SHARE_FORM_DATA = {
  partnerType: 'Onsite',
  destinaton: 'Americas',
  partnerProgram: 'SmartFlyer Elevate',
};
const PROPERTY_NAME = 'Onsite ' + uniqueId();
let json: any;

test.describe('GS-002 - Search - Partners filter Onsite', () => {
  test('Login at Society (env) as an Admin', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    partners,
    searchPage,
    toast,
  }) => {
    await test.step('1 - Log in to Society with an Admin account.', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
    });
    await test.step('2 - From the sidebar, navigate to Partners and open the Partners form.', async () => {
      await sidebar.goToModule('Partners');
      await expect(page.locator(partners.HEADER)).toBeVisible();
      await expect(page.locator(partners.SHARE_TOPBAR)).toBeEnabled();
    });
    await test.step('3 - Click Share.', async () => {
      await partners.clickShare();
    });
    await test.step('4 - Fill in all required fields with valid data and click Create. Overview form is open in a new browser tab. open Edit page', async () => {
      await partners.selectPartnerType(SHARE_FORM_DATA.partnerType);
      await partners.selectDestination(SHARE_FORM_DATA.destinaton);
      await partners.selectPartnerProgram(SHARE_FORM_DATA.partnerProgram);
      await partners.typePropertyName(PROPERTY_NAME);
      ({ json } = await partners.createAndReturnResponse());
      await expect(page.locator(toast.TOAST_MESSAGE)).toContainText('Partner created successfully');
      await page.goto(new URL(json.link, page.url()).toString());
    });
    await test.step('5 - Verify the header text.', async () => {
      await expect(page.locator(partners.BRAND_SUBMISSION_FORM_H1)).toContainText(
        'Submission Form',
      );
    });
    await test.step('6 - Verify the header text.', async () => {
      await sidebar.goToModule('Partners');
      await expect(page.locator(partners.HEADER)).toBeVisible();
      await expect(page.locator(partners.SHARE_TOPBAR)).toBeEnabled();
      await partners.searchPartner(PROPERTY_NAME);
      await expect(page.locator(partners.DRAFT_BUTTON_FIRST)).toBeVisible({
        timeout: 25000,
      });
      await partners.approveNewPartner();
      await expect(page.locator(partners.DRAFT_BUTTON_FIRST)).toContainText('Approved', {
        timeout: 25000,
      });
    });
    await test.step('7 - Go to Search - Partner filter', async () => {
      await sidebar.goToModule('Search');
      await searchPage.clickPartnerFilter();
      await searchPage.checkPartnerOnsiteFilter();
      await searchPage.textToSearch(PROPERTY_NAME);
      await expect(page.locator(searchPage.SPINNER_LOADER)).toBeHidden();
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_A)).toBeVisible();
    });
    await test.step('8 - Assert result is 1, title and details are correct', async () => {
      const count = await page.locator(searchPage.SEARCH_RESULT_MATCHES_A).count();
      expect(count).toBe(1);
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_A)).toHaveText(PROPERTY_NAME);
    });
  });
});
