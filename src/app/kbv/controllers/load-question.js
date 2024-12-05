const debug = require("debug")("load-question");
const BaseController = require("hmpo-form-wizard").Controller;
const {
  APP,
  API: {
    PATHS: { QUESTION },
  },
} = require("../../../lib/config");

const questionKeyToPathMap = new Map([
  [
    APP.QUESTION_KEYS.RTI_PAYSLIP_NATIONAL_INSURANCE,
    APP.PATHS.ENTER_NATIONAL_INSURANCE_PAYSLIP,
  ],
  [APP.QUESTION_KEYS.RTI_PAYSLIP_INCOME_TAX, APP.PATHS.ENTER_TAX_PAYSLIP],
  [
    APP.QUESTION_KEYS.ITA_BANKACCOUNT,
    APP.PATHS.ENTER_4_DIGITS_BANK_ACCOUNT_TAX_CREDITS,
  ],
  [
    APP.QUESTION_KEYS.RTI_P60_PAYMENT_FOR_YEAR,
    APP.PATHS.ENTER_TOTAL_FOR_YEAR_P60,
  ],
  [
    APP.QUESTION_KEYS.RTI_P60_EARNINGS_ABOVE_PT,
    APP.PATHS.ENTER_EARNINGS_ABOVE_PT_P60,
  ],
  [
    APP.QUESTION_KEYS.RTI_P60_POSTGRADUATE_LOAN_DEDUCTIONS,
    APP.PATHS.ENTER_POSTGRADUATE_LOAN_DEDUCTIONS_P60,
  ],
  [
    APP.QUESTION_KEYS.RTI_P60_STATUTORY_SHARED_PARENTAL_PAY,
    APP.PATHS.ENTER_STATUTORY_SHARED_PARENTAL_PAY_P60,
  ],
  [
    APP.QUESTION_KEYS.RTI_P60_STATUTORY_ADOPTION_PAY,
    APP.PATHS.ENTER_STATUTORY_ADOPTION_PAY_P60,
  ],
  [
    APP.QUESTION_KEYS.RTI_P60_STATUTORY_MATERNITY_PAY,
    APP.PATHS.ENTER_STATUTORY_MATERNITY_PAY_P60,
  ],
  [
    APP.QUESTION_KEYS.RTI_P60_STUDENT_LOAN_DEDUCTIONS,
    APP.PATHS.ENTER_STUDENT_LOAN_DEDUCTIONS_P60,
  ],
  [
    APP.QUESTION_KEYS.RTI_P60_EMPLOYEE_NI_CONTRIBUTIONS,
    APP.PATHS.ENTER_EMPLOYEES_CONTRIBUTIONS_P60,
  ],
  [
    APP.QUESTION_KEYS.SA_INCOME_FROM_PENSIONS,
    APP.PATHS.WHAT_TYPE_SELF_ASSESSMENT,
  ],
  [APP.QUESTION_KEYS.TC_AMOUNT, APP.PATHS.ENTER_RECENT_TAX_CREDITS_PAYMENT],
  [
    APP.QUESTION_KEYS.SA_PAYMENT_DETAILS,
    APP.PATHS.ENTER_RECENT_SELF_ASSESSMENT_PAYMENT,
  ],
]);

class LoadQuestionController extends BaseController {
  async saveValues(req, res, next) {
    super.saveValues(req, res, async () => {
      try {
        const apiResponse = await req.axios.get(`${QUESTION}`, {
          headers: {
            "session-id": req.session.tokenId,
          },
        });

        req.session.question = apiResponse.data;
      } catch (e) {
        debug(e);
        return next(e);
      }

      next();
    });
  }

  hasQuestion(req) {
    return !!req.session?.question;
  }

  getQuestionPath(req) {
    return `question/${questionKeyToPathMap.get(
      req.session?.question?.questionKey
    )}`;
  }
}
module.exports = LoadQuestionController;
