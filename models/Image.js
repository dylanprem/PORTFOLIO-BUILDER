const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const ImageSchema = new Schema({
  imagePath: {
    type: String
  },
  fileID: {
    type: Schema.Types.ObjectId
  }
});

module.exports = Image = mongoose.model("image", ImageSchema);
