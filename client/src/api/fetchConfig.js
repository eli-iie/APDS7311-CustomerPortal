// Alternative to axios using native fetch API
// This eliminates the need for axios dependency

class ApiClient {
  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options,
    };

    // Add credentials for session management
    config.credentials = 'same-origin';

    console.log('=== FETCH REQUEST ===');
    console.log('URL:', url);
    console.log('Method:', config.method || 'GET');
    console.log('Data:', config.body);

    try {
      const response = await fetch(url, config);
      
      console.log('=== FETCH RESPONSE ===');
      console.log('Status:', response.status);
      console.log('OK:', response.ok);

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log('Data:', data);

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return { data, status: response.status, headers: response.headers };
    } catch (error) {
      console.error('=== FETCH ERROR ===');
      console.error('Message:', error.message);
      throw error;
    }
  }

  // GET request
  async get(endpoint, headers = {}) {
    return this.request(endpoint, {
      method: 'GET',
      headers,
    });
  }

  // POST request
  async post(endpoint, data, headers = {}) {
    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data, headers = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint, headers = {}) {
    return this.request(endpoint, {
      method: 'DELETE',
      headers,
    });
  }
}

// Create and export a single instance
const apiClient = new ApiClient();

// Export specific API methods for easy use
export const authApi = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  logout: () => apiClient.post('/auth/logout'),
};

export const paymentApi = {
  getPayments: () => apiClient.get('/payment'),
  createPayment: (paymentData) => apiClient.post('/payment', paymentData),
  updatePayment: (id, data) => apiClient.put(`/payment/${id}`, data),
};

export const employeeApi = {
  login: (credentials) => apiClient.post('/employee/login', credentials),
  getPayments: () => apiClient.get('/employee/payments'),
  verifyPayment: (id, data) => apiClient.put(`/employee/payment/${id}/verify`, data),
};

export default apiClient;
