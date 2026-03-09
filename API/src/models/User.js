const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_id: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  email: { type: String },
  department: { type: String },
  year: { type: Number },
  bio: { type: String },
  isPrivate: { type: Boolean, default: false },
  followers: [{ type: String }],
  following: [{ type: String }],
  followRequests: [{ type: String }],
  posts: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);