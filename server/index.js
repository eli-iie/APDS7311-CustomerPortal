require("dotenv").config();  // Load .env file

const connectDB = require("./config/db");
connectDB();

const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { body, validationResult } = require("express-validator");
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
// Validate and sanitize PORT to prevent injection
const rawPort = process.env.PORT;
const PORT = (rawPort && /^\d+$/.test(rawPort)) ? parseInt(rawPort, 10) : 5001;

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
app.use((err, req, res, next) => {
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
// Use static configuration to prevent environment variable manipulation
const USE_SSL = process.env.USE_SSL === 'true';
const SSL_KEY_PATH = './ssl/server.key';
const SSL_CERT_PATH = './ssl/server.crt';

if (USE_SSL && fs.existsSync(SSL_KEY_PATH) && fs.existsSync(SSL_CERT_PATH)) {
  // HTTPS Server for Production
  try {
    const sslOptions = {
      key: fs.readFileSync(SSL_KEY_PATH),
      cert: fs.readFileSync(SSL_CERT_PATH)
    };    https.createServer(sslOptions, app).listen(PORT, () => {
      console.log('🔒 HTTPS Server running securely');
      console.log('🛡️  Security features enabled for APDS7311 assignment');
    });  } catch (sslError) {
    console.error('SSL configuration error, falling back to HTTP:', sslError.message);
    startHttpServer();
  }
} else {
  startHttpServer();
}

function startHttpServer() {
  // HTTP Server for Development
  app.listen(PORT, () => {
    console.log('🚀 HTTP Server running in development mode');
    console.log('🛡️  Security features enabled for APDS7311 assignment');
    console.log('⚠️  Running in development mode - HTTPS disabled');
  });
}
