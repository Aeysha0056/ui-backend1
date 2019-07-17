const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sectionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  values: [
    {
      type: Schema.Types.ObjectId,
      ref: "Value"
    }
  ]
});

module.exports = mongoose.model("Section", sectionSchema);
