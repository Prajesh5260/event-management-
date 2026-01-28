import React, { useState, useEffect } from 'react';
import '../styles/Navigation.css';

const Navigation = ({ currentPage, setCurrentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const navItems = [
    { name: 'Home', page: 'home' },
    { name: 'About Us', page: 'about' },
    { name: 'Services', page: 'services' },
    { name: 'Gallery', page: 'gallery' },
    { name: 'Contact', page: 'contact' }
  ];

  const handleNavClick = (page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    handleNavClick('home');
  };

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-header">
          <h1 className="logo" onClick={() => handleNavClick('home')}>
            Polished
          </h1>
          
          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        <div className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            {navItems.map(item => (
              <li key={item.page}>
                <button
                  onClick={() => handleNavClick(item.page)}
                  className={`nav-link ${currentPage === item.page ? 'active' : ''}`}
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
          
          <div className="auth-buttons">
            {user ? (
              <>
                <button 
                  className="btn-secondary"
                  onClick={() => handleNavClick('booking')}
                >
                  Book Now
                </button>
                <button 
                  className="btn-secondary"
                  onClick={() => handleNavClick('my-bookings')}
                >
                  My Bookings
                </button>
                <button 
                  className="btn-primary"
                  onClick={handleLogout}
                >
                  Logout ({user.firstName})
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn-secondary"
                  onClick={() => handleNavClick('login')}
                >
                  Login
                </button>
                <button 
                  className="btn-primary"
                  onClick={() => handleNavClick('signup')}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;