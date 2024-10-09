const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  model: String,
  releaseYear: Number,
  make: String,
});

const Car = mongoose.model("car", CarSchema);

module.exports = Car;
