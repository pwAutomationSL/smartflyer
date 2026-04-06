import { test, expect } from '../../../fixtures/PlaywrightFixtures';
const PROPERTY_NAME_BRAND_DRAFT = 'Olympus';
const PROPERTY_NAME_BRAND_APPROVED = 'Disney Cruise Line';
const PROPERTY_NAME_HOTEL_DRAFT = 'Mountain View Lodge';
const PROPERTY_NAME_HOTEL_APPROVED = 'The Kensington';
const PROPERTY_NAME_ONSITE_DRAFT = 'Azure Horizon Resort Test';
const PROPERTY_NAME_ONSITE_APPROVED = 'Abercrombie & Kent Japan';
test.setTimeout(200000);
test.describe('SFC-387 Admin', () => {
  test('As an Admin user i can see draft and published partners- Brand', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    partners,
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
    await test.step('3 - Search Draft Partner Brand.', async () => {
      await partners.fillSearch(PROPERTY_NAME_BRAND_DRAFT);
      await partners.clickSearch();
      await page.waitForLoadState('networkidle');
      const BrandResult = await page.locator(partners.SEARCH_RESULTS_A).count();
      expect(BrandResult).toEqual(1);
      await expect(page.locator(partners.SEARCH_RESULTS_SOCIETY_STATUS)).toContainText(['Draft']);
    });
    await test.step('4 - Search Approved Partner Brand.', async () => {
      await partners.fillSearch(PROPERTY_NAME_BRAND_APPROVED);
      await partners.clickSearch();
      await page.waitForLoadState('networkidle');
      const BrandResult = await page.locator(partners.SEARCH_RESULTS_A).count();
      expect(BrandResult).toEqual(1);
      await expect(page.locator(partners.SEARCH_RESULTS_SOCIETY_STATUS)).toContainText('Approved');
    });
  });
  test('As an Admin user i can see draft and published partners in global search- Brand', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    searchPage,
  }) => {
    await test.step('1 - Log in to Society with an Admin account.', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
    });
    await test.step('2 - Go to Search - Search Approved Partner Brand. Assert result is 1, title and details are correct', async () => {
      await sidebar.goToModule('Search');
      await searchPage.clickPartnerFilter();
      await searchPage.checkPartnerBrandFilter();
      await searchPage.textToSearch(PROPERTY_NAME_BRAND_APPROVED);
      await expect(page.locator(searchPage.SPINNER_LOADER)).toBeHidden();
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_SPAN)).toBeVisible();
      const count = await page.locator(searchPage.SEARCH_RESULT_MATCHES_SPAN).count();
      expect(count).toBe(1);
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_SPAN)).toHaveText(
        PROPERTY_NAME_BRAND_APPROVED,
      );
    });
    await test.step('3 - Go to Search - Search Drafted Partner Brand. Assert result is 1', async () => {
      await searchPage.textToSearch(PROPERTY_NAME_BRAND_DRAFT);
      await expect(page.locator(searchPage.SPINNER_LOADER)).toBeHidden();
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_SPAN)).toBeVisible();
      const count = await page.locator(searchPage.SEARCH_RESULT_MATCHES_SPAN).count();
      expect(count).toBe(1);
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_SPAN)).toHaveText(
        PROPERTY_NAME_BRAND_DRAFT,
      );
    });
  });
  test('As an Admin user i can see draft and published partners- Hotel', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    partners,
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
    await test.step('3 - Search Draft Partner Hotel.', async () => {
      await partners.fillSearch(PROPERTY_NAME_HOTEL_DRAFT);
      await partners.clickSearch();
      await page.waitForLoadState('networkidle');
      const HotelResult = await page.locator(partners.SEARCH_RESULTS_A).count();
      expect(HotelResult).toEqual(1);
      await expect(page.locator(partners.SEARCH_RESULTS_SOCIETY_STATUS)).toContainText(['Draft']);
    });
    await test.step('4 - Search Approved Partner Hotel.', async () => {
      await partners.fillSearch(PROPERTY_NAME_HOTEL_APPROVED);
      await partners.clickSearch();
      await page.waitForLoadState('networkidle');
      const BrandResult = await page.locator(partners.SEARCH_RESULTS_A).count();
      expect(BrandResult).toEqual(1);
      await expect(page.locator(partners.SEARCH_RESULTS_SOCIETY_STATUS)).toContainText('Approved');
    });
  });
  test('As an Admin user i can see draft and published partners in global search- Hotel', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    searchPage,
  }) => {
    await test.step('1 - Log in to Society with an Admin account.', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
    });
    await test.step('2 - Go to Search - Search Approved Partner Hotel. Assert result is 1, title and details are correct', async () => {
      await sidebar.goToModule('Search');
      await searchPage.clickPartnerFilter();
      await searchPage.checkPartnerHotelFilter();
      await searchPage.textToSearch(PROPERTY_NAME_HOTEL_APPROVED);
      await expect(page.locator(searchPage.SPINNER_LOADER)).toBeHidden();
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_SPAN)).toBeVisible();
      const count = await page.locator(searchPage.SEARCH_RESULT_MATCHES_SPAN).count();
      expect(count).toBe(1);
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_SPAN)).toHaveText(
        PROPERTY_NAME_HOTEL_APPROVED,
      );
    });
    await test.step('3 - Go to Search - Search Drafted Partner Hotel. Assert result is 1', async () => {
      await searchPage.textToSearch(PROPERTY_NAME_HOTEL_DRAFT);
      await expect(page.locator(searchPage.SPINNER_LOADER)).toBeHidden();
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_SPAN)).toBeVisible();
      const count = await page.locator(searchPage.SEARCH_RESULT_MATCHES_SPAN).count();
      expect(count).toBe(1);
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_SPAN)).toHaveText(
        PROPERTY_NAME_HOTEL_DRAFT,
      );
    });
  });
  test('As an Admin user i can see draft and published partners- Onsite', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    partners,
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
    await test.step('3 - Search Draft Partner Onsite.', async () => {
      await partners.fillSearch(PROPERTY_NAME_ONSITE_DRAFT);
      await partners.clickSearch();
      await page.waitForLoadState('networkidle');
      const HotelResult = await page.locator(partners.SEARCH_RESULTS_A).count();
      expect(HotelResult).toEqual(1);
      await expect(page.locator(partners.SEARCH_RESULTS_SOCIETY_STATUS)).toContainText(['Draft']);
    });
    await test.step('4 - Search Approved Partner Onsite.', async () => {
      await partners.fillSearch(PROPERTY_NAME_ONSITE_APPROVED);
      await partners.clickSearch();
      await page.waitForLoadState('networkidle');
      const BrandResult = await page.locator(partners.SEARCH_RESULTS_A).count();
      expect(BrandResult).toEqual(1);
      await expect(page.locator(partners.SEARCH_RESULTS_SOCIETY_STATUS)).toContainText('Approved');
    });
  });
  test('As an Admin user i can see draft and published partners in global search- Onsite', async ({
    loginPage,
    username,
    password,
    page,
    sidebar,
    searchPage,
  }) => {
    await test.step('1 - Log in to Society with an Admin account.', async () => {
      await loginPage.login({ username, password });
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden({ timeout: 15000 });
    });
    await test.step('2 - Go to Search - Search Approved Partner Hotel. Assert result is 1, title and details are correct', async () => {
      await sidebar.goToModule('Search');
      await searchPage.clickPartnerFilter();
      await searchPage.checkPartnerOnsiteFilter();
      await searchPage.textToSearch(PROPERTY_NAME_ONSITE_APPROVED);
      await expect(page.locator(searchPage.SPINNER_LOADER)).toBeHidden();
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_SPAN)).toBeVisible();
      const count = await page.locator(searchPage.SEARCH_RESULT_MATCHES_SPAN).count();
      expect(count).toBe(1);
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_SPAN)).toHaveText(
        PROPERTY_NAME_ONSITE_APPROVED,
      );
    });
    await test.step('3 - Go to Search - Search Drafted Partner Hotel. Assert result is 1', async () => {
      await searchPage.textToSearch(PROPERTY_NAME_ONSITE_DRAFT);
      await expect(page.locator(searchPage.SPINNER_LOADER)).toBeHidden();
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_SPAN)).toBeVisible();
      const count = await page.locator(searchPage.SEARCH_RESULT_MATCHES_SPAN).count();
      expect(count).toBe(1);
      await expect(page.locator(searchPage.SEARCH_RESULT_MATCHES_SPAN)).toHaveText(
        PROPERTY_NAME_ONSITE_DRAFT,
      );
    });
  });
});
