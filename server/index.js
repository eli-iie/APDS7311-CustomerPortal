require("dotenv").config();  // Load .env file

const connectDB = require("./config/db");
connectDB();

const express = require("express");
// const cors = require("cors");  // Commented out - using built-in security config
const session = require("express-session");
const MongoStore = require("connect-mongo");
// const { body, validationResult } = require("express-validator");  // Commented out - using custom validation
const fs = require("fs");
const https = require("https");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/payment");
const employeeRoutes = require("./routes/employeeRoutes");

// Import comprehensive security configuration
const {
  securityHeaders,
  globalLimiter,
  authLimiter,
  paymentLimiter,
  employeeLimiter,
  corsMiddleware,
  sanitizeInput,
  requestLogger,
  bruteForceProtection
} = require("./config/security");

const app = express();
const PORT = process.env.PORT || 5001;

// Apply comprehensive security configuration
app.use(securityHeaders);
app.use(corsMiddleware);

// Handle preflight requests explicitly
app.options('*', corsMiddleware);

app.use(requestLogger);
app.use(sanitizeInput);
app.use(globalLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session Management for APDS7311 Assignment
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-super-secret-session-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI || 'mongodb://localhost:27017/customer-portal',
    touchAfter: 24 * 3600 // lazy session update
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS attacks
    maxAge: 1800000, // 30 minutes
    sameSite: 'strict' // CSRF protection
  }
}));

// Apply specialized rate limiters to specific routes
app.use('/api/auth/login', authLimiter);
app.use('/api/employee/login', employeeLimiter);
app.use('/api/payment', paymentLimiter);

// Brute force protection for sensitive routes
app.use('/api/auth/login', bruteForceProtection);
app.use('/api/employee/login', bruteForceProtection);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    message: 'APDS7311 Customer Payment Portal - Server is running'
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/employee", employeeRoutes);

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server with SSL support for APDS7311 Assignment
if (process.env.NODE_ENV === 'production' && process.env.SSL_KEY && process.env.SSL_CERT) {
  // HTTPS Server for Production
  const sslOptions = {
    key: fs.readFileSync(process.env.SSL_KEY),
    cert: fs.readFileSync(process.env.SSL_CERT)
  };
  
  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`🔒 HTTPS Server running securely on port ${PORT}`);
    console.log(`🛡️  Security features enabled for APDS7311 assignment`);
  });
  
  // Redirect HTTP to HTTPS
  const httpApp = express();
  httpApp.use((req, res) => {
    res.redirect(301, `https://${req.headers.host}${req.url}`);
  });
  httpApp.listen(80, () => {
    console.log('HTTP redirect server running on port 80');
  });
  
} else {
  // HTTP Server for Development
  app.listen(PORT, () => {
    console.log(`🚀 HTTP Server running on port ${PORT}`);
    console.log(`🛡️  Security features enabled for APDS7311 assignment`);
    console.log(`⚠️  Running in development mode - HTTPS disabled`);
  });
}
