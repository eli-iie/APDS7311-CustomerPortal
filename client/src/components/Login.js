
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
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');

  // Helper function to provide user-friendly error messages
  const getUserFriendlyErrorMessage = (error) => {
    if (!error.response) {
      return 'Unable to connect to server. Please check your internet connection and try again.';
    }

    const status = error.response.status;
    const serverMessage = error.response.data?.message || error.response.data?.msg || '';

    switch (status) {
      case 400:
        if (serverMessage.includes('Invalid username format')) {
          return 'Please enter a valid account number (10-12 digits only).';
        }
        if (serverMessage.includes('Invalid credentials')) {
          return 'Account number or password is incorrect. Please double-check your credentials.';
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
    }  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  const validateForm = () => {
    const newErrors = {};

    // Account Number validation
    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!/^[0-9]{10,12}$/.test(formData.accountNumber.trim())) {
      newErrors.accountNumber = 'Account number must be 10-12 digits';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous errors and success messages
    setErrors({});
    setSuccess('');
    
    // Validate form
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    try {      const loginData = {
        accountNumber: formData.accountNumber.trim(),
        password: formData.password
      };

      const response = await axios.post('/api/auth/login', loginData);
      
      // Store token and redirect
      localStorage.setItem('token', response.data.token);
      setSuccess('Login successful! Redirecting to dashboard...');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);    } catch (error) {
      const errorMessage = getUserFriendlyErrorMessage(error);
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your secure banking portal</p>
        </div>
        
        {errors.general && (
          <div className="alert alert-danger">
            {errors.general}
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
              className={errors.accountNumber ? 'error' : ''}
              placeholder="Enter your 10-12 digit account number"
              maxLength="12"
              disabled={isLoading}
            />
            {errors.accountNumber && <small className="error-text">{errors.accountNumber}</small>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            {errors.password && <small className="error-text">{errors.password}</small>}
          </div>
          
          <button type="submit" disabled={isLoading} className="auth-button">
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
          <div className="auth-footer">
          <p>Need help accessing your account? Contact support for assistance.</p>
          <p><Link to="/" className="auth-link">← Back to Home</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
