const debug = require("debug")("load-question");
const BaseController = require("hmpo-form-wizard").Controller;
const DateControllerMixin = require("hmpo-components").mixins.Date;
const questionKeys = require("../../../constants/question-keys");
const fields = require("../../../constants/fields");
const { submitAnswer, getNextQuestion } = require("../service");

const DateController = DateControllerMixin(BaseController);

class SelfAssessmentPaymentQuestionController extends DateController {
  async saveValues(req, res, callback) {
    await super.saveValues(req, res, async (err) => {
      if (err) {
        return callback(err);
      }

      try {
        const userInput = JSON.stringify({
          [fields.SELF_ASSESSMENT_PAYMENT_DATE]:
            req.form.values.selfAssessmentPaymentDate,
          [fields.SELF_ASSESSMENT_PAYMENT_AMOUNT]:
            req.form.values.selfAssessmentPaymentAmount,
        });

        await submitAnswer(req, questionKeys.SA_PAYMENT_DETAILS, userInput);

        req.session.question = undefined;
        const nextQuestion = await getNextQuestion(req);

        if (nextQuestion.data) {
          req.session.question = nextQuestion.data;
        }
      } catch (e) {
        debug(e);
        return callback(e);
      }

      callback();
    });
  }
}

module.exports = SelfAssessmentPaymentQuestionController;
