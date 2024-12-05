const BaseController = require("hmpo-form-wizard").Controller;
const Controller = require("../../../../../../src/app/kbv/controllers/self-assessment-payment-question");
const service = require("../../../../../../src/app/kbv/service");
const { APP } = require("../../../../../../src/lib/config");
jest.mock("../../../../../../src/app/kbv/service");

describe("self-assessment-payment-question controller", () => {
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

  describe("#saveValues", () => {
    beforeEach(() => {
      req.session.tokenId = "session-id";
    });

    describe("on API success", () => {
      it("should call answer endpoint to post submitted answer", async () => {
        const questionKey = APP.QUESTION_KEYS.SA_PAYMENT_DETAILS;
        req.session.question.questionKey = questionKey;
        req.form.values = {
          selfAssessmentPaymentDate: "2023-02-22",
          selfAssessmentPaymentAmount: "2000.22",
        };
        const userInput = JSON.stringify({
          amount: parseFloat(req.form.values.selfAssessmentPaymentAmount),
          paymentDate: req.form.values.selfAssessmentPaymentDate,
        });
        service.getNextQuestion.mockResolvedValue({});
        service.submitAnswer.mockResolvedValue({});

        await controller.saveValues(req, res, next);

        expect(service.submitAnswer).toHaveBeenCalledWith(
          req,
          APP.QUESTION_KEYS.SA_PAYMENT_DETAILS,
          userInput
        );
        expect(service.submitAnswer).toHaveBeenCalledTimes(1);
      });

      it("should call question endpoint to get next question and store it in session", async () => {
        req.session.question.questionKey = APP.QUESTION_KEYS.SA_PAYMENT_DETAILS;
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
