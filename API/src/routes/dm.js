const express = require('express');
const router = express.Router();
const DirectMessage = require('../models/DirectMessage');
const User = require('../models/User');

// Get all DM conversations for a user (their followers/following)
router.get('/conversations/:user_id', async (req, res) => {
  try {
    const user = await User.findOne({ user_id: req.params.user_id }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Get mutual followers (people you follow AND who follow you)
    const mutualFollowers = user.followers.filter(f => user.following.includes(f));

    // For each mutual follower, get the last message
    const conversations = await Promise.all(
      mutualFollowers.map(async (other_id) => {
        const lastMessage = await DirectMessage.findOne({
          $or: [
            { sender_id: req.params.user_id, receiver_id: other_id },
            { sender_id: other_id, receiver_id: req.params.user_id }
          ]
        }).sort({ createdAt: -1 });

        const otherUser = await User.findOne({ user_id: other_id }).select('username name profile_pic');

        return {
          user_id: other_id,
          username: otherUser?.username || other_id,
          name: otherUser?.name || other_id,
          profile_pic: otherUser?.profile_pic || null,
          last_message: lastMessage?.content || null,
          last_time: lastMessage?.createdAt || null
        };
      })
    );

    res.json({ success: true, conversations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get message history between two users
router.get('/:user_id/:other_id', async (req, res) => {
  try {
    const { user_id, other_id } = req.params;

    const messages = await DirectMessage.find({
      $or: [
        { sender_id: user_id, receiver_id: other_id },
        { sender_id: other_id, receiver_id: user_id }
      ]
    }).sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send a DM
router.post('/send', async (req, res) => {
  try {
    const { sender_id, receiver_id, content } = req.body;

    // Check they follow each other
    const sender = await User.findOne({ user_id: sender_id });
    if (!sender.followers.includes(receiver_id) || !sender.following.includes(receiver_id)) {
      return res.status(403).json({ success: false, message: 'You can only DM mutual followers' });
    }

    const message = new DirectMessage({ sender_id, receiver_id, content });
    await message.save();

    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;