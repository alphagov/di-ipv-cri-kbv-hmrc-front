const presenters = require("../../../../src/presenters");
const { APP } = require("../../../../src/lib/config");
const taxYearToRange = require("../../../../src/utils/tax-year-to-range");
const monthsAgoToDate = require("../../../../src/utils/months-ago-to-date");

Date.now = jest.fn(() => new Date("2024-05-01"));

describe("question-to-inset", () => {
  let translate;
  let question;
  let data;
  const englishLanguage = "en";
  const welshLanguage = "cy";
  const welshDate = "1 Chwefror 2024";
  const englishDate = "1 February 2024";

  beforeEach(() => {
    question = {
      questionKey: APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE,
    };
    data = { dynamicDate: englishDate };
    translate = jest.fn();
  });

  it("should call translate using question key", () => {
    presenters.questionToInset(question, translate, englishLanguage);

    expect(translate).toHaveBeenCalledWith(
      `pages.${APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE}.inset`,
      expect.any(Object)
    );
  });

  it("should return empty string when translation not present", () => {
    translate.mockReturnValue(undefined);
    const insetTest = presenters.questionToInset(
      question,
      translate,
      englishLanguage
    );

    expect(insetTest).toBe("");
  });

  describe("with translation key found", () => {
    it("should return english language translated content", () => {
      translate.mockReturnValue(
        `translated question inset three months ago ${englishDate}`
      );

      const result = presenters.questionToInset(
        question,
        translate,
        englishLanguage
      );

      expect(translate).toHaveBeenCalledWith(
        `pages.${APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE}.inset`,
        data
      );

      expect(result).toBe(
        `translated question inset three months ago ${englishDate}`
      );
    });

    it("should return welsh language translated content", () => {
      translate.mockReturnValue(
        `mewnosod cwestiwn wedi'i gyfieithu dri mis yn ôl ${welshDate}`
      );

      const result = presenters.questionToInset(
        question,
        translate,
        welshLanguage
      );

      data.dynamicDate = welshDate;

      expect(translate).toHaveBeenCalledWith(
        `pages.${APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE}.inset`,
        data
      );

      expect(result).toBe(
        `mewnosod cwestiwn wedi'i gyfieithu dri mis yn ôl ${welshDate}`
      );
    });
  });

  describe("question-to-inset with currentTaxYear and previousTaxYear", () => {
    beforeEach(() => {
      translate = jest.fn();
    });

    it("should include tax year information in the translated inset when currentTaxYear and previousTaxYear are defined", () => {
      question = {
        questionKey: APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE,
        info: {
          currentTaxYear: "2022/23",
          previousTaxYear: "2021/22",
        },
      };

      const {
        currentYearRangeStart,
        currentYearRangeEnd,
        previousYearRangeStart,
        previousYearRangeEnd,
      } = taxYearToRange(
        question.info.currentTaxYear,
        question.info.previousTaxYear
      );

      presenters.questionToInset(question, translate, englishLanguage);

      expect(translate).toHaveBeenCalledWith(
        `pages.${APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE}.insetMultipleTaxYears`,
        expect.objectContaining({
          currentYearRangeStart,
          currentYearRangeEnd,
          previousYearRangeStart,
          previousYearRangeEnd,
        })
      );
    });

    it("should include tax year information in the translated inset when only currentTaxYear is defined", () => {
      question = {
        questionKey: APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE,
        info: {
          currentTaxYear: "2022/23",
        },
      };

      const { currentYearRangeStart, currentYearRangeEnd } = taxYearToRange(
        question.info.currentTaxYear
      );

      presenters.questionToInset(question, translate, englishLanguage);

      expect(translate).toHaveBeenCalledWith(
        `pages.${APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE}.inset`,
        expect.objectContaining({
          currentYearRangeStart,
          currentYearRangeEnd,
        })
      );
    });

    it("should not include tax year information in the translated inset when currentTaxYear is not defined", () => {
      question = {
        questionKey: APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE,
        info: {},
      };

      presenters.questionToInset(question, translate, englishLanguage);

      expect(translate).toHaveBeenCalledWith(
        `pages.${APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE}.inset`,
        expect.not.objectContaining({
          currentYearRangeStart: expect.anything(),
          currentYearRangeEnd: expect.anything(),
        })
      );
    });
  });

  describe("question-to-inset with months", () => {
    it("should include months information in the translated inset", () => {
      question = {
        questionKey: APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE,
      };

      const { dynamicDate } = monthsAgoToDate(
        APP.DOMAIN.DEFAULT_PAYSLIP_MONTHS_AGO,
        englishLanguage
      );
      presenters.questionToInset(question, translate, englishLanguage);

      expect(translate).toHaveBeenCalledWith(
        `pages.${APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE}.inset`,
        { dynamicDate }
      );
    });
  });

  describe("question-to-inset key based on previousTaxYear presence", () => {
    it("should set key to include insetMultipleTaxYears when previousTaxYear is defined", () => {
      question = {
        questionKey: APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE,
        info: {
          previousTaxYear: "2021/22",
        },
      };

      presenters.questionToInset(question, translate, englishLanguage);

      expect(translate).toHaveBeenCalledWith(
        `pages.${APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE}.insetMultipleTaxYears`,
        expect.any(Object)
      );
    });

    it("should set key to include inset when previousTaxYear is not defined", () => {
      question = {
        questionKey: APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE,
        info: {},
      };

      presenters.questionToInset(question, translate, englishLanguage);

      expect(translate).toHaveBeenCalledWith(
        `pages.${APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE}.inset`,
        expect.any(Object)
      );
    });
  });
});
