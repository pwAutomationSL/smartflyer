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
  public async addFaq() {
    await this.page.locator(this.ADD_FAQ).click({ force: true });
  }
  public async fillQuestion(faq: string) {
    await this.page.locator(this.QUESTION_INPUT).fill(faq);
  }
  public async fillAnswer(faq: string) {
    await this.page.locator(this.ANSWER_INPUT).fill(faq);
  }
  public async confirmAdd() {
    await this.page.locator(this.CONFIRM_ADD).click();
    await this.page.locator(this.OK_CONFIRM_ADD).click();
  }
}
export const faqs = (page: Page) => new Faqs({ page });
