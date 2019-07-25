const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const importsSchema = new Schema({
  img: {
    type: String,
    required: true
  },
  store: {
    type: Schema.Types.Mixed,
    required: true
  }
});

module.exports = mongoose.model("Imports", importsSchema);
