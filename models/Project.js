const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const ProjectSchema = new Schema({
  projectname: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  githuburl: {
    type: String,
    required: true
  },
  demourl: {
    type: String,
    required: true
  },
  features: {
    type: [String],
    required: true
  },
  imgsrc: {
    type: String
  }
});

module.exports = Project = mongoose.model("project", ProjectSchema);
