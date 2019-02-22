const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const ExperienceSchema = new Schema({
  from: {
    type: Date,
    required: true
  },
  to: {
    type: Date
  },
  desc: {
    type: String,
    required: true
  },
  emp: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  responsibility: {
    type: [String],
    required: true
  }
});

module.exports = Experience = mongoose.model("experience", ExperienceSchema);
