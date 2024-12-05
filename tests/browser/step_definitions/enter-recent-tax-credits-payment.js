const { Then, When } = require("@cucumber/cucumber");
const { EnterRecentTaxCreditsPayment } = require("../pages");
const { expect } = require("chai");

Then(
  "they should see the enter-recent-tax-credits-payment question page",
  async function () {
    const singleInputQuestionPage = new EnterRecentTaxCreditsPayment(this.page);

    expect(singleInputQuestionPage.isCurrentPage()).to.be.true;
  }
);

When(
  "they enter correct account number and continue from the enter-recent-tax-credits-payment question page",
  async function () {
    const singleInputQuestionPage = new EnterRecentTaxCreditsPayment(this.page);
    await singleInputQuestionPage.answer("1234.45");
    await singleInputQuestionPage.continue();
  }
);
