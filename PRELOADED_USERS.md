# Preloaded Users Documentation

This document contains all preloaded user accounts for the APDS7311 Assignment - Secure Customer International Payments Portal. All users are created during database seeding and no public registration is allowed as per assignment requirements.

## Employee Accounts

### 1. John Smith (Employee)
- **Username:** `john.smith`
- **Password:** `SecurePass123!`
- **Employee ID:** `EMP001`
- **Full Name:** John Smith
- **Department:** International Payments
- **Role:** `employee`
- **Permissions:** Can verify and reject customer payments

### 2. Sarah Jones (Employee)
- **Username:** `sarah.jones`
- **Password:** `SecurePass123!`
- **Employee ID:** `EMP002`
- **Full Name:** Sarah Jones
- **Department:** International Payments
- **Role:** `employee`
- **Permissions:** Can verify and reject customer payments

### 3. Admin User (Administrator)
- **Username:** `admin.user`
- **Password:** `AdminPass123!`
- **Employee ID:** `EMP003`
- **Full Name:** Admin User
- **Department:** IT Security
- **Role:** `admin`
- **Permissions:** 
  - All employee permissions
  - System administration access

### 4. SWIFT Manager (Manager)
- **Username:** `manager.swift`
- **Password:** `ManagerPass123!`
- **Employee ID:** `MGR001`
- **Full Name:** SWIFT Manager
- **Department:** International Payments
- **Role:** `manager`
- **Permissions:** 
  - All employee permissions
  - Can submit verified payments to SWIFT
  - View verified payments dashboard

## Customer Accounts

### 1. Test Customer
- **Username:** `test_customer`
- **Password:** `TestPass123!`
- **Account Number:** `1234567890`
- **ID Number:** `9001010000001`
- **Full Name:** Test Customer
- **Role:** `customer`
- **Permissions:** Can submit international payments, view payment history

### 2. Demo User
- **Username:** `demo_user`
- **Password:** `DemoPass123!`
- **Account Number:** `0987654321`
- **ID Number:** `8505050000005`
- **Full Name:** Demo User
- **Role:** `customer`
- **Permissions:** Can submit international payments, view payment history

## Role-Based Access Control

### Customer Role (`customer`)
- Submit international payment requests
- View personal payment history
- View payment status (pending, verified, rejected)
- Update personal profile information

### Employee Role (`employee`)
- Verify customer payment requests
- Reject payment requests with reason
- View pending payments dashboard
- Access audit trail for own actions

### Manager Role (`manager`)
- All employee permissions
- Submit verified payments to SWIFT network
- View verified payments dashboard
- Create and manage customer accounts
- Create and manage employee accounts
- Delete user accounts (soft delete)

### Admin Role (`admin`)
- All manager permissions
- Full system administration
- Manage all user roles
- System configuration access
- Advanced audit trail access

## Security Features

- **Password Hashing:** All passwords are hashed using bcrypt with 12 salt rounds
- **Account Lockout:** Accounts locked after 5 failed login attempts for 2 hours
- **Input Validation:** RegEx patterns prevent injection attacks
- **Audit Trails:** All user actions are logged with timestamps, IP addresses, and user agents
- **Role-Based Access:** Strict role-based permissions for all endpoints
- **Session Management:** JWT tokens with expiration for secure sessions
- **SSL/HTTPS:** End-to-end encryption for all communications

## Database Seeding

All users are created through the database seeding script located at:
`server/scripts/seedDatabase.js`

To recreate all preloaded users:
```bash
cd server
npm run seed
```

## Login Portals

### Customer Portal
- URL: `/login`
- Use customer account credentials above

### Employee Portal  
- URL: `/employee/login`
- Use employee account credentials above

## Important Notes

1. **No Public Registration:** Registration functionality has been completely removed. All users are pre-loaded by system administrators
2. **User Accounts:** All user accounts are pre-configured and cannot be modified through the application interface
3. **Password Security:** All passwords follow strict security requirements (8+ chars, uppercase, lowercase, number, special character)
4. **Account Recovery:** Contact system administrator for password resets
5. **Testing:** Use the provided test accounts for demonstration and testing purposes

## Contact

For user account issues or access problems, contact the system administrator using the Admin User account credentials provided above.
