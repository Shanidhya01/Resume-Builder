const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

// @desc Register a new user
// @route POST /api/auth/register
// @access Public
const registerUser = async (req, res) => {
  try {
    const { name, fullName, email, password, profileImageUrl } = req.body;
    const userName = fullName || name; // Accept both fields

    if (!userName || !email || !password) {
      return res.status(400).json({ 
        message: 'Please provide name, email, and password' 
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name: userName,
      email,
      password: hashedPassword,
      profileImageUrl: profileImageUrl || ''
    });

    // Return consistent response structure
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        _id: user._id,
        name: user.name,
        fullName: user.name, // Add alias for frontend
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error registering user", 
      error: error.message 
    });
  }
}

// @desc Login user
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Please provide email and password' 
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Return consistent response structure
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        _id: user._id,
        name: user.name,
        fullName: user.name, // Add alias for frontend
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        token: generateToken(user._id)
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error logging in user", 
      error: error.message 
    });
  }
}

// @desc Get user profile
// @route GET /api/auth/profile
// @access Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); // Fixed: use _id not id
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        fullName: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error getting user profile", 
      error: error.message 
    });
  }
}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};