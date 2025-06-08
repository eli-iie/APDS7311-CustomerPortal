const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Payment = require('../models/Payment');
const AuditTrail = require('../models/AuditTrail');

// POST create payment - authenticated route
router.post('/create', auth, async (req, res) => {
  try {
    // Input validation
    const { amount, currency, provider, payeeAccountNumber, swiftCode, payeeName } = req.body;
    
    // Get client IP and user agent for audit trail
    const clientIp = req.ip || req.connection.remoteAddress || '127.0.0.1';
    const userAgent = req.get('User-Agent') || 'Unknown';
    
    // RegEx validation for secure input
    const amountRegex = /^\d+(\.\d{1,2})?$/;
    const currencyRegex = /^[A-Z]{3}$/;
    const accountRegex = /^[A-Z0-9]{15,34}$/; // IBAN format
    const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
      if (!amountRegex.test(amount)) {
      await AuditTrail.log({
        userId: req.user.id,
        userModel: 'User',
        action: 'PAYMENT_CREATE',
        entityType: 'Payment',
        description: 'Payment creation failed: Invalid amount format',
        ipAddress: clientIp,
        userAgent: userAgent,
        severity: 'MEDIUM',
        success: false,
        errorMessage: 'Invalid amount format'
      });
      return res.status(400).json({ msg: 'Invalid amount format' });
    }
    
    if (!currencyRegex.test(currency)) {
      return res.status(400).json({ msg: 'Invalid currency format' });
    }
    
    if (!accountRegex.test(payeeAccountNumber)) {
      return res.status(400).json({ msg: 'Invalid IBAN format' });
    }
    
    if (!swiftRegex.test(swiftCode)) {
      return res.status(400).json({ msg: 'Invalid SWIFT code format' });
    }

    if (!nameRegex.test(payeeName)) {
      return res.status(400).json({ msg: 'Invalid payee name format' });
    }

    // Create new payment
    const payment = new Payment({
      customerId: req.user.id,
      amount: parseFloat(amount),
      currency,
      provider: provider || 'SWIFT',
      payeeAccountNumber,
      swiftCode,
      payeeName
    });

    await payment.save();    // Log successful payment creation
    await AuditTrail.log({
      userId: req.user.id,
      userModel: 'User',
      action: 'PAYMENT_CREATE',
      entityType: 'Payment',
      entityId: payment._id,
      description: `Payment created: ${currency} ${amount} to ${payeeName}`,
      newValues: {
        amount: payment.amount,
        currency: payment.currency,
        payeeName: payment.payeeName,
        swiftCode: payment.swiftCode
      },
      ipAddress: clientIp,
      userAgent: userAgent,
      severity: 'LOW'
    });    res.status(201).json({ 
      message: 'Payment submitted successfully',
      referenceNumber: payment.referenceNumber.toString().trim()
    });  } catch (err) {
    console.error('Payment creation error:', err);
    
    // Log the error for audit trail
    try {
      await AuditTrail.log({
        userId: req.user?.id || 'unknown',
        userModel: 'User',
        action: 'PAYMENT_CREATION_FAILED',
        entityType: 'Payment',
        description: `Payment creation failed: ${err.message}`,
        ipAddress: req.ip || req.connection.remoteAddress || '127.0.0.1',
        userAgent: req.get('User-Agent') || 'Unknown',
        severity: 'HIGH',
        success: false,
        errorMessage: err.message
      });
    } catch (auditErr) {
      console.error('Failed to log payment creation error:', auditErr);
    }
    
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

// GET all payments for customer
router.get('/my-payments', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ customerId: req.user.id })
      .sort({ createdAt: -1 })
      .select('-__v');
    res.json(payments);
  } catch (err) {
    console.error('Failed to fetch user payments:', err);
    
    // Log the error for audit trail
    try {
      await AuditTrail.log({
        userId: req.user?.id || 'unknown',
        userModel: 'User',
        action: 'FETCH_PAYMENTS_FAILED',
        entityType: 'Payment',
        description: `Failed to fetch user payments: ${err.message}`,
        ipAddress: req.ip || req.connection.remoteAddress || '127.0.0.1',
        userAgent: req.get('User-Agent') || 'Unknown',
        severity: 'MEDIUM',
        success: false,
        errorMessage: err.message
      });
    } catch (auditErr) {
      console.error('Failed to log payment fetch error:', auditErr);
    }
    
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
});

// GET all pending payments (for employee portal)
router.get('/pending', async (req, res) => {
  try {
    const payments = await Payment.find({ status: 'pending' })
      .populate('customerId', 'fullName accountNumber')
      .sort({ createdAt: -1 })
      .select('-__v');
    res.json(payments);
  } catch (err) {
    console.error('Failed to fetch pending payments:', err);
    
    // Log the error for audit trail
    try {
      await AuditTrail.log({
        userId: 'system',
        userModel: 'System',
        action: 'FETCH_PENDING_PAYMENTS_FAILED',
        entityType: 'Payment',
        description: `Failed to fetch pending payments: ${err.message}`,
        ipAddress: req.ip || req.connection.remoteAddress || '127.0.0.1',
        userAgent: req.get('User-Agent') || 'Unknown',
        severity: 'HIGH',
        success: false,
        errorMessage: err.message
      });
    } catch (auditErr) {
      console.error('Failed to log pending payments fetch error:', auditErr);
    }
    
    res.status(500).json({ error: 'Failed to fetch pending payments' });
  }
});

// Route aliases for testing compatibility
router.post('/submit', auth, async (req, res) => {
  // Use the same logic as create endpoint
  const createHandler = router.stack.find(layer => layer.route.path === '/create' && layer.route.methods.post);
  if (createHandler) {
    return createHandler.route.stack[1].handle(req, res); // Skip auth middleware (already applied)
  }
  res.status(404).json({ error: 'Handler not found' });
});

router.get('/history', auth, async (req, res) => {
  // Use the same logic as my-payments endpoint
  try {
    const payments = await Payment.find({ customerId: req.user.id })
      .sort({ createdAt: -1 })
      .select('-__v');
    res.json(payments);
  } catch (err) {
    console.error('Failed to fetch payment history:', err);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

module.exports = router;
