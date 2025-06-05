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

  const { accountNumber, password } = formData;

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
    if (!accountNumber.trim()) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!/^[0-9]{10,12}$/.test(accountNumber.trim())) {
      newErrors.accountNumber = 'Account number must be 10-12 digits';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
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

    try {
      const loginData = {
        accountNumber: accountNumber.trim(),
        password
      };

      const response = await axios.post('/api/auth/login', loginData);
      
      // Store token and redirect
      localStorage.setItem('token', response.data.token);
      setSuccess('Login successful! Redirecting to dashboard...');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.msg || 
                          'Login failed. Please check your credentials.';
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
              value={accountNumber}
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
              value={password}
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
