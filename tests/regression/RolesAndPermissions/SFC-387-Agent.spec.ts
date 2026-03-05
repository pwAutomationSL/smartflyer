import { test, expect } from '../../../fixtures/PlaywrightFixtures';
const PROPERTY_NAME_BRAND_DRAFT = 'Olympus';
const PROPERTY_NAME_BRAND_APPROVED = 'Disney Cruise Line';
const PROPERTY_NAME_HOTEL_DRAFT = 'Mountain View Lodge';
const PROPERTY_NAME_HOTEL_APPROVED = 'The Kensington';
const PROPERTY_NAME_ONSITE_DRAFT = 'Azure Horizon Resort Test';
const PROPERTY_NAME_ONSITE_APPROVED = 'Abercrombie & Kent Japan';
const AGENT_USERNAME = { username: 'useragent@scrumlaunch.com', password: 'sf_agents_01@' };
test.setTimeout(200000);
test.describe('SFC-387 Agent', () => {
  test('As an Agent user i can not see draft, and can seepublished partners without Status Column- Brand', async ({
    loginPage,
    page,
    sidebar,
    partners,
  }) => {
    await test.step('1 - Log in to Society ', async () => {
      await loginPage.login(AGENT_USERNAME);
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
    });
    await test.step('2 - From the sidebar, navigate to Partners and open the Partners form.', async () => {
      await sidebar.goToModule('Partners');
      await expect(page.locator(partners.HEADER)).toBeVisible();
      await expect(page.locator(partners.SHARE_TOPBAR)).toBeHidden();
    });
    await test.step('3 - Search Draft Partner Brand.', async () => {
      await partners.fillSearch(PROPERTY_NAME_BRAND_DRAFT);
      await partners.clickSearch();
      await page.waitForLoadState('networkidle');
      const BrandResult = await page.locator(partners.SEARCH_RESULTS_A).count();
      expect(BrandResult).toEqual(0);
      await expect(page.locator(partners.SEARCH_RESULTS_SOCIETY_STATUS)).toBeHidden();
    });
    await test.step('4 - Search Approved Partner Brand. and Status Column is not visible', async () => {
      await partners.fillSearch(PROPERTY_NAME_BRAND_APPROVED);
      await partners.clickSearch();
      await page.waitForLoadState('networkidle');
      const BrandResult = await page.locator(partners.SEARCH_RESULTS_A).count();
      expect(BrandResult).toEqual(1);
      await expect(page.locator(partners.SEARCH_RESULTS_HEADERS).allTextContents).not.toContain([
        'Status',
      ]);
    });
  });
  test('As an Admin user i can see draft and published partners- Hotel', async ({
    loginPage,
    page,
    sidebar,
    partners,
  }) => {
    await test.step('1 - Log in to Society ', async () => {
      await loginPage.login(AGENT_USERNAME);
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
    });
    await test.step('2 - From the sidebar, navigate to Partners and open the Partners form.', async () => {
      await sidebar.goToModule('Partners');
      await expect(page.locator(partners.HEADER)).toBeVisible();
      await expect(page.locator(partners.SHARE_TOPBAR)).toBeHidden();
    });
    await test.step('3 - Search Draft Partner Hotel.', async () => {
      await partners.fillSearch(PROPERTY_NAME_HOTEL_DRAFT);
      await partners.clickSearch();
      await page.waitForLoadState('networkidle');
      const HotelResult = await page.locator(partners.SEARCH_RESULTS_A).count();
      expect(HotelResult).toEqual(0);
      await expect(page.locator(partners.SEARCH_RESULTS_SOCIETY_STATUS)).toBeHidden();
    });
    await test.step('4 - Search Approved Partner Hotel. and Status Column is not visible', async () => {
      await partners.fillSearch(PROPERTY_NAME_HOTEL_APPROVED);
      await partners.clickSearch();
      await page.waitForLoadState('networkidle');
      const BrandResult = await page.locator(partners.SEARCH_RESULTS_A).count();
      expect(BrandResult).toEqual(1);
      await expect(page.locator(partners.SEARCH_RESULTS_HEADERS).allTextContents).not.toContain([
        'Status',
      ]);
    });
  });
  test('As an Admin user i can see draft and published partners- Onsite', async ({
    loginPage,
    page,
    sidebar,
    partners,
  }) => {
    await test.step('1 - Log in to Society ', async () => {
      await loginPage.login(AGENT_USERNAME);
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
    });
    await test.step('2 - From the sidebar, navigate to Partners and open the Partners form.', async () => {
      await sidebar.goToModule('Partners');
      await expect(page.locator(partners.HEADER)).toBeVisible();
      await expect(page.locator(partners.SHARE_TOPBAR)).toBeHidden();
    });
    await test.step('3 - Search Draft Partner Onsite.', async () => {
      await partners.fillSearch(PROPERTY_NAME_ONSITE_DRAFT);
      await partners.clickSearch();
      await page.waitForLoadState('networkidle');
      const HotelResult = await page.locator(partners.SEARCH_RESULTS_A).count();
      expect(HotelResult).toEqual(0);
      await expect(page.locator(partners.SEARCH_RESULTS_SOCIETY_STATUS)).toBeHidden();
    });
    await test.step('4 - Search Approved Partner Onsite. and Status Column is not visible', async () => {
      await partners.fillSearch(PROPERTY_NAME_ONSITE_APPROVED);
      await partners.clickSearch();
      await page.waitForLoadState('networkidle');
      const BrandResult = await page.locator(partners.SEARCH_RESULTS_A).count();
      expect(BrandResult).toEqual(1);
      await expect(page.locator(partners.SEARCH_RESULTS_HEADERS).allTextContents).not.toContain([
        'Status',
      ]);
    });
  });
});
