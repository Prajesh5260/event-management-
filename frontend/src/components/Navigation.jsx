import React, { useState } from 'react';
import '../styles/Navigation.css';

const Navigation = ({ currentPage, setCurrentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <nav className="navigation">
      <div className="nav-container">
        <div className="nav-header">
          <h1 className="logo" onClick={() => handleNavClick('home')}>
            Polished Events.
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
          
          <button 
            className="btn-primary shop-btn"
            onClick={() => handleNavClick('events')}
          >
            Browse Events
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;