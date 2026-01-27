import { Page } from "@playwright/test";

export class Faqs {
  public readonly page: Page;
  constructor({ page }: { page: Page }) {
    this.page = page;
  }
  public readonly ADD_FAQ = `//button[contains(.,'ADD FAQ')]`;
  public readonly ADD_FAQ_POPUP = `//div[@id="addfaq-modal"]`;
  public readonly FAQS_HEADER = `//h1`;
  public readonly QUESTION_INPUT = `//input[@id="question"]`;
  public readonly ANSWER_INPUT = `//textarea[@id="answer"]`;
  public readonly CONFIRM_ADD = `//div[contains(@class,'modal')]//button[contains(.,'ADD')]`;
  public readonly OK_CONFIRM_ADD = `//div[contains(@class,'modal')]//button[contains(.,'OK')]`;
  public readonly MODAL = `//form[@id="faqForm"]`;
  public readonly SUCCESS_POPUP = `//h2`;
  public readonly OK_POPUP = `//button[text()='OK']`;
  public readonly EDIT_FAQ = `//table[@id="faq_table"]//tbody/tr[1]/td[3]//a[1]`;
  public readonly DELETE_FAQ = `//table[@id="faq_table"]//tbody/tr[1]/td[3]//a[2]`;
  public readonly CONFIRM_DELETE = `//button[contains(.,'Yes, delete it!')]`;
  public readonly COLUMNS_BY_INDEX = (index: number) =>
    `//table[@id="faq_table"]//tbody/tr[1]/td[${index}]`;
  public async addFaq() {
    await this.page.locator(this.ADD_FAQ).click({ force: true });
  }
  public async fillQuestion(faq: string) {
    await this.page.locator(this.QUESTION_INPUT).fill(faq);
  }
  public async searchFAQ(faq: string) {
    await this.page.locator(`//label[text()='Search:']/input`).fill(faq);
  }
  public async fillAnswer(faq: string) {
    await this.page.locator(this.ANSWER_INPUT).fill(faq);
  }
  public async confirmAdd() {
    await this.page.locator(this.CONFIRM_ADD).click();
  }
  public async clickOK() {
    await this.page.locator(this.OK_POPUP).click();
  }
  public async editFAQ() {
    await this.page.locator(this.EDIT_FAQ).click();
  }
  public async deleteFAQ() {
    await this.page.locator(this.DELETE_FAQ).click();
  }
  public async confirmDeleteFAQ() {
    await this.page.locator(this.CONFIRM_DELETE).click();
  }
}
export const faqs = (page: Page) => new Faqs({ page });
