const { APP } = require("../lib/config");
const monthsAgoToDate = require("../utils/months-ago-to-date");

module.exports = function (question, translate, language) {
  const key = `pages.${question.questionKey}.content`;
  const data = {};

  Object.assign(
    data,
    monthsAgoToDate(APP.DOMAIN.DEFAULT_PAYSLIP_MONTHS_AGO, language)
  );

  const content = translate(key, data);

  if (content && !content.includes(question.questionKey)) {
    return content;
  }

  return "";
};
