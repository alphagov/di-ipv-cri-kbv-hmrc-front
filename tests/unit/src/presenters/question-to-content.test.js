const presenters = require("../../../../src/presenters");
const monthsAgoToDate = require("../../../../src/utils/months-ago-to-date");
const { APP } = require("../../../../src/lib/config");

describe("question-to-content", () => {
  let translate;
  let question;
  let language;

  beforeEach(() => {
    question = {
      questionKey: APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE,
    };

    translate = jest.fn();
    language = "en";
  });

  it("should call translate using question key", () => {
    presenters.questionToContent(question, translate, language);

    expect(translate).toHaveBeenCalledWith(
      `pages.${APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE}.content`,
      expect.any(Object)
    );
  });

  describe("with found key", () => {
    it("should return translated content when found", () => {
      translate.mockReturnValue("translated question content");

      const result = presenters.questionToContent(
        question,
        translate,
        language
      );

      expect(result).toBe("translated question content");
    });

    it("should include months information in the translated content", () => {
      const { dynamicDate } = monthsAgoToDate(
        APP.DOMAIN.DEFAULT_PAYSLIP_MONTHS_AGO,
        language
      );
      presenters.questionToContent(question, translate, language);

      expect(translate).toHaveBeenCalledWith(
        `pages.${APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE}.content`,
        { dynamicDate }
      );
    });
  });
});
