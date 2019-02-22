const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const FrameworkSchema = new Schema({
  framework: {
    type: String,
    required: true
  },
  skills: {
    type: [String],
    required: true
  },
  imgsrc: {
    type: String
  }
});

module.exports = Framework = mongoose.model("framework", FrameworkSchema);
