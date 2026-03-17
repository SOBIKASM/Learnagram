const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Notification = require('../models/Notification');
const Post = require('../models/Post');

// Get suggestions — users not yet followed
router.get('/suggestions/:user_id', async (req, res) => {
// ... existing suggestions code ...
  try {
    const me = await User.findOne({ user_id: req.params.user_id }).select('-password');
    if (!me) return res.status(404).json({ success: false, message: 'User not found' });

    const suggestions = await User.find({
      user_id: { $ne: req.params.user_id, $nin: me.following }
    }).select('user_id username name bio isPrivate followers').limit(10);

    res.json({ success: true, suggestions });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Follow or send follow request
router.post('/follow', async (req, res) => {
  try {
    const { from_user_id, to_user_id } = req.body;
    const target = await User.findOne({ user_id: to_user_id });
    const me = await User.findOne({ user_id: from_user_id });
    if (!target || !me) return res.status(404).json({ success: false, message: 'User not found' });

    if (target.isPrivate) {
      if (!target.followRequests.includes(from_user_id)) {
        target.followRequests.push(from_user_id);
        await target.save();
        
        // Notification for follow request
        const note = new Notification({
          user_id: to_user_id,
          type: 'follow',
          content: `${me.username} sent you a follow request.`,
          reference_id: from_user_id
        });
        await note.save();
      }
      return res.json({ success: true, status: 'requested' });
    } else {
      if (!target.followers.includes(from_user_id)) {
        target.followers.push(from_user_id);
        await target.save();
        
        // Notification for new follower
        const note = new Notification({
          user_id: to_user_id,
          type: 'follow',
          content: `${me.username} started following you.`,
          reference_id: from_user_id
        });
        await note.save();
      }
      if (!me.following.includes(to_user_id)) {
        me.following.push(to_user_id);
        await me.save();
      }
      return res.json({ success: true, status: 'following' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Unfollow
router.post('/unfollow', async (req, res) => {
// ... existing unfollow code ...
  try {
    const { from_user_id, to_user_id } = req.body;
    await User.updateOne({ user_id: to_user_id }, { $pull: { followers: from_user_id } });
    await User.updateOne({ user_id: from_user_id }, { $pull: { following: to_user_id } });
    res.json({ success: true, status: 'unfollowed' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Accept follow request
router.post('/accept', async (req, res) => {
  try {
    const { user_id, requester_id } = req.body;
    const me = await User.findOne({ user_id });
    const requester = await User.findOne({ user_id: requester_id });
    if (!me || !requester) return res.status(404).json({ success: false, message: 'User not found' });

    me.followRequests = me.followRequests.filter(r => r !== requester_id);
    if (!me.followers.includes(requester_id)) me.followers.push(requester_id);
    await me.save();

    if (!requester.following.includes(user_id)) requester.following.push(user_id);
    await requester.save();

    // Notification for follower
    const note = new Notification({
      user_id: requester_id,
      type: 'follow',
      content: `${me.username} accepted your follow request.`,
      reference_id: user_id
    });
    await note.save();

    res.json({ success: true, status: 'accepted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Decline follow request
router.post('/decline', async (req, res) => {
// ... existing decline code ...
  try {
    const { user_id, requester_id } = req.body;
    await User.updateOne({ user_id }, { $pull: { followRequests: requester_id } });
    res.json({ success: true, status: 'declined' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get pending follow requests
router.get('/requests/:user_id', async (req, res) => {
// ... existing requests code ...
  try {
    const me = await User.findOne({ user_id: req.params.user_id }).select('followRequests');
    if (!me) return res.status(404).json({ success: false, message: 'User not found' });
    const requesters = await User.find({ user_id: { $in: me.followRequests } }).select('user_id username name profile_pic');
    res.json({ success: true, requests: requesters });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get profile
router.get('/:user_id', async (req, res) => {
  try {
    // Populate posts using the post_id references
    const user = await User.findOne({ user_id: req.params.user_id }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Fetch full post details manually since posts is a String array of post_ids
    const fullPosts = await Post.find({ post_id: { $in: user.posts } }).sort({ created_at: -1 });

    const userObj = user.toObject();
    userObj.posts = fullPosts;

    res.json({ success: true, user: userObj });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update profile
router.put('/:user_id', async (req, res) => {
// ... existing update code ...
  try {
    const { name, bio, department, year, isPrivate } = req.body;
    const user = await User.findOneAndUpdate(
      { user_id: req.params.user_id },
      { $set: { name, bio, department, year, isPrivate } },
      { new: true }
    ).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;