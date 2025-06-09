import React, { useState } from 'react';
import axios from '../api/axiosConfig';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    accountNumber: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');  // Helper function to provide user-friendly error messages
  const getUserFriendlyErrorMessage = (err) => {
    if (!err.response) {
      return 'Unable to connect to server. Please check your internet connection and try again.';
    }

    const status = err.response.status;
    const serverMessage = err.response.data?.message || err.response.data?.msg || '';
    const validationErrors = err.response.data?.errors;

    // Handle validation errors with specific details
    if (status === 400 && validationErrors && Array.isArray(validationErrors)) {
      const errorMessages = validationErrors.map(error => error.msg || error.message).join('. ');
      return errorMessages || 'Please check your input and try again.';
    }

    switch (status) {
      case 400:
        if (serverMessage.includes('Invalid credentials')) {
          return 'Account number or password is incorrect. Please double-check your credentials.';
        }
        if (serverMessage.includes('Account number or username is required')) {
          return 'Please enter your account number.';
        }
        if (serverMessage.includes('Validation error')) {
          return 'Please check your account number format (10-12 digits) and password.';
        }
        return serverMessage || 'Invalid account number or password. Please verify your credentials.';
      
      case 423:
        return 'Your account has been temporarily locked due to multiple failed login attempts. Please wait 30 minutes before trying again, or contact customer support for immediate assistance.';
        
      case 429:
        return 'Too many login attempts detected. Please wait a few minutes before trying again to help protect your account security.';
        
      case 500:
        return 'We\'re experiencing technical difficulties. Please try again in a few moments or contact customer support if the problem persists.';
        
      default:
        return serverMessage || 'Login failed. Please check your credentials and try again.';
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };  const validateForm = () => {
    // Account Number validation
    if (!formData.accountNumber.trim()) {
      setError('Account number is required');
      return false;
    } else if (!/^[0-9]{10,12}$/.test(formData.accountNumber.trim())) {
      setError('Account number must be 10-12 digits');
      return false;
    }

    // Password validation
    if (!formData.password) {
      setError('Password is required');
      return false;
    } else if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors and success messages
    setError('');
    setSuccess('');
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const loginData = {
        accountNumber: formData.accountNumber.trim(),
        password: formData.password
      };      console.log('Attempting login with data:', { accountNumber: loginData.accountNumber });

      const response = await axios.post('/auth/login', loginData);
      
      console.log('Login successful:', response.data);
      
      // Store token and redirect
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setSuccess('Login successful! Redirecting to dashboard...');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = getUserFriendlyErrorMessage(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>🏦 Customer Portal</h2>
          <p className="auth-subtitle">Sign in to your secure banking account</p>
        </div>
        
        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="accountNumber">Account Number</label>
            <input
              type="text"
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              placeholder="Enter your 10-12 digit account number"
              maxLength="12"
              disabled={isLoading}
              required
            />
            <small>Enter your bank account number (10-12 digits)</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              disabled={isLoading}
              required
            />
          </div>
          
          <button type="submit" disabled={isLoading} className="auth-button">
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing In...
              </>
            ) : (
              'Sign In to Account'
            )}
          </button>        </form>
        
        <div className="auth-footer">
          <p>Need help accessing your account? Contact customer support at 1-800-BANK-HELP</p>
          <p><Link to="/" className="auth-link">← Back to Home</Link></p>
          <div className="portal-switch">
            <p>Bank employee? <Link to="/employee/login" className="auth-link">Employee Portal</Link></p>
          </div>
        </div>
      </div>
      
      <footer className="auth-page-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>SecureBank Portal</h4>
              <p>Customer Banking Portal</p>
              <p>International Payments System</p>
            </div>
            <div className="footer-section">
              <h4>Security Compliance</h4>
              <p>✓ 256-bit SSL Encryption</p>
              <p>✓ Account Protection</p>
              <p>✓ Fraud Prevention</p>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <p>📞 1-800-BANK-HELP</p>
              <p>🔒 Security: Active</p>
              <p>🟢 System: Operational</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 SecureBank International Payments Portal. All rights reserved.</p>
            <p>Never share your login credentials with anyone.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Login;
