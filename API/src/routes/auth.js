const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { user_id, password } = req.body;

    const user = await User.findOne({ user_id });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid User ID or password'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid User ID or password'
      });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return FULL user object (no password)
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        user_id: user.user_id,
        username: user.username,
        name: user.name,
        email: user.email,
        bio: user.bio,
        department: user.department,
        year: user.year,
        followers: user.followers,
        following: user.following,
        posts: user.posts,
        profile_pic: user.profile_pic || null
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

module.exports = router;