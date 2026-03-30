import { test, expect } from '../../../fixtures/PlaywrightFixtures';
import { uniqueId } from '../../../page-objects';
import { BRAND_REQUIRED_FIELDS, DESTINATIONS } from '../../../data';
const SHARE_FORM_DATA = {
  partnerType: 'Brand',
  destinaton: 'Americas',
  partnerProgram: 'SmartFlyer Elevate',
};
const PROPERTY_NAME = 'New Property name' + uniqueId();
let json: any;
test.setTimeout(200000);
test.describe('PF-005 - e2e for Partner Form', () => {
  test('Login at Society (env) as an Admin', async ({
    loginPage,
    page,
    sidebar,
    partners,
    toast,
  }) => {
    await test.step('1 - Log in to Society with an Admin account.', async () => {
      await loginPage.login();
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
    await test.step('4 - In the pop-up, click Create without filling any fields.', async () => {
      await partners.clickCreate();
      await expect(page.locator(toast.TOAST_MESSAGE)).toContainText(
        'Partner Type, Destination, Partner Program and Property Name are required',
      );
      await expect(page.locator(toast.TOAST_MESSAGE)).toBeHidden({
        timeout: 15000,
      });
    });
    await test.step('5 - 6 Fill in all required fields with valid data and click Create. Overview form is open in a new browser tab. open Edit page', async () => {
      await partners.selectPartnerType(SHARE_FORM_DATA.partnerType);
      await partners.selectDestination(SHARE_FORM_DATA.destinaton);
      await partners.selectPartnerProgram(SHARE_FORM_DATA.partnerProgram);
      await partners.typePropertyName(PROPERTY_NAME);
      ({ json } = await partners.createAndReturnResponse());
      await expect(page.locator(toast.TOAST_MESSAGE)).toContainText('Partner created successfully');
      await page.goto(new URL(json.link, page.url()).toString());
    });
    await test.step('7 - Verify the header text.', async () => {
      await expect(page.locator(partners.BRAND_SUBMISSION_FORM_H1)).toContainText(
        'Submission Form',
      );
      await expect(page.locator(partners.TEXT_BY_LABEL('Overview'))).toContainText(
        'The purpose of this section is to craft your brand-wide profile on smartflyer.com. Keep in mind we use a very conversational writing style on our site, ensuring the content we provide is differentiated from what clients may find elsewhere. So please write as you’d speak! Please refrain from copy and pasting your hotel’s website copy into the fields below. In order to optimize your profile’s search engine ranking, we need the language to be as original as possible and at least 30% differentiated from what appears on your website. Thank you!',
      );
    });
    await test.step('8 - Main details section - review destination options. Americas, Caribbean & Mexico, Europe, Africa, Middle East, Asia , Australia & New Zealand', async () => {
      for (const destination of DESTINATIONS)
        await expect(page.locator(partners.DESTINATIONS_CHECKBOXES(destination))).toBeVisible();
    });
    await test.step('9 - Locate required brand fields.', async () => {
      for (const field of BRAND_REQUIRED_FIELDS)
        await expect(page.locator(partners.REQUIRED_FIELDS_BY_LABEL(field)).last()).toBeVisible();
    });
    await test.step('10 - Overview', async () => {
      await partners.destinationsCoverage();
      await partners.fillMandatoryBrandFields();
      await partners.fillSmartFlyerAmenities();
      await partners.addMoreSmartFlyerAmenities();
      await partners.fillPreferredPartnerProgramAmenities();
      await partners.fillVirtuosoAmenities();
    });
    await test.step('15 - Click Save and Next, user will be redirected to Contacts Form', async () => {
      await partners.saveAndNext();
      await expect(page.locator(toast.TOAST_MESSAGE)).toContainText(
        'Record Successfully Updated. ',
      );
      await expect(page.locator(partners.CONTACTS_TAB_TOP)).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });
    await test.step('16 - Contacts', async () => {
      await partners.fillGlobalContactInfo();
      await partners.fillHelpDeskContact();
      await partners.fillCommissionContact();
      await partners.fillAdditionalContacts();
    });
    await test.step('20 - Click Save and Next and Land on Properties Tab and Add Property', async () => {
      await partners.saveAndNext();
      await expect(page.locator(toast.TOAST_MESSAGE)).toContainText(
        'Record Successfully Updated. ',
      );
      await expect(page.locator(partners.PROPERTIES_TAB_TOP)).toHaveAttribute(
        'aria-selected',
        'true',
      );
      await expect(page.locator(partners.INFO_TEXT_PROPERTIES_TOP)).toHaveText(
        'Please use this section to enter all individual hotels that will be included in the SmartFlyer Elevate Brand-Wide Partnership. Once entered, each individual hotel will receive an email from Society prompting them to fill out their designated property profile form. If they have an existing page in our system, the property will populate in the dropdown, and they will be invited to edit their existing page. Once the individual hotel profile has been completed, it will automatically link to your brand in the section below.',
      );
      await partners.addProperty();
      await partners.selectPropertyName();
      await partners.fillPropertyName('test');
      await expect(page.locator(partners.PROPERTIES_OPTIONS_RESULTS).first()).toBeVisible();
      await partners.selectFirstOtion();
      await partners.fillPropertiesPrimaryContactEmail();
      await partners.fillPropertiesFirstName();
      await partners.fillPropertiesLastName();
    });
    await test.step('22 - Click Save and Next and Land on Things To Know Tab', async () => {
      await partners.saveAndNext();
      await expect(page.locator(toast.TOAST_MESSAGE)).toContainText(
        'Record Successfully Updated. ',
      );
      await expect(page.locator(partners.THINGS_TO_KNOW_TAB_TOP)).toHaveAttribute(
        'aria-selected',
        'true',
      );
      await expect(page.locator(partners.INFO_TEXT_THINGS_TO_KNOW_TOP)).toHaveText(
        'The purpose of this section is to provide a summary of your property to be featured on our internal agent-facing intranet (Society). This information is password protected + exclusively available to our SmartFlyer travel advisors. Please refrain from copy + pasting your hotel’s website copy into the fields below and write how you speak!',
      );
    });
    await test.step('24 - Things to know', async () => {
      await partners.fillClienteleTTK();
      await partners.fillIndustryAffiliationTTK();
      await partners.industryAffiliationBrand();
      await partners.fillKeySellingPointsTTK();
      await partners.fillTipsTTK();
      await partners.fillPreferredPartnerProgramTTK();
    });
    await test.step('29 - Click Save and Next and Land on Booking and Commissions', async () => {
      await partners.saveAndNext();
      await expect(page.locator(toast.TOAST_MESSAGE)).toContainText(
        'Record Successfully Updated. ',
      );
      await expect(page.locator(partners.BOOKINGS_COMMISSIONS_TAB_TOP)).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });
    await test.step('31 - Booking and Commissions', async () => {
      await partners.checkCommissionsOffering();
      await partners.agentBenefitsUpload();
      await partners.bestWayToBook();
      await partners.bestWayToBook();
      await partners.howAreCommissionsPAid();
      await partners.receiveCommission();
      await partners.shareNameOfLLC();
    });
    await test.step('38 - Click Save and Next and Land on Marketing & Latest Updates', async () => {
      await partners.saveAndNext();
      await expect(page.locator(toast.TOAST_MESSAGE)).toContainText(
        'Record Successfully Updated. ',
      );
      await expect(page.locator(partners.MARKETING_TAB_TOP)).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });
    await test.step('40 - Marketing & Latest Updates', async () => {
      await partners.latestUpdatesMarketing();
      await partners.offersAndPromotionsMKT();
      await partners.trainingMKT();
      await partners.articlesMKT();
      await partners.marketingMKT();
      await partners.socialMediaStoryMKT();
    });
    await test.step('46 - Click Save and Next and Land on Settings', async () => {
      await partners.saveAndNext();
      await expect(page.locator(toast.TOAST_MESSAGE)).toContainText(
        'Record Successfully Updated. ',
      );
      await expect(page.locator(partners.SETTINGS_TAB_TOP)).toHaveAttribute(
        'aria-selected',
        'true',
      );
    });
    await test.step('48 - Settings', async () => {
      await partners.societySetting();
    });
    await test.step('49 - Click Save and Finish', async () => {
      await partners.saveAndFinish();
      await expect(page.locator(toast.TOAST_MESSAGE)).toContainText(
        'Record Successfully Updated. ',
      );
    });
  });
});
