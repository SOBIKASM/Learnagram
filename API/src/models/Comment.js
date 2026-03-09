const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  comment_id: {
    type: String,
    required: true,
    unique: true
  },
  post_id: {
    type: String,
    required: true
  },
  user_id: {
    type: String,
    required: true
  },
  text: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Comment", commentSchema);