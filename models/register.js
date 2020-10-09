const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 5,
  },
  email: {
    type: String,
    required: true,
    min: 5,
    max: 255,
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 1024,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("register", registerSchema);
