const { Then, When } = require("@cucumber/cucumber");
const { Enter4DigitsBankAccountTaxCredits } = require("../pages");
const { expect } = require("chai");

Then(
  "they should see the enter-4-digits-bank-account-tax-credits question page",
  async function () {
    const singleInputQuestionPage = new Enter4DigitsBankAccountTaxCredits(
      this.page
    );

    expect(singleInputQuestionPage.isCurrentPage()).to.be.true;
  }
);

When(
  "they enter correct account number and continue from the enter-4-digits-bank-account-tax-credits question page",
  async function () {
    const singleInputQuestionPage = new Enter4DigitsBankAccountTaxCredits(
      this.page
    );
    await singleInputQuestionPage.answer("1234");
    await singleInputQuestionPage.continue();
  }
);

When(
  "they do not enter an account number and continue from the enter-4-digits-bank-account-tax-credits question page",
  async function () {
    const singleInputQuestionPage = new Enter4DigitsBankAccountTaxCredits(
      this.page
    );
    await singleInputQuestionPage.answer("");
    await singleInputQuestionPage.continue();
  }
);

When(
  "they enter an invalid account number and continue from the enter-4-digits-bank-account-tax-credits question page",
  async function () {
    const singleInputQuestionPage = new Enter4DigitsBankAccountTaxCredits(
      this.page
    );
    await singleInputQuestionPage.answer("W123");
    await singleInputQuestionPage.continue();
  }
);

Then("they should see enter account number error message", async function () {
  const singleInputQuestionPage = new Enter4DigitsBankAccountTaxCredits(
    this.page
  );
  expect(singleInputQuestionPage.isCurrentPage()).to.be.true;
  expect(singleInputQuestionPage.hasErrorSummary).to.not.be.false;
});

Then(
  "they should see enter correct account number error message",
  async function () {
    const singleInputQuestionPage = new Enter4DigitsBankAccountTaxCredits(
      this.page
    );

    expect(singleInputQuestionPage.isCurrentPage()).to.be.true;
    expect(singleInputQuestionPage.hasErrorSummary).to.not.be.false;
  }
);
