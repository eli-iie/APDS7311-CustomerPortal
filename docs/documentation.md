# Secure Customer International Payments Portal

**Module Code:** APDS7311/w  
**Student Full Names:** [Your Name]  
**Student Number:** [Your Student Number]  
**ICE Task 3 Submission**

## Table of Contents
1. [Introduction](#introduction)
2. [Technical Implementation](#technical-implementation)
3. [Security Features](#security-features)
4. [Screenshots](#screenshots)
5. [Testing](#testing)

## Introduction
This document presents the implementation of a secure Customer International Payments Portal developed using React and Node.js. The portal allows customers to register, log in, and make international payments via the SWIFT system. Security measures have been implemented throughout to protect sensitive information.

## Technical Implementation

### Backend Implementation
The backend is built using Node.js with Express and MongoDB. It includes:
- User authentication system with secure password handling
- International payment processing endpoints
- Security middlewares for request validation and protection

### Frontend Implementation
The frontend is built using React and includes:
- User registration interface with validation
- Secure login system
- Dashboard for submitting international payments

## Security Features

### Password Security
Password security is implemented using bcryptjs for hashing and salting:

```javascript
// Password hashing in User model
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});
```

This implementation:
- Generates a secure random salt (12 rounds)
- Combines the salt with the password
- Uses a one-way hashing algorithm to create the password hash
- Prevents rainbow table attacks by using unique salts for each user

### Input Validation and Whitelisting
All inputs are validated using RegEx patterns to ensure only approved data formats are accepted:

```javascript
// Input validation for registration
const accountRegex = /^[0-9]{10}$/;
const nameRegex = /^[a-zA-Z\s]{3,}$/;
const idNumberRegex = /^[0-9]{13}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
```

The validation:
- Ensures account numbers are exactly 10 digits
- Ensures ID numbers conform to the South African ID format (13 digits)
- Ensures names contain only letters and spaces (minimum 3 characters)
- Enforces strong password policy (minimum 8 characters with uppercase, lowercase, numbers and special characters)

### Additional Security Measures
1. **JWT Authentication**: Secure token-based authentication for protected routes
2. **Helmet.js**: HTTP header security to protect against various attacks 
3. **Rate Limiting**: Protection against brute force attacks
4. **CORS**: Cross-Origin Resource Sharing protection

## Screenshots

### Registration Page
![Registration Page](registration_screenshot.png)
*The registration page with input validation and secure password handling*

### Login Page  
![Login Page](login_screenshot.png)
*The login page with account number and password fields*

### Dashboard Page
![Dashboard Page](dashboard_screenshot.png)
*The international payments dashboard with SWIFT payment form*

## Testing

The application has been tested to verify:
1. Password security implementation
2. Input validation and rejection of malformed data
3. Secure authentication and authorization
4. Proper error handling and user feedback

The testing confirmed that all security requirements have been met and the application functions as expected.

## Conclusion

The Customer International Payments Portal successfully implements the required security features. Password security is enforced with industry-standard hashing and salting, and all user inputs are validated using RegEx patterns to prevent injection attacks and ensure data integrity.
