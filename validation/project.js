const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProjectInput(data) {
  let errors = {};

  data.projectname = !isEmpty(data.projectname) ? data.projectname : "";
  data.githuburl = !isEmpty(data.githuburl) ? data.githuburl : "";
  data.demourl = !isEmpty(data.demourl) ? data.demourl : "";
  data.desc = !isEmpty(data.desc) ? data.desc : "";
  data.features = !isEmpty(data.features) ? data.features : "";

  if (Validator.isEmpty(data.projectname)) {
    errors.projectname = "Project name is required";
  }

  if (Validator.isEmpty(data.githuburl)) {
    errors.githuburl = "Github repository URL is required";
  }

  if (!Validator.isURL(data.githuburl)) {
    errors.githuburl = "Please enter a valid URL";
  }

  if (Validator.isEmpty(data.demourl)) {
    errors.demourl = "demo URL is required";
  }

  if (!Validator.isURL(data.demourl)) {
    errors.demourl = "Please enter a valid URL";
  }

  if (Validator.isEmpty(data.features)) {
    errors.features = "features are required";
  }

  if (Validator.isEmpty(data.desc)) {
    errors.desc = "description field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
