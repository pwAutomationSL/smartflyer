import { test, expect } from "../../fixtures/PlaywrightFixtures";
import { uniqueId } from "../../page-objects";
import { HOTEL_REQUIRED_FIELDS, DESTINATIONS } from "../../data";
const SHARE_FORM_DATA = {
  partnerType: "Hotel",
  destinaton: "Americas",
  partnerProgram: "SmartFlyer Elevate",
};
const PROPERTY_NAME = "New Property name" + uniqueId();
let json: any;

test.describe("PF-005 - e2e for Partner Form", () => {
  test("Login at Society (env) as an Admin", async ({
    loginPage,
    page,
    sidebar,
    partners,
    partnersHotel,
    toast,
  }) => {
    await test.step("1 - Log in to Society with an Admin account.", async () => {
      await loginPage.login();
      await expect(page.locator(loginPage.EMAIL_INPUT)).toBeHidden();
    });
    await test.step("2 - From the sidebar, navigate to Partners and open the Partners form.", async () => {
      await sidebar.goToModule("Partners");
      await expect(page.locator(partners.HEADER)).toBeVisible();
      await expect(page.locator(partners.SHARE_TOPBAR)).toBeEnabled();
    });
    await test.step("3 - Click Share.", async () => {
      await partners.clickShare();
    });
    await test.step("4 - In the pop-up, click Create without filling any fields.", async () => {
      await partners.clickCreate();
      await expect(page.locator(toast.TOAST_MESSAGE)).toContainText(
        "Partner Type, Destination, Partner Program and Property Name are required"
      );
      await expect(page.locator(toast.TOAST_MESSAGE)).toBeHidden({
        timeout: 15000,
      });
    });
    await test.step("5 - 6 Fill in all required fields with valid data and click Create. Overview form is open in a new browser tab. open Edit page", async () => {
      await partners.selectPartnerType(SHARE_FORM_DATA.partnerType);
      await partners.selectDestination(SHARE_FORM_DATA.destinaton);
      await partners.selectPartnerProgram(SHARE_FORM_DATA.partnerProgram);
      await partners.typePropertyName(PROPERTY_NAME);
      ({ json } = await partners.createAndReturnResponse());
      await expect(page.locator(toast.TOAST_MESSAGE)).toContainText(
        "Partner created successfully"
      );
      await page.goto(new URL(json.link, page.url()).toString());
    });
    await test.step("7 - Verify the header text.", async () => {
      await expect(
        page.locator(partners.BRAND_SUBMISSION_FORM_H1)
      ).toContainText("Submission Form");
      await expect(
        page.locator(partners.TEXT_BY_LABEL("Overview"))
      ).toContainText(
        "The purpose of this section is to craft your client-facing review page on smartflyer.com. Keep in mind we use a very conversational writing style on our site, ensuring the content we provide is differentiated from what clients may find elsewhere. So please write as you’d speak! Please refrain from copy and pasting your hotel’s website copy into the fields below. In order to optimize your profile’s search engine ranking, we need the language to be as original as possible and no less than 30% differentiated from what appears on your website. Thank you!"
      );
    });
    await test.step("8 - Overview", async () => {
      for (const field of HOTEL_REQUIRED_FIELDS)
        await expect(
          page.locator(partners.REQUIRED_FIELDS_BY_LABEL(field)).last()
        ).toBeVisible();
      await partners.oneSentenceToDescribeYourProperty();
      await partnersHotel.cityOrRegion();
      await partnersHotel.addCountry();
      await partnersHotel.attachHeroImage();
      await partners.propertyOverview();
      await partnersHotel.insiderTips();
      await partners.fillSmartFlyerAmenities();
      await partners.fillPreferredPartnerProgramAmenities();
      await partners.fillVirtuosoAmenities();
      await partnersHotel.advisorsBook();
      await partnersHotel.featuredAmenities();
      await partnersHotel.accommodationsMainTitle();
      await partnersHotel.accommodationsHeroImage();
      await partnersHotel.accommodationsDescription();
      await partnersHotel.accommodationsFeaturedRoom();
      await partnersHotel.accommodationsPool();
      await partnersHotel.accommodationsGym();
      await partnersHotel.accommodationsSpa();
      await partnersHotel.accommodationsRestaurant();
      await partnersHotel.accommodationsBar();
      await partnersHotel.propertySpecifics();
    });

    await test.step("9 - Click Save and Next, user will be redirected to Contacts Form", async () => {
      await partners.saveAndNext();
      await expect(page.locator(partners.CONTACTS_TAB_TOP)).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });
    await test.step("10 - Contacts", async () => {
      await partnersHotel.fillGlobalContactInfoHotel();
      await partnersHotel.fillSalesContact();
      await partnersHotel.fillGeneralManagerContact();
      await partnersHotel.fillReservationsContact();
      await partnersHotel.fillGroupContact();
      await partnersHotel.fillConciergeContact();
      await partnersHotel.fillCommissionContact();
      await partnersHotel.fillAdditionalContact();
    });
    await test.step("11 - Click Save and Next and Land on Things To Know Tab", async () => {
      await partners.saveAndNext();
      await expect(
        page.locator(partnersHotel.THINGS_TO_KNOW_TAB_TOP)
      ).toHaveAttribute("aria-selected", "true");
      await expect(
        page.locator(partnersHotel.INFO_TEXT_THINGS_TO_KNOW_TOP)
      ).toHaveText(
        "The purpose of this section is to provide a summary of your property to be featured on our internal agent-facing intranet (Society). This information is password protected + exclusively available to our SmartFlyer travel advisors. Please refrain from copy + pasting your hotel’s website copy into the fields below and write how you speak!"
      );
    });
    await test.step("12 -  Things To Know", async () => {
      await partnersHotel.locationDetails();
      await partners.fillIndustryAffiliationTTK();
      await partnersHotel.accommodationDetails();
      await partnersHotel.groupBookings();
      await partnersHotel.startingRates();
      await partnersHotel.additionalDetails();
    });
    await test.step("13 - Click Save and Next and Land on Booking and Commissions", async () => {
      await partners.saveAndNext();
      await expect(
        page.locator(partners.BOOKINGS_COMMISSIONS_TAB_TOP)
      ).toHaveAttribute("aria-selected", "true");
    });
    await test.step("14 - Booking & Commissions", async () => {
      await partners.checkCommissionsOffering();
      await partnersHotel.checkCommissionsOfferingHotel();
      await partnersHotel.bestWayToBook();
      await partnersHotel.commissionPaymentDetails();
    });
    await test.step("15 - Click Save and Next and Land on Latest Updates", async () => {
      await partners.saveAndNext();
      await expect(
        page.locator(partnersHotel.LATESTS_UPDATES_TAB_TOP)
      ).toHaveAttribute("aria-selected", "true");
    });
    await test.step("16 - Latest Updates", async () => {
      await partnersHotel.propertyUpdates();
      await partners.offersAndPromotionsMKT();
      await partnersHotel.peakAvailabilities();
      await partnersHotel.training();
      await partnersHotel.advisorFeedback();
    });
    await test.step("17 - Click Save and Next and Land on Marketing", async () => {
      await partners.saveAndNext();
      await expect(page.locator(partners.MARKETING_TAB_TOP)).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });
    await test.step("18 - Marketing", async () => {
      await partners.marketingMKT();
      await partnersHotel.socialMediaStoryHotelMKT();
    });
    await test.step("19 - Click Save and Next and Land on Settings", async () => {
      await partners.saveAndNext();
      await expect(page.locator(partners.SETTINGS_TAB_TOP)).toHaveAttribute(
        "aria-selected",
        "true"
      );
    });
    await test.step("20 - Settings", async () => {
      await partnersHotel.societySetting();
    });
    await test.step("21 - Click Save and Finish", async () => {
      await partners.saveAndNext();
    });
    await test.step("22 - Click Save and Finish", async () => {
      await sidebar.goToModule("Partners");
      await expect(page.locator(partners.HEADER)).toBeVisible();
      await expect(page.locator(partners.SHARE_TOPBAR)).toBeEnabled();
    });
  });
});
