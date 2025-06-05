// Test all employee login credentials
const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

const testEmployees = [
  { username: 'john.smith', password: 'SecurePass123!', expectedRole: 'employee' },
  { username: 'sarah.jones', password: 'SecurePass123!', expectedRole: 'employee' },
  { username: 'admin.user', password: 'AdminPass123!', expectedRole: 'admin' },
  { username: 'manager.swift', password: 'ManagerPass123!', expectedRole: 'manager' }
];

async function testEmployeeLogin(username, password) {
  try {
    const response = await axios.post(`${API_BASE}/employee/login`, {
      username,
      password
    });
    
    if (response.data.token) {
      return {
        success: true,
        employee: response.data.employee || response.data.user || 'Unknown',
        role: response.data.role || 'Unknown',
        department: response.data.department || 'Unknown'
      };
    } else {
      return { success: false, error: 'No token received' };
    }
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
}

async function testAllEmployees() {
  console.log('='.repeat(80));
  console.log('🧪 TESTING ALL EMPLOYEE LOGIN CREDENTIALS');
  console.log('='.repeat(80));
  
  let successCount = 0;
  let totalCount = testEmployees.length;
  
  for (const employee of testEmployees) {
    console.log(`\n👤 Testing: ${employee.username}`);
    console.log(`🔑 Password: ${employee.password}`);
    console.log(`🎯 Expected Role: ${employee.expectedRole}`);
    
    const result = await testEmployeeLogin(employee.username, employee.password);
    
    if (result.success) {
      console.log(`✅ LOGIN SUCCESSFUL`);
      console.log(`   Employee: ${result.employee}`);
      console.log(`   Role: ${result.role}`);
      console.log(`   Department: ${result.department}`);
      successCount++;
    } else {
      console.log(`❌ LOGIN FAILED`);
      console.log(`   Error: ${result.error}`);
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 EMPLOYEE LOGIN TEST RESULTS');
  console.log('='.repeat(80));
  console.log(`✅ Successful Logins: ${successCount}/${totalCount}`);
  console.log(`📈 Success Rate: ${Math.round((successCount/totalCount) * 100)}%`);
  
  if (successCount === totalCount) {
    console.log('🎉 ALL EMPLOYEE ACCOUNTS ARE WORKING PERFECTLY!');
  } else {
    console.log('⚠️  Some employee accounts need attention.');
  }
}

testAllEmployees().catch(console.error);
