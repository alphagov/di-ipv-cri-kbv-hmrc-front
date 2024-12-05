const debug = require("debug")("load-question");
const BaseController = require("hmpo-form-wizard").Controller;
const { APP } = require("../../../lib/config");
const { submitAnswer, getNextQuestion } = require("../service");
const taxYearToRange = require("../../../utils/tax-year-to-range");

class SelfAssessmentTaxReturnQuestionController extends BaseController {
  locals(req, res, callback) {
    super.locals(req, res, (err, locals) => {
      if (err) {
        return callback(err, locals);
      }

      locals = taxYearToRange(
        req.session.question?.info?.currentTaxYear,
        req.session.question?.info?.previousTaxYear
      );

      callback(null, locals);
    });
  }

  async saveValues(req, res, callback) {
    await super.saveValues(req, res, async (err) => {
      if (err) {
        return callback(err);
      }

      try {
        const pensionContributions = {
          [APP.FIELDS.STATE_PENSION]:
            req.body.statePension || req.body.statePensionShort,
          [APP.FIELDS.OTHER_PENSION]:
            req.body.otherPension || req.body.otherPensionShort,
          [APP.FIELDS.EMPLOYMENT_AND_SUPPORT_ALLOWANCE]:
            req.body.employmentAndSupportAllowance ||
            req.body.employmentAndSupportAllowanceShort,
          [APP.FIELDS.JOB_SEEKERS_ALLOWANCE]:
            req.body.jobSeekersAllowance || req.body.jobSeekersAllowanceShort,
          [APP.FIELDS.STATE_PENSION_AND_BENEFITS]:
            req.body.statePensionAndBenefits ||
            req.body.statePensionAndBenefitsShort,
        };

        const totalPensionContribution = Object.keys(
          pensionContributions
        ).reduce(function (previous, key) {
          return previous + parseFloat(pensionContributions[key] || 0);
        }, 0);

        await submitAnswer(
          req,
          APP.QUESTION_KEYS.SA_INCOME_FROM_PENSIONS,
          totalPensionContribution.toString()
        );

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

module.exports = SelfAssessmentTaxReturnQuestionController;
