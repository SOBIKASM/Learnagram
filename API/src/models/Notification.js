const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['message', 'assignment', 'like', 'comment', 'follow', 'assignment_graded'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  reference_id: {
    type: String // classroom_id, assignment_id, or post_id
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
