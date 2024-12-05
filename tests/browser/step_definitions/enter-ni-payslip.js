const { Then, When } = require("@cucumber/cucumber");
const { EnterNIPayslipPage } = require("../pages");
const { expect } = require("chai");

Then("they should see the Enter NI Payslip question page", async function () {
  const singleInputQuestionPage = new EnterNIPayslipPage(this.page);

  expect(singleInputQuestionPage.isCurrentPage()).to.be.true;
});

When(
  "they enter amount and continue from the Enter NI Payslip question page",
  async function () {
    const singleInputQuestionPage = new EnterNIPayslipPage(this.page);
    await singleInputQuestionPage.answer("1234.45");
    await singleInputQuestionPage.continue();
  }
);

When(
  "they click on the abandon link from Payslip question page",
  async function () {
    const enterNIPayslipPage = new EnterNIPayslipPage(this.page);
    await enterNIPayslipPage.selectAbandon();
  }
);
