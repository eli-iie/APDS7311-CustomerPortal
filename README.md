# APDS7311 Customer Portal - International Payment System

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)
![React](https://img.shields.io/badge/React-19.x-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

A secure, two-part international payment system consisting of a Customer Portal and Employee Portal for processing international payments with comprehensive security features and DevSecOps pipeline integration.

## 🚀 Features

### Customer Portal
- **Secure Registration & Authentication** - JWT-based authentication with bcrypt password hashing
- **International Payment Processing** - SWIFT code validation and secure payment submissions
- **Transaction History** - View and track payment status
- **Multi-layered Security** - Input validation, rate limiting, and session management

### Employee Portal  
- **Pre-registered Staff Access** - Secure login for bank employees
- **Payment Verification** - Review and verify customer payment details
- **SWIFT Integration** - Submit verified payments to SWIFT network
- **Role-based Access Control** - Different access levels for managers and admins

### Security Features
- **HTTPS Encryption** - TLS 1.2+ for all communications
- **Input Sanitization** - MongoDB injection prevention
- **Rate Limiting** - Brute force attack protection
- **Session Security** - Secure session management with MongoDB storage
- **CORS Protection** - Configurable cross-origin resource sharing
- **Helmet Security** - HTTP security headers

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Production](#production)
- [API Documentation](#api-documentation)
- [Security](#security)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v6.x or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)
- **OpenSSL** (for SSL certificates) - Usually included with Git on Windows

### System Requirements
- **Operating System:** Windows 10+, macOS 10.14+, or Linux Ubuntu 18.04+
- **RAM:** Minimum 4GB, Recommended 8GB+
- **Storage:** 2GB free space
- **Network:** Internet connection for dependencies and MongoDB Atlas (optional)

## 🔨 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/CustomerPortal.git
cd CustomerPortal
```

### 2. Install All Dependencies

```bash
# Install all dependencies (root, server, and client)
npm run install:all
```

### 3. Environment Configuration

Create environment files from the examples:

```bash
# Copy the environment example file
cp server/.env.example server/.env
```

Edit `server/.env` with your configuration:

```bash
# Database Configuration
MONGO_URI=mongodb://localhost:27017/customer-portal

# JWT Secret for token signing (CHANGE THIS IN PRODUCTION!)
JWT_SECRET=your-super-secret-jwt-key-minimum-256-bits

# Session Secret (CHANGE THIS IN PRODUCTION!)
SESSION_SECRET=your-super-secret-session-key-minimum-256-bits

# Server Configuration
PORT=5001
NODE_ENV=development

# Security Configuration
ALLOWED_ORIGINS=https://localhost:3000,https://localhost:5001
```

### 4. SSL Certificate Setup

The application uses HTTPS in development. SSL certificates are provided in `server/ssl/`:

```bash
# Certificates are already included:
# server/ssl/server.crt
# server/ssl/server.key
```

**Note:** For production, replace these with valid SSL certificates from a trusted CA.

### 5. Database Setup

#### Option A: Local MongoDB

1. Install and start MongoDB locally
2. The application will automatically create the database and collections

#### Option B: MongoDB Atlas (Cloud)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Update `MONGO_URI` in your `.env` file with your Atlas connection string

### 6. Seed Database (Optional)

```bash
# Seed the database with sample data
cd server
npm run seed
```

## 🛠️ Development

### Start Development Mode

```bash
# Start both frontend and backend in development mode
npm run dev
```

This will start:
- **Frontend:** https://localhost:3000 (React development server)
- **Backend:** https://localhost:5001 (Express server with nodemon)

### Individual Services

```bash
# Start only the backend server
npm run server:dev

# Start only the frontend client
npm run client:dev
```

### Available Scripts

```bash
# Development
npm run dev              # Start full development environment
npm run server:dev       # Start backend only
npm run client:dev       # Start frontend only

# Production
npm run build            # Build React app for production
npm run start:production # Start production server

# Utilities
npm run install:all      # Install all dependencies
npm run help            # Show available commands
```

### Development URLs

- **Frontend (Customer Portal):** https://localhost:3000
- **Backend API:** https://localhost:5001
- **Employee Portal:** https://localhost:3000/employee/login

### Browser Certificate Warning

When accessing HTTPS in development, you'll see a security warning. This is normal for self-signed certificates:

1. Click "Advanced" or "Show Details"
2. Click "Proceed to localhost (unsafe)" or "Accept Risk"
3. The certificate will be remembered for future visits

## 🚀 Production

### Build for Production

```bash
# Build the React application
npm run build

# Start production server
npm run start:production
```

### Production Environment Variables

Update your `.env` file for production:

```bash
NODE_ENV=production
PORT=5001
MONGO_URI=mongodb://your-production-db-url
JWT_SECRET=your-production-jwt-secret-256-bits-minimum
SESSION_SECRET=your-production-session-secret-256-bits-minimum

# SSL Configuration (if using custom certificates)
SSL_KEY=path/to/your/private.key
SSL_CERT=path/to/your/certificate.crt

# Security
ALLOWED_ORIGINS=https://yourdomain.com
```

### Production Deployment

1. **Server Setup**
   - Ensure Node.js and MongoDB are installed
   - Clone the repository
   - Install dependencies with `npm run install:all`
   - Configure environment variables

2. **SSL Certificates**
   - Obtain valid SSL certificates from a trusted CA
   - Replace the certificates in `server/ssl/` or configure custom paths

3. **Database**
   - Set up MongoDB Atlas or a production MongoDB instance
   - Update the `MONGO_URI` in your environment

4. **Security Hardening**
   - Change all default secrets and passwords
   - Configure firewall rules
   - Set up reverse proxy (nginx/Apache) if needed
   - Enable MongoDB authentication

5. **Process Management**
   - Use PM2 or similar for process management:
   ```bash
   npm install -g pm2
   pm2 start ecosystem.config.js
   ```

## 📡 API Documentation

### Authentication Endpoints

#### Customer Authentication
```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me
```

#### Employee Authentication
```http
POST /api/employee/login
POST /api/employee/logout
GET  /api/employee/me
```

### Payment Endpoints

#### Customer Payments
```http
POST /api/payments/create
GET  /api/payments/my-payments
GET  /api/payments/:id
```

#### Employee Payment Management
```http
GET  /api/employee/payments
GET  /api/employee/payments/:id
POST /api/employee/payments/:id/verify
POST /api/employee/payments/:id/submit-to-swift
```

### Request/Response Examples

#### Customer Registration
```json
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "idNumber": "1234567890123",
  "accountNumber": "ACC123456789"
}
```

#### Create Payment
```json
POST /api/payments/create
Content-Type: application/json
Authorization: Bearer <jwt-token>

{
  "recipientName": "Jane Smith",
  "recipientBank": "International Bank",
  "recipientAccount": "ACC987654321",
  "amount": 1000.00,
  "currency": "USD",
  "swiftCode": "INTLUS33",
  "purpose": "Business payment"
}
```

## 🔒 Security

### Security Measures Implemented

1. **Authentication & Authorization**
   - JWT tokens with secure signing
   - bcrypt password hashing (12 rounds)
   - Session-based authentication backup

2. **Input Validation & Sanitization**
   - express-validator for input validation
   - express-mongo-sanitize for NoSQL injection prevention
   - Helmet for security headers

3. **Rate Limiting**
   - express-rate-limit for API endpoints
   - express-slow-down for gradual response delays

4. **Transport Security**
   - HTTPS enforced in all environments
   - TLS 1.2+ configuration
   - HSTS headers

5. **Database Security**
   - MongoDB connection with authentication
   - Parameterized queries prevention
   - Session storage in MongoDB

### Security Best Practices

1. **Never commit sensitive data** - Use environment variables
2. **Change default secrets** - Generate strong, unique secrets for production
3. **Regular updates** - Keep dependencies updated
4. **Monitor logs** - Implement comprehensive logging
5. **Backup strategy** - Regular database backups

### Common Security Issues

- **Self-signed certificates** - Replace with valid certificates in production
- **Default secrets** - Change all JWT_SECRET and SESSION_SECRET values
- **Open ports** - Ensure only necessary ports are exposed
- **MongoDB access** - Enable authentication and network restrictions

## 🧪 Testing

### Running Tests

```bash
# Run server tests
cd server
npm test

# Run client tests
cd client
npm test
```

### Manual Testing

1. **Customer Registration Flow**
   - Navigate to https://localhost:3000
   - Click "Register" 
   - Complete registration form
   - Verify email validation and password requirements

2. **Payment Creation**
   - Login as customer
   - Navigate to "Make Payment"
   - Fill out payment form with valid SWIFT code
   - Submit and verify payment appears in history

3. **Employee Verification**
   - Navigate to https://localhost:3000/employee/login
   - Login with employee credentials
   - Verify payments appear in employee dashboard
   - Test payment verification functionality

### Security Testing

```bash
# Test rate limiting
curl -X POST https://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"wrong"}' \
  --insecure

# Test HTTPS enforcement
curl -X GET http://localhost:5001/api/auth/me
```

## 🚢 Deployment

### Cloud Deployment Options

#### Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login and create app
heroku login
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-production-secret
heroku config:set MONGO_URI=your-mongodb-atlas-url

# Deploy
git push heroku main
```

#### AWS/Azure/GCP
- Use Docker containerization
- Set up load balancer with SSL termination
- Configure auto-scaling
- Set up database cluster

#### DigitalOcean/Linode
- Use PM2 for process management
- Configure nginx reverse proxy
- Set up SSL with Let's Encrypt
- Configure firewall rules

### Production Checklist

- [ ] SSL certificates installed and configured
- [ ] Environment variables set and secured
- [ ] Database backups configured
- [ ] Monitoring and logging set up
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] Error handling and logging implemented
- [ ] Performance optimization completed

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Standards

- **ESLint** - Follow the configured linting rules
- **Prettier** - Use consistent code formatting
- **Security** - Follow OWASP guidelines
- **Testing** - Write tests for new features
- **Documentation** - Update README and inline comments

### Commit Messages

Use conventional commit messages:
```
feat: add payment verification system
fix: resolve authentication token expiry
docs: update API documentation
style: improve UI responsiveness
test: add payment processing tests
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

### Getting Help

1. **Documentation** - Check this README and inline code comments
2. **Issues** - Open a GitHub issue for bugs or feature requests
3. **Discussions** - Use GitHub Discussions for questions

### Common Issues

#### Port Already in Use
```bash
# Kill process using port 5001
npx kill-port 5001

# Or find and kill manually
lsof -ti:5001 | xargs kill -9
```

#### MongoDB Connection Issues
```bash
# Check MongoDB status
mongosh --eval "db.runCommand('ping')"

# Restart MongoDB service
sudo systemctl restart mongod  # Linux
brew services restart mongodb  # macOS
```

#### SSL Certificate Issues
- Ensure certificates exist in `server/ssl/`
- Check certificate permissions
- Verify certificate validity dates

### Development Environment

- **Node.js Version:** 18.x or higher
- **MongoDB Version:** 6.x or higher
- **Browser Support:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

---

## 🎯 Quick Start Commands

```bash
# Complete setup from scratch
git clone https://github.com/yourusername/CustomerPortal.git
cd CustomerPortal
npm run install:all
cp server/.env.example server/.env
# Edit server/.env with your settings
npm run dev
```

**Access the application:**
- Customer Portal: https://localhost:3000
- Employee Portal: https://localhost:3000/employee/login  
- API: https://localhost:5001

---

**Built with ❤️ for APDS7311 - Secure international payment processing**
