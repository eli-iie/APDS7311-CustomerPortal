const express = require('express');
const { login } = require('../controllers/authController');
const { validationChains, handleValidationErrors } = require('../utils/validation');
const router = express.Router();

// Login user with validation
router.post('/login', validationChains.login, handleValidationErrors, login);

module.exports = router;
