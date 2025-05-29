const mongoose = require("mongoose");

const advertisementSchema = new mongoose.Schema({
  category: String,
  heading: String,
  content: String,
  images: [String], // Store filenames
});

module.exports = mongoose.model("Advertisement", advertisementSchema);
