const mongoose = require("mongoose");

const feedSchema = mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  imagePath: { type: String, required: true },
  source: { type: String, required: true },
  publisher: { type: String, required: true },
});

feedSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", feedSchema);
