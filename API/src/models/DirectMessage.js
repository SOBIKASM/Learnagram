const mongoose = require("mongoose");

const directMessageSchema = new mongoose.Schema({
  sender_id: { type: String, required: true },
  receiver_id: { type: String, required: true },
  content: { type: String, required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model("DirectMessage", directMessageSchema);