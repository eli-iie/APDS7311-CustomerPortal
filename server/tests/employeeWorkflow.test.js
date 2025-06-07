// filepath: C:\\Users\\eliiz\\Desktop\\Learning\\CustomerPortal\\server\\tests\\employeeWorkflow.test.js
const express = require(\'express\');
const request = require(\'supertest\'); // Assuming supertest is available or will be added
const jwt = require(\'jsonwebtoken\');
const Employee = require(\'../models/Employee\');
const Payment = require(\'../models/Payment\');
const AuditTrail = require(\'../models/AuditTrail\');
const employeeRoutes = require(\'../routes/employeeRoutes\');

// Mock environment variables
process.env.JWT_SECRET = \'testsecret\';

// Mock models
jest.mock(\'../models/Employee\');
jest.mock(\'../models/Payment\');
jest.mock(\'../models/AuditTrail\');
AuditTrail.log = jest.fn().mockResolvedValue(true);


const app = express();
app.use(express.json());
app.use(\'/api/employees\', employeeRoutes); // Mount the routes with a base path

describe(\'Employee API Workflow Tests\', () => {
  let token;
  const mockEmployee = {
    _id: \'employee123\',
    username: \'testemployee\',
    password: \'hashedpassword\',
    role: \'employee\',
    employeeId: \'E123\',
    isActive: true,
    isLocked: false,
    loginAttempts: 0,
    comparePassword: jest.fn().mockResolvedValue(true),
    incLoginAttempts: jest.fn().mockResolvedValue(),
    resetLoginAttempts: jest.fn().mockResolvedValue(),
    save: jest.fn().mockResolvedValue(this),
  };

  beforeAll(() => {
    // Reset mocks before all tests in this suite
    Employee.findOne.mockReset();
    Employee.findById.mockReset();
    Payment.find.mockReset();
    mockEmployee.comparePassword.mockClear();
    mockEmployee.save.mockClear();
    AuditTrail.log.mockClear();
  });

  describe(\'Login and Fetch Pending Payments Workflow\', () => {
    it(\'should allow an employee to log in and then fetch pending payments\', async () => {
      // Step 1: Login
      Employee.findOne.mockResolvedValue(mockEmployee);
      
      const loginRes = await request(app)
        .post(\'/api/employees/login\')
        .send({ username: \'testemployee\', password: \'password123\' });

      expect(loginRes.statusCode).toBe(200);
      expect(loginRes.body).toHaveProperty(\'token\');
      expect(loginRes.body.employee.username).toBe(\'testemployee\');
      token = loginRes.body.token;

      expect(Employee.findOne).toHaveBeenCalledWith({ username: \'testemployee\', isActive: true });
      expect(mockEmployee.comparePassword).toHaveBeenCalledWith(\'password123\');
      expect(AuditTrail.log).toHaveBeenCalledWith(expect.objectContaining({ action: \'LOGIN_SUCCESS\' }));

      // Step 2: Fetch Pending Payments with the obtained token
      const mockPendingPayments = [
        { _id: \'payment1\', amount: 100, currency: \'USD\', status: \'pending\', customerId: { fullName: \'Cust One\', accountNumber: \'Acc1\' } },
        { _id: \'payment2\', amount: 200, currency: \'EUR\', status: \'pending\', customerId: { fullName: \'Cust Two\', accountNumber: \'Acc2\' } },
      ];
      Payment.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        lean: jest.fn().mockResolvedValue(mockPendingPayments),
      });
      Employee.findById.mockResolvedValue(mockEmployee); // For verifyEmployeeToken middleware if it re-fetches

      const paymentsRes = await request(app)
        .get(\'/api/employees/payments/pending\')
        .set(\'Authorization\', \`Bearer ${token}\`);

      expect(paymentsRes.statusCode).toBe(200);
      expect(paymentsRes.body).toBeInstanceOf(Array);
      expect(paymentsRes.body.length).toBe(2);
      expect(paymentsRes.body[0].amount).toBe(100);
      expect(Payment.find).toHaveBeenCalledWith({ status: { $eq: \'pending\' } });
      expect(AuditTrail.log).toHaveBeenCalledWith(expect.objectContaining({ action: \'VIEW_PENDING_PAYMENTS\' }));
    });

    it(\'should return 401 if trying to fetch pending payments without a token\', async () => {
      const res = await request(app).get(\'/api/employees/payments/pending\');
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe(\'No token, authorization denied\');
    });

    it(\'should return 401 if trying to fetch pending payments with an invalid token\', async () => {
      const res = await request(app)
        .get(\'/api/employees/payments/pending\')
        .set(\'Authorization\', \'Bearer invalidtoken123\');
      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe(\'Token is not valid\');
    });
  });

  // Add more describe blocks for other workflows:
  // - Verify a payment
  // - Reject a payment
  // - Submit to SWIFT (manager/admin role)
  // - Access control for different roles on specific routes
});
