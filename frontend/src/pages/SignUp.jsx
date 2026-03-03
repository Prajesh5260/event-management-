import React, { useState } from 'react';
import '../styles/SignUp.css';
import { apiFetch } from '../utils/api';
import { useToast } from '../components/Toast';

export default function SignUp({ setCurrentPage, setUser }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const toast = useToast();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!firstName || !lastName || !email || !password) {
      toast('All fields are required','error');
      return;
    }

    if (password.length < 6) {
      toast('Password must be at least 6 characters','error');
      return;
    }

    if (password !== confirmPassword) {
      toast('Passwords do not match','error');
      return;
    }

    setLoading(true);

    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, confirmPassword }),
      });

      if (!res.ok) {
        toast(res.data?.message || 'Sign up failed','error');
        return;
      }

      const data = res.data;
      toast('Account created successfully! Redirecting to home...','success');
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);

      setTimeout(() => {
        setCurrentPage('home');
      }, 1500);
    } catch (err) {
      toast(err.message || 'Error creating account. Please try again.','error');
      console.error('Signup network error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {/* Left Side - Information */}
      <div className="signup-left">
        <div className="signup-brand">
          <h1>Polished Events</h1>
        </div>
        
        <div className="signup-content">
          <p className="signup-label">FREE ONLINE WORKSHOP</p>
          <h2 className="signup-title">
            How to Plan Perfect Events: The Ultimate Guide to Event Management
          </h2>
          <p className="signup-date">Thursday, February 21st • 12pm PST / 3pm EST</p>
          
          <div className="signup-description">
            <p>Get an action plan for using event management to make a living as a planner in this <strong>free online workshop</strong> hosted by top event planning professionals.</p>
          </div>
          
          <div className="signup-benefits">
            <p className="benefits-intro">We'll show you...</p>
            <ul className="benefits-list">
              <li>How to use email list to create a living as a planner</li>
              <li>How to use email to grow your clientele</li>
              <li>What to include in your emails to get more bookings</li>
            </ul>
          </div>
        </div>
        
        {/* Profile Images */}
        <div className="profile-images">
          <div className="profile-img profile-1"></div>
          <div className="profile-img profile-2"></div>
        </div>
        
        {/* Decorative Elements */}
        <div className="decorative-shape"></div>
      </div>

      {/* Right Side - SignUp Form */}
      <div className="signup-right">
        <div className="signup-form-wrapper">
          <div className="signup-form-card">
            <h3 className="form-card-title">Create Account</h3>
            <p className="form-card-subtitle">
              Join us now! Already have an account? <span 
                onClick={() => setCurrentPage('login')} 
                style={{cursor: 'pointer', color: '#B2AA8E', fontWeight: '600'}}
              >
                Login
              </span>
            </p>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <form onSubmit={handleSignUp} className="signup-form-content">
              <div className="name-row">
                <div className="input-group-half">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="signup-input"
                    required
                  />
                </div>
                <div className="input-group-half">
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="signup-input"
                    required
                  />
                </div>
              </div>

              <div className="input-group-full">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="signup-input"
                  required
                />
              </div>

              <div className="input-group-full">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="signup-input"
                  required
                />
              </div>

              <div className="input-group-full">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="signup-input"
                  required
                />
              </div>

              <button type="submit" className="signup-button" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
              
              <p className="signup-disclaimer">
                By registering you consent to our terms and conditions. Your email address is safe and we will never spam you.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
