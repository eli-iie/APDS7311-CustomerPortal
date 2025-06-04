const mongoose = require('mongoose');

const auditTrailSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'userModel'
  },
  userModel: {
    type: String,
    required: true,
    enum: ['User', 'Employee']
  },  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN',
      'LOGIN_SUCCESS',
      'LOGOUT',
      'LOGIN_FAILED',
      'ACCOUNT_LOCKED',
      'REGISTER',
      'PASSWORD_CHANGE',
      'PAYMENT_CREATED',
      'PAYMENT_VERIFIED',
      'PAYMENT_REJECTED',
      'PAYMENT_SUBMITTED',
      'PROFILE_UPDATED',
      'SECURITY_VIOLATION',
      'VIEW_PENDING_PAYMENTS',
      'VIEW_PAYMENT_DETAILS',
      'VERIFY_PAYMENT',
      'REJECT_PAYMENT',
      'SUBMIT_TO_SWIFT'
    ]
  },
  entityType: {
    type: String,
    required: true,
    enum: ['User', 'Employee', 'Payment', 'System']
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  description: {
    type: String,
    required: true
  },
  oldValues: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  newValues: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  ipAddress: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Basic IP address validation
        return /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(v) || 
               /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/.test(v) ||
               v === '::1' || v === 'localhost';
      },
      message: 'Invalid IP address format'
    }
  },
  userAgent: {
    type: String,
    required: true
  },
  severity: {
    type: String,
    required: true,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'LOW'
  },
  success: {
    type: Boolean,
    required: true,
    default: true
  },
  errorMessage: {
    type: String,
    default: null
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  }
});

// Indexes for efficient querying
auditTrailSchema.index({ userId: 1, timestamp: -1 });
auditTrailSchema.index({ action: 1, timestamp: -1 });
auditTrailSchema.index({ entityType: 1, entityId: 1 });
auditTrailSchema.index({ timestamp: -1 });
auditTrailSchema.index({ severity: 1, timestamp: -1 });

// Static method to log audit entry
auditTrailSchema.statics.log = function(data) {
  const auditEntry = new this({
    userId: data.userId,
    userModel: data.userModel,
    action: data.action,
    entityType: data.entityType,
    entityId: data.entityId,
    description: data.description,
    oldValues: data.oldValues,
    newValues: data.newValues,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    severity: data.severity || 'LOW',
    success: data.success !== false,
    errorMessage: data.errorMessage
  });
  
  return auditEntry.save();
};

// Static method to get user activity
auditTrailSchema.statics.getUserActivity = function(userId, limit = 50) {
  return this.find({ userId })
    .sort({ timestamp: -1 })
    .limit(limit)
    .select('action description timestamp ipAddress success');
};

// Static method to get security events
auditTrailSchema.statics.getSecurityEvents = function(hours = 24) {
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);
  return this.find({
    timestamp: { $gte: since },
    $or: [
      { action: 'LOGIN_FAILED' },
      { action: 'ACCOUNT_LOCKED' },
      { action: 'SECURITY_VIOLATION' },
      { severity: { $in: ['HIGH', 'CRITICAL'] } }
    ]
  }).sort({ timestamp: -1 });
};

const AuditTrail = mongoose.model('AuditTrail', auditTrailSchema);

module.exports = AuditTrail;
