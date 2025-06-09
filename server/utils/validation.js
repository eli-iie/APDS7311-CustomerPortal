const { body, validationResult } = require('express-validator');

// Validation chains for different routes
const validationChains = {
  register: [
    body('fullName')
      .isLength({ min: 3, max: 50 })
      .matches(/^[a-zA-Z\s]+$/)
      .withMessage('Full name must contain only letters and spaces (3-50 characters)'),
    
    body('idNumber')
      .isLength({ min: 13, max: 13 })
      .isNumeric()
      .withMessage('ID number must be exactly 13 digits'),
    
    body('accountNumber')
      .isLength({ min: 10, max: 12 })
      .isNumeric()
      .withMessage('Account number must be 10-12 digits'),
    
    body('username')
      .isLength({ min: 3, max: 20 })
      .matches(/^[a-zA-Z0-9_.]+$/)
      .withMessage('Username must be 3-20 characters and contain only letters, numbers, dots, and underscores'),
    
    body('password')
      .isLength({ min: 8 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      .withMessage('Password must be at least 8 characters with uppercase, lowercase, number, and special character')
  ],
    login: [
    body('username')
      .optional()
      .isLength({ min: 3, max: 20 })
      .matches(/^[a-zA-Z0-9_.]+$/)
      .withMessage('Invalid username format'),
    
    body('accountNumber')
      .optional()
      .isLength({ min: 10, max: 12 })
      .isNumeric()
      .withMessage('Account number must be 10-12 digits'),
    
    body('password')
      .isLength({ min: 1 })
      .withMessage('Password is required')
  ].concat([
    // Custom validation to ensure either username or accountNumber is provided
    body().custom((value, { req }) => {
      if (!req.body.username && !req.body.accountNumber) {
        throw new Error('Either username or account number is required');
      }
      return true;
    })
  ]),
  
  payment: [
    body('amount')
      .isFloat({ min: 0.01, max: 1000000 })
      .withMessage('Amount must be between 0.01 and 1,000,000'),
    
    body('currency')
      .isIn(['USD', 'EUR', 'GBP', 'ZAR', 'JPY'])
      .withMessage('Invalid currency'),
    
    body('payeeAccountNumber')
      .matches(/^[A-Z0-9]{15,34}$/)
      .withMessage('Invalid IBAN format'),
    
    body('swiftCode')
      .matches(/^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/)
      .withMessage('Invalid SWIFT/BIC code format'),
    
    body('payeeName')
      .matches(/^[a-zA-Z\s]{2,50}$/)
      .withMessage('Payee name must contain only letters and spaces (2-50 characters)')
  ]
};

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validationChains,
  handleValidationErrors
};