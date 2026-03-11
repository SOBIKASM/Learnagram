const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');

// Create a post
router.post('/create', async (req, res) => {
  try {
    const { post_id, user_id, caption, image_url, visibility } = req.body;

    if (!post_id || !user_id || !caption) {
      return res.status(400).json({ success: false, message: 'post_id, user_id and caption are required' });
    }

    const post = new Post({ post_id, user_id, caption, image_url, visibility });
    await post.save();

    // Add post_id to user's posts array
    await User.findOneAndUpdate(
      { user_id },
      { $push: { posts: post_id } }
    );

    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all posts (Explore)
router.get('/explore', async (req, res) => {
  try {
    const posts = await Post.find().sort({ created_at: -1 });
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's own posts (Home)
router.get('/home/:user_id', async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findOne({ user_id: req.params.user_id });

    // Show your posts + posts from people you follow
    const userIds = [req.params.user_id, ...(user?.following || [])];

    const posts = await Post.find({ user_id: { $in: userIds } })
      .sort({ created_at: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Like/Unlike a post
router.post('/like', async (req, res) => {
  const { post_id, user_id } = req.body;
  try {
    const post = await Post.findOne({ post_id });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const index = post.likes.indexOf(user_id);
    if (index === -1) {
      post.likes.push(user_id);
    } else {
      post.likes.splice(index, 1);
    }
    await post.save();
    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a comment
router.post('/comment', async (req, res) => {
  const { post_id, user_id, text } = req.body;
  try {
    const post = await Post.findOne({ post_id });
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({ user_id, text });
    await post.save();
    res.json({ success: true, post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a post
router.delete('/:post_id', async (req, res) => {
  const { post_id } = req.params;
  const { user_id } = req.body; // In a real app, this would come from auth middleware
  try {
    const post = await Post.findOne({ post_id });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    // Permissions: Author or Mentor
    const isAuthor = post.user_id === user_id;
    const isMentor = user_id && user_id.startsWith('MTR_');

    if (!isAuthor && !isMentor) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this post' });
    }

    await Post.findOneAndDelete({ post_id });

    // Also remove from user's posts array
    await User.findOneAndUpdate(
      { user_id: post.user_id },
      { $pull: { posts: post_id } }
    );

    res.json({ success: true, message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete a comment
router.delete('/comment/:post_id/:comment_id', async (req, res) => {
  const { post_id, comment_id } = req.params;
  const { user_id } = req.body;
  try {
    const post = await Post.findOne({ post_id });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const comment = post.comments.id(comment_id);
    if (!comment) return res.status(404).json({ success: false, message: 'Comment not found' });

    // Permissions: Comment Author, Post Author, or Mentor
    const isCommentAuthor = comment.user_id === user_id;
    const isPostAuthor = post.user_id === user_id;
    const isMentor = user_id && user_id.startsWith('MTR_');

    if (!isCommentAuthor && !isPostAuthor && !isMentor) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this comment' });
    }

    post.comments.pull(comment_id);
    await post.save();

    res.json({ success: true, message: 'Comment deleted', post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;