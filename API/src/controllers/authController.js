const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const register = async (req, res) => {
  try {
    const { username, password, role, name, email, department, year, bio } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      username, 
      password: hashedPassword, 
      role: role || "user",
      name,
      email,
      department,
      year,
      bio
    });
    
    await newUser.save();
    
    // Generate token for auto-login after registration
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRETKEY,
      { expiresIn: "7d" }
    );
    
    res.status(201).json({ 
      message: `User registered successfully`,
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        role: newUser.role,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `Something went wrong` });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: `User with ${username} not found` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: `Invalid credentials` });
    }
    
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRETKEY,
      { expiresIn: "7d" }
    );
    
    res.status(200).json({ 
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `Something went wrong` });
  }
};

module.exports = { register, login };