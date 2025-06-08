const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },  amount: {
    type: Number,
    required: true,
    min: [0.01, 'Amount must be at least 0.01'],
    max: [999999999.99, 'Amount cannot exceed 999,999,999.99']
  },
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'EUR', 'GBP', 'ZAR', 'JPY'],
    uppercase: true
  },
  provider: {
    type: String,
    required: true,
    default: 'SWIFT'
  },
  payeeAccountNumber: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // IBAN format validation (15-34 characters)
        return /^[A-Z0-9]{15,34}$/.test(v);
      },
      message: 'Invalid IBAN format'
    }
  },
  swiftCode: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // BIC/SWIFT code format validation (8-11 characters)
        return /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(v);
      },
      message: 'Invalid SWIFT/BIC code format'
    }
  },
  payeeName: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Only alphabetic characters and spaces
        return /^[a-zA-Z\s]{2,50}$/.test(v);
      },
      message: 'Payee name must contain only letters and spaces (2-50 characters)'
    }
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
    enum: ['pending', 'verified', 'submitted', 'completed', 'rejected']
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    default: null
  },
  verifiedAt: {
    type: Date,
    default: null
  },
  submittedAt: {
    type: Date,
    default: null
  },
  rejectionReason: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for better query performance
paymentSchema.index({ customerId: 1, status: 1 });
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ verifiedBy: 1 });

// Update the updatedAt field before saving
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for payment reference number
paymentSchema.virtual('referenceNumber').get(function() {
  return `PAY-${this._id.toString().slice(-8).toUpperCase()}`;
});

// Method to verify payment
paymentSchema.methods.verify = function(employeeId) {
  this.status = 'verified';
  this.verifiedBy = employeeId;
  this.verifiedAt = new Date();
};

// Method to submit to SWIFT
paymentSchema.methods.submitToSwift = function() {
  this.status = 'submitted';
  this.submittedAt = new Date();
};

// Method to reject payment
paymentSchema.methods.reject = function(employeeId, reason) {
  this.status = 'rejected';
  this.rejectionReason = reason;
  this.verifiedBy = employeeId;
  this.verifiedAt = new Date();
};

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
