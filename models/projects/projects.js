const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectsSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  imports: [
    {
      type: Schema.Types.ObjectId,
      ref: "Imports"
    }
  ]
});

module.exports = mongoose.model("Projects", projectsSchema);
