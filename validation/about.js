const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateAboutInput(data) {
  let errors = {};

  data.name = !isEmpty(data.name) ? data.name : "";
  data.bio = !isEmpty(data.bio) ? data.bio : "";
  data.contactemail = !isEmpty(data.contactemail) ? data.contactemail : "";

  if (Validator.isEmpty(data.name)) {
    errors.name = "Your name is required";
  }

  if (Validator.isEmpty(data.bio)) {
    errors.bio = "Bio is required";
  }

  if (Validator.isEmpty(data.contactemail)) {
    errors.contactemail = "Email is required";
  }

  if (!Validator.isEmail(data.contactemail)) {
    errors.contactemail = "Email is invalid";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
