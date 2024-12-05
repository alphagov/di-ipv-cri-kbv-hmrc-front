const { Then, When } = require("@cucumber/cucumber");
const { EnterTaxPayslipPage } = require("../pages");
const { expect } = require("chai");

Then("they should see the Enter Tax Payslip question page", async function () {
  const singleInputQuestionPage = new EnterTaxPayslipPage(this.page);

  expect(singleInputQuestionPage.isCurrentPage()).to.be.true;
});

When(
  "they enter amount and continue from the Enter Tax Payslip question page",
  async function () {
    const singleInputQuestionPage = new EnterTaxPayslipPage(this.page);
    await singleInputQuestionPage.answer();
    await singleInputQuestionPage.continue();
  }
);
