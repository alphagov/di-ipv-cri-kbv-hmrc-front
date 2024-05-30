const presenters = require("../../../../src/presenters");
const monthsAgoToDate = require("../../../../src/utils/months-ago-to-date");
const constants = require("../../../../src/constants/question-keys");

describe("question-to-content", () => {
  let translate;
  let question;
  let language;

  beforeEach(() => {
    question = {
      questionKey: constants.RTI_PAYSLIP_NATIONAL_INSURANCE,
    };

    translate = jest.fn();
    language = "en";
  });

  it("should call translate using questionID", () => {
    presenters.questionToContent(question, translate, language);

    expect(translate).toHaveBeenCalledWith(
      `pages.${constants.RTI_PAYSLIP_NATIONAL_INSURANCE}.content`,
      {}
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

    it("should include months information in the translated content when months is defined", () => {
      question.info = {
        months: "3",
      };

      const { dynamicDate } = monthsAgoToDate(question?.info?.months, language);
      presenters.questionToContent(question, translate, language);

      expect(translate).toHaveBeenCalledWith(
        `pages.${constants.RTI_PAYSLIP_NATIONAL_INSURANCE}.content`,
        { dynamicDate }
      );
    });

    it("should not include months information in the translated content when months is not defined", () => {
      presenters.questionToContent(question, translate, language);

      expect(translate).toHaveBeenCalledWith(
        `pages.${constants.RTI_PAYSLIP_NATIONAL_INSURANCE}.content`,
        {}
      );
    });
  });
});
