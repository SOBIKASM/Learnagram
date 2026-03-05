const express = require("express");
const router = express.Router();
const verifyToken = require("../middlewares/authMiddleware");
const Post = require("../models/Post");

// Get feed posts
router.get("/feed", verifyToken, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username name profilePic")
      .populate("comments.user", "username name")
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create post
router.post("/", verifyToken, async (req, res) => {
  try {
    const { caption, mediaType, mediaContent } = req.body;
    
    const post = new Post({
      user: req.user.id,
      caption,
      media: {
        type: mediaType,
        [mediaType === "image" ? "src" : "content"]: mediaContent
      }
    });
    
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Like/unlike post
router.post("/:id/like", verifyToken, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }
    
    await post.save();
    res.json({ likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;