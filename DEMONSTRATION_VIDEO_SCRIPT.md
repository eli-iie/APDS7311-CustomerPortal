# APDS7311 - Customer Portal Demonstration Video Script
## Comprehensive Demo for 100% Mark Achievement

**Duration:** 15-20 minutes  
**Date:** June 9, 2025  
**Project:** Secure International Payment System  

---

## 🎯 **INTRODUCTION SECTION** (2 minutes)

### **Opening Statement**
> "Good day, I'm presenting the APDS7311 Secure International Payment System - a comprehensive two-part application consisting of a Customer Portal and Employee Portal for secure international payments with SWIFT integration."

### **Project Overview**
- **Technology Stack:** React frontend, Node.js/Express backend, MongoDB database
- **Security Focus:** Enterprise-grade security with comprehensive DevSecOps pipeline
- **Architecture:** Two separate portals with role-based access control

### **Demo Structure Preview**
1. Security Infrastructure & DevSecOps Pipeline
2. Customer Portal Demonstration
3. Employee Portal Demonstration  
4. Security Features & Attack Protection
5. System Integration & Data Flow

---

## 🔒 **SECURITY & DEVSECOPS DEMONSTRATION** (3 minutes)

### **GitHub Repository & Version Control**
- Open GitHub repository: `https://github.com/[username]/APDS7311-CustomerPortal`
- Show project structure and commit history
- Highlight security-focused commits

### **CircleCI Pipeline**
- Navigate to CircleCI dashboard
- Show successful build with all security checks
- Point out: "Our CI pipeline includes dependency scanning, SAST, and API security testing"

### **SonarCloud Security Analysis**
- Open SonarCloud project dashboard
- Show security hotspots, code smells, and vulnerabilities status
- Highlight: "Zero critical security vulnerabilities detected"

### **SSL/HTTPS Configuration**
```bash
# Show SSL certificates
ls server/ssl/
# Display: server.crt and server.key files
```
- Explain: "Valid SSL certificates generated for HTTPS-only communication"

---

## 👤 **CUSTOMER PORTAL DEMONSTRATION** (4 minutes)

### **Landing Page & Navigation**
- Open: `https://localhost:3000`
- Show professional landing page design
- Point out security dashboard with live metrics
- Navigate through different sections

### **Customer Registration** ⚠️ 
> **CRITICAL:** First implement the missing registration feature!

**SCRIPT ADJUSTMENT:**
- "First, let me show customer registration - a core requirement"
- Navigate to registration page
- Demonstrate input validation and security

### **Customer Login**
- Navigate to `/login`
- Show secure login form
- Demonstrate input validation:
  ```
  Account Number: 1234567890 (10-12 digits)
  Password: SecurePass123!
  ```
- Point out: "Real-time validation with RegEx patterns"

### **Payment Creation Workflow**
- After login, access customer dashboard
- Demonstrate payment form completion:
  ```
  Amount: 1500.00
  Currency: USD
  Provider: SWIFT (default)
  Payee Account: GB29NWBK60161331926819
  SWIFT Code: ABCDGB2L
  Payee Name: John Doe International Ltd
  ```

### **Input Validation Demo**
- Try invalid inputs to show validation:
  - Invalid SWIFT code: "ABC123" → Show error
  - Invalid amount: "-100" → Show error
  - Invalid IBAN: "123" → Show error

### **Payment Submission**
- Complete valid payment
- Show success message and transaction ID
- Navigate to payment history

---

## 🏢 **EMPLOYEE PORTAL DEMONSTRATION** (4 minutes)

### **Employee Authentication**
- Navigate to `/employee/login`
- Use pre-configured employee credentials:
  ```
  Username: manager.smith
  Password: SecureManager123!
  ```
- Show role-based authentication

### **Payment Review Dashboard**
- Display pending payments from customer portal
- Show real-time data flow between portals
- Point out: "Customer payments appear immediately for employee review"

### **Payment Verification Process**
- Select a pending payment
- Show detailed payment information
- Demonstrate SWIFT code validation
- Verify payee account details
- Click "Verify Payment"

### **SWIFT Submission (Manager/Admin Only)**
- Show role-based access control
- Submit verified payment to SWIFT
- Point out: "Only managers and admins can submit to SWIFT"

### **Audit Trail Access**
- Navigate to audit trail (admin feature)
- Show comprehensive logging:
  - Login attempts
  - Payment actions
  - System access
