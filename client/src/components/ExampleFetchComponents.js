import React, { useState } from 'react';
import { authApi } from '../api/fetchConfig';

// Example: Login component using native fetch (no axios)
const LoginWithFetch = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Using our custom fetch API client
      const response = await authApi.login(credentials);
      
      console.log('Login successful:', response.data);
      
      // Handle successful login
      localStorage.setItem('user', JSON.stringify(response.data.user));
      window.location.href = '/dashboard';
      
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <h2>Login (Using Fetch API)</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={credentials.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required
          />
        </div>
        
        {error && <div className="error">{error}</div>}
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

// Example: Dashboard component fetching data
const DashboardWithFetch = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  React.useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      const response = await paymentApi.getPayments();
      setPayments(response.data);
    } catch (error) {
      setError('Failed to load payments');
      console.error('Error loading payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPayment = async (paymentData) => {
    try {
      setLoading(true);
      const response = await paymentApi.createPayment(paymentData);
      
      // Add new payment to state
      setPayments([...payments, response.data]);
      
      console.log('Payment created:', response.data);
    } catch (error) {
      setError('Failed to create payment');
      console.error('Error creating payment:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <h2>Payments Dashboard (Using Fetch API)</h2>
      <div className="payments-list">
        {payments.map(payment => (
          <div key={payment._id} className="payment-item">
            <p>Amount: ${payment.amount}</p>
            <p>Recipient: {payment.recipient}</p>
            <p>Status: {payment.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export { LoginWithFetch, DashboardWithFetch };
