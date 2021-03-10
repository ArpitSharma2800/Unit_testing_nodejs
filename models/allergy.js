const mongoose = require("mongoose");

const allergySchema = new mongoose.Schema({
  user_uid: {
    type: String,
    required: true,
    min: 5,
  },
  allergy: {
    type: String,
    required: true,
    min: 5,
    max: 255,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("allergy", allergySchema);
