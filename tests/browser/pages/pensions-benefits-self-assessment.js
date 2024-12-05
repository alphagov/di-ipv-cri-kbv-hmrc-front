module.exports = class PensionsBenefitsSelfAssessmentPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.path = "/kbv/question/enter-pensions-benefits-self-assessment";
  }

  async continue() {
    await this.page.click("button:text('continue')");
  }

  isCurrentPage() {
    const { pathname } = new URL(this.page.url());
    return pathname === this.path;
  }

  async answer(values = ["200", "200", "200", "200", "200"]) {
    await this.page.waitForSelector('input[type="text"]');
    const inputs = await this.page.$$('input[type="text"]');
    for (let i = 0; i < inputs.length; i++) {
      await inputs[i].fill(values[i]);
    }
  }

  async answerWithInvalidValues() {
    await this.answer(["abc", "xyz", "123.45", "", "678.90"]);
  }

  async answerWithEmptyValues() {
    await this.answer(["", "", "", "", ""]);
  }
};
