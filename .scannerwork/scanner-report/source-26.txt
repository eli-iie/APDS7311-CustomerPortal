import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {  const [formData, setFormData] = useState({
    amount: '',
    currency: '',
    provider: 'SWIFT',
    payeeAccountNumber: '',
    swiftCode: '',
    payeeName: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { amount, currency, provider, payeeAccountNumber, swiftCode, payeeName } = formData;
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    // Set up axios auth header
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    
    // Load payment history
    loadPaymentHistory();
  }, [navigate]);

  const loadPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/payment/my-payments');
      setPayments(response.data);
    } catch (err) {
      console.error('Failed to load payment history:', err);
    } finally {
      setLoading(false);
    }
  };

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });  const validateInput = () => {
    const amountRegex = /^\d+(\.\d{1,2})?$/;
    const allowedCurrencies = ['USD', 'EUR', 'GBP', 'ZAR', 'JPY'];
    const accountRegex = /^[A-Z0-9]{15,34}$/; // IBAN format to match backend
    const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;

    if (!amount || !amountRegex.test(amount)) {
      setError('Amount should be a valid number');
      return false;
    }
    
    if (!currency || !allowedCurrencies.includes(currency)) {
      setError('Please select a valid currency');
      return false;
    }
    
    if (!payeeName || !nameRegex.test(payeeName)) {
      setError('Payee name should contain only letters and spaces (2-50 characters)');
      return false;
    }
    
    if (!payeeAccountNumber || !accountRegex.test(payeeAccountNumber)) {
      setError('Invalid IBAN format (15-34 alphanumeric characters)');
      return false;
    }
    
    if (!swiftCode || !swiftRegex.test(swiftCode)) {
      setError('Invalid SWIFT code format');
      return false;
    }

    return true;
  };

  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateInput()) return;    try {
      setLoading(true);
      await axios.post('/api/payment/create', formData);
      setSuccess('Payment submitted successfully! Your payment is now pending verification.');
      setFormData({
        amount: '',
        currency: '',
        provider: 'SWIFT',
        payeeAccountNumber: '',
        swiftCode: '',
        payeeName: ''
      });
      
      // Reload payment history
      await loadPaymentHistory();
    } catch (err) {
      console.error('Payment submission error:', err);
      const errorMessage = err.response?.data?.msg || 
                          err.response?.data?.message || 
                          'Payment failed. Please try again.';
      setError(errorMessage);
        // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>International Payment Portal</h1>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </header>
      
      <div className="payment-card">
        <h2>Make an International Payment</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="1000000"
              name="amount"
              value={amount}
              onChange={onChange}
              placeholder="Enter amount (e.g., 1000.50)"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>Currency</label>
            <select name="currency" value={currency} onChange={onChange} required disabled={loading}>
              <option value="">Select Currency</option>
              <option value="USD">USD - US Dollar</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="ZAR">ZAR - South African Rand</option>
              <option value="JPY">JPY - Japanese Yen</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Payment Provider</label>
            <select name="provider" value={provider} onChange={onChange} disabled={loading}>
              <option value="SWIFT">SWIFT</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Payee Name</label>
            <input
              type="text"
              name="payeeName"
              value={payeeName}
              onChange={onChange}
              placeholder="Full name of recipient"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>Payee Account Number</label>
            <input
              type="text"
              name="payeeAccountNumber"
              value={payeeAccountNumber}
              onChange={onChange}
              placeholder="IBAN format (15-34 characters)"
              required
              disabled={loading}
            />
          </div>
          
          <div className="form-group">
            <label>SWIFT Code</label>
            <input
              type="text"
              name="swiftCode"
              value={swiftCode}
              onChange={onChange}
              placeholder="e.g., ABCDUS33XXX"
              required
              disabled={loading}
            />
            <small>Format: BANKCODE + COUNTRY CODE + LOCATION CODE + BRANCH CODE</small>
          </div>
          
          <button type="submit" className="payment-btn" disabled={loading}>
            {loading ? 'Processing...' : 'Submit Payment'}
          </button>
        </form>
      </div>

      {/* Payment History Section */}
      <div className="payment-card">
        <h2>Payment History</h2>
        {loading && !payments.length ? (
          <p>Loading payment history...</p>
        ) : payments.length === 0 ? (
          <p>No payments submitted yet.</p>
        ) : (
          <div className="payment-history">
            {payments.map((payment, index) => (
              <div key={payment._id || index} className="payment-item">
                <div className="payment-header">
                  <span className="payment-ref">Ref: {payment.referenceNumber}</span>
                  <span className={`payment-status ${payment.status}`}>{payment.status.toUpperCase()}</span>
                </div>
                <div className="payment-details">
                  <p><strong>Amount:</strong> {payment.currency} {payment.amount}</p>
                  <p><strong>Recipient:</strong> {payment.payeeName}</p>
                  <p><strong>Account:</strong> {payment.payeeAccountNumber}</p>
                  <p><strong>SWIFT:</strong> {payment.swiftCode}</p>
                  <p><strong>Submitted:</strong> {new Date(payment.createdAt).toLocaleString()}</p>
                  {payment.verifiedAt && (
                    <p><strong>Verified:</strong> {new Date(payment.verifiedAt).toLocaleString()}</p>
                  )}
                  {payment.rejectionReason && (
                    <p><strong>Rejection Reason:</strong> {payment.rejectionReason}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
