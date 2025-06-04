# APDS7311 Assignment - Project Summary Report

**Student Project:** Secure Customer International Payments Portal  
**Course:** APDS7311 - Application Development Security  
**Date:** June 2025  

---

## Project Overview

This project implements a secure banking portal for international payments, featuring separate customer and employee interfaces with comprehensive security measures as required by the APDS7311 assignment specifications.

## System Architecture

The application follows a three-tier architecture:
- **Frontend:** React.js client application
- **Backend:** Node.js/Express.js REST API
- **Database:** MongoDB with Mongoose ODM

## Security Implementation

### Password Security
- Implementation of bcrypt hashing with 12 salt rounds
- Password complexity validation using regular expressions
- Account lockout mechanism after 5 failed login attempts

### Input Validation
- Comprehensive input whitelisting using RegEx patterns
- Server-side validation for all user inputs
- Protection against SQL injection and XSS attacks

### SSL/HTTPS Configuration
- SSL certificate generation and implementation
- HTTPS enforcement in production environment
- HTTP Strict Transport Security (HSTS) headers

### Attack Protection
- Helmet.js security middleware implementation
- Rate limiting on authentication endpoints
- CSRF protection through SameSite cookie policy
- Content Security Policy (CSP) headers

## Application Features

### Customer Portal
- User registration with validation
- Secure login system using JWT tokens
- International payment submission with SWIFT compliance
- Payment status tracking

### Employee Portal
- Pre-configured static employee accounts
- Role-based access control (Employee, Admin, Manager)
- Payment verification workflow
- SWIFT submission capabilities
- Audit trail access

## Testing Results

Comprehensive testing was conducted covering:
- Application availability verification
- User registration and authentication flows
- Payment submission and processing
- Employee workflow validation
- Security feature verification

All critical functionality tests passed successfully, demonstrating a fully operational system.

## Technical Standards

The implementation follows industry best practices:
- Clean code architecture with proper separation of concerns
- Comprehensive error handling and logging
- Production-ready configuration management
- Security-first development approach

## Assignment Compliance

This project meets all specified requirements for:
- Task 2: Customer Portal Development (Password security, input validation, SSL/HTTPS, attack protection)
- Task 3: Employee Portal Development (Consistent security implementation, static login system, complete workflow)

The implementation demonstrates understanding of web application security principles and practical application of security measures in a banking context.

---

**Note:** This project represents original work completed for the APDS7311 assignment, implementing secure web application development principles as taught in the course curriculum.
