const presenters = require("../../../../src/presenters");
const { APP } = require("../../../../src/lib/config");

describe("question-to-hint", () => {
  let translate;
  let question;

  beforeEach(() => {
    question = {
      questionKey: APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE,
    };

    translate = jest.fn();
  });

  it("should call translate using questionID", () => {
    presenters.questionToHint(question, translate);

    expect(translate).toHaveBeenCalledWith(
      `fields.${APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE}.hint`
    );
  });

  describe("with found key", () => {
    it("should return translated hint when found", () => {
      translate.mockReturnValue("translated question hint");

      const result = presenters.questionToHint(question, translate);

      expect(result).toBe("translated question hint");
    });
  });
});
