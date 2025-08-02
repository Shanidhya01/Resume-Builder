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
  try{
    const { fullName, email, password, profileImageUrl } = 
    req.body;

    //Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // creating a new user
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      profileImageUrl
    });

    //returning user data with JWT
    res.status(201).json({
      _id: user._id,
      name: user.fullName,
      email: user.email,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id)
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
}

// @desc Login user
// @route POST /api/auth/login
// @access Public
const loginUser = async (req, res) => {}

// @desc Get user profile
// @route GET /api/auth/profile
// @access Private(Requires token)
const getUserProfile = async (req, res) => {}

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};