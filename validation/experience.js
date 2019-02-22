const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
  let errors = {};

  data.from = !isEmpty(data.from) ? data.from : "";
  data.desc = !isEmpty(data.desc) ? data.desc : "";
  data.emp = !isEmpty(data.emp) ? data.emp : "";
  data.responsibility = !isEmpty(data.responsibility)
    ? data.responsibility
    : "";

  if (Validator.isEmpty(data.from)) {
    errors.from = "from date is required";
  }

  if (Validator.isEmpty(data.desc)) {
    errors.desc = "description field is required";
  }

  if (Validator.isEmpty(data.emp)) {
    errors.emp = "employer name field is required";
  }

  if (Validator.isEmpty(data.responsibility)) {
    errors.responsibility = "responsibilities are required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
