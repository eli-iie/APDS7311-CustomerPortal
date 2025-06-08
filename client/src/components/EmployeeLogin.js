import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const EmployeeLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Helper function to provide user-friendly error messages
  const getUserFriendlyErrorMessage = (err) => {
    if (!err.response) {
      return 'Unable to connect to server. Please check your internet connection and contact IT support if needed.';
    }

    const status = err.response.status;
    const serverMessage = err.response.data?.message || err.response.data?.msg || '';

    switch (status) {
      case 400:
        if (serverMessage.includes('Invalid username format')) {
          return 'Username format is invalid. Please use only letters, numbers, dots, and underscores (3-20 characters).';
        }
        if (serverMessage.includes('Invalid credentials')) {
          return 'Username or password is incorrect. Please verify your employee credentials.';
        }
        return serverMessage || 'Invalid username or password. Please check your employee credentials.';
      
      case 423:
        return 'Your employee account has been temporarily locked due to multiple failed login attempts. Please wait 30 minutes or contact IT support for immediate assistance.';
        
      case 429:
        return 'Too many login attempts detected from this location. Please wait a few minutes before trying again for security purposes.';
        
      case 500:
        return 'Internal system error. Please contact IT support immediately if this problem persists.';
        
      default:
        return serverMessage || 'Employee authentication failed. Please verify your credentials and try again.';
    }  };

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
  const validateInput = () => {
    const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/;
    
    if (!usernameRegex.test(formData.username)) {
      setError('Username must be alphanumeric with underscores/dots (3-20 characters)');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    
    return true;
  };
  const onSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    if (!validateInput()) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post('/api/employee/login', formData);
      
      // Store employee token and data
      localStorage.setItem('employeeToken', res.data.token);
      localStorage.setItem('employeeData', JSON.stringify(res.data.employee));
      
      // Redirect to employee dashboard
      navigate('/employee/dashboard');    } catch (err) {
      const errorMessage = getUserFriendlyErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="employee-header">
          <h2>🏦 Employee Portal</h2>
          <p>International Payments Verification System</p>
        </div>
        
        {error && <div className="alert alert-danger">{error}</div>}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Employee Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={onChange}
              placeholder="Enter your employee username"
              required
              disabled={loading}
            />
            <small>Use your assigned employee username</small>
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>
            <button type="submit" disabled={loading} className="employee-login-btn">
            {loading ? 'Logging in...' : 'Access Employee Portal'}
          </button>
        </form>
        
        <div className="security-notice">
          <div className="security-info">
            <h4>🔒 Secure Access Portal</h4>
            <p>This portal is protected by:</p>
            <ul>
              <li>SSL/TLS Encryption</li>
              <li>Multi-factor Authentication</li>
              <li>Rate Limiting Protection</li>
              <li>Comprehensive Audit Logging</li>
            </ul>
            <p className="security-warning">
              ⚠️ Unauthorized access attempts are monitored and logged.
            </p>
          </div>
        </div>
        
        <div className="portal-switch">
          <p>Are you a customer? <a href="/login">Customer Portal</a></p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeLogin;
