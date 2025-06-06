const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/Employee');
const Payment = require('../models/Payment');
const AuditTrail = require('../models/AuditTrail');
const router = express.Router();

// Employee Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {    // Input validation
    const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/;
    
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ message: 'Invalid username format' });
    }
    
    // Sanitize username to prevent NoSQL injection
    const sanitizedUsername = username.toString().trim();
    
    // Check if employee exists and is active - use exact match with sanitized input
    const employee = await Employee.findOne({ 
      username: { $eq: sanitizedUsername }, 
      isActive: { $eq: true } 
    });
    if (!employee) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (employee.isLocked) {
      return res.status(423).json({ 
        message: 'Account is temporarily locked due to multiple failed login attempts. Please try again later.' 
      });
    }

    // Check password
    const isMatch = await employee.comparePassword(password);
    if (!isMatch) {
      // Increment login attempts
      await employee.incLoginAttempts();
        // Log failed login attempt
      await AuditTrail.log({
        userId: employee._id,
        userModel: 'Employee',
        action: 'LOGIN_FAILED',
        entityType: 'Employee',
        entityId: employee._id,
        description: `Failed login attempt for employee: ${employee.username}`,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        severity: 'MEDIUM'
      });
      
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Reset login attempts on successful login
    if (employee.loginAttempts > 0) {
      await employee.resetLoginAttempts();
    }

    // Update last login
    employee.lastLogin = new Date();
    await employee.save();

    // Generate JWT token with employee role
    const token = jwt.sign(
      { 
        id: employee._id, 
        username: employee.username,
        role: employee.role,
        employeeId: employee.employeeId,
        type: 'employee'
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' } // Employee sessions last 2 hours
    );    // Log successful login
    await AuditTrail.log({
      userId: employee._id,
      userModel: 'Employee',
      action: 'LOGIN_SUCCESS',
      entityType: 'Employee',
      entityId: employee._id,
      description: `Successful login for employee: ${employee.username}`,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      severity: 'LOW'
    });

    res.json({ 
      token,
      employee: {
        id: employee._id,
        username: employee.username,
        fullName: employee.fullName,
        role: employee.role,
        department: employee.department,
        employeeId: employee.employeeId
      }
    });
  } catch (err) {
    console.error('Employee login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Middleware to verify employee token
const verifyEmployeeToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ensure it's an employee token
    if (decoded.type !== 'employee') {
      return res.status(403).json({ message: 'Access denied - Employee access required' });
    }
    
    req.employee = decoded;
    next();  } catch (err) {
    console.error('Employee token verification error:', err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Get employee profile
router.get('/profile', verifyEmployeeToken, async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee.id).select('-password');
    if (!employee || !employee.isActive) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (err) {
    console.error('Get employee profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all pending payments for verification
router.get('/payments/pending', verifyEmployeeToken, async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'pending' })
      .populate('customerId', 'fullName accountNumber')
      .sort({ createdAt: -1 })
      .select('-__v');
    
    // Log access to pending payments
    await AuditTrail.log({
      userId: req.employee.id,
      userModel: 'Employee',
      action: 'VIEW_PENDING_PAYMENTS',
      entityType: 'Payment',
      description: `Employee viewed ${payments.length} pending payments`,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      severity: 'LOW'    });
    
    res.json(payments);
  } catch (err) {
    console.error('Get pending payments error:', err);
    res.status(500).json({ message: 'Failed to fetch pending payments' });
  }
});

// Get verified payments ready for SWIFT submission
router.get('/payments/verified', verifyEmployeeToken, async (req, res) => {
  try {
    // Only managers and admins can view verified payments
    if (!['manager', 'admin'].includes(req.employee.role)) {
      return res.status(403).json({ message: 'Access denied - Manager or Admin role required' });
    }
    
    const payments = await Payment.find({ status: 'verified' })
      .populate('customerId', 'fullName accountNumber')
      .populate('verifiedBy', 'fullName employeeId')
      .sort({ verifiedAt: -1 })
      .select('-__v');
    
    res.json(payments);
  } catch (err) {
    console.error('Get verified payments error:', err);
    res.status(500).json({ message: 'Failed to fetch verified payments' });
  }
});

// Get payment details for verification
router.get('/payments/:paymentId', verifyEmployeeToken, async (req, res) => {
  try {
    // Validate payment ID format
    const paymentId = req.params.paymentId;
    if (!paymentId || !paymentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid payment ID format' });
    }
    
    const payment = await Payment.findById(paymentId)
      .populate('customerId', 'fullName accountNumber idNumber')
      .populate('verifiedBy', 'fullName employeeId');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Log payment details access
    await AuditTrail.log({
      userId: req.employee.id,
      userModel: 'Employee',
      action: 'VIEW_PAYMENT_DETAILS',
      entityType: 'Payment',
      entityId: payment._id,
      description: `Employee viewed payment details: ${payment.referenceNumber}`,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      severity: 'LOW'
    });
    
    res.json(payment);
  } catch (err) {
    console.error('Get payment details error:', err);
    res.status(500).json({ message: 'Failed to fetch payment details' });
  }
});

// Verify a payment
router.put('/payments/:paymentId/verify', verifyEmployeeToken, async (req, res) => {
  try {
    // Validate payment ID format
    const paymentId = req.params.paymentId;
    if (!paymentId || !paymentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid payment ID format' });
    }
    
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    if (payment.status !== 'pending') {
      return res.status(400).json({ message: 'Payment is not pending verification' });
    }
    
    // Verify the payment
    payment.verify(req.employee.id);
    await payment.save();
    
    // Log verification action
    await AuditTrail.log({
      userId: req.employee.id,
      userModel: 'Employee',
      action: 'VERIFY_PAYMENT',
      entityType: 'Payment',
      entityId: payment._id,
      description: `Payment verified by ${req.employee.username}: ${payment.referenceNumber}`,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      severity: 'MEDIUM'
    });
    
    res.json({ 
      message: 'Payment verified successfully',
      payment: {
        id: payment._id,
        referenceNumber: payment.referenceNumber,
        status: payment.status,
        verifiedAt: payment.verifiedAt,
        verifiedBy: req.employee.username
      }
    });
  } catch (err) {
    console.error('Verify payment error:', err);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
});

// Reject a payment
router.put('/payments/:paymentId/reject', verifyEmployeeToken, async (req, res) => {
  try {
    const { rejectionReason } = req.body;
      if (!rejectionReason || rejectionReason.trim().length < 10) {
      return res.status(400).json({ message: 'Rejection reason must be at least 10 characters' });
    }
    
    // Validate payment ID format
    const paymentId = req.params.paymentId;
    if (!paymentId || !paymentId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid payment ID format' });
    }
    
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    if (payment.status !== 'pending') {
      return res.status(400).json({ message: 'Payment is not pending verification' });
    }
    
    // Reject the payment
    payment.reject(req.employee.id, rejectionReason);
    await payment.save();
    
    // Log rejection action
    await AuditTrail.log({
      userId: req.employee.id,
      userModel: 'Employee',
      action: 'REJECT_PAYMENT',
      entityType: 'Payment',
      entityId: payment._id,
      description: `Payment rejected by ${req.employee.username}: ${payment.referenceNumber}. Reason: ${rejectionReason}`,
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent'),
      severity: 'MEDIUM'
    });
    
    res.json({ 
      message: 'Payment rejected successfully',
      payment: {
        id: payment._id,
        referenceNumber: payment.referenceNumber,
        status: payment.status,
        rejectionReason: payment.rejectionReason
      }
    });
  } catch (err) {
    console.error('Reject payment error:', err);
    res.status(500).json({ message: 'Failed to reject payment' });
  }
});

// Submit verified payments to SWIFT
router.post('/payments/submit-to-swift', verifyEmployeeToken, async (req, res) => {
  try {
    // Only managers and admins can submit to SWIFT
    if (!['manager', 'admin'].includes(req.employee.role)) {
      return res.status(403).json({ message: 'Access denied - Manager or Admin role required' });
    }
      const { paymentIds } = req.body;
    
    if (!paymentIds || !Array.isArray(paymentIds) || paymentIds.length === 0) {
      return res.status(400).json({ message: 'Payment IDs array is required' });
    }
    
    // Validate all payment IDs are proper MongoDB ObjectId format
    const invalidIds = paymentIds.filter(id => !id.match(/^[0-9a-fA-F]{24}$/));
    if (invalidIds.length > 0) {
      return res.status(400).json({ message: 'Invalid payment ID format detected' });
    }
    
    // Find verified payments - using validated IDs
    const payments = await Payment.find({
      _id: { $in: paymentIds.map(id => id.toString()) },
      status: { $eq: 'verified' }
    });
    
    if (payments.length === 0) {
      return res.status(400).json({ message: 'No verified payments found for submission' });
    }
    
    // Submit to SWIFT (simulate SWIFT submission)
    const submissionResults = [];
    for (const payment of payments) {
      await payment.submitToSwift();
      await payment.save();
      
      submissionResults.push({
        paymentId: payment._id,
        referenceNumber: payment.referenceNumber,
        status: 'submitted',
        submittedAt: payment.submittedAt
      });
      
      // Log SWIFT submission
      await AuditTrail.log({
        userId: req.employee.id,
        userModel: 'Employee',
        action: 'SUBMIT_TO_SWIFT',
        entityType: 'Payment',
        entityId: payment._id,
        description: `Payment submitted to SWIFT by ${req.employee.username}: ${payment.referenceNumber}`,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        severity: 'HIGH'
      });
    }
    
    res.json({
      message: `Successfully submitted ${submissionResults.length} payments to SWIFT`,
      submissions: submissionResults
    });
  } catch (err) {
    console.error('Submit to SWIFT error:', err);
    res.status(500).json({ message: 'Failed to submit payments to SWIFT' });  }
});

// Get audit trail for employee actions
router.get('/audit-trail', verifyEmployeeToken, async (req, res) => {
  try {
    // Only admins can view full audit trail
    if (req.employee.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied - Admin role required' });
    }
    
    const { page = 1, limit = 50 } = req.query;
    const skip = (page - 1) * limit;
    
    const auditEntries = await AuditTrail.find({ userModel: 'Employee' })
      .populate('userId', 'fullName employeeId')
      .sort({ timestamp: -1 })
      .limit(parseInt(limit))
      .skip(skip)
      .select('-__v');
    
    const total = await AuditTrail.countDocuments({ userModel: 'Employee' });
    
    res.json({
      auditEntries,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Get audit trail error:', err);
    res.status(500).json({ message: 'Failed to fetch audit trail' });
  }
});

module.exports = router;
