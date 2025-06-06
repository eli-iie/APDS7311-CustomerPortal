import axios from 'axios';

// Create axios instance with base URL configuration
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('=== AXIOS REQUEST ===');
    console.log('URL:', config.baseURL + config.url);
    console.log('Method:', config.method);
    console.log('Data:', config.data);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('=== AXIOS RESPONSE ===');
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    return response;
  },
  (error) => {
    console.error('=== AXIOS ERROR ===');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
