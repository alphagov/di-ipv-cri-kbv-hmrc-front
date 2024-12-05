const BaseController = require("hmpo-form-wizard").Controller;
const Controller = require("../../../../../../src/app/kbv/controllers/single-input-question");
const service = require("../../../../../../src/app/kbv/service");
jest.mock("../../../../../../src/app/kbv/service");

const presenters = require("../../../../../../src/presenters");
jest.mock("../../../../../../src/presenters");
const fields = require("../../../../../../src/app/kbv/fieldsHelper");
const { APP } = require("../../../../../../src/lib/config");

describe("single-input-question controller", () => {
  let controller;
  let req;
  let next;
  let res;

  beforeEach(() => {
    controller = new Controller({ route: "/test" });
    req = global.req;
    req.lng = "en";
    req.form.options = {
      fields: {},
      templatePath: "template-path",
    };
    req.session.question = {
      questionKey: "Q1",
      hint: "l",
      text: "t",
    };
    next = jest.fn();
    res = jest.fn();
  });

  it("should be an instance of BaseController", () => {
    controller = new Controller({ route: "/test" });
    expect(controller).toBeInstanceOf(BaseController);
  });

  describe("#configure", () => {
    it("should set the template to be the shared template for this controller", () => {
      controller.configure(req, res, next);
      expect(req.form.options.template).toContain("single-input-question");
    });
  });

  describe("#locals", () => {
    beforeEach(() => {
      req.session = {
        question: {
          info: {
            months: "3",
          },
        },
      };
      req.translate = jest.fn();
    });

    it("should call super.locals with req and res", () => {
      const superLocals = jest.spyOn(BaseController.prototype, "locals");

      controller.locals(req, res, next);

      expect(superLocals).toHaveBeenCalledWith(req, res, expect.any(Function));
    });

    it("should set question.label and question.hint in locals", (done) => {
      presenters.questionToLabel.mockReturnValue("Question Label");
      presenters.questionToHint.mockReturnValue("Question Hint");
      presenters.questionToInset.mockReturnValue("Question Inset");
      presenters.questionToContent.mockReturnValue("Question Content");
      presenters.questionToTitle.mockReturnValue("Question Title");

      const callback = jest.fn((err, locals) => {
        expect(err).toBeNull();
        expect(locals.question.label).toBe("Question Label");
        expect(locals.question.hint).toBe("Question Hint");
        expect(locals.question.content).toBe("Question Content");
        expect(locals.question.inset).toBe("Question Inset");
        expect(locals.question.title).toBe("Question Title");
        done();
      });

      controller.locals(req, res, callback);
    });

    it("should call callback with error if super.locals returns an error", (done) => {
      const mockError = new Error("Some error");

      const callback = jest.fn((err, locals) => {
        expect(err).toEqual(mockError);
        expect(locals).toBeUndefined();
        done();
      });

      const superLocals = jest.spyOn(BaseController.prototype, "locals");
      superLocals.mockImplementation((req, res, callback) => {
        callback(mockError);
      });

      controller.locals(req, res, callback);
    });
  });

  describe("#saveValues", () => {
    beforeEach(() => {
      req.session.tokenId = "session-id";
      req.axios.post = jest.fn();
    });

    describe("on API success", () => {
      it("should call answer endpoint to post submitted answer", async () => {
        const questionKey = APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE;
        req.session.question.questionKey = questionKey;
        req.body[questionKey] = "3";
        service.getNextQuestion.mockResolvedValue({});
        service.submitAnswer.mockResolvedValue({});

        await controller.saveValues(req, res, next);

        expect(service.submitAnswer).toHaveBeenCalledWith(
          req,
          APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE,
          "3"
        );
        expect(service.submitAnswer).toHaveBeenCalledTimes(1);
      });

      it("should call question endpoint to get next question and store it in session", async () => {
        req.session.question.questionKey =
          APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE;
        req.body.question = "3";
        service.getNextQuestion.mockResolvedValue({
          data: { questionKey: APP.QUESTION_KEYS.RTI_P60_PAYMENT_FOR_YEAR },
        });
        service.submitAnswer.mockResolvedValue({});

        await controller.saveValues(req, res, next);

        expect(service.getNextQuestion).toHaveBeenCalledWith(req);
        expect(service.getNextQuestion).toHaveBeenCalledTimes(1);
        expect(req.session.question).toEqual({
          questionKey: APP.QUESTION_KEYS.RTI_P60_PAYMENT_FOR_YEAR,
        });
      });

      it("should strip spaces and decimal when required", async () => {
        const questionKey = APP.QUESTION_KEYS.RTI_P60_EARNINGS_ABOVE_PT;
        req.session.question.questionKey = questionKey;
        req.body[questionKey] = " 123.45 ";
        req.form.options.fields[questionKey] = { stripDecimal: true };
        service.getNextQuestion.mockResolvedValue({});
        service.submitAnswer.mockResolvedValue({});
        fields.stripSpaces = jest.fn().mockReturnValue("123.45");
        fields.stripDecimal = jest.fn().mockReturnValue("123");

        await controller.saveValues(req, res, next);

        expect(fields.stripSpaces).toHaveBeenCalledWith(" 123.45 ");
        expect(fields.stripDecimal).toHaveBeenCalledWith("123.45");
        expect(service.submitAnswer).toHaveBeenCalledWith(
          req,
          questionKey,
          "123"
        );
      });

      it("should strip spaces only when stripDecimal is not set to true", async () => {
        const questionKey = APP.QUESTION_KEYS.ITA_BANKACCOUNT;
        req.session.question.questionKey = questionKey;
        req.body[questionKey] = " 123.45 ";
        req.form.options.fields[questionKey] = { stripDecimal: false };
        service.getNextQuestion.mockResolvedValue({});
        service.submitAnswer.mockResolvedValue({});
        fields.stripSpaces = jest.fn().mockReturnValue("123.45");

        await controller.saveValues(req, res, next);

        expect(fields.stripSpaces).toHaveBeenCalledWith(" 123.45 ");
        expect(fields.stripDecimal).not.toHaveBeenCalled();
        expect(service.submitAnswer).toHaveBeenCalledWith(
          req,
          questionKey,
          "123.45"
        );
      });
    });

    describe("When answer API fails", () => {
      it("should call next with error when Post answer fails", async () => {
        const error = new Error("Async error message");
        service.submitAnswer.mockRejectedValue(error);

        await controller.saveValues(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(error);
      });

      it("should call next with error when Get question fails", async () => {
        const error = new Error("Async error message");
        service.submitAnswer.mockResolvedValue({});
        service.getNextQuestion.mockRejectedValue(error);

        await controller.saveValues(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(error);
      });

      it("should call callback with error if super.locals returns an error", async () => {
        const mockError = new Error("Some error");

        const callback = jest.fn((err) => {
          expect(err).toEqual(mockError);
        });

        const superLocals = jest.spyOn(BaseController.prototype, "saveValues");
        superLocals.mockImplementation((req, res, callback) => {
          callback(mockError);
        });

        await controller.saveValues(req, res, callback);
      });
    });
  });
});
