const mongoose = require("mongoose");

const directMessageSchema = new mongoose.Schema({
  sender_id: { type: String, required: true },
  receiver_id: { type: String, required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'file'], default: 'text' },
  file_url: { type: String },
  file_name: { type: String },
  file_type: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model("DirectMessage", directMessageSchema);