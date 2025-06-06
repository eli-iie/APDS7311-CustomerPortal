import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EmployeeDashboard.css';

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [verifiedPayments, setVerifiedPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [rejectionReason, setRejectionReason] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('employeeData');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/employee/login');
  }, [navigate]);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load pending payments
      const pendingResponse = await axios.get('/api/employee/payments/pending');
      setPendingPayments(pendingResponse.data);

      // Load verified payments (if manager/admin)
      if (employee?.role === 'manager' || employee?.role === 'admin') {
        try {
          const verifiedResponse = await axios.get('/api/employee/payments/verified');
          setVerifiedPayments(verifiedResponse.data);
        } catch (err) {
          console.error('Not authorized to view verified payments:', err);
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard data');
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  }, [employee?.role, handleLogout]);

  useEffect(() => {
    const token = localStorage.getItem('employeeToken');
    if (!token) {
      navigate('/employee/login');
      return;
    }

    // Set up axios auth header
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Load employee data from localStorage
    const employeeData = JSON.parse(localStorage.getItem('employeeData') || '{}');
    setEmployee(employeeData);

    loadDashboardData();
  }, [navigate, loadDashboardData]);
  const handlePaymentClick = async (payment) => {
    try {
      const response = await axios.get(`/api/employee/payments/${payment._id}`);
      setSelectedPayment(response.data);
    } catch (err) {
      console.error('Failed to load payment details:', err);
      setError('Failed to load payment details');
    }
  };

  const handleVerifyPayment = async (paymentId) => {
    try {
      setError('');
      setSuccess('');
      
      await axios.put(`/api/employee/payments/${paymentId}/verify`);
      setSuccess('Payment verified successfully!');
      
      // Refresh data
      loadDashboardData();
      setSelectedPayment(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify payment');
    }
  };

  const handleRejectPayment = async (paymentId) => {
    if (!rejectionReason.trim() || rejectionReason.length < 10) {
      setError('Rejection reason must be at least 10 characters');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      await axios.put(`/api/employee/payments/${paymentId}/reject`, {
        rejectionReason: rejectionReason.trim()
      });
      
      setSuccess('Payment rejected successfully!');
      
      // Refresh data and clear form
      loadDashboardData();
      setSelectedPayment(null);
      setRejectionReason('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject payment');
    }
  };

  const handleSubmitToSwift = async () => {
    if (verifiedPayments.length === 0) {
      setError('No verified payments to submit');
      return;
    }

    try {
      setError('');
      setSuccess('');
      
      const paymentIds = verifiedPayments.map(p => p._id);
      const response = await axios.post('/api/employee/payments/submit-to-swift', {
        paymentIds
      });
      
      setSuccess(`Successfully submitted ${response.data.submissions.length} payments to SWIFT`);
      loadDashboardData();    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit to SWIFT');
    }
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="employee-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="employee-dashboard">
      {/* Header */}
      <header className="employee-header">
        <div className="header-content">
          <div className="header-info">
            <h1>🏦 Employee Portal</h1>
            <div className="employee-details">
              <span className="employee-name">{employee?.fullName}</span>
              <span className="employee-role">{employee?.role}</span>
              <span className="employee-dept">{employee?.department}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-content">
        {/* Alerts */}
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        {/* Dashboard Stats */}
        <section className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <h3>{pendingPayments.length}</h3>
              <p>Pending Payments</p>
            </div>
          </div>
          {(employee?.role === 'manager' || employee?.role === 'admin') && (
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{verifiedPayments.length}</h3>
                <p>Verified Payments</p>
              </div>
            </div>
          )}
          <div className="stat-card">
            <div className="stat-icon">🔒</div>
            <div className="stat-content">
              <h3>Secure</h3>
              <p>Session Active</p>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={activeTab === 'pending' ? 'tab-btn active' : 'tab-btn'}
            onClick={() => setActiveTab('pending')}
          >
            Pending Verification ({pendingPayments.length})
          </button>
          {(employee?.role === 'manager' || employee?.role === 'admin') && (
            <button 
              className={activeTab === 'verified' ? 'tab-btn active' : 'tab-btn'}
              onClick={() => setActiveTab('verified')}
            >
              Verified Payments ({verifiedPayments.length})
            </button>
          )}
        </div>

        {/* Payments Content */}
        <div className="payments-container">
          {/* Payments List */}
          <div className="payments-list">
            {activeTab === 'pending' && (
              <div className="payments-section">
                <h3>Payments Requiring Verification</h3>
                {pendingPayments.length === 0 ? (
                  <div className="empty-state">
                    <p>No pending payments at this time</p>
                  </div>
                ) : (
                  <div className="payment-items">
                    {pendingPayments.map(payment => (
                      <div 
                        key={payment._id} 
                        className={`payment-item ${selectedPayment?._id === payment._id ? 'selected' : ''}`}
                        onClick={() => handlePaymentClick(payment)}
                      >
                        <div className="payment-summary">
                          <div className="payment-amount">
                            {formatCurrency(payment.amount, payment.currency)}
                          </div>
                          <div className="payment-details">
                            <div className="payment-ref">Ref: {payment.referenceNumber}</div>
                            <div className="payment-customer">Customer: {payment.customerId?.fullName}</div>
                            <div className="payment-date">Submitted: {formatDate(payment.createdAt)}</div>
                          </div>
                        </div>
                        <div className="payment-status">
                          <span className="status-badge pending">Pending</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'verified' && (employee?.role === 'manager' || employee?.role === 'admin') && (
              <div className="payments-section">
                <div className="section-header">
                  <h3>Verified Payments Ready for SWIFT</h3>
                  {verifiedPayments.length > 0 && (
                    <button 
                      className="swift-submit-btn"
                      onClick={handleSubmitToSwift}
                    >
                      Submit All to SWIFT ({verifiedPayments.length})
                    </button>
                  )}
                </div>
                {verifiedPayments.length === 0 ? (
                  <div className="empty-state">
                    <p>No verified payments ready for SWIFT submission</p>
                  </div>
                ) : (
                  <div className="payment-items">
                    {verifiedPayments.map(payment => (
                      <div 
                        key={payment._id} 
                        className="payment-item verified"
                        onClick={() => handlePaymentClick(payment)}
                      >
                        <div className="payment-summary">
                          <div className="payment-amount">
                            {formatCurrency(payment.amount, payment.currency)}
                          </div>
                          <div className="payment-details">
                            <div className="payment-ref">Ref: {payment.referenceNumber}</div>
                            <div className="payment-customer">Customer: {payment.customerId?.fullName}</div>
                            <div className="payment-verified">Verified: {formatDate(payment.verifiedAt)}</div>
                          </div>
                        </div>
                        <div className="payment-status">
                          <span className="status-badge verified">Verified</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Payment Details Panel */}
          {selectedPayment && (
            <div className="payment-details-panel">
              <div className="panel-header">
                <h3>Payment Details</h3>
                <button 
                  className="close-btn"
                  onClick={() => setSelectedPayment(null)}
                >
                  ×
                </button>
              </div>
              
              <div className="panel-content">                <div className="detail-group">
                  <div className="detail-label">Reference Number</div>
                  <span>{selectedPayment.referenceNumber}</span>
                </div>
                
                <div className="detail-group">
                  <div className="detail-label">Customer</div>
                  <span>{selectedPayment.customerId?.fullName}</span>
                  <small>Account: {selectedPayment.customerId?.accountNumber}</small>
                </div>
                
                <div className="detail-group">
                  <div className="detail-label">Amount</div>
                  <span className="amount-display">
                    {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                  </span>
                </div>
                
                <div className="detail-group">
                  <div className="detail-label">Recipient Details</div>
                  <span>{selectedPayment.payeeName}</span>
                  <small>Account: {selectedPayment.payeeAccountNumber}</small>
                </div>
                
                <div className="detail-group">
                  <div className="detail-label">SWIFT Code</div>
                  <span className="swift-code">{selectedPayment.swiftCode}</span>
                </div>
                
                <div className="detail-group">
                  <div className="detail-label">Submitted</div>
                  <span>{formatDate(selectedPayment.createdAt)}</span>
                </div>

                {selectedPayment.status === 'pending' && (
                  <div className="action-buttons">
                    <button 
                      className="verify-btn"
                      onClick={() => handleVerifyPayment(selectedPayment._id)}
                    >
                      ✅ Verify Payment
                    </button>
                    
                    <div className="reject-section">
                      <textarea
                        placeholder="Enter rejection reason (minimum 10 characters)..."
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        rows={3}
                      />
                      <button 
                        className="reject-btn"
                        onClick={() => handleRejectPayment(selectedPayment._id)}
                        disabled={!rejectionReason.trim() || rejectionReason.length < 10}
                      >
                        ❌ Reject Payment
                      </button>
                    </div>
                  </div>
                )}

                {selectedPayment.status === 'verified' && (                  <div className="verification-info">
                    <div className="detail-group">
                      <div className="detail-label">Verified By</div>
                      <span>{selectedPayment.verifiedBy?.fullName}</span>
                    </div>
                    <div className="detail-group">
                      <div className="detail-label">Verified At</div>
                      <span>{formatDate(selectedPayment.verifiedAt)}</span>
                    </div>
                  </div>
                )}

                {selectedPayment.status === 'rejected' && (                  <div className="rejection-info">
                    <div className="detail-group">
                      <div className="detail-label">Rejection Reason</div>
                      <span className="rejection-reason">{selectedPayment.rejectionReason}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default EmployeeDashboard;
