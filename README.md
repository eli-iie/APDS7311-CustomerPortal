# 🏦 APDS7311 Customer Portal - SecureBank International Payments

A secure banking application for international payments built with React, Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd CustomerPortal

# Install all dependencies (root, server, and client)
npm run install:all
```

## 🛠️ Development Commands

### Development Mode (Recommended)
```bash
# Start both client and server in development mode
npm run dev
```
- **Client (React)**: https://localhost:3000
- **Server (Express)**: https://localhost:5001
- Features auto-reload, hot-reloading, and separate processes

### Individual Components
```bash
# Start only the server (development mode with nodemon)
npm run server:dev

# Start only the client (React development server)
npm run client:dev
```

### Production Mode
```bash
# Build and start production server (single process)
npm run start:production
```
- **Single Server**: https://localhost:5001 (serves both API and static files)
- Optimized build, single process, production-ready

### Build & Utilities
```bash
# Build React app for production
npm run build

# Show available commands
npm run help
```

## 📱 Application Access

### Customer Portal
- **URL**: https://localhost:3000 (dev) or https://localhost:5001 (production)
- **Login**: Use your username (not account number) and password
- **Purpose**: Customer international payments, account management

### Employee Portal  
- **URL**: https://localhost:3000/employee (dev) or https://localhost:5001/employee (production)
- **Purpose**: Employee dashboard, payment verification, administration

## 👥 Demo Users & Test Credentials

### 🏢 Customer Accounts (International Business)

#### Primary Test Customers
```
Username: alexandra.mitchell
Password: CustomerSecure2025!
Name: Alexandra Mitchell
Account: 4001234567
```

```
Username: benjamin.carter  
Password: BusinessPass2025!
Name: Benjamin Carter
Account: 4009876543
```

```
Username: catherine.williams
Password: TradeSecure2025!
Name: Catherine Williams  
Account: 4005555666
```

### 👨‍💼 Employee Accounts

#### Manager Access
```
Username: sarah.chen
Password: SecureManager2025!
Name: Sarah Chen
Role: Manager
Department: International Payments
```

#### Employee Access
```
Username: emily.watson
Password: OfficerPass2025!
Name: Emily Watson
Role: Employee
Department: Payment Processing
```

#### Administrator Access
```
Username: michael.rodriguez
Password: AdminSecure2025!
Name: Michael Rodriguez
Role: Administrator
Department: System Administration
```

## 🧪 Testing

### Comprehensive Test Suite
```bash
# Run complete workflow tests (auto-manages server)
powershell -ExecutionPolicy Bypass -File ".\run-comprehensive-test.ps1"

# Or run the Node.js test directly
node comprehensive-workflow-test.js
```

### Quick Tests
```bash
# Simple comprehensive test (requires running server)
node simple-comprehensive-test.js

# Quick server connectivity test
node quick-live-test.js
```

## 🏗️ Project Structure

```
CustomerPortal/
├── client/                 # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── server/                 # Express backend
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   └── package.json
├── package.json           # Root package (dev commands)
└── README.md
```

## 🔒 Security Features

- **HTTPS**: SSL/TLS encryption for all communications
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage  
- **Input Validation**: Comprehensive data validation
- **Rate Limiting**: API request throttling
- **CORS Protection**: Cross-origin request security
- **SQL Injection Prevention**: Parameterized queries

## 💳 Payment Features

- **SWIFT Payments**: International wire transfers
- **Multi-Currency**: USD, EUR, GBP support
- **Payment History**: Complete transaction records
- **Real-time Validation**: IBAN, SWIFT code verification
- **Audit Trail**: Complete payment tracking

## 🌐 Environment Configuration

### Development
- React Dev Server: https://localhost:3000
- Express API Server: https://localhost:5001
- Database: MongoDB Atlas
- SSL: Self-signed certificates

### Production  
- Single Express Server: https://localhost:5001
- Static Files: Served by Express
- Database: MongoDB Atlas
- SSL: Production certificates

## 📊 Test Results

Latest comprehensive test results: **100% Success Rate (19/19 tests passed)**

Test Coverage:
- ✅ Server Connectivity
- ✅ Customer Authentication (3 users)
- ✅ Employee Authentication (3 users)  
- ✅ Payment Workflow (Submit, History, Validation)
- ✅ Employee Operations (Pending payments, Stats)
- ✅ Security Features (Invalid login prevention, unauthorized access)

## 🛠️ Development

### Code Style
- ESLint configuration included
- React best practices
- Node.js security standards

### Database
- MongoDB Atlas cloud database
- Mongoose ODM
- Automated seeding scripts

### Hot Reloading
- React: Automatic browser refresh
- Server: Nodemon auto-restart on changes

## 📋 Available Scripts Summary

| Command | Description | Ports | Use Case |
|---------|-------------|--------|----------|
| `npm run dev` | Full development mode | 3000 + 5001 | Development work |
| `npm run start:production` | Production mode | 5001 only | Production/testing |
| `npm run server:dev` | Server only | 5001 | Backend development |
| `npm run client:dev` | Client only | 3000 | Frontend development |
| `npm run build` | Build for production | - | Deployment prep |

## 🔧 Troubleshooting

### Port Conflicts
```bash
# Kill processes on port 5001
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

### SSL Certificate Issues
- Development uses self-signed certificates
- Browser may show security warnings (normal for dev)
- Click "Advanced" → "Proceed to localhost"

### Database Connection
- Ensure MongoDB Atlas credentials are correct
- Check network connectivity
- Verify IP whitelist in MongoDB Atlas

---

**🎓 APDS7311 Assignment - Secure Banking Application**  
*International Payments Portal with Advanced Security Features*
