const mongoose = require("mongoose");

const feedSchema = mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  imagePath: { type: String, required: true },
  source: { type: String, required: true },
  publisher: { type: String, required: true },
});

module.exports = mongoose.model("Feed", feedSchema);
