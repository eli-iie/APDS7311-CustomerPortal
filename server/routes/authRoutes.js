const express = require('express');
const { register, login } = require('../controllers/authController');
const { validationChains, handleValidationErrors } = require('../utils/validation');
const router = express.Router();

// Register a new user with comprehensive validation
router.post('/register', validationChains.registration, handleValidationErrors, register);

// Login user with validation
router.post('/login', validationChains.login, handleValidationErrors, login);

module.exports = router;
