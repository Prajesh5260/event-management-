import React, { useState } from 'react';
import '../styles/Login.css';
import { apiFetch } from '../utils/api';
import { useToast } from '../components/Toast';

export default function Login({ setCurrentPage, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const toast = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email || !password) {
      toast('Email and password are required','error');
      return;
    }

    setLoading(true);

    try {
      try {
        const res = await apiFetch('/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          toast(res.data?.message || 'Login failed','error');
          return;
        }

        const data = res.data;
        console.log('Login response:', res);
        console.log('User object:', data.user);
        toast(`Login successful! Redirecting... (isAdmin=${data.user?.isAdmin ? 'true' : 'false'})`,'success');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);

        // Redirect to admin dashboard if user is admin
        setTimeout(() => {
          setCurrentPage(data.user?.isAdmin ? 'admin' : 'home');
        }, 1500);
      } catch (err) {
        toast(err.message || 'Error logging in. Please try again.','error');
        console.error('Login network error:', err);
        return;
      }


    } catch (err) {
      setError('Error logging in. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Left Side - Decorative */}
      <div className="login-left">
        <div className="brand-header">
          <h1>Polished Events</h1>
          <p>Event Management Company</p>
        </div>
        
        <div className="illustration-area">
          <div className="decorative-elements">
            <div className="gift-box"></div>
            <div className="confetti-1"></div>
            <div className="confetti-2"></div>
            <div className="confetti-3"></div>
            
            <div className="cake-wrapper">
              <div className="cake-top"></div>
              <div className="cake-bottom"></div>
            </div>
            
            <div className="balloon-1"></div>
            <div className="balloon-2"></div>
            <div className="balloon-3"></div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-right">
        <div className="form-wrapper">
          <h2 className="form-title">Login</h2>
          <p className="form-subtitle">
            Don't have an account? <span 
              onClick={() => setCurrentPage('signup')} 
              style={{cursor: 'pointer', color: '#B2AA8E', fontWeight: '600'}}
              className="create-account-link"
            >
              Create your account
            </span>
          </p>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleLogin} className="form-content">
            <div className="input-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div className="form-options">
              <span className="forgot-password" style={{cursor: 'pointer'}}>Forgot Password?</span>
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