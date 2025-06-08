# Frontend-Backend Communication Flow

## Current Architecture: Single HTTPS Server
```
Browser (https://localhost:5001)
    ↓
Express Server (Port 5001)
    ├── Static Files (React Build) → Frontend
    └── API Routes (/api/*) → Backend Logic
```

## Communication Flow:

### 1. Page Load
```
1. Browser requests: https://localhost:5001
2. Express serves: client/build/index.html (React App)
3. React loads and runs in browser
```

### 2. API Calls
```
1. React component needs data
2. Calls: fetch('/api/auth/login') or axios.post('/api/auth/login')
3. Express receives request at /api/auth/login
4. Express processes (validates, database, etc.)
5. Express responds with JSON
6. React receives response and updates UI
```

## Data Flow Example:

### Login Process:
```javascript
// FRONTEND (React Component)
const handleLogin = async (credentials) => {
  try {
    // API call to same server
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      credentials: 'same-origin' // Include session cookies
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Update React state
      setUser(data.user);
      navigate('/dashboard');
    } else {
      setError(data.message);
    }
  } catch (error) {
    setError('Network error');
  }
};

// BACKEND (Express Route)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    // Check database
    // Verify password
    
    // Set session
    req.session.userId = user._id;
    
    // Send response
    res.json({
      success: true,
      user: { id: user._id, email: user.email },
      message: 'Login successful'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});
```

## Benefits of Current Single-Server Setup:

### ✅ Advantages:
- **Same Origin**: No CORS issues
- **Shared Sessions**: Cookies work seamlessly
- **Single SSL Certificate**: Unified security
- **Simplified Deployment**: One server to manage
- **Better Security**: All traffic encrypted

### 🔄 Alternative Architectures:

#### Option 1: Separate Servers (Not recommended for APDS7311)
```
Frontend: https://localhost:3000 (React Dev Server)
Backend:  https://localhost:5001 (Express API)
```
- Requires CORS configuration
- Complex SSL setup
- Development-only approach

#### Option 2: Production Build Serving (Current - Recommended)
```
Single Server: https://localhost:5001
├── Serves React build for UI
└── Handles API calls
```
- Production-ready
- Meets APDS7311 requirements
- Simplified architecture

## Session Management Flow:
```
1. User logs in → Server creates session → Session ID stored in cookie
2. Future requests → Browser sends cookie → Server validates session
3. User logs out → Server destroys session → Cookie cleared
```

## Security Considerations:
- All traffic over HTTPS (APDS7311 requirement)
- Session cookies are httpOnly and secure
- CSRF protection with sameSite cookies
- Rate limiting on API endpoints
- Input validation and sanitization
