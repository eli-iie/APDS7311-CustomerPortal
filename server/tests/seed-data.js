// APDS7311 - Shared Seed Data for Testing and Database Initialization
// Single source of truth for all test credentials and user data

/**
 * Realistic employee accounts for testing and seeding
 * These accounts are used by both the seeding script and test suites
 */
const employees = [
  {
    username: 'sarah.chen',
    password: 'SecureManager2025!',
    fullName: 'Sarah Chen',
    role: 'manager',
    department: 'International Payments',
    employeeId: 'MGR001',
    email: 'sarah.chen@securebank.com'
  },
  {
    username: 'michael.rodriguez',
    password: 'AdminSecure2025!',
    fullName: 'Michael Rodriguez',
    role: 'admin',
    department: 'System Administration',
    employeeId: 'ADM001',
    email: 'michael.rodriguez@securebank.com'
  },
  {
    username: 'emily.watson',
    password: 'OfficerPass2025!',
    fullName: 'Emily Watson',
    role: 'employee',
    department: 'Payment Processing',
    employeeId: 'EMP001',
    email: 'emily.watson@securebank.com'
  },
  {
    username: 'david.kim',
    password: 'ClerkSecure2025!',
    fullName: 'David Kim',
    role: 'employee',
    department: 'Payment Verification',
    employeeId: 'EMP002',
    email: 'david.kim@securebank.com'
  },
  {
    username: 'rachel.thompson',
    password: 'AnalystPass2025!',
    fullName: 'Rachel Thompson',
    role: 'employee',
    department: 'Risk Analysis',
    employeeId: 'EMP003',
    email: 'rachel.thompson@securebank.com'
  },
  {
    username: 'james.anderson',
    password: 'SupervisorSecure2025!',
    fullName: 'James Anderson',
    role: 'manager',
    department: 'Compliance',
    employeeId: 'MGR002',
    email: 'james.anderson@securebank.com'
  },
  {
    username: 'lisa.patel',
    password: 'LeadSecure2025!',
    fullName: 'Lisa Patel',
    role: 'employee',
    department: 'SWIFT Operations',
    employeeId: 'EMP004',
    email: 'lisa.patel@securebank.com'
  },
  {
    username: 'robert.johnson',
    password: 'SpecialistPass2025!',
    fullName: 'Robert Johnson',
    role: 'employee',
    department: 'Anti-Money Laundering',
    employeeId: 'EMP005',
    email: 'robert.johnson@securebank.com'
  }
];

/**
 * Realistic customer accounts for testing and seeding
 * These accounts are used by both the seeding script and test suites
 */
const customers = [
  {
    fullName: 'Alexandra Mitchell',
    idNumber: '8501015800080',
    accountNumber: '4001234567',
    username: 'alexandra.mitchell',
    password: 'CustomerSecure2025!'
  },
  {
    fullName: 'Benjamin Carter',
    idNumber: '9003128900081',
    accountNumber: '4009876543',
    username: 'benjamin.carter',
    password: 'BusinessPass2025!'
  },
  {
    fullName: 'Catherine Williams',
    idNumber: '7809205600082',
    accountNumber: '4005555666',
    username: 'catherine.williams',
    password: 'TradeSecure2025!'
  },
  {
    fullName: 'Daniel Thompson',
    idNumber: '8712094800083',
    accountNumber: '4007777888',
    username: 'daniel.thompson',
    password: 'PremiumPass2025!'
  },
  {
    fullName: 'Emma Rodriguez',
    idNumber: '9204156700084',
    accountNumber: '4003333444',
    username: 'emma.rodriguez',
    password: 'CorporateSecure2025!'
  },
  {
    fullName: 'Franklin Davis',
    idNumber: '8506089500085',
    accountNumber: '4008888999',
    username: 'franklin.davis',
    password: 'ImporterPass2025!'
  },
  {
    fullName: 'Grace Chen',
    idNumber: '9105127800086',
    accountNumber: '4006666777',
    username: 'grace.chen',
    password: 'ExporterSecure2025!'
  },
  {
    fullName: 'Henry Wilson',
    idNumber: '8408203400087',
    accountNumber: '4004444555',
    username: 'henry.wilson',
    password: 'TechSecure2025!'
  },
  {
    fullName: 'Isabella Garcia',
    idNumber: '9007144200088',
    accountNumber: '4002222333',
    username: 'isabella.garcia',
    password: 'RetailPass2025!'
  },
  {
    fullName: 'Jackson Brown',
    idNumber: '8711078600089',
    accountNumber: '4001111222',
    username: 'jackson.brown',
    password: 'ManufacturerSecure2025!'
  }
];

/**
 * Realistic payment data for testing
 * These payments will be created for various customers to test different scenarios
 */
