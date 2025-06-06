const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditTrail = require('../models/AuditTrail');

// Register Controller
const register = async (req, res) => {
  const { fullName, idNumber, accountNumber, username, password } = req.body;

  try {
    // Check if user already exists
    const existingUserByUsername = await User.findOne({ username: { $eq: username } });
    if (existingUserByUsername) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const existingUserByIdNumber = await User.findOne({ idNumber: { $eq: idNumber } });
    if (existingUserByIdNumber) {
      return res.status(400).json({ message: 'ID number already registered' });
    }

    const existingUserByAccountNumber = await User.findOne({ accountNumber: { $eq: accountNumber } });
    if (existingUserByAccountNumber) {
      return res.status(400).json({ message: 'Account number already registered' });
    }

    // Create new user
    const user = new User({
      fullName,
      idNumber,
      accountNumber,
      username,
      password // Will be hashed by pre-save middleware
    });

    await user.save();

    // Log registration
    await AuditTrail.log({
      userId: user._id,
      userModel: 'User',
      action: 'REGISTER',
      entityType: 'User',
      entityId: user._id,
      description: `New user registered: ${user.username}`,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      severity: 'LOW'
    });

    res.status(201).json({ 
      message: 'User registered successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        accountNumber: user.accountNumber
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login Controller
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Input validation
    const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/;
    
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ message: 'Invalid username format' });
    }

    // Sanitize username
    const sanitizedUsername = username.toString().trim();
    
    // Check if user exists and is active
    const user = await User.findOne({ 
      username: { $eq: sanitizedUsername }, 
      isActive: { $eq: true } 
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({ 
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.' 
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Increment login attempts
      await user.incLoginAttempts();
      
      // Log failed login attempt
      await AuditTrail.log({
        userId: user._id,
        userModel: 'User',
        action: 'LOGIN_FAILED',
        entityType: 'User',
        entityId: user._id,
        description: `Failed login attempt for user: ${user.username}`,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        severity: 'MEDIUM'
      });
      
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Reset login attempts on successful login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id, 
        username: user.username,
        accountNumber: user.accountNumber,
        type: 'user'
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Log successful login
    await AuditTrail.log({
      userId: user._id,
      userModel: 'User',
      action: 'LOGIN_SUCCESS',
      entityType: 'User',
      entityId: user._id,
      description: `Successful login for user: ${user.username}`,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      severity: 'LOW'
    });

    res.json({ 
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        accountNumber: user.accountNumber
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get Profile Controller
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user || !user.isActive) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  getProfile
};