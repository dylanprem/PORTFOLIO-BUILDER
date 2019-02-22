const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateFrameworkInput(data) {
  let errors = {};

  data.framework = !isEmpty(data.framework) ? data.framework : "";
  data.skills = !isEmpty(data.skills) ? data.skills : "";

  if (Validator.isEmpty(data.framework)) {
    errors.framework = "A framework is required";
  }

  if (Validator.isEmpty(data.skills)) {
    errors.skills = "Framework skills are required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
