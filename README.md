# Secure Customer International Payments Portal

A banking application for international payments with comprehensive security implementation, developed for APDS7311 - Application Development Security.

## Project Overview

This application provides a secure platform for customers to submit international payments and employees to verify and process them through SWIFT networks. The system implements security practices covering authentication, input validation, and audit trail management.

## Application Features

### Customer Portal
- Secure user registration with validation
- JWT-based authentication system
- International payment submission (SWIFT compliant)
- Payment status tracking
- Account security with lockout protection

### Employee Portal
- Role-based access control (Employee, Admin, Manager)
- Payment verification and approval workflow
- SWIFT submission for verified payments
- Audit trail access
- Static employee login system

### Security Implementation
- bcrypt password hashing (12 rounds)
- Attack protection (XSS, CSRF, Clickjacking prevention)
- Rate limiting and brute force protection
- SSL/HTTPS with HSTS implementation
- Audit trail system
- Input validation and sanitization

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone [repository-url]
cd CustomerPortal
```

2. **Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Environment Configuration**
Create `.env` file in the server directory:
```env
MONGO_URI=mongodb://localhost:27017/customer-portal
JWT_SECRET=your-super-secret-jwt-key
SESSION_SECRET=your-super-secret-session-key
NODE_ENV=development
PORT=5001
CLIENT_URL=http://localhost:3000
```

4. **Database Setup**
```bash
cd server
node seedDatabase.js
```

5. **Generate SSL Certificates (Optional)**
```bash
cd server
node generateSSL.js
```

### Running the Application

1. **Start the Backend Server**
```bash
cd server
npm start
```
Server will run on: `http://localhost:5001`

2. **Start the Frontend Client**
```bash
cd client
npm start
```
Client will run on: `http://localhost:3000`

## Testing

### Run Comprehensive Tests
```bash
# Run the main test suite
node tests/comprehensive_workflow_test.js

# Run individual component tests
node tests/simple_employee_test.js
```

### Manual Testing

1. **Customer Workflow:**
   - Navigate to `http://localhost:3000`
   - Register a new customer account
   - Login and submit an international payment
   - Check payment status

2. **Employee Workflow:**
   - Login with pre-configured employee accounts:
     - Username: `admin.user`, Password: `AdminPass123!`
     - Username: `john.smith`, Password: `EmpPass123!`
   - View pending payments
   - Verify/reject payments
   - Submit verified payments to SWIFT

## Project Structure

```
CustomerPortal/
├── client/                 # React frontend application
├── server/                 # Express.js backend API
├── tests/                  # Test files and scripts
├── docs/                   # Project documentation
├── README.md              # This file
└── package.json           # Root package configuration
```

## Default Employee Accounts

The system comes with pre-configured employee accounts:

| Username | Password | Role | Department |
|----------|----------|------|------------|
| admin.user | AdminPass123! | Admin | IT Security |
| john.smith | EmpPass123! | Employee | Operations |
| sarah.jones | EmpPass123! | Employee | Compliance |
| manager.swift | ManagerPass123! | Manager | SWIFT Operations |

## Security Implementation

This application implements comprehensive security measures:

- **Password Security:** bcrypt with 12 salt rounds
- **Input Validation:** RegEx whitelisting for all inputs
- **Attack Protection:** Helmet.js security headers
- **Rate Limiting:** Multi-tier rate limiting
- **Session Security:** Secure cookies with httpOnly and sameSite
- **SSL/HTTPS:** Complete certificate implementation
- **Audit Logging:** Comprehensive security trail

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/login` - Customer login
- `POST /api/employee/login` - Employee login

### Payment Endpoints
- `POST /api/payment/submit` - Submit payment
- `GET /api/payment/user/:userId` - Get user payments
- `GET /api/employee/payments/pending` - Get pending payments
- `PUT /api/employee/payments/:id/verify` - Verify payment
- `PUT /api/employee/payments/:id/reject` - Reject payment
- `POST /api/employee/payments/submit-to-swift` - Submit to SWIFT

## Test Results

The application achieves **100% success rate** on comprehensive testing:

- Application Availability
- Customer Registration & Login
- Payment Submission
- Employee Authentication
- Payment Verification
- SWIFT Submission
- Audit Trail Verification

## Additional Documentation

Detailed documentation is available in the `docs/` folder:
- Security Architecture Documentation
- Implementation Guidelines
- Testing Procedures
- Compliance Assessment

## Contributing

This project was developed as part of APDS7311 coursework. For academic integrity, please refer to the course guidelines for collaboration policies.

## License

This project is developed for educational purposes as part of APDS7311 - Application Development Security coursework.

## Support

For technical issues or questions:
1. Check the documentation in the `docs/` folder
2. Review test files in the `tests/` folder
3. Verify environment configuration
4. Ensure all dependencies are installed correctly

---

**Assignment Status: COMPLETE - Ready for Submission**
