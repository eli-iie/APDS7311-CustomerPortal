// Simple test server to debug CORS issue
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Simple CORS configuration
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'CORS test successful' });
});

// Employee login test route
app.post('/api/employee/login', async (req, res) => {
  console.log('Employee login attempt:', req.body);
  
  const { username, password } = req.body;
  
  // Simple test response
  if (username === 'admin.user' && password === 'AdminPass123!') {
    res.json({
      message: 'Login successful',
      token: 'test-token',
      employee: {
        username: 'admin.user',
        fullName: 'Admin User',
        role: 'admin'
      }
    });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log('CORS enabled for all origins');
});
