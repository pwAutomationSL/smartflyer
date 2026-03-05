import { Page } from '@playwright/test';
const env = process.env.ENVIRONMENT ?? 'stage';

export class Partners {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }
  private shareEndpoint = `https://crm.${env}.smartflyer.com/share_link`;
  public readonly HEADER = `//h1`;
  public readonly CONTACTS_TAB_TOP = `//button[@id="pills-contact-tab"]`;
  public readonly PROPERTIES_TAB_TOP = `//button[@id="pills-property-tab"]`;
  public readonly INFO_TEXT_PROPERTIES_TOP = `(//div[@aria-labelledby="pills-property-tab"]//div/p)[1]`;
  public readonly THINGS_TO_KNOW_TAB_TOP = `//button[@id="pills-things_to_know-tab"]`;
  public readonly BOOKINGS_COMMISSIONS_TAB_TOP = `//button[@id="pills-booking_and_commission-tab"]`;
  public readonly MARKETING_TAB_TOP = `//button[@id="pills-marketing-tab"]`;
  public readonly SETTINGS_TAB_TOP = `//button[@id="pills-settings-tab"]`;
  public readonly INFO_TEXT_THINGS_TO_KNOW_TOP = `(//div[@aria-labelledby="pills-things_to_know-tab"]//div/p)[1]`;
  public readonly SHARE_TOPBAR = `//div[contains(@class,'topbar')]//button[contains(.,'Share')]`;
  public readonly CREATE_BUTTON_MODAL = `(//div[contains(@class,'modal')]//button[contains(.,'Create')])[2]`;
  public readonly SEARCH_INPUT = `//input[@id="search_term"]`;
  public readonly SEARCH = `//button[text()='SEARCH']`;
  public readonly SEARCH_RESULT_MATCHES = `//div[contains(@class,'Layout_content')]//div/a[contains(@href,'https')]/div/div/div/p/span//mark`;
  public readonly PARTNER_TYPE_SELECT = `//select[@id="form_type"]`;
  public readonly PARTNER_SEARCH = `//input[@id="search_term"]`;
  public readonly SEARCH_BUTTON = `//button[contains(.,'SEARCH')]`;
  public readonly DESTINATION_SELECT = `//select[@id="new_destination_id"]`;
  public readonly PARTNER_PROGRAM_SELECT = `//select[@id="partner_program2"]`;
  public readonly PROPERTY_NAME = `//input[@id="share_title"]`;
  public readonly DRAFT_BUTTON_FIRST = `(//table[@id="partner_table"]//span)[1]`;
  public readonly CONFIRM_POPUP = `//button[contains(.,'Yes , Proceed!')]`;
  public readonly BRAND_SUBMISSION_FORM_H1 = `//H1`;
  public readonly PROPERTIES_OPTIONS_RESULTS = `//ul[contains(@class,'results')]/li`;
  public readonly SEARCH_RESULTS_A = `//table//td[1]//a[contains(@class,'link')]`;
  public readonly SEARCH_RESULTS_SOCIETY_STATUS = `(//tbody)[1]/tr/td[8]`;
  public readonly SEARCH_RESULTS_HEADERS = `//table[@id="partner_table"]/thead/tr/th`;
  public readonly DESTINATIONS_CHECKBOXES = (destination: string) =>
    `//input[contains(@id,"destination")]/../label[contains(.,'${destination}')]`;
  public readonly REQUIRED_FIELDS_BY_LABEL = (field: string) =>
    `//span[contains(.,'*')]/../../*[contains(.,'${field}')]`;
  public readonly TEXT_BY_LABEL = (label: string) => `//h4[contains(.,'${label}')]/../p`;
  public async clickShare() {
    await this.page.waitForTimeout(1000);
    await this.page.locator(this.SHARE_TOPBAR).isVisible();
    await this.page.locator(this.SHARE_TOPBAR).click({ force: true });
  }
  public async clickCreate() {
    await this.page.locator(this.CREATE_BUTTON_MODAL).click();
  }
  public async fillSearch(data: string) {
    await this.page.locator(this.SEARCH_INPUT).fill(data);
  }
  public async clickSearch() {
    await this.page.locator(this.SEARCH).click();
    await this.page.waitForTimeout(800);
  }
  async createAndReturnResponse() {
    const waitForCreate = this.page.waitForResponse(
      (res) => res.ok() && res.request().method() === 'POST' && res.url() === this.shareEndpoint,
    );
    const [newTab] = await Promise.all([
      this.page.context().waitForEvent('page'),
      await this.page.locator(this.CREATE_BUTTON_MODAL).click(),
    ]);
    const response = await waitForCreate;
    const json = await response.json();
    await newTab.waitForLoadState('domcontentloaded');
    await newTab.close();
    return { json };
  }
  public async selectPartnerType(option: string) {
    await this.page.locator(this.PARTNER_TYPE_SELECT).selectOption(option);
  }
  public async selectDestination(option: string) {
    await this.page.locator(this.DESTINATION_SELECT).selectOption(option);
  }
  public async selectPartnerProgram(option: string) {
    await this.page.locator(this.PARTNER_PROGRAM_SELECT).selectOption(option);
  }
  public async typePropertyName(name: string) {
    await this.page.locator(this.PROPERTY_NAME).fill(name);
  }
  public async selectPhoto() {
    await this.page.getByRole('button', { name: 'Select' }).nth(3).click();
    await this.page.getByRole('button', { name: 'Close', exact: true }).click();
  }
  public async destinationsCoverage() {
    await this.page.getByRole('checkbox', { name: 'Caribbean & Mexico' }).check();
    await this.page.getByRole('checkbox', { name: 'Europe' }).check();
    await this.page.getByRole('checkbox', { name: 'Africa' }).check();
    await this.page.getByRole('checkbox', { name: 'Middle East' }).check();
    await this.page.getByRole('checkbox', { name: 'Asia' }).check();
    await this.page.getByRole('checkbox', { name: 'Australia & New Zealand' }).check();
  }
  public async propertyOverview() {
    await this.page
      .getByRole('textbox', { name: 'Give us a broad overview' })
      .first()
      .fill('Test property overview');
  }
  public async oneSentenceToDescribeYourProperty() {
    await this.page
      .getByRole('textbox', { name: 'eg. A light-filled, spacious' })
      .fill('Test sentence');
  }
  public async fillMandatoryBrandFields() {
    await this.page
      .getByRole('textbox', { name: 'e.g. From romantic retreats' })
      .fill('fun pack holidays');
    await this.page.getByRole('button', { name: 'Choose From Gallery' }).first().click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.selectPhoto();
    await this.page
      .getByRole('textbox', { name: 'In 4-6 sentences, please' })
      .fill('Brand Ethos Test');
  }
  public async fillSmartFlyerAmenities() {
    await this.page.locator('#part_of_elevate_amenity_yes').check();
    await this.page.getByRole('textbox', { name: 'Enter SmartFlyer Elevate' }).fill('Sauna');
  }
  public async addMoreSmartFlyerAmenities() {
    await this.page.getByRole('button', { name: 'ADD MORE' }).click();
    await this.page.locator('input[name="feature[2][feat_name]"]').click();
    await this.page.locator('input[name="feature[2][feat_name]"]').fill('Food');
    await this.page.getByRole('button', { name: 'ADD MORE' }).click();
  }
  public async fillPreferredPartnerProgramAmenities() {
    await this.page.locator('#have_preferred_partner_program_yes').dispatchEvent('click');
    await this.page.locator('#have_preferred_partner_program_yes').check();
    await this.page
      .getByRole('textbox', { name: 'Enter Preferred Partner Program Name' })
      .fill('Exclusive');
    await this.page
      .getByRole('textbox', { name: 'Enter details here' })
      .fill('Testing Qualification');
    await this.page
      .locator('#exc_features_div')
      .getByRole('button', { name: 'Choose From Gallery' })
      .click();
    await this.selectPhoto();
  }

  public async fillVirtuosoAmenities() {
    await this.page.locator('#defaultCheckvirtousoY').check();
    await this.page
      .getByRole('textbox', { name: 'Enter Virtuoso amenity here,' })
      .fill('Virtuoso Test');
    await this.page.waitForTimeout(1000);
    await this.page
      .locator('#vistouso_amenities_container_div')
      .getByRole('button', { name: 'ADD MORE' })
      .click();
    await this.page.getByRole('checkbox', { name: 'Elevate amenities' }).first().click();
    await this.page.getByRole('checkbox', { name: 'Preferred Partner amenities' }).click();
    await this.page.getByRole('radio', { name: 'Virtuoso amenities' }).check();
  }
  public async fillGlobalContactInfo() {
    await this.fillContacts('global_contact');
    await this.page.getByRole('button', { name: 'Choose From Gallery' }).first().click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.selectPhoto();
    await this.page.locator('#defaultCheckpp_primary_contact').check();
  }
  public async fillHelpDeskContact() {
    await this.fillContacts('brand_helpdesk');
    await this.page.getByRole('button', { name: 'Choose From Gallery' }).nth(1).click();
    await this.selectPhoto();
    await this.page.locator('#defaultCheckpp_primary_contact2').check();
  }
  private async fillContacts(field: string, index: string = '') {
    await this.page
      .locator(`input[name="contacts[${field}]${index}[first_name]"]`)
      .fill(`${field} Test`);
    await this.page.locator(`input[name="contacts[${field}]${index}[last_name]"]`).fill('Test');
    await this.page
      .locator(`input[name="contacts[${field}]${index}[phone]"]`)
      .fill('1 (234) 234-2342');
    await this.page
      .locator(`input[name="contacts[${field}]${index}[email]"]`)
      .fill(`${field}_test@test.com`);
  }
  public async fillCommissionContact() {
    await this.page.getByRole('textbox', { name: 'Enter position', exact: true }).click();
    await this.page
      .getByRole('textbox', { name: 'Enter position', exact: true })
      .fill('Commission');
    await this.fillContacts('brand_commision');
    await this.page.locator('#defaultCheckpp_primary_contact3').check();
  }
  public async fillAdditionalContacts() {
    await this.page.getByRole('textbox', { name: 'Enter POSITION / TITLE' }).fill('Additional');
    await this.fillContacts('additional_contact', '[1]');
    await this.page
      .locator('[id="additional_contact_div[1]"]')
      .getByRole('button', { name: 'Choose From Gallery' })
      .click();
    await this.selectPhoto();
  }

  public async saveAndNext() {
    await this.page.getByRole('button', { name: 'Save and next' }).click();
  }
  public async saveAndContinue() {
    await this.page.getByRole('button', { name: 'Save and continue' }).click();
  }
  public async saveAndFinish() {
    await this.page.getByRole('button', { name: 'Save and finish' }).click();
  }
  public async addProperty() {
    await this.page.getByRole('button', { name: 'Add Property' }).click();
  }
  public async selectPropertyName() {
    await this.page.getByRole('textbox', { name: 'Please Select' }).click();
  }
  public async fillPropertyName(text: string) {
    await this.page.locator('input[type="search"]').fill(text);
  }
  public async searchPartner(partner: string) {
    await this.page.locator(this.PARTNER_SEARCH).fill(partner);
    await this.page.locator(this.SEARCH_BUTTON).click();
  }
  public async approveNewPartner() {
    await this.page.locator(this.DRAFT_BUTTON_FIRST).click();
    await this.confirmApprove();
  }
  public async confirmApprove() {
    await this.page.locator(this.CONFIRM_POPUP).click();
  }
  public async selectFirstOtion() {
    await this.page.locator(this.PROPERTIES_OPTIONS_RESULTS).first().click;
  }
  public async fillPropertiesPrimaryContactEmail() {
    await this.page.getByRole('textbox', { name: 'Enter Email' }).fill('test@test.com');
  }
  public async fillPropertiesFirstName() {
    await this.page.getByRole('textbox', { name: 'Enter First Name' }).fill('test property name');
  }
  public async fillPropertiesLastName() {
    await this.page.getByRole('textbox', { name: 'Enter Last Name' }).fill('property lastname');
  }
  public async fillClienteleTTK() {
    await this.page.getByRole('textbox', { name: 'Enter Answer...' }).fill('Test Clientele');
  }
  public async fillIndustryAffiliationTTK() {
    await this.page.locator('#affiliationYes').first().check();
    await this.page.getByRole('checkbox', { name: 'Leading Hotels of the World' }).check();
    await this.page.getByRole('radio', { name: 'Yes NO Overview Lock' }).check();
  }
  public async industryAffiliationBrand() {
    await this.page.getByRole('checkbox', { name: 'Virtuoso' }).check();
  }
  public async fillKeySellingPointsTTK() {
    await this.page
      .locator('input[name="things_to_know[brand_name_of_representitive_company]"]')
      .fill('Test Company');
    await this.page
      .getByRole('textbox', { name: 'Enter key selling points' })
      .fill('Top Selling Points');
    await this.page
      .locator('textarea[name="things_to_know[key_selling_point][1][desc]"]')
      .fill('Test Description');
    await this.page.getByRole('button', { name: 'Add More' }).first().click();
    await this.page
      .getByRole('textbox', { name: 'Enter Best Selling Room' })
      .fill('Selling Room Categories Test');
    await this.page
      .locator('textarea[name="things_to_know[key_selling_point][2][desc]"]')
      .fill('Best Rooms test');
  }
  public async fillTipsTTK() {
    await this.page
      .locator('textarea[name="things_to_know[brand_tips][1][desc]"]')
      .fill('Description for Tips');
    await this.page.locator('#brand_preffered_partner_yes').check();
  }
  public async fillPreferredPartnerProgramTTK() {
    await this.page.locator('#brand_preffered_partner_yes').check();
    await this.page
      .locator('input[name="things_to_know[brand_preffered_partner_name]"]')
      .fill('Test Preferred Program');

    await this.page
      .locator('input[name="things_to_know[brand_preffered_partner_name]"]')
      .fill('Test Preferred Partner Program');
    await this.page
      .locator('input[name="things_to_know[brand_preffered_partner_website]"]')
      .fill('www.test.com');
    await this.page
      .locator('input[name="things_to_know[brand_adviasor_login_instruction]"]')
      .fill('Test Instruction');
    await this.page.getByRole('button', { name: 'Choose From Gallery' }).click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.selectPhoto();
  }

  public async checkCommissionsOffering() {
    const percentages = [5, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25];
    for (const i of percentages) {
      await this.page.locator(`//input[@id="commisiion_offer_percent_${i}"]`).check();
    }
    await this.page.locator('[name="commission_detail"]').fill('5% on test, 10% on test 2');
  }

  public async agentBenefitsUpload() {
    await this.page.getByRole('button', { name: 'Choose From Gallery' }).click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.selectPhoto();
  }
  public async bestWayToBook() {
    await this.page.getByRole('checkbox', { name: 'Hotel Website' }).check();
    await this.page.getByRole('textbox', { name: 'Enter answer...' }).fill('Test Answer');
    await this.page
      .locator('#Hotel-Website')
      .getByRole('button', { name: 'Choose From Gallery' })
      .click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.selectPhoto();
  }
  public async comissionPaymentDetails() {
    await this.page.getByRole('radio', { name: 'At time of booking' }).check();
  }
  public async howAreCommissionsPAid() {
    await this.page.getByRole('checkbox', { name: 'Check' }).check();
  }
  public async receiveCommission() {
    await this.page.getByRole('radio', { name: 'Commission is processed' }).check();
  }
  public async shareNameOfLLC() {
    await this.page.getByRole('textbox', { name: 'Enter LLC, Name' }).fill('test LLC');
  }
  public async latestUpdatesMarketing() {
    await this.page
      .getByRole('textbox', { name: 'Enter Title' })
      .first()
      .fill('Latest Update Test');
    await this.page
      .locator('[id="offers_and_training[latest_updates][0][date]"]')
      .fill('2025-11-12');
    await this.page
      .locator('textarea[name="offers_and_training[latest_updates][0][description]"]')
      .fill('Description Test');
    await this.page
      .locator('[id="updates_div[1]"]')
      .getByRole('button', { name: 'Choose From Gallery' })
      .click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.selectPhoto();
  }
  public async offersAndPromotionsMKT() {
    await this.page.getByRole('textbox', { name: 'Enter Offer' }).fill('Promotion Test');
    await this.page
      .locator('input[name="offers_and_training[offers_and_promotion][0][start_date]"]')
      .fill('2025-11-11');
    await this.page
      .locator('input[name="offers_and_training[offers_and_promotion][0][expire_date]"]')
      .fill('2025-11-26');
    await this.page
      .locator('textarea[name="offers_and_training[offers_and_promotion][0][description]"]')
      .fill('This is an offer test');
    await this.page
      .locator('[id="promotion_div[0]"]')
      .getByRole('button', { name: 'Choose From Gallery' })
      .click();
    await this.selectPhoto();
  }
  public async articlesMKT() {
    await this.page.getByRole('textbox', { name: 'Enter article title' }).fill('Test Title');
    await this.page.getByRole('textbox', { name: 'Enter Link' }).fill('www.test.com');
    await this.page
      .locator('[id="article_div[1]"]')
      .getByRole('button', { name: 'Delete' })
      .click();
    await this.page.getByRole('textbox', { name: 'Enter article title' }).fill('Test Article');
    await this.page.getByRole('textbox', { name: 'Enter Link' }).fill('www.test.com');
    await this.page.getByRole('button', { name: 'Add More', exact: true }).click();
    await this.page.locator('input[name="marketing[article][3][title]"]').fill('Test 2');
    await this.page.locator('#property_Search').fill('www.test.com');
  }
  public async trainingMKT() {
    await this.page.getByRole('textbox', { name: 'Enter Training Title' }).fill('Training Test');
    await this.page
      .locator('input[name="offers_and_training[training][0][start_date]"]')
      .fill('2025-11-12');
    await this.page.getByRole('combobox').last().selectOption('2');
    await this.page
      .locator('textarea[name="offers_and_training[training][0][description]"]')
      .fill('Test Training');
    await this.page
      .locator('[id="training_div[0]"]')
      .getByRole('button', { name: 'Choose From Gallery' })
      .click();
    await this.selectPhoto();
  }
  public async marketingMKT() {
    await this.page.getByRole('textbox', { name: 'Enter Brand Username' }).fill('@test');
    await this.page.locator('.fa.fa-instagram').click();
    await this.page.locator('#social_media_handles').getByRole('button', { name: 'ADD' }).click();
  }
  public async socialMediaStoryMKT() {
    await this.page.getByRole('textbox', { name: 'Story Name' }).fill('Story test');
    await this.page.getByRole('textbox', { name: 'Story link' }).fill('www.test.com');
    await this.page
      .locator('[id="social_media_story_div[1]"]')
      .getByRole('button', { name: 'Choose From Gallery' })
      .click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.selectPhoto();
    await this.page.getByRole('textbox', { name: 'Enter hashtag' }).fill('#Test');
    await this.page.getByRole('radio', { name: 'Yes' }).check();
    await this.page.getByRole('textbox', { name: 'insert property name and' }).fill('Q3 Test');
  }
  public async societySetting() {
    await this.page.getByRole('checkbox', { name: 'Newest' }).check();
    await this.page.getByRole('radio', { name: 'Lock', exact: true }).check();
    await this.page.getByRole('checkbox', { name: 'Approve', exact: true }).check();
    await this.page.getByRole('checkbox', { name: 'Featured Leisure' }).check();
    await this.page.locator('input[name="overview[member_since]"]').fill('2025-11-11');
  }
}
export const partners = (page: Page) => new Partners({ page });
