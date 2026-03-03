import React, { useState, useEffect, useRef } from 'react';
import '../styles/Navigation.css';

const Navigation = ({ currentPage, setCurrentPage, user, onLogout }) => {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const profileRef                    = useRef(null);

  /* Close profile dropdown when clicking outside */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Shadow intensity on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Close mobile menu on page change */
  const navigate = (page) => {
    setCurrentPage(page);
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const navLinks = [
    { id: 'home',     label: 'Home',     icon: '🏠' },
    { id: 'events',   label: 'Events',   icon: '🎪' },
    { id: 'services', label: 'Services', icon: '✨' },
    { id: 'about',    label: 'About',    icon: '💡' },
    { id: 'contact',  label: 'Contact',  icon: '📩' },
  ];

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav
      className="navigation"
      style={{ boxShadow: scrolled ? '0 8px 32px rgba(10,37,64,0.4)' : '0 4px 24px rgba(10,37,64,0.3)' }}
    >
      <div className="nav-container">
        <div className="nav-header">

          {/* ── Logo ── */}
          <h1 className="logo" onClick={() => navigate('home')}>
            ✦ Polished Events
          </h1>

          {/* ── Mobile toggle ── */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? '✕' : '☰'}
          </button>

          {/* ── Nav Menu ── */}
          <div className={`nav-menu ${menuOpen ? 'active' : ''}`}>

            {/* Links */}
            <ul className="nav-links">
              {navLinks.map(link => (
                <li key={link.id}>
                  <button
                    className={`nav-link ${currentPage === link.id ? 'active' : ''}`}
                    onClick={() => navigate(link.id)}
                  >
                    <span style={{ fontSize: '.9rem' }}>{link.icon}</span>
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            {/* Auth / Profile */}
            <div className="auth-buttons">
              {user ? (
                /* ── Logged-in: Avatar + Dropdown ── */
                <div className="profile-wrapper" ref={profileRef}>
                  <button
                    className="profile-btn"
                    onClick={() => setProfileOpen(prev => !prev)}
                    aria-label="Open profile menu"
                  >
                    <div className="avatar">
                      {user.avatar
                        ? <img src={user.avatar} alt={user.name} style={{ width:'100%', height:'100%', borderRadius:'50%', objectFit:'cover' }} />
                        : getInitials(user.name)
                      }
                    </div>
                  </button>

                  {profileOpen && (
                    <div className="profile-menu">
                      {/* User info header */}
                      <div style={{ padding:'10px 14px 12px', borderBottom:'1px solid rgba(111,207,151,0.12)', marginBottom:6 }}>
                        <div style={{ fontFamily:"'DM Sans',sans-serif", fontWeight:700, color:'#fff', fontSize:'.9rem' }}>{user.name}</div>
                        <div style={{ fontFamily:"'DM Sans',sans-serif", color:'rgba(255,255,255,.5)', fontSize:'.78rem', marginTop:2 }}>{user.email}</div>
                      </div>

                      <button className="profile-menu-item" onClick={() => navigate('my-bookings')}>
                        📋 My Bookings
                      </button>
                      <button className="profile-menu-item" onClick={() => navigate('profile')}>
                        👤 My Profile
                      </button>
                      <button className="profile-menu-item" onClick={() => navigate('settings')}>
                        ⚙️ Settings
                      </button>

                      {/* Admin link */}
                      {user.role === 'admin' && (
                        <button className="profile-menu-item" onClick={() => navigate('admin')}>
                          🛡️ Admin Panel
                        </button>
                      )}

                      <button
                        className="profile-menu-item danger"
                        onClick={() => { onLogout?.(); setProfileOpen(false); }}
                      >
                        🚪 Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* ── Logged-out: Login + Register ── */
                <>
                  <button
                    className="btn-secondary"
                    onClick={() => navigate('login')}
                  >
                    Log In
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => navigate('register')}
                  >
                    Get Started ✦
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;