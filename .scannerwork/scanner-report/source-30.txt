import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const EmployeeLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { username, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateInput = () => {
    const usernameRegex = /^[a-zA-Z0-9_.]{3,20}$/;
    
    if (!usernameRegex.test(username)) {
      setError('Username must be alphanumeric with underscores/dots (3-20 characters)');
      return false;
    }
    
    if (password.length < 8) {
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
      navigate('/employee/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      
      // Handle account lockout
      if (err.response?.status === 423) {
        setError('Account temporarily locked due to multiple failed attempts. Please try again later.');
      }
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
              value={username}
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
              value={password}
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
        
        <div className="employee-info">
          <h4>Pre-registered Employee Accounts:</h4>
          <div className="credentials-list">
            <div className="credential-item">
              <strong>Employee:</strong> john.smith / SecurePass123!
            </div>
            <div className="credential-item">
              <strong>Employee:</strong> sarah.jones / SecurePass123!
            </div>
            <div className="credential-item">
              <strong>Admin:</strong> admin.user / AdminPass123!
            </div>
            <div className="credential-item">
              <strong>Manager:</strong> manager.swift / ManagerPass123!
            </div>
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
