# Frontend-Backend Integration Guide

## Connecting Your React Frontend to the Backend API

### Step 1: Create API Configuration

Create a new file `frontend/src/config/apiClient.js`:

```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const apiClient = {
  // Authentication
  register: (data) => 
    fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
  
  login: (data) => 
    fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  // Users
  getProfile: (token) => 
    fetch(`${API_BASE_URL}/users/profile`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    }),

  updateProfile: (data, token) => 
    fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  changePassword: (data, token) => 
    fetch(`${API_BASE_URL}/users/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  // Events
  getEvents: (query = '') => 
    fetch(`${API_BASE_URL}/events${query}`, {
      method: 'GET',
    }),

  getUserEvents: (token) => 
    fetch(`${API_BASE_URL}/events/user/my-events`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
    }),

  getEvent: (id) => 
    fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'GET',
    }),

  createEvent: (data, token) => 
    fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  updateEvent: (id, data, token) => 
    fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }),

  deleteEvent: (id, token) => 
    fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    }),

  // Services
  getServices: (query = '') => 
    fetch(`${API_BASE_URL}/services${query}`, {
      method: 'GET',
    }),

  getServiceCategories: () => 
    fetch(`${API_BASE_URL}/services/categories/list`, {
      method: 'GET',
    }),

  getService: (id) => 
    fetch(`${API_BASE_URL}/services/${id}`, {
      method: 'GET',
    }),
};

// Helper function to parse response
export const parseResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API Error');
  }
  
  return data;
};
```

### Step 2: Update .env file

Create `frontend/.env.local`:

```
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 3: Create Authentication Context

Create `frontend/src/context/AuthContext.jsx`:

```javascript
import React, { createContext, useState, useCallback } from 'react';
import { apiClient, parseResponse } from '../config/apiClient';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.register(userData);
      const data = await parseResponse(response);
      
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.login({ email, password });
      const data = await parseResponse(response);
      
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### Step 4: Create Custom Hooks

Create `frontend/src/hooks/useAuth.js`:

```javascript
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

Create `frontend/src/hooks/useApi.js`:

```javascript
import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { apiClient, parseResponse } from '../config/apiClient';

export const useApi = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const call = useCallback(async (apiFunction) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunction(token);
      const data = await parseResponse(response);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [token]);

  return { call, loading, error };
};
```

### Step 5: Update App.jsx

Wrap with AuthProvider:

```javascript
import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import AboutPage from './pages/AboutPage';
// ... other imports

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch(currentPage) {
      case 'home': return <Homepage setCurrentPage={setCurrentPage} />;
      case 'about': return <AboutPage />;
      case 'services': return <ServicesPage />;
      case 'gallery': return <GalleryPage />;
      case 'contact': return <ContactPage />;
      case 'events': return <EventsPage setCurrentPage={setCurrentPage} />;
      case 'event-details': return <EventDetailsPage setCurrentPage={setCurrentPage} />;
      case 'login': return <Login setCurrentPage={setCurrentPage} />;
      case 'signup': return <SignUp setCurrentPage={setCurrentPage} />;
      default: return <Homepage setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <AuthProvider>
      <div className="app">
        <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
        <main className="main-content">
          {renderPage()}
        </main>
        <Footer setCurrentPage={setCurrentPage} />
      </div>
    </AuthProvider>
  );
};

export default App;
```

### Step 6: Update Login Component

Update `frontend/src/pages/Login.jsx`:

```javascript
import React, { useState } from 'react';
import '../styles/Login.css';
import { useAuth } from '../hooks/useAuth';

export default function Login({ setCurrentPage }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      if (rememberMe) {
        localStorage.setItem('rememberEmail', email);
      }
      setCurrentPage('home');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* ... existing JSX ... */}
      <div className="login-right">
        <div className="form-wrapper">
          <h2 className="form-title">Login</h2>
          <p className="form-subtitle">
            Welcome back! <span className="create-account-link" onClick={() => setCurrentPage('signup')}>Create Account</span>
          </p>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleLogin} className="form-content">
            <div className="input-group">
              <input
                type="email"
                className="input-field"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                className="input-field"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-options">
              <label className="remember-me">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <span className="forgot-password">Forgot password?</span>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
```

### Step 7: Update SignUp Component

Update `frontend/src/pages/SignUp.jsx`:

```javascript
import React, { useState } from 'react';
import '../styles/SignUp.css';
import { useAuth } from '../hooks/useAuth';

export default function SignUp({ setCurrentPage }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });
      setCurrentPage('home');
    } catch (err) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* ... existing JSX ... */}
      <div className="signup-right">
        <div className="signup-form-wrapper">
          <div className="signup-form-card">
            <h2 className="form-card-title">Create Account</h2>
            <p className="form-card-subtitle">
              Already have an account? <span onClick={() => setCurrentPage('login')} style={{cursor: 'pointer', color: '#B2AA8E'}}>Login</span>
            </p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSignUp} className="signup-form-content">
              <div className="name-row">
                <div className="input-group-half">
                  <input
                    type="text"
                    className="signup-input"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group-half">
                  <input
                    type="text"
                    className="signup-input"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="input-group-full">
                <input
                  type="email"
                  className="signup-input"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="input-group-full">
                <input
                  type="password"
                  className="signup-input"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="input-group-full">
                <input
                  type="password"
                  className="signup-input"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="signup-button" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### Step 8: Add Error Styling

Add to `frontend/src/index.css`:

```css
.error-message {
  background-color: #fee;
  border: 1px solid #f99;
  color: #c33;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-weight: 500;
}

.success-message {
  background-color: #efe;
  border: 1px solid #9f9;
  color: #3c3;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-weight: 500;
}
```

## Testing the Integration

1. Start PostgreSQL server
2. Start backend: `npm run dev` (in backend folder)
3. Start frontend: `npm run dev` (in frontend folder)
4. Register a new user
5. Login with your credentials
6. Verify token is stored in localStorage
7. Test creating/viewing events
8. Test browsing services

## Common Issues

### CORS Error
- Ensure backend has CORS enabled
- Check API_BASE_URL is correct
- Verify backend is running

### Token Errors
- Check Authorization header format
- Verify token is in localStorage
- Re-login if token expired

### API Not Found
- Verify backend server is running
- Check API_BASE_URL environment variable
- Ensure endpoint path is correct

---

Your frontend is now fully integrated with the backend API!
