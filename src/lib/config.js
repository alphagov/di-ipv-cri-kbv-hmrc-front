require("dotenv").config();

// These are the suffixes that the GOVUK Design system adds to the ID of a date
// control to generate the IDs of the text inputs.
const HMPO_SUFFIX_DAY = "-day";
const HMPO_SUFFIX_MONTH = "-month";
const HMPO_SUFFIX_YEAR = "-year";

module.exports = {
  API: {
    BASE_URL: process.env.API_BASE_URL || "http://localhost:8080",
    PATHS: {
      SESSION: "/session",
      AUTHORIZATION: "/authorization",
      FETCHQUESTIONS: "/fetchquestions",
      QUESTION: "/question",
      ANSWER: "/answer",
    },
  },
  APP: {
    BASE_URL: process.env.EXTERNAL_WEBSITE_HOST || "http://localhost:5000",
    PATHS: {
      KBV: "/kbv",
      OAUTH2_CALLBACK: "/oauth2/callback",
      PROVE_IDENTITY_ANOTHER_WAY: "/prove-identity-another-way",
      DONE: "done",
      QUESTION_PREFIX: "question/",
      ANSWER_SECURITY_QUESTIONS: "answer-security-questions",
      LOAD_QUESTION: "load-question",
      ENTER_NATIONAL_INSURANCE_PAYSLIP: "enter-national-insurance-payslip",
      ENTER_TAX_PAYSLIP: "enter-tax-payslip",
      ENTER_4_DIGITS_BANK_ACCOUNT_TAX_CREDITS:
        "enter-4-digits-bank-account-tax-credits",
      ENTER_TOTAL_FOR_YEAR_P60: "enter-total-for-year-p60",
      ENTER_EARNINGS_ABOVE_PT_P60: "enter-earnings-above-pt-p60",
      ENTER_POSTGRADUATE_LOAN_DEDUCTIONS_P60:
        "enter-postgraduate-loan-deductions-p60",
      ENTER_STATUTORY_SHARED_PARENTAL_PAY_P60:
        "enter-statutory-shared-parental-pay-p60",
      ENTER_STATUTORY_ADOPTION_PAY_P60: "enter-statutory-adoption-pay-p60",
      ENTER_STATUTORY_MATERNITY_PAY_P60: "enter-statutory-maternity-pay-p60",
      ENTER_STUDENT_LOAN_DEDUCTIONS_P60: "enter-student-loan-deductions-p60",
      ENTER_EMPLOYEES_CONTRIBUTIONS_P60: "enter-employees-contributions-p60",
      WHAT_TYPE_SELF_ASSESSMENT: "what-type-self-assessment",
      ENTER_RECENT_TAX_CREDITS_PAYMENT: "enter-recent-tax-credits-payment",
      ENTER_RECENT_SELF_ASSESSMENT_PAYMENT:
        "enter-recent-self-assessment-payment",
      ENTER_PENSION_BENEFITS_SELF_ASSESSMENT:
        "enter-pensions-benefits-self-assessment",
      ENTER_PENSION_BENEFITS_SHORT_TAX_RETURN:
        "enter-pensions-benefits-short-tax-return",
    },
    QUESTION_KEYS: {
      RTI_PAYSLIP_NATIONAL_INSURANCE: "rti-payslip-national-insurance",
      RTI_PAYSLIP_INCOME_TAX: "rti-payslip-income-tax",
      RTI_P60_PAYMENT_FOR_YEAR: "rti-p60-payment-for-year",
      RTI_P60_EARNINGS_ABOVE_PT: "rti-p60-earnings-above-pt",
      RTI_P60_POSTGRADUATE_LOAN_DEDUCTIONS:
        "rti-p60-postgraduate-loan-deductions",
      RTI_P60_STATUTORY_SHARED_PARENTAL_PAY:
        "rti-p60-statutory-shared-parental-pay",
      RTI_P60_STATUTORY_ADOPTION_PAY: "rti-p60-statutory-adoption-pay",
      RTI_P60_STATUTORY_MATERNITY_PAY: "rti-p60-statutory-maternity-pay",
      RTI_P60_STUDENT_LOAN_DEDUCTIONS: "rti-p60-student-loan-deductions",
      RTI_P60_EMPLOYEE_NI_CONTRIBUTIONS: "rti-p60-employee-ni-contributions",
      ITA_BANKACCOUNT: "ita-bankaccount",
      TC_AMOUNT: "tc-amount",
      SA_INCOME_FROM_PENSIONS: "sa-income-from-pensions",
      SA_PAYMENT_DETAILS: "sa-payment-details",
    },
    FIELDS: {
      SELF_ASSESSMENT_ROUTER: "selfAssessmentRouter",
      STATE_PENSION: "statePension",
      OTHER_PENSION: "otherPension",
      EMPLOYMENT_AND_SUPPORT_ALLOWANCE: "employmentAndSupportAllowance",
      JOB_SEEKERS_ALLOWANCE: "jobSeekersAllowance",
      STATE_PENSION_AND_BENEFITS: "statePensionAndBenefits",
      STATE_PENSION_SHORT: "statePensionShort",
      OTHER_PENSION_SHORT: "otherPensionShort",
      EMPLOYMENT_AND_SUPPORT_ALLOWANCE_SHORT:
        "employmentAndSupportAllowanceShort",
      JOB_SEEKERS_ALLOWANCE_SHORT: "jobSeekersAllowanceShort",
      STATE_PENSION_AND_BENEFITS_SHORT: "statePensionAndBenefitsShort",
      SELF_ASSESSMENT_PAYMENT_DATE: "selfAssessmentPaymentDate",
      SELF_ASSESSMENT_PAYMENT_DATE_DAY:
        "selfAssessmentPaymentDate" + HMPO_SUFFIX_DAY,
      SELF_ASSESSMENT_PAYMENT_DATE_MONTH:
        "selfAssessmentPaymentDate" + HMPO_SUFFIX_MONTH,
      SELF_ASSESSMENT_PAYMENT_DATE_YEAR:
        "selfAssessmentPaymentDate" + HMPO_SUFFIX_YEAR,
      SELF_ASSESSMENT_PAYMENT_AMOUNT: "selfAssessmentPaymentAmount",
      ABANDON_RADIO: "abandonRadio",
    },
    DOMAIN: {
      DEFAULT_PAYSLIP_MONTHS_AGO: 3,
    },
    GTM: {
      ANALYTICS_COOKIE_DOMAIN:
        process.env.ANALYTICS_COOKIE_DOMAIN || "localhost",
      UA_DISABLED: process.env.UA_DISABLED || "false",
      UA_CONTAINER_ID: process.env.UA_CONTAINER_ID,
      GA4_DISABLED: process.env.GA4_DISABLED || "true",
      GA4_CONTAINER_ID: process.env.GA4_CONTAINER_ID,
    },
    LANGUAGE_TOGGLE_DISABLED: process.env.LANGUAGE_TOGGLE_DISABLED || "true",
  },
  AWS_REGION: process.env.AWS_REGION || "eu-west-2",
  PORT: Number(process.env.PORT) || 5000,
  SESSION_SECRET: process.env.SESSION_SECRET,
  SESSION_TABLE_NAME: process.env.SESSION_TABLE_NAME,
  SESSION_TTL: Number(process.env.SESSION_TTL) || 7200000, // two hours in ms
};
