const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const valueSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  view: {
    type: Schema.Types.ObjectId,
    ref: "View"
  }
});

module.exports = mongoose.model("Value", valueSchema);
