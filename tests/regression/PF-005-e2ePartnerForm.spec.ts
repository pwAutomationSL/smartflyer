import { test, expect } from "../../fixtures/PlaywrightFixtures";
import { uniqueId } from "../../page-objects";
import { BRAND_REQUIRED_FIELDS, DESTINATIONS } from "../../data";
const SHARE_FORM_DATA = {
  partnerType: "Brand",
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
        "The purpose of this section is to craft your brand-wide profile on smartflyer.com. Keep in mind we use a very conversational writing style on our site, ensuring the content we provide is differentiated from what clients may find elsewhere. So please write as you’d speak! Please refrain from copy and pasting your hotel’s website copy into the fields below. In order to optimize your profile’s search engine ranking, we need the language to be as original as possible and at least 30% differentiated from what appears on your website. Thank you!"
      );
    });
    await test.step("8 - Main details section - review destination options. Americas, Caribbean & Mexico, Europe, Africa, Middle East, Asia , Australia & New Zealand", async () => {
      for (const destination of DESTINATIONS)
        await expect(
          page.locator(partners.DESTINATIONS_CHECKBOXES(destination))
        ).toBeVisible();
    });
    await test.step("9 - Locate required brand fields.", async () => {
      for (const field of BRAND_REQUIRED_FIELDS)
        await expect(
          page.locator(partners.REQUIRED_FIELDS_BY_LABEL(field)).last()
        ).toBeVisible();
    });
  });
});
