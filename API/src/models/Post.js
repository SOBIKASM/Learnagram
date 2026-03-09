const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  post_id: { type: String, required: true, unique: true },
  user_id: { type: String, required: true },
  caption: { type: String },
  image_url: { type: String },
  visibility: { type: String, enum: ['Public', 'Private'], default: 'Public' },
  created_at: { type: Date, default: Date.now },
  likes: [{ type: String }],
  comments: [{
    user_id: { type: String, required: true },
    text: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model("Post", postSchema);