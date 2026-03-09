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
    enum: ['text', 'assignment', 'notification'],
    default: 'text'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
