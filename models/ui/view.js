const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const viewSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  values: [
    {
      type: String,
      required: true
    }
  ]
});

module.exports = mongoose.model("View", viewSchema);
