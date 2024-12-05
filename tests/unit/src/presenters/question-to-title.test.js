const presenters = require("../../../../src/presenters");
const { APP } = require("../../../../src/lib/config");

describe("question-to-title", () => {
  let translate;
  let question;

  beforeEach(() => {
    question = {
      questionKey: APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE,
    };

    translate = jest.fn();
  });

  it("should call translate using questionID", () => {
    presenters.questionToTitle(question, translate);

    expect(translate).toHaveBeenCalledWith(
      `pages.${APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE}.title`
    );
  });

  describe("with found key", () => {
    it("should return translated title when found", () => {
      translate.mockReturnValue("translated question title");

      const result = presenters.questionToTitle(question, translate);

      expect(result).toBe("translated question title");
    });
  });
});
