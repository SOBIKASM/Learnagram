const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  classroom_id: {
    type: String,
    required: true,
    index: true
  },
  sender_id: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'assignment', 'notification', 'file'],
    default: 'text'
  },
  file_url: {
    type: String
  },
  file_name: {
    type: String
  },
  file_type: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
