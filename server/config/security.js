// Security Configuration for APDS7311 Assignment
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

// Enhanced Security Headers
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      frameAncestors: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  xssFilter: true,
  noSniff: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
});

// Rate Limiting Configuration
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later",
    resetTime: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    console.log(`Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: "Too many requests",
      message: "Rate limit exceeded. Please try again later.",
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Stricter rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 auth requests per windowMs
  message: {
    error: "Too many authentication attempts, please try again later",
    resetTime: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    console.log(`Auth rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: "Too many authentication attempts",
      message: "Please wait before trying to login again.",
      retryAfter: Math.round(req.rateLimit.resetTime / 1000)
    });
  }
});

// Speed limiting for suspicious activity
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 2, // Allow 2 requests per windowMs without delay
  delayMs: () => 500, // Add 500ms delay per request after delayAfter
  maxDelayMs: 5000, // Maximum delay of 5 seconds
  validate: { delayMs: false } // Disable warning for v2 compatibility
});

// API Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 API requests per minute
  message: {
    error: "API rate limit exceeded",
    resetTime: 1 * 60 * 1000
  }
});

// Payment endpoint specific rate limiting
const paymentLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // Limit each IP to 50 payment submissions per hour
  message: {
    error: "Payment submission limit exceeded",
    message: "Too many payment attempts. Please try again later.",
    resetTime: 60 * 60 * 1000
  },
  skipSuccessfulRequests: false
});

// Employee portal rate limiting
const employeeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each IP to 50 employee requests per windowMs
  message: {
    error: "Employee portal rate limit exceeded",
    resetTime: 15 * 60 * 1000
  }
});

// CORS Configuration - Simplified for debugging
const corsOptions = {
  origin: true, // Allow all origins during development debugging
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400, // 24 hours
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Session Configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict'
  },
  name: 'sessionId', // Change default session name
};

// Additional Security Middleware
const additionalSecurity = (req, res, next) => {
  // Remove server signature
  res.removeHeader('X-Powered-By');
  
  // Add additional security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 
    'camera=(), microphone=(), geolocation=(), payment=()');
  
  // Prevent clickjacking
  res.setHeader('Content-Security-Policy', 
    "frame-ancestors 'none'; object-src 'none';");
  
  next();
};

// Input Sanitization Middleware
const sanitizeInput = (req, res, next) => {
  // Remove null bytes
  if (req.body) {
    for (let key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].replace(/\0/g, '');
      }
    }
  }
  
  // Log suspicious activity
  if (req.body) {
    const suspiciousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /data:text\/html/gi
    ];
    
    const bodyString = JSON.stringify(req.body);
    suspiciousPatterns.forEach(pattern => {
      if (pattern.test(bodyString)) {
        console.warn(`Suspicious input detected from IP ${req.ip}:`, bodyString);
      }
    });
  }
  
  next();
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'WARN' : 'INFO';
    
    console.log(`[${logLevel}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms - ${req.ip}`);
    
    // Log failed authentication attempts
    if (req.originalUrl.includes('/login') && res.statusCode === 400) {
      console.warn(`Failed login attempt from IP: ${req.ip}`);
    }
  });
  
  next();
};

// Create CORS middleware
const cors = require("cors");
const corsMiddleware = cors(corsOptions);

// Create brute force protection middleware 
const bruteForceProtection = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 3, // Allow 3 requests per windowMs without delay
  delayMs: () => 1000, // Add 1 second delay per request after delayAfter
  maxDelayMs: 10000, // Maximum delay of 10 seconds
  validate: { delayMs: false } // Disable warning for v2 compatibility
});

module.exports = {
  securityHeaders,
  globalLimiter,
  authLimiter,
  speedLimiter,
  apiLimiter,
  paymentLimiter,
  employeeLimiter,
  corsMiddleware,
  corsOptions,
  sessionConfig,
  additionalSecurity,
  sanitizeInput,
  requestLogger,
  bruteForceProtection
};
