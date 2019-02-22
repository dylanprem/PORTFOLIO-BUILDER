const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const SettingSchema = new Schema({
  disableRegisterPage: {
    type: String
  }
});

module.exports = Setting = mongoose.model("setting", SettingSchema);
