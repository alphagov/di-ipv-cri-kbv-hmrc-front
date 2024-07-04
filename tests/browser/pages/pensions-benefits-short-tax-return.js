const {
  BASE_KBV_QUESTION_PATH,
  ENTER_PENSION_BENEFITS_SHORT_TAX_RETURN,
} = require("../../../src/constants/routes");

module.exports = class PensionsBenefitsShortTaxReturnPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.path = `${BASE_KBV_QUESTION_PATH}${ENTER_PENSION_BENEFITS_SHORT_TAX_RETURN}`;
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
