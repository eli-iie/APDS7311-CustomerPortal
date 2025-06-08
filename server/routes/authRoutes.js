const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
const { validationChains, handleValidationErrors } = require('../utils/validation');
const { auth } = require('../middleware/auth'); // Import auth correctly
const router = express.Router();

// Register user with validation
router.post('/register', validationChains.register, handleValidationErrors, register);

// Login user with validation
router.post('/login', validationChains.login, handleValidationErrors, login);

// Get user profile (protected route)
router.get('/profile', auth, getProfile);

// Dashboard route (alias for profile for compatibility)
router.get('/dashboard', auth, getProfile);

// Account information route (alias for profile)
router.get('/account', auth, getProfile);

module.exports = router;
