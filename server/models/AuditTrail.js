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
  },
  action: {
    type: String,
    required: true,
    enum: [
      'LOGIN_SUCCESS',
      'LOGIN_FAILED',
      'LOGOUT',
      'REGISTER',
      'PASSWORD_CHANGE',
      'PROFILE_UPDATE',
      'PAYMENT_CREATE',
      'PAYMENT_UPDATE',
      'VIEW_PAYMENT_DETAILS',
      'VIEW_PENDING_PAYMENTS',
      'VERIFY_PAYMENT',
      'REJECT_PAYMENT',
      'SUBMIT_TO_SWIFT',
      'VIEW_AUDIT_TRAIL',
      'DATA_ACCESS',
      'SYSTEM_ERROR'
    ]
  },
  entityType: {
    type: String,
    required: false, // Not all actions involve an entity
    enum: ['User', 'Employee', 'Payment', 'AuditTrail', 'System']
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false // Not all actions involve a specific entity
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  ipAddress: {
    type: String,
    required: false,    validate: {
      validator: function(v) {
        if (!v) return true; // Allow empty/null values
        // Simple IP validation - allow common patterns
        return v === '::1' || v === 'localhost' || /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(v);
      },
      message: 'Invalid IP address format'
    }
  },
  userAgent: {
    type: String,
    required: false,
    maxlength: 1000
  },
  severity: {
    type: String,
    required: true,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'LOW'
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true // Index for efficient querying
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    required: false // Additional context data
  }
}, {
  timestamps: { createdAt: 'timestamp', updatedAt: false } // Only track creation time
});

// Indexes for efficient querying
auditTrailSchema.index({ userId: 1, timestamp: -1 });
auditTrailSchema.index({ userModel: 1, timestamp: -1 });
auditTrailSchema.index({ action: 1, timestamp: -1 });
auditTrailSchema.index({ severity: 1, timestamp: -1 });
auditTrailSchema.index({ entityType: 1, entityId: 1 });

// Static method to create audit log entries
auditTrailSchema.statics.log = async function(logData) {
  try {
    const auditEntry = new this({
      userId: logData.userId,
      userModel: logData.userModel || 'User',
      action: logData.action,
      entityType: logData.entityType,
      entityId: logData.entityId,
      description: logData.description,
      ipAddress: logData.ipAddress,
      userAgent: logData.userAgent,
      severity: logData.severity || 'LOW',
      metadata: logData.metadata
    });

    await auditEntry.save();
    return auditEntry;
  } catch (error) {
    console.error('Failed to create audit log entry:', error);
    // Don't throw error to prevent breaking the main application flow
    return null;
  }
};

// Static method to get recent activities
auditTrailSchema.statics.getRecentActivities = async function(userId, userModel, limit = 10) {
  try {
    return await this.find({ 
      userId: userId, 
      userModel: userModel 
    })
    .sort({ timestamp: -1 })
    .limit(limit)
    .select('-__v')
    .exec();
  } catch (error) {
    console.error('Failed to fetch recent activities:', error);
    return [];
  }
};

// Static method to get activities by action type
auditTrailSchema.statics.getByAction = async function(action, startDate, endDate, limit = 100) {
  try {
    const query = { action: action };
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    return await this.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .populate('userId', 'username fullName employeeId')
      .select('-__v')
      .exec();
  } catch (error) {
    console.error('Failed to fetch activities by action:', error);
    return [];
  }
};

// Static method to get security-related events
auditTrailSchema.statics.getSecurityEvents = async function(severity = 'MEDIUM', limit = 50) {
  try {
    const severityLevels = {
      'LOW': ['LOW'],
      'MEDIUM': ['MEDIUM', 'HIGH', 'CRITICAL'],
      'HIGH': ['HIGH', 'CRITICAL'],
      'CRITICAL': ['CRITICAL']
    };

    return await this.find({ 
      severity: { $in: severityLevels[severity] || ['MEDIUM', 'HIGH', 'CRITICAL'] }
    })
    .sort({ timestamp: -1 })
    .limit(limit)
    .populate('userId', 'username fullName employeeId')
    .select('-__v')
    .exec();
  } catch (error) {
    console.error('Failed to fetch security events:', error);
    return [];
  }
};

const AuditTrail = mongoose.model('AuditTrail', auditTrailSchema);

module.exports = AuditTrail;