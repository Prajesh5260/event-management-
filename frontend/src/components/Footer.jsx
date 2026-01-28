import React from 'react';
import '../styles/Footer.css';

const Footer = ({ setCurrentPage }) => {
  const handleNavClick = (page) => {
    if (setCurrentPage) {
      setCurrentPage(page);
    }
  };

  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Polished Events</h3>
            <p className="footer-description">Professional event planning and management services for all occasions.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><button onClick={() => handleNavClick('home')} className="footer-link">Home</button></li>
              <li><button onClick={() => handleNavClick('about')} className="footer-link">About Us</button></li>
              <li><button onClick={() => handleNavClick('services')} className="footer-link">Services</button></li>
              <li><button onClick={() => handleNavClick('gallery')} className="footer-link">Gallery</button></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Support</h4>
            <ul className="footer-links">
              <li><button onClick={() => handleNavClick('contact')} className="footer-link">Contact Us</button></li>
              <li><button onClick={() => handleNavClick('events')} className="footer-link">Events</button></li>
              <li><button onClick={() => handleNavClick('login')} className="footer-link">Login</button></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Polished Events. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
