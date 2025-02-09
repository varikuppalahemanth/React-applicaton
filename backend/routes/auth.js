const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ usernameOrEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create a new user
    const user = new User({ usernameOrEmail, password });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login a user
router.post('/login', async (req, res) => {
    const { usernameOrEmail, password } = req.body;
  
    try {
      // Check if user exists
      const user = await User.findOne({ usernameOrEmail });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // Check if password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      // If credentials are valid, return success
      res.status(200).json({ message: 'Login successful', user: { usernameOrEmail: user.usernameOrEmail } });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  });
module.exports = router;