const payments = [  // Pending payments
  {
    customerUsername: 'benjamin.carter',
    amount: 15000.00,
    currency: 'USD',
    provider: 'SWIFT',
    payeeAccountNumber: 'GB29NWBK60161331926819', // UK IBAN
    swiftCode: 'NWBKGB2L',
    payeeName: 'TechCorp Solutions Ltd',
    status: 'pending'
  },
  {
    customerUsername: 'catherine.williams',
    amount: 8750.50,
    currency: 'EUR',
    provider: 'SWIFT',
    payeeAccountNumber: 'DE89370400440532013000', // German IBAN
    swiftCode: 'COBADEFF',
    payeeName: 'European Imports GmbH',
    status: 'pending'
  },
  // Verified payments
  {
    customerUsername: 'alexandra.mitchell',
    amount: 25000.00,
    currency: 'USD',
    provider: 'SWIFT',
    payeeAccountNumber: 'US64SVBKUS6S3300958879', // US IBAN
    swiftCode: 'SVBKUS6S',
    payeeName: 'Mitchell Trading Corp',
    status: 'verified',
    verifiedBy: 'emily.watson'
  },
  {
    customerUsername: 'daniel.thompson',
    amount: 12500.75,
    currency: 'GBP',
    provider: 'SWIFT',
    payeeAccountNumber: 'GB82WEST12345698765432', // UK IBAN
    swiftCode: 'MIDLGB22',
    payeeName: 'Premium Services Ltd',
    status: 'verified',
    verifiedBy: 'david.kim'
  },
  // Submitted payments
  {
    customerUsername: 'emma.rodriguez',
    amount: 45000.00,
    currency: 'USD',
    provider: 'SWIFT',
    payeeAccountNumber: 'ES9121000418450200051332', // Spanish IBAN
    swiftCode: 'CAIXESBB',
    payeeName: 'Rodriguez International SA',
    status: 'submitted'
  },
  // Completed payments
  {
    customerUsername: 'franklin.davis',
    amount: 7250.25,
    currency: 'EUR',
    provider: 'SWIFT',
    payeeAccountNumber: 'FR1420041010050500013M02606', // French IBAN
    swiftCode: 'BNPAFRPP',
    payeeName: 'Davis Import Export SARL',
    status: 'completed'
  },
  {
    customerUsername: 'grace.chen',
    amount: 18900.00,
    currency: 'ZAR',
    provider: 'SWIFT',
    payeeAccountNumber: 'ZA940000123456789012345', // South African IBAN
    swiftCode: 'SBZAZAJJ',
    payeeName: 'Chen Manufacturing Pty',
    status: 'completed'
  },
  // Rejected payment
  {
    customerUsername: 'henry.wilson',
    amount: 95000.00,
    currency: 'USD',
    provider: 'SWIFT',
    payeeAccountNumber: 'US12345678901234567890', // Invalid format for testing
    swiftCode: 'CHASUS33',
    payeeName: 'High Value Transaction Corp',
    status: 'rejected',
    rejectionReason: 'Exceeds daily limit without additional authorization'
  },
  // More pending payments for comprehensive testing
  {
    customerUsername: 'isabella.garcia',
    amount: 3250.00,
    currency: 'EUR',
    provider: 'SWIFT',
    payeeAccountNumber: 'IT60X0542811101000000123456', // Italian IBAN
    swiftCode: 'BPMIITM1',
    payeeName: 'Garcia Retail Solutions SRL',
    status: 'pending'
  },
  {
    customerUsername: 'jackson.brown',
    amount: 33750.50,
    currency: 'USD',
    provider: 'SWIFT',
    payeeAccountNumber: 'CA0001234567890123456789', // Canadian format
    swiftCode: 'TDOMCATT',
    payeeName: 'Brown Manufacturing Inc',
    status: 'pending'
  }
];

/**
 * Test data subsets for specific testing scenarios
 */
const testEmployees = [
  employees.find(emp => emp.username === 'sarah.chen'),      // Manager
  employees.find(emp => emp.username === 'emily.watson'),    // Employee
  employees.find(emp => emp.username === 'michael.rodriguez') // Admin
];

const testCustomers = [
  customers.find(cust => cust.username === 'benjamin.carter'),
  customers.find(cust => cust.username === 'catherine.williams')
];

const testPayments = [
  payments.find(pay => pay.customerUsername === 'benjamin.carter'),
  payments.find(pay => pay.customerUsername === 'catherine.williams')
];

/**
 * Utility functions for accessing seed data
 */
const getSeedData = {
  // Get all employees
  getAllEmployees: () => employees,
  
  // Get all customers
  getAllCustomers: () => customers,
  
  // Get all payments
  getAllPayments: () => payments,
  
  // Get employees by role
  getEmployeesByRole: (role) => employees.filter(emp => emp.role === role),
  
  // Get payments by status
  getPaymentsByStatus: (status) => payments.filter(pay => pay.status === status),
  
  // Get payments by customer
  getPaymentsByCustomer: (username) => payments.filter(pay => pay.customerUsername === username),
  
  // Get specific employee by username
  getEmployee: (username) => employees.find(emp => emp.username === username),
  
  // Get specific customer by username
  getCustomer: (username) => customers.find(cust => cust.username === username),
  
  // Get test subsets
  getTestEmployees: () => testEmployees,
  getTestCustomers: () => testCustomers,
  getTestPayments: () => testPayments,
  
  // Get credentials for authentication testing
  getManagerCredentials: () => employees.find(emp => emp.role === 'manager'),
  getAdminCredentials: () => employees.find(emp => emp.role === 'admin'),
  getEmployeeCredentials: () => employees.find(emp => emp.role === 'employee'),
  getCustomerCredentials: () => customers[0]
};

module.exports = {
  employees,
  customers,
  payments,
  testEmployees,
  testCustomers,
  testPayments,
  getSeedData
};
