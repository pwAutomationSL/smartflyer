import { Page, APIResponse } from '@playwright/test';
import { uniqueId } from '..';
export class PartnersHotel {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }
  public readonly HEADER = `//h1`;
  public readonly CONTACTS_TAB_TOP = `//button[@id="pills-contact-tab"]`;
  public readonly PROPERTIES_TAB_TOP = `//button[@id="pills-property-tab"]`;
  public readonly INFO_TEXT_PROPERTIES_TOP = `(//div[@aria-labelledby="pills-property-tab"]//div/p)[1]`;
  public readonly THINGS_TO_KNOW_TAB_TOP = `//button[@id="pills-things-to-know-tab"]`;
  public readonly LATESTS_UPDATES_TAB_TOP = `//button[@id="pills-latest_update-tab"]`;
  public readonly BOOKINGS_COMMISSIONS_TAB_TOP = `//button[@id="pills-booking_and_commission-tab"]`;
  public readonly MARKETING_TAB_TOP = `//button[@id="pills-marketing-tab"]`;
  public readonly SETTINGS_TAB_TOP = `//button[@id="pills-settings-tab"]`;
  public readonly INFO_TEXT_THINGS_TO_KNOW_TOP = `(//div[@aria-labelledby="pills-things-to-know-tab"]//div/p)[1]`;
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

  public async fillGlobalContactInfoHotel() {
    const FIELD_PATH = 'global_contact';
    await this.fillContacts(FIELD_PATH);
    await this.advisorEmailAndBased(FIELD_PATH);
    await this.page.getByRole('button', { name: 'Choose From Gallery' }).first().click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.selectPhoto();
  }

  public async fillSalesContact() {
    const FIELD_PATH = 'sales_contact';
    await this.fillContacts(FIELD_PATH);
    await this.advisorEmailAndBased(FIELD_PATH);
    await this.page.waitForTimeout(200);
    await this.page
      .locator(
        `//h4[contains(.,'Sales Contact')]/following-sibling::div[1]//button[contains(.,'Choose From Gallery')]`,
      )
      .click();
    await this.uploadPhoto();
  }
  public async fillKeyAccountContact() {
    const FIELD_PATH = 'national_or_key_account_contact';
    await this.fillContacts(FIELD_PATH);
    await this.advisorEmailAndBased(FIELD_PATH);
    await this.page.waitForTimeout(400);
    await this.page
      .locator(
        `//h4[contains(.,'Key Account Contact')]/following-sibling::div[1]//button[contains(.,'Choose From Gallery')]`,
      )
      .click();
    await this.uploadPhoto();
  }
  public async fillGeneralManagerContact() {
    const FIELD_PATH = 'general_manager';
    await this.fillContacts(FIELD_PATH);
    await this.advisorEmailAndBased(FIELD_PATH);
    await this.page.getByRole('button', { name: 'Choose From Gallery' }).nth(1).click();
    await this.uploadPhoto();
  }
  public async fillReservationsContact() {
    const FIELD_PATH = 'reservation_contact';
    await this.fillContacts(FIELD_PATH);
    await this.advisorEmailAndBased(FIELD_PATH);
    await this.page
      .locator(
        `//h4[contains(.,'Reservations Contact')]/following-sibling::div[1]//button[contains(.,'Choose From Gallery')]`,
      )
      .click();
    await this.uploadPhoto();
  }
  public async fillGroupContact() {
    const FIELD_PATH = 'group_contact';
    await this.fillContacts(FIELD_PATH);
    await this.advisorEmailAndBased(FIELD_PATH);
    await this.page.getByRole('button', { name: 'Choose From Gallery' }).nth(1).click();
    await this.uploadPhoto();
  }
  public async fillConciergeContact() {
    const FIELD_PATH = 'concierge_contact';
    await this.fillContacts(FIELD_PATH);
    await this.advisorEmailAndBased(FIELD_PATH);
    await this.page.getByRole('button', { name: 'Choose From Gallery' }).nth(1).click();
    await this.uploadPhoto();
  }
  public async fillCommissionContact() {
    const FIELD_PATH = 'commission_contact';
    await this.fillContacts(FIELD_PATH);
    await this.advisorEmailAndBased(FIELD_PATH);
    await this.page
      .locator(
        `//h4[contains(.,'Commissions Contact')]/following-sibling::div[1]//button[contains(.,'Choose From Gallery')]`,
      )
      .click();
    await this.uploadPhoto();
  }
  public async fillAdditionalContact() {
    const FIELD_PATH = 'additional_contact';
    await this.fillContacts(FIELD_PATH, '[0]');
    await this.advisorEmailAndBasedGC(FIELD_PATH);
    await this.page
      .locator(
        `//h4[contains(.,'Additional Contacts')]/../following-sibling::div[1]//button[contains(.,'Choose From Gallery')]`,
      )
      .click();
    await this.uploadPhoto();
    await this.page
      .locator(`input[name="contacts[${FIELD_PATH}][0][include_smartflyer_emails][0]"]`)
      .check();
  }
  public async fillAdditionalContactCruise() {
    const FIELD_PATH = 'additional_contact';
    await this.fillContacts(FIELD_PATH, '[0]');
    await this.page
      .locator(
        `//h4[contains(.,'Additional Contacts')]/../following-sibling::div[1]//button[contains(.,'Choose From Gallery')]`,
      )
      .click();
    await this.uploadPhoto();
    await this.page
      .locator(`input[name="contacts[${FIELD_PATH}][0][include_smartflyer_emails][0]"]`)
      .check();
  }
  public async uploadPhoto() {
    await this.page.locator(`//div[@role="dialog"]//button[contains(.,'Media Library')]`).click();
    const button = this.page
      .locator(`//div[@role="dialog"]//div[@id="nav-profile"]//img/following-sibling::button`)
      .first();
    if (!(await button.isVisible())) {
      await this.page.locator(`//div[@role="dialog"]//div[@id="nav-profile"]//img`).first().hover();
    }
    await button.click();
    await this.page.waitForTimeout(500);
    await this.page.locator(`//div[@role="dialog"]//button[contains(.,'Close')]`).click();
    await this.page.waitForTimeout(500);
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
  }
  private async advisorEmailAndBasedGC(field: string) {
    await this.page
      .locator(`input[name="contacts[${field}][0][include_smartflyer_emails][0]"]`)
      .check();
  }
  public async selectPhoto() {
    await this.page.getByRole('button', { name: 'Select' }).nth(3).click();
    await this.page.getByRole('button', { name: 'Close', exact: true }).click();
  }
  public async accommodationsHeroImage() {
    await this.page.getByRole('button', { name: 'Choose From Gallery' }).nth(1).click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.selectPhoto();
  }
  public async featuredAmenities() {
    await this.page.getByRole('radio', { name: 'Elevate amenities' }).click();
  }
  public async accommodationsMainTitle() {
    await this.page.getByRole('textbox', { name: 'Room title' }).fill('Room title test');
  }
  public async accommodationsDescription() {
    await this.page
      .getByRole('textbox', { name: 'Tell us more about the room' })
      .fill('Room description');
  }
  public async accommodationsFeaturedRoom() {
    await this.page
      .getByRole('textbox', { name: 'Specific room category name' })
      .fill('Room Specific room category name');
  }
  public async accommodationsPool() {
    await this.page.getByRole('radio', { name: 'Yes Yes' }).click();
    await this.page.locator('input[name="overview[pool_and_gym][title]"]').fill('Main Title pool');
    await this.page.getByRole('button', { name: 'Choose From Gallery' }).nth(2).click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.selectPhoto();
    await this.page
      .getByRole('textbox', { name: 'Is there a pool? If so,' })
      .fill('Deep pool test');
  }
  public async accommodationsGym() {
    await this.page.locator('#gymYes').click();
    await this.page.locator('input[name="overview[gym][title]"]').fill('Main Title gym');
    await this.page.getByRole('button', { name: 'Choose From Gallery' }).nth(3).click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.selectPhoto();
    await this.page
      .getByRole('textbox', { name: 'Do you have a fitness' })
      .fill('gym equipment test');
  }
  public async accommodationsSpa() {
    await this.page.locator('#spaYes').click();
    await this.page.locator('input[name="overview[spa][title]"]').fill('Main Title spa');
    await this.page.getByRole('button', { name: 'Choose From Gallery' }).nth(4).click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.selectPhoto();
    await this.page
      .getByRole('textbox', {
        name: 'Tell us more about whether or not you have a spa',
      })
      .fill('spa equipment test');
  }
  public async accommodationsRestaurant() {
    await this.page.locator('#restaurant_and_barYes').click();
    await this.page
      .locator('input[name="overview[restaurant_and_bar][title]"]')
      .fill('Main Title restaurant');
    await this.page.getByRole('button', { name: 'Choose From Gallery' }).nth(5).click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.selectPhoto();
    await this.page
      .getByRole('textbox', { name: 'Tell us about the restaurants' })
      .fill('restaurant test');
  }
  public async accommodationsBar() {
    await this.page.locator('#barYes').click();
    await this.page.locator('input[name="overview[bar][title]"]').fill('Main Title bar');
    await this.page.getByRole('button', { name: 'Choose From Gallery' }).nth(6).click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.selectPhoto();
    await this.page.getByRole('textbox', { name: 'What’s the bar like?' }).fill('restaurant test');
  }
  public async advisorsBook() {
    await this.page.getByRole('checkbox', { name: 'Elevate amenities' }).check();
  }
  public async streetAddress() {
    await this.page.getByRole('textbox', { name: 'Enter Address' }).fill('Test Adress 1542');
  }
  public async cityOrRegion() {
    await this.page.getByRole('textbox', { name: 'Enter City Or Region' }).fill('City Test');
  }
  public async addCountry() {
    await this.page.getByRole('textbox', { name: 'Enter Country' }).first().fill('United States');
  }
  public async attachHeroImage() {
    await this.page.getByRole('button', { name: 'Choose From Gallery' }).first().click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.selectPhoto();
  }
  public async insiderTips() {
    await this.page
      .getByRole('textbox', { name: 'Tell us your insider tips' })
      .first()
      .fill('Test insider tips');
  }
  public async propertySpecifics() {
    await this.page
      .getByRole('textbox', { name: 'Describe the location in' })
      .fill('Location Details');
    await this.page
      .getByRole('textbox', { name: 'Please answer in one sentence' })
      .fill('Vibe Details');
    await this.page
      .getByRole('textbox', { name: 'Wellness enthusiasts,' })
      .fill('Who is it for Details');
  }
  public async locationDetails() {
    await this.page
      .getByRole('textbox', { name: 'Enter answer...' })
      .first()
      .fill('Location Details');
  }
  public async accommodationDetails() {
    await this.page
      .getByRole('textbox', { name: 'Enter Best Selling Room' })
      .first()
      .fill('Best Selling Room');
    await this.page.getByRole('checkbox', { name: 'Multi-Bedroom' }).check();
    await this.page.getByRole('radio', { name: 'Guaranteed' }).click();
    await this.page.getByRole('textbox', { name: 'Enter Here' }).first().fill('5');
  }
  public async groupBookings() {
    await this.page
      .getByRole('textbox', { name: 'Enter minimum room requirement' })
      .fill('Minimum requirement');
    await this.page.getByRole('radio', { name: 'Yes', exact: true }).check();
    await this.page.getByRole('textbox', { name: 'Enter contact Details' }).fill('Contact Test');
    await this.page.getByRole('checkbox', { name: 'Small Events (10 - 50 people)' }).check();
    await this.page.getByRole('textbox', { name: 'Enter Details' }).fill('Details Test');
  }
  public async startingRates() {
    await this.page.getByRole('textbox', { name: 'ex: $' }).fill('$19999');
    await this.page.getByRole('radio', { name: 'Room Only' }).check();
  }
  public async additionalDetails() {
    await this.page
      .locator('textarea[name="things_to_know[length_of_stay_to_experience]"]')
      .fill('Additional Details Test');
    await this.page.locator('textarea[name="things_to_know[peak_season]"]').fill('Winter');
  }
  public async checkCommissionsOfferingHotel() {
    await this.page.getByRole('textbox', { name: 'Enter here...' }).fill('Condition Test');
    await this.page.locator('input[name="commission[agreement_validity_date]"]').fill('2025-11-13');
  }
  public async bestWayToBook() {
    await this.page.getByRole('checkbox', { name: 'Hotel Website' }).check();
    await this.page.getByRole('textbox', { name: 'Enter answer...' }).click();
    await this.page.getByRole('textbox', { name: 'Enter answer...' }).fill('Best way to book');
    await this.page.getByRole('checkbox', { name: 'Dedicated SmartFlyer Booking' }).check();
    await this.page
      .getByRole('textbox', { name: 'Please share the hotel' })
      .fill('Dedicated SmartFlyer Booking');
    await this.page.getByRole('checkbox', { name: 'Via Email' }).check();
  }
  public async advisorFeedback() {
    await this.page.getByRole('textbox', { name: 'select travel advisor' }).click();
    await this.page.getByRole('treeitem', { name: 'Rachel Braylovsky' }).first().click();
    await this.page.getByRole('textbox', { name: 'Write Feedback...' }).fill('Feedback Test');
    await this.page.getByRole('checkbox', { name: 'FAM' }).check();
    await this.page.getByRole('checkbox', { name: 'Internal feedback for the' }).check();
    await this.page
      .locator('#append_advisor_div')
      .getByRole('button', { name: 'ADD MORE' })
      .click();
    await this.page.getByRole('textbox', { name: 'select travel advisor' }).click();
    await this.page.getByRole('treeitem', { name: 'Rachel Braylovsky' }).first().click();
    await this.page
      .locator('textarea[name="offers_and_training[advisor_feedback][1][feedback]"]')
      .fill('Feedback Test');
    await this.page.locator('[id="defaultCheck-advisor-[1][2]"]').check();
    await this.page.locator('[id="defaultCheck-visit-[1][1]"]').check();
  }
  public async training() {
    await this.page.getByRole('textbox', { name: 'Enter Training Title' }).fill('Training title');
    await this.page
      .locator('input[name="offers_and_training[training][0][start_date]"]')
      .fill('2025-11-21');
    await this.page.getByRole('textbox', { name: 'Select Category' }).click();
    await this.page.getByRole('treeitem', { name: 'General Development' }).click();
    await this.page
      .locator('textarea[name="offers_and_training[training][0][description]"]')
      .fill('Description Test');
    await this.page
      .locator('[id="training_div[0]"]')
      .getByRole('button', { name: 'Choose From Gallery' })
      .click();
    await this.selectPhoto();
  }
  public async offersAndPromotions() {
    await this.page.getByRole('textbox', { name: 'Enter Offer' }).fill('Offer test');
    await this.page
      .locator('input[name="offers_and_training[offers_and_promotion][0][start_date]"]')
      .fill('2025-11-21');
    await this.page
      .locator('input[name="offers_and_training[offers_and_promotion][0][expire_date]"]')
      .fill('2025-11-21');
    await this.page
      .locator('textarea[name="offers_and_training[offers_and_promotion][0][description]"]')
      .click();
    await this.page
      .locator('textarea[name="offers_and_training[offers_and_promotion][0][description]"]')
      .fill('Offer information');
    await this.page
      .locator('[id="promotion_div[0]"]')
      .getByRole('button', { name: 'Choose From Gallery' })
      .click();
    await this.page.locator('#image_56205').click();
    await this.page.getByRole('button', { name: 'Close', exact: true }).click();
  }
  public async peakAvailabilities() {
    await this.page.locator('input[name="availability[0][title]"]').fill('Availability test');
    await this.page.locator('input[name="availability[0][start_date]"]').fill('2025-11-13');
    await this.page.locator('input[name="availability[0][expire_date]"]').fill('2025-11-13');
    await this.page
      .locator('textarea[name="availability[0][additional_info_to_know]"]')
      .fill('Additional information advisors');
    await this.page
      .locator('[id="peak_availability_div[0]"]')
      .getByRole('button', { name: 'Choose From Gallery' })
      .click();
    await this.selectPhoto();
  }
  public async propertyUpdates() {
    await this.page
      .locator('input[name="offers_and_training[property_updates][0][title]"]')
      .fill('Title test');
    await this.page
      .locator('textarea[name="offers_and_training[property_updates][0][description]"]')
      .fill('description test');
    await this.page
      .locator('[id="updates_div[1]"]')
      .getByRole('button', { name: 'Choose From Gallery' })
      .click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.selectPhoto();
  }
  public async commissionPaymentDetails() {
    await this.page.getByRole('radio', { name: 'At time of booking' }).check();
    await this.page.getByRole('radio', { name: 'Check' }).check();
    await this.page.getByRole('radio', { name: 'Commission is processed' }).check();
    await this.page.getByRole('textbox', { name: 'Enter LLC, Name' }).fill('LLC Test');
  }
  public async societySetting() {
    await this.page.getByRole('radio', { name: 'Lock', exact: true }).check();
    await this.page.getByRole('checkbox', { name: 'Approve', exact: true }).check();
    await this.page.getByRole('checkbox', { name: 'Featured Leisure' }).check();
    await this.page.locator('input[name="overview[member_since]"]').fill('2025-11-11');
  }
  public async socialMediaStoryHotelMKT() {
    await this.page.getByRole('textbox', { name: 'Story Name' }).fill('Story test');
    await this.page.getByRole('textbox', { name: 'Story link' }).fill('www.test.com');
    await this.page
      .locator('[id="social_media_story_div[1]"]')
      .getByRole('button', { name: 'Choose From Gallery' })
      .click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.selectPhoto();
    await this.page.getByRole('textbox', { name: 'Enter hashtag' }).fill('#Test');
  }
  public async socialMediaStoryHotelMKCruise() {
    await this.page.getByRole('textbox', { name: 'Story Name' }).fill('Story test');
    await this.page.getByRole('textbox', { name: 'Story link' }).fill('www.test.com');
    await this.page
      .locator('[id="social_media_story_div[1]"]')
      .getByRole('button', { name: 'Choose From Gallery' })
      .click();
    await this.page.getByRole('tab', { name: 'Media Library' }).click();
    await this.uploadPhoto();
    await this.page.getByRole('textbox', { name: 'Enter hashtag' }).fill('#Test');
  }
}
export const partnersHotel = (page: Page) => new PartnersHotel({ page });
