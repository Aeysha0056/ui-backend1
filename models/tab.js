const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tabSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  section: {
    type: Schema.Types.ObjectId,
    ref: 'Section'
  }
})

module.exports = mongoose.model('Tab', tabSchema)
