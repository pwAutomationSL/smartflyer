import { Page, APIResponse } from '@playwright/test';
import { uniqueId } from '..';
export class PartnersOnsite {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }
  private shareEndpoint = 'https://crm.test.smartflyer.com/share_link';
  public readonly HEADER = `//h1`;
  public readonly CONTACTS_TAB_TOP = `//button[@id="pills-contact-tab"]`;
  public readonly PROPERTIES_TAB_TOP = `//button[@id="pills-property-tab"]`;
  public readonly INFO_TEXT_PROPERTIES_TOP = `(//div[@aria-labelledby="pills-property-tab"]//div/p)[1]`;
  public readonly THINGS_TO_KNOW_TAB_TOP = `//button[@id="pills-things_to_know-tab"]`;
  public readonly LATESTS_UPDATES_TAB_TOP = `//button[@id="pills-offers-tab"]`;
  public readonly BOOKINGS_COMMISSIONS_TAB_TOP = `//button[@id="pills-booking_and_commission-tab"]`;
  public readonly MARKETING_TAB_TOP = `//button[@id="pills-marketing-tab"]`;
  public readonly SETTINGS_TAB_TOP = `//button[@id="pills-settings-tab"]`;
  public readonly INFO_TEXT_THINGS_TO_KNOW_TOP = `(//div[@aria-labelledby="pills-things_to_know-tab"]//div/p)[1]`;
  public readonly SHARE_TOPBAR = `//div[contains(@class,'topbar')]//button[contains(.,'Share')]`;
  public readonly CREATE_BUTTON_MODAL = `(//div[contains(@class,'modal')]//button[contains(.,'Create')])[2]`;
  public readonly SEARCH_RESULT_MATCHES = `//div[contains(@class,'Layout_content')]//div/a[contains(@href,'https')]/div/div/div/p/span//mark`;
  public readonly PARTNER_TYPE_SELECT = `//select[@id="form_type"]`;
  public readonly DESTINATION_SELECT = `//select[@id="new_destination_id"]`;
  public readonly PARTNER_PROGRAM_SELECT = `//select[@id="partner_program2"]`;
  public readonly PROPERTY_NAME = `//input[@id="share_title"]`;
  public readonly BRAND_SUBMISSION_FORM_H1 = `//H1`;
  public readonly PROPERTIES_OPTIONS_RESULTS = `//ul[contains(@class,'results')]/li`;
  public readonly DESTINATIONS_CHECKBOXES = (destination: string) =>
    `//input[contains(@id,"destination")]/../label[contains(.,'${destination}')]`;
  public readonly REQUIRED_FIELDS_BY_LABEL = (field: string) =>
    `//span[contains(.,'*')]/../../*[contains(.,'${field}')]`;
  public readonly TEXT_BY_LABEL = (label: string) => `//h4[contains(.,'${label}')]/../p`;

  public async oneSentenceToDescribeYourProperty() {
    await this.page
      .getByRole('textbox', { name: 'e.g. Your company ethos,' })
      .fill('Test sentence');
  }
  public async cityOrRegion() {
    await this.page.getByRole('textbox', { name: 'Enter City Or Region' }).fill('City Test');
    await this.page.getByRole('textbox', { name: 'Enter State' }).fill('State Test');
    await this.page.getByRole('textbox', { name: 'Enter Country' }).last().fill('City Test');
  }
  public async onsiteSpecifics() {
    await this.page
      .getByRole('textbox', { name: 'e.g. What landmarks will' })
      .fill('Test Destination details');
    await this.page
      .getByRole('textbox', { name: 'Please answer in one sentence' })
      .fill('test vibe');
    await this.page
      .getByRole('textbox', { name: 'Wellness enthusiasts,' })
      .fill('who is it for test');
  }
  public async fillVirtuosoAmenitiesOnsite() {
    await this.page.locator('#defaultCheckvirtousoY').check();
    await this.page
      .getByRole('textbox', { name: 'Insert Virtuoso amenity here' })
      .fill('Virtuoso Test');
    await this.page.getByRole('button', { name: 'ADD MORE' }).nth(2).click();
    await this.page.locator('input[name="amenity[2][feat_name]"]').fill('Virtuoso Test 2');
  }
  public async fillOnsiteConciergeContact() {
    const FIELD_PATH = 'concierge_contact';
    await this.fillContacts(FIELD_PATH);
    await this.advisorEmailAndBased(FIELD_PATH);
    await this.page.getByRole('button', { name: 'Choose From Gallery' }).nth(1).click();
    await this.selectPhoto();
  }
  private async fillContacts(field: string, index: string = '') {
    await this.page
      .locator(`input[name="contacts[${field}]${index}[position]"]`)
      .fill(`${field} Test`);
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
  private async advisorEmailAndBased(field: string) {
    await this.page.locator(`[id="contacts[${field}][include_smartflyer_emails][0]"]`).check();
    await this.page.locator(`[id="contacts[${field}][based][0]"]`).check();
  }
  public async selectPhoto() {
    await this.page.getByRole('button', { name: 'Select' }).nth(3).click();
    await this.page.getByRole('button', { name: 'Close', exact: true }).click();
  }
  public async onsiteDetails() {
    await this.page.getByRole('checkbox', { name: 'Ultra Lux' }).check();
    await this.page
      .locator('input[name="things_to_know[client_itineraries][0][details]"]')
      .fill('2000');
    await this.page.getByRole('checkbox', { name: 'High-end & High-touch' }).check();
    await this.page
      .locator('input[name="things_to_know[client_itineraries][1][details]"]')
      .fill('2000');
    await this.page.getByRole('checkbox', { name: 'Moderate' }).check();
    await this.page
      .locator('input[name="things_to_know[client_itineraries][2][details]"]')
      .fill('1000');
    await this.page.getByRole('checkbox', { name: 'Full Package (Hotels, Tours,' }).check();
    await this.page.locator('[id="things_to_know[minimum_budget]-Y"]').check();
    await this.page.getByRole('textbox', { name: 'Please share what the minimum' }).fill('500');
    await this.page.getByRole('textbox', { name: 'Please elaborate on how' }).fill('100, 200');
    await this.page.locator('input[name="things_to_know[avg_cost_per_person]"]').fill('100');
    await this.page.getByRole('checkbox', { name: 'Axus' }).check();
  }
  public async sampleItineraries() {
    await this.page.getByRole('textbox', { name: 'Title' }).fill('Title');
    await this.page.getByRole('textbox', { name: 'Description' }).fill('Description');
  }

  public async destinationDetails() {
    await this.page
      .locator('textarea[name="things_to_know[destination_details][stay_length]"]')
      .fill('1 week');
    await this.page
      .locator('textarea[name="things_to_know[destination_details][seasonality_destination]"]')
      .fill('Winter');
    await this.page.getByRole('button', { name: 'Choose From Gallery' }).nth(1).click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.selectPhoto();
  }
  public async fillIndustryAffiliationTTKCruise() {
    await this.page.locator('input[name="things_to_know[part_of_consortia]"]').first().check();
    await this.page
      .locator('input[name="things_to_know[brand_industry_affiliation][]"]')
      .first()
      .check();
    await this.page
      .locator('textarea[name="things_to_know[key_selling_points]"]')
      .fill('Stands Out');
    await this.page
      .locator('textarea[name="things_to_know[popular_destination]"]')
      .fill('Most Popular Itinerary');
  }
  public async averageItineraryCruise() {
    await this.page.locator('input[name="things_to_know[nights][]"]').first().click();
    await this.page
      .locator('input[name="things_to_know[avg_cost_per_person]"]')
      .fill('Average Cost');
    await this.page
      .locator('textarea[name="things_to_know[cruise_fare_inclusion]"]')
      .fill('Cruise Fare Inclusion');
    await this.page
      .locator('input[name="things_to_know[number_of_ships]"]')
      .fill('Number of Ships');
    await this.page.locator('input[name="things_to_know[crew_ratio]"]').fill('Crew Ratio');
    await this.page.locator('input[name="things_to_know[brand_product]"]').fill('Brand Product');
    await this.page
      .locator('input[name="things_to_know[passenger_range]"]')
      .fill('Passenger Range');
    await this.page
      .locator(
        `//span[text()='Any additional Collateral that you wish to share, please enter it here']/following-sibling::div//button[contains(.,'Choose From Gallery')]`,
      )
      .click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.uploadPhoto();
  }
  public async uploadPhoto() {
    await this.page.locator(`//div[@role="dialog"]//button[contains(.,'Media Library')]`).click();
    await this.page.locator(`//div[@role="dialog"]//div[@id="nav-profile"]//img`).first().click();
    await this.page.locator(`//div[@role="dialog"]//button[contains(.,'Close')]`).click();
    await this.page.waitForTimeout(500);
  }
  public async fillIndustryAffiliationTTK() {
    await this.page.locator('#brand-industry-affiliation-yes').check();
    await this.page.getByRole('checkbox', { name: 'Virtuoso' }).check();
    await this.page.getByRole('checkbox', { name: 'Traveller Mode' }).check();
    await this.page.locator('#represented-by-company-yes').check();
    await this.page
      .locator('input[name="things_to_know[represented_by_company][company_name]"]')
      .fill('Representation');
  }
  public async groupBookings() {
    await this.page.getByRole('checkbox', { name: 'Small Events (10 - 50 people)' }).check();
    await this.page.getByRole('textbox', { name: 'Enter Details' }).fill('Details Test');
  }
  public async checkCommissionsOfferingHotel() {
    await this.page
      .locator('input[name="commission[condition_exclude_commission]"]')
      .fill('condition');
    await this.page
      .locator('input[name="commission[agreemant_validity_elevate_contract]"]')
      .fill('2025-11-14');
  }
  public async bestWayToBook() {
    await this.page.getByRole('checkbox', { name: 'Website' }).check();
    await this.page
      .locator('input[name="commission[best_way_booking][request_time_information]"]')
      .fill('Documents');
    await this.page
      .locator('input[name="commission[best_way_booking][response_time_itinerary_request]"]')
      .fill('1 Day');
    await this.page
      .locator('input[name="commission[best_way_booking][advisor_work_with_contact]"]')
      .fill('Yes');
    await this.page
      .locator('input[name="commission[best_way_booking][advisor_work_with_travel_planner]"]')
      .fill('Yes');
  }
  public async bestWayToBookCruise() {
    await this.page.getByRole('checkbox', { name: 'Website' }).check();
    await this.page.locator('input[name="commission[booking_code_any]"]').fill('test');
    await this.page.getByRole('textbox', { name: 'Enter Here...' }).fill('test');
  }
  public async commissionPaymentDetails() {
    await this.page.getByRole('radio', { name: 'At time of booking' }).check();
    await this.page.getByRole('checkbox', { name: 'Check' }).check();
    await this.page.getByRole('radio', { name: 'Commission is processed' }).check();
    await this.page.getByRole('textbox', { name: 'Enter LLC, Name' }).fill('LLC Test');
  }
  public async commissionPaymentDetailsCruise() {
    await this.page.getByRole('radio', { name: 'At time of booking' }).check();
    await this.page.getByRole('radio', { name: 'Check' }).check();
    await this.page.getByRole('radio', { name: 'Commission is processed' }).check();
    await this.page.getByRole('textbox', { name: 'Enter LLC, Name' }).fill('LLC Test');
  }
  public async latestUpdatesMarketing() {
    await this.page
      .getByRole('textbox', { name: 'Enter Title' })
      .first()
      .fill('Latest Update Test');
    await this.page
      .locator('input[name="offers_and_training[updates][1][date]"]')
      .fill('2025-11-12');
    await this.page
      .locator('textarea[name="offers_and_training[updates][1][description]"]')
      .fill('Description Test');
    await this.page
      .locator('[id="updates_div[1]"]')
      .getByRole('button', { name: 'Choose From Gallery' })
      .click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.selectPhoto();
  }
  public async latestUpdatesMarketingCruise() {
    await this.page
      .getByRole('tabpanel', { name: 'Marketing & Latest Updates' })
      .locator('#defaultCheckvirtousoYes')
      .check();
    await this.page
      .locator('input[name="offers_and_training[latest_updates][0][title]"]')
      .fill('Latest Update Testt');
    await this.page
      .locator('[id="offers_and_training[latest_updates][0][date]"]')
      .fill('04/22/2026');
    await this.page
      .locator('textarea[name="offers_and_training[latest_updates][0][description]"]')
      .fill('Description');
    await this.page
      .locator('[id="updates_div[1]"]')
      .getByRole('button', { name: 'Choose From Gallery' })
      .click();
    await this.page.getByRole('tab', { name: 'Media Library', exact: true }).click();
    await this.uploadPhoto();
  }
  public async offersAndPromotions() {
    await this.page.getByRole('textbox', { name: 'Enter Offer' }).fill('Offer test');
    await this.page
      .locator('input[name="offers_and_training[offers_and_promotion][1][start_date]"]')
      .fill('2025-11-21');
    await this.page
      .locator('input[name="offers_and_training[offers_and_promotion][1][expire_date]"]')
      .fill('2025-11-21');
    await this.page
      .locator('textarea[name="offers_and_training[offers_and_promotion][1][description]"]')
      .fill('Offer information');
    await this.page
      .locator('[id="promotion_div[1]"]')
      .getByRole('button', { name: 'Choose From Gallery' })
      .click();
    await this.selectPhoto();
  }
  public async offersAndPromotionsCruise() {
    await this.page.getByRole('textbox', { name: 'Enter Offer' }).first().fill('Offer test');
    await this.page
      .locator('input[name="offers_and_training[offers_and_promotion][1][start_date]"]')
      .fill('2025-11-21');
    await this.page
      .locator('input[name="offers_and_training[offers_and_promotion][1][expire_date]"]')
      .fill('2025-11-21');
    await this.page
      .locator('textarea[name="offers_and_training[offers_and_promotion][1][description]"]')
      .fill('Offer information');
    await this.page
      .locator('[id="promotion_div[1]"]')
      .getByRole('button', { name: 'Choose From Gallery' })
      .click();
    await this.uploadPhoto();
  }
  public async advisorFeedback() {
    await this.page
      .locator('[id="offers_and_training[advisor_feedback][0][advisor]"]')
      .selectOption('Rachel Braylovsky');
    await this.page.getByRole('textbox', { name: 'Write Feedback...' }).fill('Feedback Test');
    await this.page.getByRole('checkbox', { name: 'FAM' }).check();
    await this.page.getByRole('checkbox', { name: 'Internal feedback for the' }).check();
    await this.page
      .locator('#append_advisor_div')
      .getByRole('button', { name: 'ADD MORE' })
      .click();
    await this.page
      .locator('select[name="offers_and_training[advisor_feedback][1][advisor]"]')
      .selectOption('Rachel Braylovsky');
    await this.page
      .locator('textarea[name="offers_and_training[advisor_feedback][1][feedback]"]')
      .fill('Feedback Test');
    await this.page.locator('[id="defaultCheck-advisor-[1][2]"]').check();
    await this.page.locator('[id="defaultCheck-visit-[1][1]"]').check();
  }
  public async marketingMKT() {
    await this.page.getByRole('button', { name: 'Choose From Gallery' }).first().click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.selectPhoto();
    await this.page.getByRole('textbox', { name: 'Enter Handle' }).fill('@test');
    await this.page.locator('.fa.fa-instagram').click();
    await this.page.locator('#social_media_handles').getByRole('button', { name: 'ADD' }).click();
  }
  public async training() {
    await this.page.getByRole('textbox', { name: 'Enter Training Title' }).fill('Training title');
    await this.page
      .locator('input[name="offers_and_training[training][0][start_date]"]')
      .fill('2025-11-21');
    await this.page
      .locator('select[name="offers_and_training[training][0][category_id]"]')
      .selectOption('General Development');
    await this.page
      .locator('textarea[name="offers_and_training[training][0][description]"]')
      .fill('Description Test');
    await this.page
      .locator('[id="training_div[0]"]')
      .getByRole('button', { name: 'Choose From Gallery' })
      .click();
    await this.selectPhoto();
  }
  public async trainingCruise() {
    await this.page.getByRole('textbox', { name: 'Enter Offer' }).last().fill('Training title');
    await this.page
      .locator('input[name="offers_and_training[training][1][start_date]"]')
      .fill('2025-11-21');
    await this.page
      .locator('select[name="offers_and_training[training][1][category_id]"]')
      .selectOption('General Development');
    await this.page
      .locator('textarea[name="offers_and_training[training][1][description]"]')
      .fill('Description Test');
    await this.page
      .locator('[id="training_div[1]"]')
      .getByRole('button', { name: 'Choose From Gallery' })
      .click();
    await this.selectPhoto();
  }

  public async oneSentenceToDescribe() {
    await this.page
      .locator(`//label[contains(.,'One Sentence to Describe')]/following-sibling::input`)
      .fill('Test sentence');
  }
  public async marketingMKTCruise() {
    await this.page.getByRole('button', { name: 'Choose From Gallery' }).nth(3).click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.uploadPhoto();
    await this.page.getByRole('textbox', { name: 'Enter Handle' }).fill('@test');
    await this.page.locator('.fa.fa-instagram').click();
    await this.page.locator('#social_media_handles').getByRole('button', { name: 'ADD' }).click();
  }
}
export const partnersOnsite = (page: Page) => new PartnersOnsite({ page });
