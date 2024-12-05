const taxYearToRange = require("../../../../src/utils/tax-year-to-range");
const { APP } = require("../../../../src/lib/config");

Date.now = jest.fn(() => new Date("2024-05-01"));

describe("tax-year-to-range", () => {
  let question;
  const currentTaxYear = "2022/23";
  const previousTaxYear = "2021/22";
  const currentYearRangeStart = 2022;
  const currentYearRangeEnd = 2023;
  const previousYearRangeStart = 2021;
  const previousYearRangeEnd = 2022;

  beforeEach(() => {
    question = {
      questionKey: APP.QUESTION_KEYS.SA_INCOME_FROM_PENSIONS,
      info: {
        currentTaxYear: currentTaxYear,
        previousTaxYear: previousTaxYear,
      },
    };
  });

  it("should return empty object when currentTaxYear and previousTaxYear are undefined", () => {
    question.info.currentTaxYear = undefined;
    question.info.previousTaxYear = undefined;
    const result = taxYearToRange(
      question?.info?.currentTaxYear,
      question?.info?.previousTaxYear
    );

    expect(result).toEqual({});
  });

  describe("with currentTaxYear defined", () => {
    it("should return object with currentYearRangeStart and currentYearRangeEnd when only currentTaxYear is defined", () => {
      question.info.previousTaxYear = undefined;
      const result = taxYearToRange(
        question?.info?.currentTaxYear,
        question?.info?.previousTaxYear
      );

      expect(result).toEqual({ currentYearRangeStart, currentYearRangeEnd });
    });

    it("should return object with currentYearRangeStart, currentYearRangeEnd, previousYearRangeStart, and previousYearRangeEnd when both currentTaxYear and previousTaxYear are defined", () => {
      const result = taxYearToRange(
        question?.info?.currentTaxYear,
        question?.info?.previousTaxYear
      );

      expect(result).toEqual({
        currentYearRangeStart,
        currentYearRangeEnd,
        previousYearRangeStart,
        previousYearRangeEnd,
      });
    });
  });
});
