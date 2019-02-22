const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const AboutSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true
  },
  region: {
    type: String
  },
  contactemail: {
    type: String
  },
  github: {
    type: String
  },
  linkedin: {
    type: String
  },
  imgsrc: {
    type: String
  }
});

module.exports = About = mongoose.model("about", AboutSchema);
