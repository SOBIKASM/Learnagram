const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Login", loginSchema);