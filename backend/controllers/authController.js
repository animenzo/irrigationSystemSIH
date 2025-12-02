const User = require("../models/user");
const jwt = require("jsonwebtoken");

// Create Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Register User
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: "Fill all required fields" });

  const userExists = await User.findOne({ email });

  if (userExists)
    return res.status(400).json({ message: "Email already exists" });

  const user = await User.create({ name, email, password });

  return res.status(201).json({
    message: "Registered successfully",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token: generateToken(user._id),
  });
};

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const isMatch = await user.matchPassword(password);

  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    message: "Login successful",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    token: generateToken(user._id),
  });
};

// Get logged-in user
const getMe = async (req, res) => {
  res.json({ user: req.user });
};

module.exports = { registerUser, loginUser, getMe };