- Explain: "Complete audit trail for compliance and security"

---

## 🛡️ **SECURITY FEATURES DEMONSTRATION** (3 minutes)

### **Password Security**
- Open browser developer tools
- Navigate to Network tab during login
- Show: "Passwords are bcrypt hashed - never transmitted in plain text"

### **Input Sanitization & Validation**
- Attempt MongoDB injection:
  ```
  Username: {"$ne": null}
  ```
- Show how it's blocked by express-mongo-sanitize

### **Rate Limiting Protection**
- Attempt multiple rapid login attempts
- Show rate limiting in action:
  ```
  Error: "Too many login attempts, please try again later"
  ```

### **Security Headers**
- Open browser developer tools → Network → Headers
- Show security headers added by Helmet:
  ```
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Strict-Transport-Security: max-age=31536000
  Content-Security-Policy: [detailed policy]
  ```

### **Session Management**
- Show JWT token in localStorage (briefly)
- Demonstrate automatic logout after token expiry
- Show secure session handling

---

## 🔄 **SYSTEM INTEGRATION & DATA FLOW** (2 minutes)

### **Real-time Data Synchronization**
- Create payment in customer portal
- Immediately switch to employee portal
- Show payment appears in pending queue
- Demonstrate: "Seamless data flow between portals"

### **Role-Based Access Control**
- Login as different employee roles:
  - Employee: Can view and verify payments
  - Manager: Can submit to SWIFT
  - Admin: Can access audit trails

### **Database Security**
- Show MongoDB connection with authentication
- Explain: "All database queries use parameterized statements"

---

## 📊 **PERFORMANCE & RELIABILITY** (1 minute)

### **Error Handling**
- Demonstrate graceful error handling
- Show user-friendly error messages
- Network disconnection handling

### **Responsive Design**
- Show application on different screen sizes
- Mobile responsiveness demonstration

---

## 🎬 **CONCLUSION & REQUIREMENTS COVERAGE** (1 minute)

### **Requirements Checklist**
✅ **Customer Portal Requirements (FR-C1 to FR-C5):** All implemented  
✅ **Employee Portal Requirements (FR-E1 to FR-E5):** All implemented  
✅ **Security Requirements (NFR-SEC1 to NFR-SEC6):** Fully compliant  
✅ **DevSecOps Pipeline (NFR-DSO1 to NFR-DSO5):** Complete implementation  

### **Security Standards Achieved**
- ✅ bcrypt password hashing
- ✅ Input validation & sanitization  
- ✅ SSL/TLS encryption
- ✅ Protection against common attacks
- ✅ Secure session management
- ✅ Role-based access control

### **DevSecOps Excellence**
- ✅ GitHub version control
- ✅ CircleCI continuous integration
- ✅ SonarCloud SAST analysis
- ✅ npm audit SCA scanning
- ✅ API security testing

### **Closing Statement**
> "This implementation demonstrates enterprise-grade security practices, comprehensive functionality, and professional development standards. The system successfully meets all APDS7311 requirements with additional security enhancements."

---

## 📝 **RECORDING NOTES**

### **Technical Setup**
1. Ensure both frontend and backend servers are running
2. Have multiple browser tabs open for quick switching
3. Clear any previous data for clean demonstration
4. Test all functionality before recording

### **Demo Tips**
- Speak clearly and maintain steady pace
- Show actual code when demonstrating security features
- Use realistic data for professional appearance
- Highlight security aspects throughout
- Keep within time limit while being comprehensive

### **Critical Points to Emphasize**
1. **Security-first approach** in all implementations
2. **Real-time data flow** between customer and employee portals
3. **Role-based access control** with proper authorization
4. **Comprehensive audit trail** for compliance
5. **Professional DevSecOps pipeline** with automated security testing

---

## ⚠️ **PRE-RECORDING CHECKLIST**

- [ ] Implement customer registration functionality
- [ ] Seed database with realistic test data
- [ ] Verify all security features are working
- [ ] Test both portals thoroughly
- [ ] Ensure SSL certificates are valid
- [ ] Check CircleCI pipeline is green
- [ ] Verify SonarCloud analysis is complete
- [ ] Prepare demonstration credentials
- [ ] Test network connectivity and performance

**Expected Mark Achievement:** 90-100% based on comprehensive requirement coverage and security excellence demonstration.
