// Validation Utilities for APDS7311 Assignment
// Enterprise-grade input validation and sanitization

const validator = require('validator');
const { body, validationResult } = require('express-validator');

// Regular expressions for input validation (whitelisting approach)
const REGEX_PATTERNS = {
  fullName: /^[a-zA-Z\s]{3,50}$/,
  idNumber: /^[0-9]{13}$/,
  accountNumber: /^[0-9]{10,12}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  employeeId: /^EMP[0-9]{3}$/,
  swiftCode: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
  amount: /^[0-9]+(\.[0-9]{1,2})?$/,
  currency: /^[A-Z]{3}$/
};

// Validation error messages
const ERROR_MESSAGES = {
  fullName: 'Name should contain only letters and spaces (3-50 characters)',
  idNumber: 'ID Number must be 13 digits',
  accountNumber: 'Account Number must be 10-12 digits',
  username: 'Username must be alphanumeric with underscores (3-20 characters)',
  password: 'Password must be at least 8 characters and include uppercase, lowercase, number and special character',
  employeeId: 'Employee ID must be in format EMP001',
  swiftCode: 'Invalid SWIFT code format',
  amount: 'Amount must be a valid number with up to 2 decimal places',
  currency: 'Currency must be a 3-letter ISO code'
};

// Validation functions
const validateField = (field, value) => {
  if (!value || typeof value !== 'string') {
    return { isValid: false, message: `${field} is required` };
  }
  
  const pattern = REGEX_PATTERNS[field];
  if (!pattern) {
    return { isValid: false, message: `Unknown field: ${field}` };
  }
  
  const isValid = pattern.test(value.trim());
  return {
    isValid,
    message: isValid ? null : ERROR_MESSAGES[field]
  };
};

// Sanitization functions
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potential XSS attempts
  let sanitized = validator.escape(input);
  
  // Remove SQL injection attempts
  sanitized = sanitized.replace(/['"`;\\]/g, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  return sanitized;
};

// Express validator middleware generators
const createValidationChain = (field) => {
  return body(field)
    .custom((value) => {
      const result = validateField(field, value);
      if (!result.isValid) {
        throw new Error(result.message);
      }
      return true;
    })
    .customSanitizer(sanitizeInput);
};

// Pre-defined validation chains
const validationChains = {
  login: [
    createValidationChain('accountNumber'),
    body('password').isLength({ min: 1 }).withMessage('Password is required')
  ],
  
  payment: [
    createValidationChain('amount'),
    createValidationChain('currency'),
    createValidationChain('swiftCode'),
    body('recipientName').isLength({ min: 2, max: 100 }).withMessage('Recipient name must be 2-100 characters'),
    body('recipientBank').isLength({ min: 2, max: 100 }).withMessage('Recipient bank must be 2-100 characters')
  ],
  
  employee: [
    createValidationChain('employeeId'),
    createValidationChain('username'),
    createValidationChain('password')
  ]
};

// Validation error handler middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

module.exports = {
  REGEX_PATTERNS,
  ERROR_MESSAGES,
  validateField,
  sanitizeInput,
  validationChains,
  handleValidationErrors,
  createValidationChain
};
