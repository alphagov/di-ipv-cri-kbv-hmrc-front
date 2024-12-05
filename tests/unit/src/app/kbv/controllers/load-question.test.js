const BaseController = require("hmpo-form-wizard").Controller;
const Controller = require("../../../../../../src/app/kbv/controllers/load-question");
const {
  APP,
  API: {
    PATHS: { QUESTION },
  },
} = require("../../../../../../src/lib/config");

jest.mock();
describe("question controller", () => {
  let controller;

  beforeEach(() => {
    controller = new Controller({ route: "/test" });
  });

  it("should be an instance of BaseController", () => {
    controller = new Controller({ route: "/test" });

    expect(controller).toBeInstanceOf(BaseController);
  });

  describe("#saveValues", () => {
    const next = jest.fn();
    const res = jest.fn();
    let req;

    beforeEach(() => {
      req = global.req;
    });

    it("should call question endpoint", async () => {
      await controller.saveValues(req, res, next);

      expect(req.axios.get).toHaveBeenCalledWith(QUESTION, {
        headers: {
          "session-id": req.session.tokenId,
        },
      });
    });

    describe("on API success", () => {
      it("should call next", async () => {
        req.axios.get = jest.fn().mockResolvedValue({});

        await controller.saveValues(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith();
      });
    });

    describe("on API failure", () => {
      it("should call next with error", async () => {
        const error = new Error("Async error message");
        req.axios.get = jest.fn().mockRejectedValue(error);

        await controller.saveValues(req, res, next);

        expect(next).toHaveBeenCalledTimes(1);
        expect(next).toHaveBeenCalledWith(error);
      });
    });
  });

  describe("#hasQuestion", () => {
    it('should return "true" when there is a next question', () => {
      const req = {
        session: {
          question: {
            questionKey: APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE,
          },
        },
      };

      const result = controller.hasQuestion(req);

      expect(result).toBe(true);
    });

    it('should return "false" when no question', () => {
      const req = {
        session: {
          question: null,
        },
      };
      const result = controller.hasQuestion(req);

      expect(result).toBe(false);
    });
  });

  describe("#getQuestionPath", () => {
    it("should return path for the next question", () => {
      const req = {
        session: {
          question: {
            questionKey: APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE,
          },
        },
      };

      const result = controller.getQuestionPath(req);

      expect(result).toBe("question/enter-national-insurance-payslip");
    });
  });
});
